import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseAndValidatePatientQR } from "@/lib/identity/qr-code";

// Demo Patients Baseline Registry (From Database Hackathon.pdf)
const DEMO_PATIENTS_LOOKUP: Record<
  string,
  {
    id: string;
    profile_id: string;
    medibase_id: string;
    full_name: string;
    date_of_birth: string | null;
    gender: string | null;
    blood_group: string | null;
    occupation: string | null;
    qr_code_token: string;
  }
> = {
  "MB-100001": {
    id: "10000000-0000-0000-0000-000000000001",
    profile_id: "00000000-0000-0000-0000-000000000001",
    medibase_id: "MB-100001",
    full_name: "Anjali Mehta",
    date_of_birth: "1990-07-05",
    gender: "Female",
    blood_group: "O-",
    occupation: "School Teacher",
    qr_code_token: "d3b07384-0001-4632-b7e6-8c2ff6d8b901",
  },
  "MB-100002": {
    id: "10000000-0000-0000-0000-000000000002",
    profile_id: "00000000-0000-0000-0000-000000000002",
    medibase_id: "MB-100002",
    full_name: "Vikram Singh",
    date_of_birth: "1975-11-22",
    gender: "Male",
    blood_group: "A+",
    occupation: "Farmer",
    qr_code_token: "d3b07384-0002-4632-b7e6-8c2ff6d8b902",
  },
  "MB-100003": {
    id: "10000000-0000-0000-0000-000000000003",
    profile_id: "00000000-0000-0000-0000-000000000003",
    medibase_id: "MB-100003",
    full_name: "Priya Reddy",
    date_of_birth: "1993-01-18",
    gender: "Female",
    blood_group: "AB+",
    occupation: "Marketing Manager",
    qr_code_token: "d3b07384-0003-4632-b7e6-8c2ff6d8b903",
  },
  "MB-100004": {
    id: "10000000-0000-0000-0000-000000000004",
    profile_id: "00000000-0000-0000-0000-000000000004",
    medibase_id: "MB-100004",
    full_name: "Suresh Patel",
    date_of_birth: "1968-09-30",
    gender: "Male",
    blood_group: "O+",
    occupation: "Shopkeeper",
    qr_code_token: "d3b07384-0004-4632-b7e6-8c2ff6d8b904",
  },
  "MB-100005": {
    id: "10000000-0000-0000-0000-000000000005",
    profile_id: "00000000-0000-0000-0000-000000000005",
    medibase_id: "MB-100005",
    full_name: "Kavita Sharma",
    date_of_birth: "1980-05-14",
    gender: "Female",
    blood_group: "B-",
    occupation: "Homemaker",
    qr_code_token: "d3b07384-0005-4632-b7e6-8c2ff6d8b905",
  },
  "MB-100006": {
    id: "10000000-0000-0000-0000-000000000006",
    profile_id: "00000000-0000-0000-0000-000000000006",
    medibase_id: "MB-100006",
    full_name: "Manoj Desai",
    date_of_birth: "1982-04-12",
    gender: "Male",
    blood_group: "A-",
    occupation: "Teacher",
    qr_code_token: "d3b07384-0006-4632-b7e6-8c2ff6d8b906",
  },
  "MB-100007": {
    id: "10000000-0000-0000-0000-000000000007",
    profile_id: "00000000-0000-0000-0000-000000000007",
    medibase_id: "MB-100007",
    full_name: "Neha Gupta",
    date_of_birth: "1995-10-25",
    gender: "Female",
    blood_group: "B+",
    occupation: "Data Analyst",
    qr_code_token: "d3b07384-0007-4632-b7e6-8c2ff6d8b907",
  },
  "MB-100008": {
    id: "10000000-0000-0000-0000-000000000008",
    profile_id: "00000000-0000-0000-0000-000000000008",
    medibase_id: "MB-100008",
    full_name: "Ramesh Iyer",
    date_of_birth: "1955-08-10",
    gender: "Male",
    blood_group: "O-",
    occupation: "Retired Professor",
    qr_code_token: "d3b07384-0008-4632-b7e6-8c2ff6d8b908",
  },
  "MB-100009": {
    id: "10000000-0000-0000-0000-000000000009",
    profile_id: "00000000-0000-0000-0000-000000000009",
    medibase_id: "MB-100009",
    full_name: "Deepa Nair",
    date_of_birth: "1988-06-17",
    gender: "Female",
    blood_group: "A+",
    occupation: "Banker",
    qr_code_token: "d3b07384-0009-4632-b7e6-8c2ff6d8b909",
  },
  "MB-100010": {
    id: "10000000-0000-0000-0000-000000000010",
    profile_id: "00000000-0000-0000-0000-000000000010",
    medibase_id: "MB-100010",
    full_name: "Rajesh Kumar",
    date_of_birth: "1985-03-12",
    gender: "Male",
    blood_group: "B+",
    occupation: "Software Engineer",
    qr_code_token: "d3b07384-0010-4632-b7e6-8c2ff6d8b910",
  },
  "MB-102394": {
    id: "demo-patient-rec-0001",
    profile_id: "00000000-0000-0000-0000-000000000098",
    medibase_id: "MB-102394",
    full_name: "Rahul Sharma",
    date_of_birth: "1994-06-15",
    gender: "Male",
    blood_group: "O+",
    occupation: "Accountant",
    qr_code_token: "d3b07384-d113-4632-b7e6-8c2ff6d8b991",
  },
};

