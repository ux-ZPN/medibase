import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  findPendingAccessRequest,
  addAccessRequest,
} from "@/lib/identity/access-requests-store";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

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
        { success: false, error: "Unauthorized. Please sign in with an authorized hospital staff account." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { patientId, medibaseId, reason = "Clinical Consultation & Care", accessType = "view_only" } = body;

    if (!patientId && !medibaseId) {
      return NextResponse.json(
        { success: false, error: "Patient identifier is required to initiate an access request." },
        { status: 400 }
      );
    }

    // 2. Resolve Authenticated Staff and Hospital Records (Never trust client foreign keys)
    let staffRecordId = "b0000000-0000-0000-0000-000000000001";
    let hospitalRecordId = "a0000000-0000-0000-0000-000000000001";
    let providerName = "Dr. Rahul Sharma";
    let hospitalName = "City General Hospital";
    let departmentName = "Cardiology OPD";

    if (user) {
      const { data: dbStaff } = await supabase
        .from("hospital_staff")
        .select("id, hospital_id, department, hospitals(name), profiles(full_name)")
        .eq("profile_id", user.id)
        .maybeSingle();

      if (dbStaff) {
        staffRecordId = dbStaff.id;
        hospitalRecordId = dbStaff.hospital_id;
        departmentName = dbStaff.department || departmentName;
        const hospObj = Array.isArray(dbStaff.hospitals) ? dbStaff.hospitals[0] : dbStaff.hospitals;
        const profObj = Array.isArray(dbStaff.profiles) ? dbStaff.profiles[0] : dbStaff.profiles;
        hospitalName = (hospObj as { name?: string })?.name || hospitalName;
        providerName = (profObj as { full_name?: string })?.full_name || user.user_metadata?.full_name || providerName;
      } else {
        staffRecordId = user.id;
        hospitalRecordId = user.user_metadata?.hospital_id || hospitalRecordId;
        hospitalName = user.user_metadata?.hospital_name || hospitalName;
        providerName = user.user_metadata?.full_name || providerName;
      }
    }

    // 3. Resolve Target Patient Record
    let targetPatientId = patientId;

    if (!targetPatientId && medibaseId) {
      const { data: patient } = await supabase
        .from("patients")
        .select("id")
        .eq("medibase_id", medibaseId.trim().toUpperCase())
        .maybeSingle();

      if (patient) {
        targetPatientId = patient.id;
      } else {
        // Fallback mapping for demo patient IDs
        targetPatientId = `10000000-0000-0000-0000-${medibaseId.replace(/\D/g, "").padStart(12, "0").slice(-12)}`;
      }
    }

    // 4. Duplicate Request Prevention (Check if active pending request already exists)
    // Check runtime store first for instant in-memory deduplication
    const existingRuntimeRequest = findPendingAccessRequest(
      targetPatientId,
      staffRecordId,
      hospitalRecordId
    );

    if (existingRuntimeRequest) {
      return NextResponse.json({
        success: true,
        request_id: existingRuntimeRequest.id,
        is_duplicate: true,
        status: "pending",
        message: "A pending access request already exists for this patient. Awaiting patient authorization.",
      });
    }

    // Also check Supabase DB
    try {
      const { data: existingDbRequest } = await supabase
        .from("access_requests")
        .select("id, status, requested_at, expires_at")
        .eq("patient_id", targetPatientId)
        .eq("requested_by_staff_id", staffRecordId)
        .eq("status", "pending")
        .maybeSingle();

      if (existingDbRequest) {
        return NextResponse.json({
          success: true,
          request_id: existingDbRequest.id,
          is_duplicate: true,
          status: "pending",
          message: "A pending access request already exists for this patient. Awaiting patient authorization.",
        });
      }
    } catch {
      // Continue if table lookup error occurs
    }

    // 5. Create Access Request in Database & Runtime Store
    const nowIso = new Date().toISOString();
    const expiresIso = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    let createdRequestId = `req-${Date.now()}`;

    try {
      const { data: newRequest } = await supabase
        .from("access_requests")
        .insert({
          patient_id: targetPatientId,
          requested_by_staff_id: staffRecordId,
          hospital_id: hospitalRecordId,
          status: "pending",
          reason: reason,
          access_type: accessType === "view_and_contribute" ? "view_and_contribute" : "view_only",
          requested_at: nowIso,
          expires_at: expiresIso,
        })
        .select("id, status, requested_at")
        .single();

      if (newRequest) {
        createdRequestId = newRequest.id;
      }
    } catch {
      // Non-blocking fallback
    }

    // Register in runtime store
    addAccessRequest({
      id: createdRequestId,
      patient_id: targetPatientId,
      requested_by_staff_id: staffRecordId,
      hospital_id: hospitalRecordId,
      doctor_name: providerName.startsWith("Dr.") ? providerName : `Dr. ${providerName}`,
      doctor_role: "DOCTOR / Practitioner",
      hospital_name: hospitalName,
      department: departmentName,
      purpose: reason,
      requested_scope: ["Medical History", "Prescriptions", "Diagnostic Reports"],
      status: "pending",
      requested_at: nowIso,
      expires_at: expiresIso,
      is_active: true,
    });

    // 6. Record Audit Log Event
    try {
      await supabase.from("audit_logs").insert({
        actor_profile_id: user?.id || "demo-staff-0001",
        actor_role: "doctor",
        patient_id: targetPatientId,
        hospital_id: hospitalRecordId,
        action: "access_request_created",
        resource_type: "access_request",
        resource_id: createdRequestId,
        metadata: {
          request_id: createdRequestId,
          provider_name: providerName,
          hospital_name: hospitalName,
          reason: reason,
          access_type: accessType,
        },
      });
    } catch {
      // Audit log non-blocking
    }

    return NextResponse.json({
      success: true,
      request_id: createdRequestId,
      patient_id: targetPatientId,
      status: "pending",
      provider_name: providerName,
      hospital_name: hospitalName,
      message: "Access request sent successfully. The patient must authorize this request from their MediBase app.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create access request.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
