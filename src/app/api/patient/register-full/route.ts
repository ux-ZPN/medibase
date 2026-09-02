import { NextResponse } from "next/server";
import { registerNewPatient } from "@/lib/identity/access-requests-store";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    // 1. Validate Personal Info
    const fullName = (body.fullName || "").toString().trim();
    const phoneNumber = (body.phoneNumber || "").toString().trim();
    const email = (body.email || `${phoneNumber.replace(/\D/g, "") || "patient"}@medibase.org`).toString().trim();
    const occupation = (body.occupation || "General Citizen").toString().trim();
    const dateOfBirth = (body.dateOfBirth || "1995-01-01").toString().trim();
    const gender = (body.gender || "Not Specified").toString().trim();
    const bloodGroup = (body.bloodGroup || "O+").toString().trim();
    const height = body.height ? body.height.toString() : "170 cm";
    const weight = body.weight ? body.weight.toString() : "68 kg";
    const allergies = Array.isArray(body.allergies) ? body.allergies : (body.allergies ? [body.allergies] : []);

    if (!fullName || fullName.length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter patient's full name (minimum 2 characters)." },
        { status: 400 }
      );
    }

    if (!phoneNumber || phoneNumber.replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 10-digit contact phone number." },
        { status: 400 }
      );
    }

    // 2. Validate Emergency Contact
    const emergencyContactName = (body.emergencyContactName || body.emergencyName || "Family Member").toString().trim();
    const emergencyContactRelationship = (body.emergencyContactRelationship || body.emergencyRelationship || "Spouse / Next of Kin").toString().trim();
    const emergencyContactPhone = (body.emergencyContactPhone || body.emergencyPhone || phoneNumber).toString().trim();

    // 3. Validate Vital Signs Baseline
    const pulse = parseInt(body.pulse || body.heartRate || "74", 10) || 74;
    const bloodPressure = (body.bloodPressure || `${body.systolic || 120}/${body.diastolic || 80} mmHg`).toString().trim();
    const temperature = (body.temperature || "98.6 °F").toString().trim();
    const spo2 = parseInt(body.spo2 || "98", 10) || 98;
    const chronicConditions = Array.isArray(body.chronicConditions) ? body.chronicConditions : (body.chronicConditions ? [body.chronicConditions] : []);

    // 4. Past Medical History
    const pastHistory = Array.isArray(body.pastHistory)
      ? body.pastHistory.map((item: any) => ({
          date: item.date || item.encounterDate || "Historical",
          time: item.time || "10:00 AM",
          hospital_name: item.hospital_name || item.hospitalName || "Prior Clinic / Hospital",
          department: item.department || "General Medicine",
          doctor_name: item.doctor_name || item.doctorName || "Attending Doctor",
          visit_type: item.visit_type || item.visitType || "Past Clinical Consultation",
          diagnosis: item.diagnosis || item.condition || "Clinical Condition",
          treatment: item.treatment || item.prescription || "Standard Medical Management",
          notes: item.notes || item.clinicalNotes || "",
        }))
      : [];

    // 5. Register in Global Store and Generate Unique MediBase ID
    const registeredPatient = registerNewPatient({
      full_name: fullName,
      phone_number: phoneNumber,
      email: email,
      occupation: occupation,
      date_of_birth: dateOfBirth,
      gender: gender,
      blood_group: bloodGroup,
      height_cm: height,
      weight_kg: weight,
      allergies: allergies,
      emergency_contact: {
        name: emergencyContactName,
        relationship: emergencyContactRelationship,
        phone: emergencyContactPhone,
      },
      vitals: {
        pulse: pulse,
        blood_pressure: bloodPressure,
        temperature: temperature,
        spo2: spo2,
      },
      chronic_conditions: chronicConditions,
      past_history: pastHistory,
    });

    // 6. Best-effort Supabase DB Sync
    try {
      const supabase = await createClient();
      await supabase.from("profiles").upsert({
        id: registeredPatient.id,
        email: email,
        role: "patient",
        full_name: fullName,
        phone_number: phoneNumber,
      });

      await supabase.from("patients").upsert({
        id: registeredPatient.id,
        profile_id: registeredPatient.id,
        medibase_id: registeredPatient.medibase_id,
        date_of_birth: dateOfBirth,
        blood_group: bloodGroup,
        gender: gender,
        occupation: occupation,
      });
    } catch {
      // Non-blocking fallback
    }

    const response = NextResponse.json({
      success: true,
      medibase_id: registeredPatient.medibase_id,
      patient_id: registeredPatient.id,
      patient: registeredPatient,
      message: `Patient registered successfully! Assigned MediBase ID: ${registeredPatient.medibase_id}`,
      redirectUrl: `/patient/dashboard`,
    });

    // Set demo cookies for seamless instant login
    response.cookies.set("medibase_demo_role", "patient", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    response.cookies.set("medibase_active_patient_id", registeredPatient.medibase_id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to register patient.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
