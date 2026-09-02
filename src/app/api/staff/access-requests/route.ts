import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  findPendingAccessRequest,
  addAccessRequest,
  getStaffAccessRequests,
} from "@/lib/identity/access-requests-store";

export async function GET() {
  try {
    const requests = getStaffAccessRequests();
    return NextResponse.json({
      success: true,
      requests,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load access requests.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

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
      const cleanMbId = medibaseId.trim().toUpperCase();
      try {
        const { data: patient } = await supabase
          .from("patients")
          .select("id")
          .eq("medibase_id", cleanMbId)
          .maybeSingle();

        if (patient) {
          targetPatientId = patient.id;
        }
      } catch {
        // Fallback below
      }

      if (!targetPatientId) {
        const num = parseInt(cleanMbId.replace(/\D/g, ""), 10);
        const index = num >= 100000 ? num - 100000 : num;
        targetPatientId = `10000000-0000-0000-0000-${String(index).padStart(12, "0")}`;
      }
    }

    // 4. Duplicate Request Prevention (Check if active pending request already exists)
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
      const { data: newRequest, error: insertError } = await supabase
        .from("access_requests")
        .insert({
          patient_id: targetPatientId,
          requested_by_staff_id: staffRecordId,
          hospital_id: hospitalRecordId,
          reason,
          access_type: accessType,
          status: "pending",
          expires_at: expiresIso,
        })
        .select("id")
        .single();

      if (newRequest && !insertError) {
        createdRequestId = newRequest.id;
      }

      // Record in audit log
      await supabase.from("audit_logs").insert({
        actor_profile_id: user?.id || staffRecordId,
        actor_role: "doctor",
        patient_id: targetPatientId,
        hospital_id: hospitalRecordId,
        action: "access_request_created",
        resource_type: "access_request",
        resource_id: createdRequestId,
        metadata: {
          reason,
          access_type: accessType,
          provider_name: providerName,
          hospital_name: hospitalName,
        },
      });
    } catch {
      // Runtime fallback continues
    }

    // Save in runtime store for cross-route sync and deduplication
    addAccessRequest({
      id: createdRequestId,
      patient_id: targetPatientId,
      requested_by_staff_id: staffRecordId,
      hospital_id: hospitalRecordId,
      doctor_name: providerName,
      doctor_role: "DOCTOR / Senior Physician",
      hospital_name: hospitalName,
      department: departmentName,
      purpose: reason,
      requested_scope: ["Medical History", "Prescriptions", "Diagnostic Reports"],
      status: "pending",
      requested_at: nowIso,
      expires_at: expiresIso,
      is_active: true,
    });

    return NextResponse.json({
      success: true,
      request_id: createdRequestId,
      status: "pending",
      expires_at: expiresIso,
      provider_name: providerName,
      hospital_name: hospitalName,
      message: "Access authorization request submitted successfully. Awaiting patient approval.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create access request.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
