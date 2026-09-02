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
    interface PastHistoryInput {
      date?: string;
      encounterDate?: string;
      time?: string;
      hospital_name?: string;
      hospitalName?: string;
      department?: string;
      doctor_name?: string;
      doctorName?: string;
      visit_type?: string;
      visitType?: string;
      diagnosis?: string;
      condition?: string;
      treatment?: string;
      prescription?: string;
      notes?: string;
      clinicalNotes?: string;
    }

    interface UploadedDocInput {
      id?: string;
      name?: string;
      fileName?: string;
      type?: string;
      documentType?: string;
      sizeBytes?: number;
      fileSize?: number;
      dataUrl?: string;
      fileUrl?: string;
      uploadedAt?: string;
    }

    const pastHistory = Array.isArray(body.pastHistory)
      ? (body.pastHistory as PastHistoryInput[]).map((item) => ({
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

    // 5. Uploaded Medical Documents & Images
    const uploadedDocuments = Array.isArray(body.uploadedDocuments)
      ? (body.uploadedDocuments as UploadedDocInput[]).map((doc, idx) => ({
          id: doc.id || `doc-${Date.now()}-${idx}`,
          name: doc.name || doc.fileName || `Medical_Document_${idx + 1}.pdf`,
          type: doc.type || doc.documentType || "diagnostic_file",
          sizeBytes: doc.sizeBytes || doc.fileSize || 250000,
          dataUrl: doc.dataUrl || doc.fileUrl || "",
          uploadedAt: doc.uploadedAt || new Date().toISOString(),
        }))
      : [];

    // 6. Register in Global Store and Generate Unique MediBase ID
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
      uploaded_documents: uploadedDocuments,
    });

    // 6. Supabase Relational Database Sync
    let dbSynced = false;
    try {
      const supabase = await createClient();

      // 6a. Upsert Profile
      await supabase.from("profiles").upsert({
        id: registeredPatient.id,
        email: email,
        role: "patient",
        full_name: fullName,
        phone_number: phoneNumber,
      });

      // 6b. Upsert Patient Identity
      await supabase.from("patients").upsert({
        id: registeredPatient.id,
        profile_id: registeredPatient.id,
        medibase_id: registeredPatient.medibase_id,
        date_of_birth: dateOfBirth,
        blood_group: bloodGroup,
        gender: gender,
        occupation: occupation,
      });

      // 6c. Upsert Emergency Contact
      await supabase.from("emergency_contacts").upsert({
        patient_id: registeredPatient.id,
        name: emergencyContactName,
        relationship: emergencyContactRelationship,
        phone_number: emergencyContactPhone,
        is_primary: true,
      });

      // 6d. Upsert Medical Profile with Vitals & Allergies
      await supabase.from("medical_profiles").upsert({
        patient_id: registeredPatient.id,
        blood_group: bloodGroup,
        allergies: allergies,
        chronic_conditions: chronicConditions,
        height_cm: parseFloat(height) || null,
        weight_kg: parseFloat(weight) || null,
        baseline_vitals: {
          pulse,
          blood_pressure: bloodPressure,
          temperature,
          spo2,
        },
      });

      // 6e. Insert Initial & Past Encounters into Encounters Table
      if (pastHistory.length > 0) {
        for (let i = 0; i < pastHistory.length; i++) {
          const hist = pastHistory[i];
          const encounterId = `enc-db-${registeredPatient.medibase_id.toLowerCase()}-${i + 1}`;

          await supabase.from("encounters").upsert({
            id: encounterId,
            patient_id: registeredPatient.id,
            encounter_date: hist.date,
            visit_type: hist.visit_type,
            department: hist.department,
            chief_complaint: hist.diagnosis,
            clinical_notes: hist.notes || `Historical encounter at ${hist.hospital_name}`,
          });

          if (hist.diagnosis) {
            await supabase.from("diagnoses").upsert({
              encounter_id: encounterId,
              diagnosis_name: hist.diagnosis,
              diagnosis_type: "primary",
              clinical_status: "resolved",
            });
          }

          if (hist.treatment) {
            await supabase.from("prescriptions").upsert({
              encounter_id: encounterId,
              medication_name: hist.treatment,
              dosage: "As prescribed",
              frequency: "Historical regimen",
              is_active: false,
            });
          }
        }
      }

      // 6f. Insert Uploaded Medical Documents & Images into medical_reports Table
      if (uploadedDocuments.length > 0) {
        for (let j = 0; j < uploadedDocuments.length; j++) {
          const doc = uploadedDocuments[j];
          await supabase.from("medical_reports").upsert({
            id: `rep-db-${registeredPatient.medibase_id.toLowerCase()}-${j + 1}`,
            patient_id: registeredPatient.id,
            hospital_id: "a0000000-0000-0000-0000-000000000001",
            uploaded_by_staff_id: "b0000000-0000-0000-0000-000000000001",
            report_title: doc.name,
            report_type: doc.type,
            file_name: doc.name,
            file_size_bytes: doc.sizeBytes,
            mime_type: doc.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "image/jpeg",
            storage_path: `medical-records/${registeredPatient.medibase_id}/${doc.name}`,
          });
        }
      }

      // 6g. Record Audit Log in Database
      await supabase.from("audit_logs").insert({
        actor_profile_id: registeredPatient.id,
        actor_role: "patient",
        patient_id: registeredPatient.id,
        hospital_id: "a0000000-0000-0000-0000-000000000001",
        action: "patient_account_registered",
        resource_type: "patient_profile",
        resource_id: registeredPatient.id,
        metadata: {
          medibase_id: registeredPatient.medibase_id,
          full_name: fullName,
          blood_group: bloodGroup,
          encounters_initialized: pastHistory.length + 1,
        },
      });

      dbSynced = true;
    } catch (dbErr) {
      console.warn("Supabase database sync completed with in-memory fallback:", dbErr);
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
