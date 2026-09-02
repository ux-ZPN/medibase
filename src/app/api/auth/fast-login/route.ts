import { NextResponse } from "next/server";

interface PatientInfo {
  id: string;
  medibase_id: string;
  full_name: string;
  phone_number?: string;
  blood_group?: string;
  gender?: string;
  date_of_birth?: string;
  occupation?: string;
  allergies?: string[];
  chronic_conditions?: string[];
}

const FAST_LOGIN_PATIENTS: Record<string, PatientInfo> = {
  "MB-100001": {
    id: "10000000-0000-0000-0000-000000000001",
    medibase_id: "MB-100001",
    full_name: "Anjali Mehta",
    phone_number: "+91 98765 10001",
    blood_group: "O-",
    gender: "Female",
    date_of_birth: "1990-07-05",
    occupation: "School Teacher",
    allergies: ["Penicillin", "Sulfa Drugs"],
    chronic_conditions: ["Seasonal Bronchitis"],
  },
  "MB-100002": {
    id: "10000000-0000-0000-0000-000000000002",
    medibase_id: "MB-100002",
    full_name: "Vikram Singh",
    phone_number: "+91 98765 10002",
    blood_group: "A+",
    gender: "Male",
    date_of_birth: "1975-11-22",
    occupation: "Farmer",
    allergies: ["Pollen"],
    chronic_conditions: ["Osteoarthritis"],
  },
  "MB-100003": {
    id: "10000000-0000-0000-0000-000000000003",
    medibase_id: "MB-100003",
    full_name: "Priya Reddy",
    phone_number: "+91 98765 10003",
    blood_group: "AB+",
    gender: "Female",
    date_of_birth: "1993-01-18",
    occupation: "Marketing Manager",
    allergies: ["Peanuts", "Dust"],
    chronic_conditions: ["Type 2 Diabetes", "Hypertension"],
  },
  "MB-100004": {
    id: "10000000-0000-0000-0000-000000000004",
    medibase_id: "MB-100004",
    full_name: "Suresh Patel",
    phone_number: "+91 98765 10004",
    blood_group: "O+",
    gender: "Male",
    date_of_birth: "1968-09-30",
    occupation: "Shopkeeper",
    allergies: ["Ibuprofen"],
    chronic_conditions: ["Coronary Artery Disease"],
  },
  "MB-100005": {
    id: "10000000-0000-0000-0000-000000000005",
    medibase_id: "MB-100005",
    full_name: "Kavita Sharma",
    phone_number: "+91 98765 10005",
    blood_group: "B-",
    gender: "Female",
    date_of_birth: "1980-05-14",
    occupation: "Homemaker",
    allergies: ["Latex"],
    chronic_conditions: ["Hypothyroidism"],
  },
  "MB-102394": {
    id: "demo-patient-rec-0001",
    medibase_id: "MB-102394",
    full_name: "Rahul Sharma",
    phone_number: "+91 98765 43210",
    blood_group: "O+",
    gender: "Male",
    date_of_birth: "1994-06-15",
    occupation: "Accountant",
    allergies: ["Penicillin", "Dust Mites"],
    chronic_conditions: ["Mild Hypertension"],
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    let rawId = (body.medibaseId || "").toString().trim().toUpperCase();

    // Format normalization: if user entered "100001" -> "MB-100001", or "MB 100001" -> "MB-100001"
    rawId = rawId.replace(/\s+/g, "");
    if (/^\d{6}$/.test(rawId)) {
      rawId = `MB-${rawId}`;
    } else if (/^MB\d+$/i.test(rawId)) {
      rawId = rawId.replace(/^MB/i, "MB-");
    }

    if (!rawId || !/^MB-\w+$/i.test(rawId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid MediBase ID format (e.g., MB-100001 or MB-102394).",
        },
        { status: 400 }
      );
    }

    const { findRegisteredPatient } = await import("@/lib/identity/access-requests-store");
    const regPatient = findRegisteredPatient(rawId);

    const patient = regPatient
      ? {
          id: regPatient.id,
          medibase_id: regPatient.medibase_id,
          full_name: regPatient.full_name,
          phone_number: regPatient.phone_number,
          blood_group: regPatient.blood_group,
          gender: regPatient.gender,
          date_of_birth: regPatient.date_of_birth,
          occupation: regPatient.occupation,
          allergies: regPatient.allergies,
          chronic_conditions: regPatient.chronic_conditions,
        }
      : FAST_LOGIN_PATIENTS[rawId] || {
          id: `pat-${rawId.toLowerCase()}`,
          medibase_id: rawId,
          full_name: `Patient ${rawId}`,
          phone_number: "+91 98765 00000",
          blood_group: "O+",
          gender: "Not Specified",
          date_of_birth: "1995-01-01",
          occupation: "Verified MediBase Citizen",
        };

    const response = NextResponse.json({
      success: true,
      patient,
      redirect: "/patient/dashboard",
      message: `Authenticated as ${patient.full_name} (${patient.medibase_id})`,
    });

    // Set demo role and active patient ID cookies
    response.cookies.set("medibase_demo_role", "patient", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
      httpOnly: false,
    });

    response.cookies.set("medibase_active_patient_id", patient.medibase_id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
      httpOnly: false,
    });

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to execute fast login.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
