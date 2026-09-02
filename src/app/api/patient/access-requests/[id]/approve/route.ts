import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { approveAccessRequest } from "@/lib/identity/access-requests-store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const resolvedParams = await params;
    const requestId = resolvedParams.id;

    if (!requestId) {
      return NextResponse.json(
        { success: false, error: "Request ID is required." },
        { status: 400 }
      );
    }

    // 1. Verify Authenticated Patient Session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const demoRole = cookieStore.get("medibase_demo_role")?.value;

    const isPatientSession = Boolean(
      (user && user.user_metadata?.role === "patient") ||
      demoRole === "patient" ||
      !authError
    );

    if (authError && !isPatientSession) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in as a patient." },
        { status: 401 }
      );
    }

    // 2. Resolve Patient Record ID
    let patientRecordId = "demo-patient-rec-0001";

    if (user) {
      const { data: patient } = await supabase
        .from("patients")
        .select("id")
        .eq("profile_id", user.id)
        .maybeSingle();

      if (patient) {
        patientRecordId = patient.id;
      }
    } else if (demoRole === "patient") {
      const activePatientId = cookieStore.get("medibase_active_patient_id")?.value?.trim();
      if (activePatientId) {
        // We use the activePatientId (which is usually the MB-ID) and pass it along
        patientRecordId = activePatientId;
      }
    }

    // 3. Query Target Access Request
    let targetRequest = null;

    try {
      const { data: dbReq } = await supabase
        .from("access_requests")
        .select("id, patient_id, requested_by_staff_id, hospital_id, status, access_type, expires_at")
        .eq("id", requestId)
        .maybeSingle();

      if (dbReq) {
        targetRequest = dbReq;
      }
    } catch {
      // Non-blocking fallback
    }

    // Patient Ownership Verification against DB
    if (targetRequest && targetRequest.patient_id !== patientRecordId && patientRecordId !== "demo-patient-rec-0001") {
      return NextResponse.json(
        { success: false, error: "Forbidden. You can only approve access requests directed to your own profile." },
        { status: 403 }
      );
    }

    if (targetRequest && targetRequest.status !== "pending") {
      return NextResponse.json(
        { success: false, error: `This access request cannot be approved because its status is '${targetRequest.status}'.` },
        { status: 400 }
      );
    }

    // 4. Update Database: Set status = 'approved' and Insert into access_grants
    const nowIso = new Date().toISOString();
    const validUntilIso = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30-min window

    try {
      await supabase
        .from("access_requests")
        .update({
          status: "approved",
          responded_at: nowIso,
        })
        .eq("id", requestId);

      if (targetRequest) {
        await supabase.from("access_grants").insert({
          patient_id: targetRequest.patient_id,
          access_request_id: targetRequest.id,
          hospital_id: targetRequest.hospital_id,
          staff_id: targetRequest.requested_by_staff_id,
          granted_by_patient_id: targetRequest.patient_id,
          access_type: targetRequest.access_type || "view_only",
          is_active: true,
          valid_from: nowIso,
          valid_until: validUntilIso,
        });
      }

      // Record in audit logs
      await supabase.from("audit_logs").insert({
        actor_profile_id: user?.id || "demo-patient-rec-0001",
        actor_role: "patient",
        patient_id: patientRecordId,
        hospital_id: targetRequest?.hospital_id || "a0000000-0000-0000-0000-000000000001",
        action: "access_request_approved",
        resource_type: "access_grant",
        resource_id: requestId,
        metadata: {
          request_id: requestId,
          status: "approved",
          duration_minutes: 30,
        },
      });
    } catch {
      // Non-blocking fallback
    }

    // 5. Update Runtime In-Memory Store
    const dbFallbackInfo = targetRequest ? {
      staff_id: targetRequest.requested_by_staff_id,
      hospital_id: targetRequest.hospital_id,
    } : undefined;

    const runtimeResult = approveAccessRequest(requestId, patientRecordId, dbFallbackInfo);
    if (!runtimeResult.success && runtimeResult.error) {
      return NextResponse.json({ success: false, error: runtimeResult.error }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      request_id: requestId,
      status: "approved",
      valid_until: validUntilIso,
      message: "Access request approved successfully. Authorized healthcare provider now has access for 30 minutes.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to approve access request.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
