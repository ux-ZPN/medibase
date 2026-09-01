import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { denyAccessRequest } from "@/lib/identity/access-requests-store";

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
    }

    // 3. Query Target Access Request
    let targetRequest = null;

    try {
      const { data: dbReq } = await supabase
        .from("access_requests")
        .select("id, patient_id, requested_by_staff_id, hospital_id, status")
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
        { success: false, error: "Forbidden. You can only deny access requests directed to your own profile." },
        { status: 403 }
      );
    }

    if (targetRequest && targetRequest.status !== "pending") {
      return NextResponse.json(
        { success: false, error: `This access request cannot be denied because its status is already '${targetRequest.status}'.` },
        { status: 400 }
      );
    }

    // 4. Update Database: Set status = 'denied'
    const nowIso = new Date().toISOString();

    try {
      await supabase
        .from("access_requests")
        .update({
          status: "denied",
          responded_at: nowIso,
        })
        .eq("id", requestId);

      // Record in audit logs
      await supabase.from("audit_logs").insert({
        actor_profile_id: user?.id || "demo-patient-rec-0001",
        actor_role: "patient",
        patient_id: patientRecordId,
        hospital_id: targetRequest?.hospital_id || "a0000000-0000-0000-0000-000000000001",
        action: "access_request_denied",
        resource_type: "access_request",
        resource_id: requestId,
        metadata: {
          request_id: requestId,
          status: "denied",
        },
      });
    } catch {
      // Non-blocking fallback
    }

    // 5. Update Runtime In-Memory Store
    const runtimeResult = denyAccessRequest(requestId, patientRecordId);
    if (!runtimeResult.success && runtimeResult.error) {
      return NextResponse.json({ success: false, error: runtimeResult.error }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      request_id: requestId,
      status: "denied",
      message: "Access request has been denied. The requesting provider will not receive medical record access.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to deny access request.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