function calculateAge(dobString?: string | null): number | null {
  if (!dobString) return null;
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Check Authenticated Session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // In demo mode, verify via demo cookie or fallback
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const demoRole = cookieStore.get("medibase_demo_role")?.value;

    const isStaffSession = Boolean(
      (user && user.user_metadata?.role !== "patient") ||
      demoRole === "hospital_staff"
    );

    if (authError && !isStaffSession) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Hospital staff authentication required." },
        { status: 401 }
      );
    }

    // 2. Parse Request Body
    const body = await request.json().catch(() => ({}));
    const { medibaseId, qrPayload } = body;

    let targetMediBaseId: string | null = null;
    let targetQrToken: string | null = null;
    let lookupMethod: "search" | "qr_scan" = "search";

    if (qrPayload) {
      lookupMethod = "qr_scan";
      const qrValidation = parseAndValidatePatientQR(qrPayload);
      if (!qrValidation.isValid || !qrValidation.medibaseId) {
        return NextResponse.json(
          {
            success: false,
            error: qrValidation.error || "Invalid QR code format. Please scan a valid MediBase QR code.",
          },
          { status: 400 }
        );
      }
      targetMediBaseId = qrValidation.medibaseId;
      targetQrToken = qrValidation.qrCodeToken || null;
    } else if (medibaseId && typeof medibaseId === "string") {
      const cleanId = medibaseId.trim().toUpperCase();
      if (!/^MB-\w+$/i.test(cleanId)) {
        return NextResponse.json(
          { success: false, error: "Please provide a valid MediBase ID format (e.g. MB-102394)." },
          { status: 400 }
        );
      }
      targetMediBaseId = cleanId;
    } else {
      return NextResponse.json(
        { success: false, error: "Please provide a MediBase ID or QR payload." },
        { status: 400 }
      );
    }

    // 3. Resolve Patient Record (Instant In-Memory Lookup first, then Database fallback)
    let patientRecord = null;
    let profileName: string | null = null;

    const { findRegisteredPatient } = await import("@/lib/identity/access-requests-store");
    const registered = targetMediBaseId ? findRegisteredPatient(targetMediBaseId) : undefined;

    if (registered) {
      patientRecord = {
        id: registered.id,
        profile_id: registered.id,
        medibase_id: registered.medibase_id,
        qr_code_token: `token-${registered.medibase_id.toLowerCase()}`,
        date_of_birth: registered.date_of_birth,
        gender: registered.gender,
        blood_group: registered.blood_group,
        occupation: registered.occupation,
      };
      profileName = registered.full_name;
    } else if (targetMediBaseId && DEMO_PATIENTS_LOOKUP[targetMediBaseId]) {
      const demoPatient = DEMO_PATIENTS_LOOKUP[targetMediBaseId];
      patientRecord = {
        id: demoPatient.id,
        profile_id: demoPatient.profile_id,
        medibase_id: demoPatient.medibase_id,
        qr_code_token: demoPatient.qr_code_token,
        date_of_birth: demoPatient.date_of_birth,
        gender: demoPatient.gender,
        blood_group: demoPatient.blood_group,
        occupation: demoPatient.occupation,
      };
      profileName = demoPatient.full_name;
    } else {
      try {
        let query = supabase
          .from("patients")
          .select("id, profile_id, medibase_id, qr_code_token, date_of_birth, gender, blood_group, occupation, profiles(full_name)")
          .limit(1);

        if (targetQrToken) {
          query = query.or(`medibase_id.eq.${targetMediBaseId},qr_code_token.eq.${targetQrToken}`);
        } else {
          query = query.eq("medibase_id", targetMediBaseId);
        }

        const { data: matchedPatient } = await query.maybeSingle();

        if (matchedPatient) {
          patientRecord = matchedPatient;
          const profileObj = Array.isArray(matchedPatient.profiles)
            ? matchedPatient.profiles[0]
            : matchedPatient.profiles;
          profileName = (profileObj as { full_name?: string })?.full_name || null;
        }
      } catch {
        // Handled below
      }
    }

    if (!patientRecord) {
      return NextResponse.json(
        {
          success: false,
          error: `No registered patient found with MediBase ID "${targetMediBaseId}". Please verify the ID or scan patient QR code.`,
        },
        { status: 404 }
      );
    }

    const calculatedAge = calculateAge(patientRecord.date_of_birth);

    // 4. Record Audit Log Entry (Patient identification is auditable, non-blocking)
    try {
      const staffUserId = user?.id || "demo-staff-0001";
      const staffRole = user?.user_metadata?.staff_role || "doctor";
      const hospitalId = user?.user_metadata?.hospital_id || "a0000000-0000-0000-0000-000000000001";

      supabase.from("audit_logs").insert({
        actor_profile_id: staffUserId,
        actor_role: staffRole,
        patient_id: patientRecord.id,
        hospital_id: hospitalId,
        action: lookupMethod === "qr_scan" ? "qr_patient_lookup" : "patient_lookup",
        resource_type: "patient_identity",
        resource_id: patientRecord.id,
        metadata: {
          medibase_id: patientRecord.medibase_id,
          method: lookupMethod,
        },
      });
    } catch {
      // Audit log non-blocking
    }

    // 5. Return MINIMAL Identification Information ONLY (Strictly NO medical records)
    return NextResponse.json({
      success: true,
      patient: {
        id: patientRecord.id,
        medibase_id: patientRecord.medibase_id,
        full_name: profileName || "MediBase Patient",
        age: calculatedAge ?? 32,
        gender: patientRecord.gender || "Not Specified",
        blood_group: patientRecord.blood_group || "Unknown",
        occupation: patientRecord.occupation || null,
        is_identified: true,
      },
      message: "Patient identified successfully. Access authorization required before viewing medical records.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "An unexpected error occurred during patient lookup.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
