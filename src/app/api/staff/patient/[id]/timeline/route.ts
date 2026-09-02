import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  checkClinicalAccess,
  getPatientEncounters,
  ClinicalEncounter,
} from "@/lib/identity/access-requests-store";

interface DbEncounterRow {
  id: string;
  encounter_date: string;
  visit_type: string;
  department: string;
  chief_complaint: string;
  clinical_notes: string;
  hospitals?: { name?: string } | Array<{ name?: string }>;
  hospital_staff?: {
    profile_id?: string;
    role?: string;
    profiles?: { full_name?: string } | Array<{ full_name?: string }>;
  } | Array<{
    profile_id?: string;
    role?: string;
    profiles?: { full_name?: string } | Array<{ full_name?: string }>;
  }>;
  diagnoses?: Array<{
    id: string;
    diagnosis_name: string;
    icd10_code?: string;
    diagnosis_type?: string;
    clinical_status?: string;
  }>;
  prescriptions?: Array<{
    id: string;
    medication_name: string;
    dosage?: string;
    frequency?: string;
    instructions?: string;
    is_active?: boolean;
  }>;
  medical_tests?: Array<{
    id: string;
    test_name: string;
    test_status?: string;
    test_result_summary?: string;
  }>;
  medical_reports?: Array<{
    id: string;
    title?: string;
    file_name: string;
    file_url?: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const resolvedParams = await params;
    const targetPatientIdentifier = resolvedParams.id;

    if (!targetPatientIdentifier) {
      return NextResponse.json(
        { success: false, authorized: false, error: "Patient identifier is required." },
        { status: 400 }
      );
    }

    // 1. Verify Authenticated Staff Session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const demoRole = cookieStore.get("medibase_demo_role")?.value;

    const isStaffSession = Boolean(
      (user && user.user_metadata?.role !== "patient") ||
      demoRole === "hospital_staff"
    );

    if (authError && !isStaffSession) {
      return NextResponse.json(
        {
          success: false,
          authorized: false,
          error: "Unauthorized. Hospital staff credentials required to view medical timeline.",
        },
        { status: 401 }
      );
    }

    // 2. Resolve Staff and Hospital
    let staffRecordId = "b0000000-0000-0000-0000-000000000001";
    let hospitalRecordId = "a0000000-0000-0000-0000-000000000001";

    if (user) {
      const { data: dbStaff } = await supabase
        .from("hospital_staff")
        .select("id, hospital_id")
        .eq("profile_id", user.id)
        .maybeSingle();

      if (dbStaff) {
        staffRecordId = dbStaff.id;
        hospitalRecordId = dbStaff.hospital_id;
      }
    }

    // 3. Resolve Target Patient
    let targetPatientId = targetPatientIdentifier;
    let patientName = "Rahul Sharma";
    let medibaseId = targetPatientIdentifier.toUpperCase();
    let patientAge = 32;
    let bloodGroup = "O+";
    const allergies = ["Penicillin (Anaphylaxis)"];

    const { findRegisteredPatient } = await import("@/lib/identity/access-requests-store");
    const regPatient = findRegisteredPatient(targetPatientIdentifier);

    if (regPatient) {
      targetPatientId = regPatient.id;
      medibaseId = regPatient.medibase_id;
      patientName = regPatient.full_name;
      bloodGroup = regPatient.blood_group || "O+";
      if (regPatient.date_of_birth) {
        patientAge = new Date().getFullYear() - new Date(regPatient.date_of_birth).getFullYear();
      }
    } else {
      try {
        const { data: dbPatient } = await supabase
          .from("patients")
          .select(`
            id,
            medibase_id,
            date_of_birth,
            blood_group,
            profiles(full_name),
            medical_profiles(past_medical_history, chief_complaint)
          `)
          .or(`id.eq.${targetPatientIdentifier},medibase_id.eq.${targetPatientIdentifier.toUpperCase()}`)
          .maybeSingle();

        if (dbPatient) {
          targetPatientId = dbPatient.id;
          medibaseId = dbPatient.medibase_id;
          bloodGroup = dbPatient.blood_group || bloodGroup;
          const profObj = Array.isArray(dbPatient.profiles) ? dbPatient.profiles[0] : dbPatient.profiles;
          patientName = (profObj as { full_name?: string })?.full_name || patientName;
          if (dbPatient.date_of_birth) {
            patientAge = new Date().getFullYear() - new Date(dbPatient.date_of_birth).getFullYear();
          }
        }
      } catch {
        // Handled by default mapping
      }
    }

    // 4. CRITICAL SECURITY CHECK: Active Access Grant Required
    let isAuthorized = false;

    // Check Database Grants
    try {
      const { data: dbGrant } = await supabase
        .from("access_grants")
        .select("id, is_active, valid_until")
        .eq("patient_id", targetPatientId)
        .eq("is_active", true)
        .gt("valid_until", new Date().toISOString())
        .maybeSingle();

      if (dbGrant) {
        isAuthorized = true;
      }
    } catch {
      // Check runtime store
    }

    // Check Runtime Store
    if (!isAuthorized) {
      const runtimeCheck = checkClinicalAccess(targetPatientId, staffRecordId, hospitalRecordId);
      const runtimeCheckAlt = checkClinicalAccess(medibaseId, staffRecordId, hospitalRecordId);
      if (runtimeCheck.authorized || runtimeCheckAlt.authorized) {
        isAuthorized = true;
      }
    }

    // 5. IF UNAUTHORIZED: Return 403 ACCESS DENIED
    if (!isAuthorized) {
      return NextResponse.json(
        {
          success: false,
          authorized: false,
          status: "access_denied",
          patient_id: medibaseId,
          patient_name: patientName,
          error: "ACCESS DENIED: You do not have active patient authorization to view this medical timeline.",
          message: "Access requires explicit patient approval. Please initiate an authorization request.",
        },
        { status: 403 }
      );
    }

    // 6. IF AUTHORIZED: Query Real Encounters and Details
    let encountersList: ClinicalEncounter[] = getPatientEncounters(medibaseId);

    try {
      const { data: rawEncounters } = await supabase
        .from("encounters")
        .select(`
          id,
          encounter_date,
          visit_type,
          department,
          chief_complaint,
          clinical_notes,
          hospitals(name),
          hospital_staff(profile_id, profiles(full_name), role),
          diagnoses(id, diagnosis_name, icd10_code, diagnosis_type, clinical_status),
          prescriptions(id, medication_name, dosage, frequency, instructions, is_active),
          medical_tests(id, test_name, test_status, test_result_summary),
          medical_reports(id, title, file_name, file_url)
        `)
        .eq("patient_id", targetPatientId)
        .order("encounter_date", { ascending: false });

      if (rawEncounters && rawEncounters.length > 0) {
        const typedEncounters = rawEncounters as unknown as DbEncounterRow[];
        encountersList = typedEncounters.map((enc) => {
          const hospObj = Array.isArray(enc.hospitals) ? enc.hospitals[0] : enc.hospitals;
          const staffObj = Array.isArray(enc.hospital_staff) ? enc.hospital_staff[0] : enc.hospital_staff;
          const profObj = staffObj?.profiles
            ? (Array.isArray(staffObj.profiles) ? staffObj.profiles[0] : staffObj.profiles)
            : null;

          const docName = profObj?.full_name || "Dr. Rahul Sharma";
          const hospName = hospObj?.name || "City General Hospital";

          const formattedDate = new Date(enc.encounter_date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return {
            id: enc.id,
            patient_id: medibaseId,
            date: formattedDate,
            hospital_name: hospName,
            department: enc.department,
            doctor_name: docName.startsWith("Dr.") ? docName : `Dr. ${docName}`,
            doctor_role: staffObj?.role ? staffObj.role.toUpperCase() : "DOCTOR",
            visit_type: enc.visit_type,
            chief_complaint: enc.chief_complaint,
            diagnoses: Array.isArray(enc.diagnoses)
              ? enc.diagnoses.map((d) => ({
                  name: d.diagnosis_name,
                  code: d.icd10_code,
                  is_primary: d.diagnosis_type === "primary",
                }))
              : [],
            prescriptions: Array.isArray(enc.prescriptions)
              ? enc.prescriptions.map((p) => ({
                  name: p.medication_name,
                  dosage: p.dosage || "",
                  frequency: p.frequency || "",
                  instructions: p.instructions,
                  is_active: p.is_active,
                }))
              : [],
            investigations: Array.isArray(enc.medical_tests)
              ? enc.medical_tests.map((t) => ({
                  name: t.test_name,
                  status: t.test_status || "completed",
                  result: t.test_result_summary,
                }))
              : [],
            reports: Array.isArray(enc.medical_reports)
              ? enc.medical_reports.map((r) => ({
                  title: r.title || r.file_name,
                  file_name: r.file_name,
                  file_url: r.file_url,
                }))
              : [],
            clinical_notes: enc.clinical_notes,
          };
        });
      }
    } catch {
      // Non-blocking DB fallback
    }

    // 7. Audit Event Logging
    try {
      await supabase.from("audit_logs").insert({
        actor_profile_id: user?.id || staffRecordId,
        actor_role: "doctor",
        patient_id: targetPatientId,
        hospital_id: hospitalRecordId,
        action: "patient_medical_timeline_viewed",
        resource_type: "encounters_timeline",
        resource_id: targetPatientId,
        metadata: {
          medibase_id: medibaseId,
          encounters_count: encountersList.length,
        },
      });
    } catch {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      authorized: true,
      patient: {
        id: targetPatientId,
        medibase_id: medibaseId,
        name: patientName,
        age: patientAge,
        gender: "M",
        blood_group: bloodGroup,
        allergies: allergies,
      },
      encounters: encountersList,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load medical timeline.";
    return NextResponse.json({ success: false, authorized: false, error: msg }, { status: 500 });
  }
}
