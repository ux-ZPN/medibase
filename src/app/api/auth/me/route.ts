import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { findRegisteredPatient, findRegisteredStaff } from "@/lib/identity/access-requests-store";

const KNOWN_PATIENTS_MAP: Record<string, unknown> = {
  "MB-100001": {
    id: "10000000-0000-0000-0000-000000000001",
    email: "anjali.mehta@medibase.org",
    role: "patient",
    full_name: "Anjali Mehta",
    phone_number: "+91 98765 10001",
    patient_data: {
      id: "10000000-0000-0000-0000-000000000001",
      medibase_id: "MB-100001",
      qr_code_token: "d3b07384-0001-4632-b7e6-8c2ff6d8b901",
      aadhaar_last4: "8492",
      blood_group: "O-",
      occupation: "School Teacher",
      allergies: ["Penicillin", "Sulfa Drugs"],
      chronic_conditions: ["Seasonal Bronchitis"],
      date_of_birth: "1990-07-05",
      gender: "Female",
    },
  },
  "MB-100002": {
    id: "10000000-0000-0000-0000-000000000002",
    email: "vikram.singh@medibase.org",
    role: "patient",
    full_name: "Vikram Singh",
    phone_number: "+91 98765 10002",
    patient_data: {
      id: "10000000-0000-0000-0000-000000000002",
      medibase_id: "MB-100002",
      qr_code_token: "d3b07384-0002-4632-b7e6-8c2ff6d8b902",
      aadhaar_last4: "2941",
      blood_group: "A+",
      occupation: "Farmer",
      allergies: ["Pollen"],
      chronic_conditions: ["Osteoarthritis"],
      date_of_birth: "1975-11-22",
      gender: "Male",
    },
  },
  "MB-100003": {
    id: "10000000-0000-0000-0000-000000000003",
    email: "priya.reddy@medibase.org",
    role: "patient",
    full_name: "Priya Reddy",
    phone_number: "+91 98765 10003",
    patient_data: {
      id: "10000000-0000-0000-0000-000000000003",
      medibase_id: "MB-100003",
      qr_code_token: "d3b07384-0003-4632-b7e6-8c2ff6d8b903",
      aadhaar_last4: "6321",
      blood_group: "AB+",
      occupation: "Marketing Manager",
      allergies: ["Peanuts", "Dust"],
      chronic_conditions: ["Type 2 Diabetes", "Hypertension"],
      date_of_birth: "1993-01-18",
      gender: "Female",
    },
  },
  "MB-100004": {
    id: "10000000-0000-0000-0000-000000000004",
    email: "suresh.patel@medibase.org",
    role: "patient",
    full_name: "Suresh Patel",
    phone_number: "+91 98765 10004",
    patient_data: {
      id: "10000000-0000-0000-0000-000000000004",
      medibase_id: "MB-100004",
      qr_code_token: "d3b07384-0004-4632-b7e6-8c2ff6d8b904",
      aadhaar_last4: "4920",
      blood_group: "O+",
      occupation: "Shopkeeper",
      allergies: ["Ibuprofen"],
      chronic_conditions: ["Coronary Artery Disease"],
      date_of_birth: "1968-09-30",
      gender: "Male",
    },
  },
  "MB-100005": {
    id: "10000000-0000-0000-0000-000000000005",
    email: "kavita.sharma@medibase.org",
    role: "patient",
    full_name: "Kavita Sharma",
    phone_number: "+91 98765 10005",
    patient_data: {
      id: "10000000-0000-0000-0000-000000000005",
      medibase_id: "MB-100005",
      qr_code_token: "d3b07384-0005-4632-b7e6-8c2ff6d8b905",
      aadhaar_last4: "9142",
      blood_group: "B-",
      occupation: "Homemaker",
      allergies: ["Latex"],
      chronic_conditions: ["Hypothyroidism"],
      date_of_birth: "1980-05-14",
      gender: "Female",
    },
  },
  "MB-102394": {
    id: "demo-patient-0001",
    email: "demo.patient@medibase.org",
    role: "patient",
    full_name: "Rahul Sharma",
    phone_number: "+91 98765 43210",
    patient_data: {
      id: "demo-patient-rec-0001",
      medibase_id: "MB-102394",
      qr_code_token: "d3b07384-d113-4632-b7e6-8c2ff6d8b991",
      aadhaar_last4: "1234",
      blood_group: "O+",
      occupation: "Accountant",
      allergies: ["Penicillin", "Dust Mites"],
      chronic_conditions: ["Mild Hypertension"],
      date_of_birth: "1994-06-15",
      gender: "Male",
    },
  },
};

