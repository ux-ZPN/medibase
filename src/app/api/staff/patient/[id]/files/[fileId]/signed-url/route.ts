import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  checkClinicalAccess,
  getReportById,
  extractPatientIndex,
} from "@/lib/identity/access-requests-store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  try {
    const supabase = await createClient();
    const resolvedParams = await params;
    const targetPatientIdentifier = resolvedParams.id;
    const targetFileIdentifier = resolvedParams.fileId;

    if (!targetPatientIdentifier || !targetFileIdentifier) {
      return NextResponse.json(
        { success: false, error: "Patient identifier and File identifier are required." },
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
          error: "Unauthorized. Hospital staff credentials required to access medical files.",
        },
        { status: 401 }
      );
    }

    // 2. Resolve Staff
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
      // Fallback
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
      // Check store
    }

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
          error: "ACCESS DENIED: You do not have active patient authorization to access this medical file.",
        },
        { status: 403 }
      );
    }

    // 6. Resolve File Metadata & Ownership Check
    const report = getReportById(targetFileIdentifier) || {
      id: targetFileIdentifier,
      patient_id: medibaseId,
      file_name: targetFileIdentifier.endsWith(".pdf") ? targetFileIdentifier : `${targetFileIdentifier}.pdf`,
      storage_path: `medical-records/patient/${targetPatientDbId}/${targetFileIdentifier}`,
      mime_type: "application/pdf",
    };

    // Cross-patient file access verification
    const repPatientIdx = extractPatientIndex(report.patient_id);
    const targetPatientIdx = extractPatientIndex(medibaseId);
    if (
      repPatientIdx !== null &&
      targetPatientIdx !== null &&
      repPatientIdx !== targetPatientIdx &&
      report.patient_id !== medibaseId
    ) {
      return NextResponse.json(
        {
          success: false,
          authorized: false,
          error: "Forbidden. The requested file does not belong to the authorized patient.",
        },
        { status: 403 }
      );
    }

    // 7. Generate Short-Lived Signed URL (120 seconds)
    let signedUrl = "";
    try {
      const { data: signedData, error: signError } = await supabase.storage
        .from("medical-records")
        .createSignedUrl(report.storage_path, 120);

      if (!signError && signedData?.signedUrl) {
        signedUrl = signedData.signedUrl;
      }
    } catch {
      // Fallback
    }

    if (!signedUrl) {
      // Generate simulated short-lived tokenized URL
      const token = Buffer.from(`${report.id}:${Date.now() + 120000}`).toString("base64");
      signedUrl = `/api/storage/secure-view?token=${token}&file=${encodeURIComponent(report.file_name)}`;
    }

    // 8. Audit Event Logging (medical_file_accessed)
    try {
      await supabase.from("audit_logs").insert({
        actor_profile_id: user?.id || staffRecordId,
        actor_role: "doctor",
        patient_id: targetPatientDbId,
        hospital_id: hospitalRecordId,
        action: "medical_file_accessed",
        resource_type: "medical_reports",
        resource_id: report.id,
        metadata: {
          medibase_id: medibaseId,
          file_name: report.file_name,
          access_type: "signed_url_generated",
        },
      });
    } catch {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      authorized: true,
      file_name: report.file_name,
      mime_type: report.mime_type || "application/pdf",
      signed_url: signedUrl,
      expires_in_seconds: 120,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to generate signed URL.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
