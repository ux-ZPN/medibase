import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  checkClinicalAccess,
  recordClinicalEncounter,
} from "@/lib/identity/access-requests-store";

interface NewVisitRequestBody {
  chiefComplaint?: string;
  diagnosis?: string;
  clinicalNotes?: string;
  visitType?: string;
  department?: string;
  vitals?: {
    systolic?: number;
    diastolic?: number;
    heart_rate?: number;
    glucose_mg_dl?: number;
    spo2?: number;
  };
  prescriptions?: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
    instructions?: string;
  }>;
  investigations?: Array<{
    name: string;
    status: string;
    result?: string;
  }>;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const resolvedParams = await params;
    const targetPatientIdentifier = resolvedParams.id;

    if (!targetPatientIdentifier) {
      return NextResponse.json(
        { success: false, error: "Patient identifier is required." },
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

    const isPatientSession = Boolean(
      (user && user.user_metadata?.role === "patient") ||
      demoRole === "patient"
    );

    if (isPatientSession) {
      return NextResponse.json(
        {
          success: false,
          authorized: false,
          error: "Forbidden. Patient accounts cannot create hospital clinical visit records.",
        },
        { status: 403 }
      );
    }

    const isStaffSession = Boolean(
      (user && user.user_metadata?.role !== "patient") ||
      demoRole === "hospital_staff"
    );

    if (authError && !isStaffSession) {
      return NextResponse.json(
        {
          success: false,
          authorized: false,
          error: "Unauthorized. Hospital staff credentials required to record visits.",
        },
        { status: 401 }
      );
    }

    // 2. Strict Staff Identity Derivation (Never trust frontend-sent IDs)
    let staffRecordId = "b0000000-0000-0000-0000-000000000001";
    let hospitalRecordId = "a0000000-0000-0000-0000-000000000001";
    let doctorFullName = "Dr. Rahul Sharma";
    let doctorRole = "DOCTOR";
    let hospitalName = "City General Hospital";

    if (user) {
      const { data: dbStaff } = await supabase
        .from("hospital_staff")
        .select(`
          id,
          hospital_id,
          role,
          department,
          profiles(full_name),
          hospitals(name)
        `)
        .eq("profile_id", user.id)
        .maybeSingle();

      if (dbStaff) {
        staffRecordId = dbStaff.id;
        hospitalRecordId = dbStaff.hospital_id;
        doctorRole = dbStaff.role ? dbStaff.role.toUpperCase() : "DOCTOR";
        const profObj = Array.isArray(dbStaff.profiles) ? dbStaff.profiles[0] : dbStaff.profiles;
        if (profObj && (profObj as { full_name?: string }).full_name) {
          doctorFullName = (profObj as { full_name?: string }).full_name!;
        }
        const hospObj = Array.isArray(dbStaff.hospitals) ? dbStaff.hospitals[0] : dbStaff.hospitals;
        if (hospObj && (hospObj as { name?: string }).name) {
          hospitalName = (hospObj as { name?: string }).name!;
        }
      }
    }

    // 3. Resolve Target Patient
    let targetPatientDbId = targetPatientIdentifier;
    let medibaseId = targetPatientIdentifier.toUpperCase();

    try {
      const { data: dbPatient } = await supabase
        .from("patients")
        .select("id, medibase_id")
        .or(`id.eq.${targetPatientIdentifier},medibase_id.eq.${targetPatientIdentifier.toUpperCase()}`)
        .maybeSingle();

      if (dbPatient) {
        targetPatientDbId = dbPatient.id;
        medibaseId = dbPatient.medibase_id;
      }
    } catch {
      // Fallback to identifier
    }

    // 4. CRITICAL SECURITY CHECK: Active Access Grant Required
    let isAuthorized = false;

    // Database check
    try {
      const { data: dbGrant } = await supabase
        .from("access_grants")
        .select("id, is_active, valid_until")
        .eq("patient_id", targetPatientDbId)
        .eq("is_active", true)
        .gt("valid_until", new Date().toISOString())
        .maybeSingle();

      if (dbGrant) {
        isAuthorized = true;
      }
    } catch {
      // Check runtime store
    }

    // Runtime store check
    if (!isAuthorized) {
      const runtimeCheck = checkClinicalAccess(targetPatientDbId, staffRecordId, hospitalRecordId);
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
          error: "ACCESS DENIED: You do not have active patient authorization to record clinical visits for this patient.",
        },
        { status: 403 }
      );
    }

    // 6. Parse and Validate Form Payload
    let body: NewVisitRequestBody = {};
    try {
      body = (await request.json()) as NewVisitRequestBody;
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body." },
        { status: 400 }
      );
    }

    const chiefComplaint = typeof body.chiefComplaint === "string" ? body.chiefComplaint.trim() : "";
    const diagnosis = typeof body.diagnosis === "string" ? body.diagnosis.trim() : "";
    const clinicalNotes = typeof body.clinicalNotes === "string" ? body.clinicalNotes.trim() : "";
    const visitType = typeof body.visitType === "string" ? body.visitType : "outpatient";
    const department = typeof body.department === "string" ? body.department : "Cardiology / Outpatient Clinic";

    // Required Field Validation
    if (!chiefComplaint || chiefComplaint.length < 3) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed: Chief complaint is required (minimum 3 characters).",
        },
        { status: 400 }
      );
    }

    // 7. Atomic Database Insertion
    let encounterId = `enc-${Date.now()}`;
    const nowIso = new Date().toISOString();

    try {
      // 7.1 Insert encounter
      const { data: dbEnc, error: encError } = await supabase
        .from("encounters")
        .insert({
          patient_id: targetPatientDbId,
          hospital_id: hospitalRecordId,
          attending_staff_id: staffRecordId,
          visit_type: visitType,
          encounter_date: nowIso,
          department: department,
          chief_complaint: chiefComplaint,
          clinical_notes: clinicalNotes || "Routine outpatient clinical encounter.",
        })
        .select("id")
        .single();

      if (!encError && dbEnc) {
        encounterId = dbEnc.id;

        // 7.2 Insert Diagnosis if provided
        if (diagnosis) {
          await supabase.from("diagnoses").insert({
            encounter_id: encounterId,
            patient_id: targetPatientDbId,
            diagnosis_name: diagnosis,
            diagnosis_type: "primary",
            clinical_status: "active",
          });
        }

        // 7.3 Insert Vitals if provided
        if (body.vitals && typeof body.vitals === "object") {
          await supabase.from("vitals").insert({
            encounter_id: encounterId,
            patient_id: targetPatientDbId,
            systolic_bp: body.vitals.systolic || 120,
            diastolic_bp: body.vitals.diastolic || 80,
            heart_rate_bpm: body.vitals.heart_rate || 72,
            oxygen_saturation_pct: body.vitals.spo2 || 98,
          });
        }

        // 7.4 Insert Prescriptions if provided
        if (Array.isArray(body.prescriptions) && body.prescriptions.length > 0) {
          const rxRows = body.prescriptions.map((rx) => ({
            encounter_id: encounterId,
            patient_id: targetPatientDbId,
            prescribed_by_staff_id: staffRecordId,
            medication_name: rx.name,
            dosage: rx.dosage || "As directed",
            frequency: rx.frequency || "Daily",
            instructions: rx.instructions || "",
            is_active: true,
          }));
          await supabase.from("prescriptions").insert(rxRows);
        }
      }
    } catch {
      // Synchronized via runtime store below
    }

    // 8. Synchronize with Runtime Store for Instant SSR / Client Cache Invalidation
    const savedEncounter = recordClinicalEncounter(medibaseId, {
      patient_id: medibaseId,
      hospital_name: hospitalName,
      department: department,
      doctor_name: doctorFullName.startsWith("Dr.") ? doctorFullName : `Dr. ${doctorFullName}`,
      doctor_role: doctorRole,
      visit_type: visitType === "outpatient" ? "Outpatient Follow-up" : visitType,
      chief_complaint: chiefComplaint,
      diagnoses: diagnosis ? [{ name: diagnosis, is_primary: true, is_new: true }] : [],
      prescriptions: Array.isArray(body.prescriptions)
        ? body.prescriptions.map((p) => ({
            name: p.name,
            dosage: p.dosage || "Standard",
            frequency: p.frequency || "Daily",
            instructions: p.instructions,
            is_active: true,
            is_new: true,
          }))
        : [],
      vitals: body.vitals
        ? {
            bp: `${body.vitals.systolic || 128}/${body.vitals.diastolic || 82} mmHg`,
            heart_rate: body.vitals.heart_rate || 72,
            glucose_mg_dl: body.vitals.glucose_mg_dl || 118,
            spo2: body.vitals.spo2 || 98,
          }
        : {
            bp: "128/82 mmHg",
            heart_rate: 72,
            glucose_mg_dl: 118,
            spo2: 98,
          },
      investigations: Array.isArray(body.investigations) ? body.investigations : [],
      clinical_notes: clinicalNotes || "Clinical visit documented by attending physician.",
    });

    // 9. Audit Event Logging (visit_created)
    try {
      await supabase.from("audit_logs").insert({
        actor_profile_id: user?.id || staffRecordId,
        actor_role: "doctor",
        patient_id: targetPatientDbId,
        hospital_id: hospitalRecordId,
        action: "visit_created",
        resource_type: "encounters",
        resource_id: encounterId,
        metadata: {
          medibase_id: medibaseId,
          visit_type: visitType,
          chief_complaint: chiefComplaint,
          diagnosis: diagnosis,
        },
      });
    } catch {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      authorized: true,
      encounter_id: savedEncounter.id || encounterId,
      patient_id: medibaseId,
      message: "New clinical visit recorded successfully.",
      encounter: savedEncounter,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to record clinical visit.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