interface DbProfileRow {
  full_name?: string;
  email?: string;
  phone_number?: string;
}

interface DbMedicalProfileRow {
  allergies?: string[];
  chronic_conditions?: string[];
  height_cm?: number;
  weight_kg?: number;
}

interface DbEmergencyContactRow {
  name?: string;
  relationship?: string;
  phone_number?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const context = searchParams.get("context");
    
    const cookieStore = await cookies();
    let demoRole = cookieStore.get("medibase_demo_role")?.value;
    
    // Override demoRole if a specific context was requested from the client
    if (context === "staff") {
      demoRole = "hospital_staff";
    } else if (context === "patient") {
      demoRole = "patient";
    }

    // 1. If Patient Role Session
    if (demoRole === "patient") {
      const activePatientId = cookieStore.get("medibase_active_patient_id")?.value?.trim()?.toUpperCase();
      const patientId = activePatientId || "MB-100001";

      // 1a. Check Runtime Registered Patients Store
      const reg = findRegisteredPatient(patientId);
      if (reg) {
        return NextResponse.json({
          success: true,
          profile: {
            id: reg.id,
            email: reg.email || `${reg.medibase_id.toLowerCase()}@medibase.org`,
            role: "patient",
            full_name: reg.full_name,
            phone_number: reg.phone_number,
            patient_data: {
              id: reg.id,
              medibase_id: reg.medibase_id,
              qr_code_token: `token-${reg.medibase_id.toLowerCase()}`,
              aadhaar_last4: "8899",
              blood_group: reg.blood_group || "O+",
              occupation: reg.occupation || "General Citizen",
              allergies: reg.allergies || [],
              chronic_conditions: reg.chronic_conditions || [],
              date_of_birth: reg.date_of_birth,
              gender: reg.gender,
              emergency_contact: reg.emergency_contact,
              vitals: reg.vitals,
            },
          },
        });
      }

      // 1b. Check Known Patients Map
      if (KNOWN_PATIENTS_MAP[patientId]) {
        return NextResponse.json({
          success: true,
          profile: KNOWN_PATIENTS_MAP[patientId],
        });
      }

      // 1c. Check Supabase Database
      try {
        const supabase = await createClient();
        const { data: dbPatient } = await supabase
          .from("patients")
          .select(`
            id,
            medibase_id,
            date_of_birth,
            blood_group,
            gender,
            occupation,
            profiles(full_name, email, phone_number),
            medical_profiles(allergies, chronic_conditions, height_cm, weight_kg),
            emergency_contacts(name, relationship, phone_number)
          `)
          .or(`id.eq.${patientId},medibase_id.eq.${patientId}`)
          .maybeSingle();

        if (dbPatient) {
          const profObj = (Array.isArray(dbPatient.profiles) ? dbPatient.profiles[0] : dbPatient.profiles) as DbProfileRow | null;
          const medObj = (Array.isArray(dbPatient.medical_profiles) ? dbPatient.medical_profiles[0] : dbPatient.medical_profiles) as DbMedicalProfileRow | null;
          const emgObj = (Array.isArray(dbPatient.emergency_contacts) ? dbPatient.emergency_contacts[0] : dbPatient.emergency_contacts) as DbEmergencyContactRow | null;

          const pName = profObj?.full_name || `Patient ${dbPatient.medibase_id}`;
          const pEmail = profObj?.email || `${dbPatient.medibase_id.toLowerCase()}@medibase.org`;
          const pPhone = profObj?.phone_number || "+91 98765 00000";

          return NextResponse.json({
            success: true,
            profile: {
              id: dbPatient.id,
              email: pEmail,
              role: "patient",
              full_name: pName,
              phone_number: pPhone,
              patient_data: {
                id: dbPatient.id,
                medibase_id: dbPatient.medibase_id,
                qr_code_token: `token-${dbPatient.medibase_id.toLowerCase()}`,
                aadhaar_last4: "8899",
                blood_group: dbPatient.blood_group || "O+",
                occupation: dbPatient.occupation || "General Citizen",
                allergies: medObj?.allergies || [],
                chronic_conditions: medObj?.chronic_conditions || [],
                date_of_birth: dbPatient.date_of_birth,
                gender: dbPatient.gender,
                emergency_contact: emgObj,
              },
            },
          });
        }
      } catch {
        // Fallback
      }

      // Default fallback using the requested active ID
      return NextResponse.json({
        success: true,
        profile: {
          id: `patient-${patientId.toLowerCase()}`,
          email: `${patientId.toLowerCase()}@medibase.org`,
          role: "patient",
          full_name: `Patient ${patientId}`,
          phone_number: "+91 98765 00000",
          patient_data: {
            id: `patient-${patientId.toLowerCase()}`,
            medibase_id: patientId,
            qr_code_token: `token-${patientId.toLowerCase()}`,
            aadhaar_last4: "8899",
            blood_group: "O+",
            occupation: "General Citizen",
            allergies: [],
            chronic_conditions: [],
            date_of_birth: "1995-01-01",
            gender: "Not Specified",
          },
        },
      });
    }

    // 2. If Staff Role Session
    if (demoRole === "hospital_staff") {
      const activeStaffId = cookieStore.get("medibase_active_staff_id")?.value?.trim();
      const staffRecord = activeStaffId ? findRegisteredStaff(activeStaffId) : findRegisteredStaff("DOC-1001");

      if (staffRecord) {
        return NextResponse.json({
          success: true,
          profile: {
            id: staffRecord.id,
            email: staffRecord.email,
            role: "hospital_staff",
            full_name: staffRecord.full_name,
            phone_number: staffRecord.phone_number,
            staff_data: {
              id: staffRecord.id,
              staff_id: staffRecord.staff_id,
              hospital_id: staffRecord.hospital_id,
              hospital_name: staffRecord.hospital_name,
              role: staffRecord.role,
              department: staffRecord.department,
              license_number: staffRecord.license_number,
              aadhaar_last4: staffRecord.aadhaar_last4 || "5678",
            },
          },
        });
      }

      // Default fallback staff profile
      return NextResponse.json({
        success: true,
        profile: {
          id: "demo-staff-0001",
          email: "demo.doctor@cityhospital.com",
          role: "hospital_staff",
          full_name: "Dr. Rahul Sharma",
          phone_number: "+91 98765 43211",
          staff_data: {
            id: "demo-staff-rec-0001",
            staff_id: "DOC-1001",
            hospital_id: "a0000000-0000-0000-0000-000000000001",
            hospital_name: "City General Hospital",
            role: "doctor",
            department: "Cardiology",
            license_number: "MED-REG-2024-8941",
            aadhaar_last4: "5678",
          },
        },
      });
    }

    // 3. Fallback Supabase User Session
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        return NextResponse.json({
          success: true,
          profile: {
            id: profile.id,
            email: profile.email || user.email,
            role: profile.role,
            full_name: profile.full_name,
            phone_number: profile.phone_number,
          },
        });
      }
    }

    return NextResponse.json({ success: false, error: "No active session found." }, { status: 401 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to resolve authenticated profile.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
