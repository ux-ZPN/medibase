import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  checkClinicalAccess,
  addMedicalReport,
} from "@/lib/identity/access-requests-store";

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
]);

const FORBIDDEN_EXTENSIONS = new Set([
  "exe", "bat", "cmd", "sh", "js", "ts", "html", "htm", "php", "py", "vbs", "ps1",
]);

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

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
          error: "Forbidden. Patient accounts cannot upload clinical files to hospital records.",
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
          error: "Unauthorized. Hospital staff credentials required to upload medical files.",
        },
        { status: 401 }
      );
    }

    // 2. Strict Staff Identity Derivation (Never trust frontend-sent IDs)
    let staffRecordId = "b0000000-0000-0000-0000-000000000001";
    let hospitalRecordId = "a0000000-0000-0000-0000-000000000001";
    let doctorFullName = "Dr. Rahul Sharma";
    let hospitalName = "City General Hospital";

    if (user) {
      const { data: dbStaff } = await supabase
        .from("hospital_staff")
        .select(`
          id,
          hospital_id,
          profiles(full_name),
          hospitals(name)
        `)
        .eq("profile_id", user.id)
        .maybeSingle();

      if (dbStaff) {
        staffRecordId = dbStaff.id;
        hospitalRecordId = dbStaff.hospital_id;
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
      // Fallback to store
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
          error: "ACCESS DENIED: You do not have active patient authorization to upload medical files for this patient.",
        },
        { status: 403 }
      );
    }

    // 6. Extract and Validate File from Multipart Request or JSON
    let fileName = "medical_report.pdf";
    let mimeType = "application/pdf";
    let fileSizeBytes = 102400;
    let reportTitle = "Laboratory Diagnostics";
    let reportType = "lab_report";
    let encounterId: string | undefined;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json(
          { success: false, error: "Validation failed: No file uploaded." },
          { status: 400 }
        );
      }

      fileName = file.name;
      mimeType = file.type || "application/octet-stream";
      fileSizeBytes = file.size;

      const formTitle = formData.get("reportTitle") as string | null;
      if (formTitle) reportTitle = formTitle;

      const formType = formData.get("reportType") as string | null;
      if (formType) {
        if (formType.toLowerCase().includes("diag") || formType.toLowerCase().includes("lab")) {
          reportType = "lab_report";
        } else if (formType.toLowerCase().includes("image") || formType.toLowerCase().includes("radio")) {
          reportType = "imaging";
        } else if (formType.toLowerCase().includes("presc")) {
          reportType = "prescription";
        } else {
          reportType = "other";
        }
      }

      const formEncId = formData.get("encounterId") as string | null;
      if (formEncId) encounterId = formEncId;
    } else {
      // JSON payload support
      const jsonBody = await request.json().catch(() => ({}));
      fileName = jsonBody.fileName || jsonBody.file_name || fileName;
      mimeType = jsonBody.mimeType || jsonBody.mime_type || mimeType;
      fileSizeBytes = jsonBody.fileSizeBytes || jsonBody.file_size || jsonBody.fileSize || fileSizeBytes;
      reportTitle = jsonBody.reportTitle || jsonBody.title || reportTitle;
      encounterId = jsonBody.encounterId || jsonBody.encounter_id;
    }

    // 6.1 Validate File Extension
    const fileExt = fileName.split(".").pop()?.toLowerCase() || "";
    if (FORBIDDEN_EXTENSIONS.has(fileExt)) {
      return NextResponse.json(
        {
          success: false,
          error: `Security violation: Executable or script files (.${fileExt}) are strictly prohibited.`,
        },
        { status: 400 }
      );
    }

    // 6.2 Validate MIME Type
    if (!ALLOWED_MIME_TYPES.has(mimeType) && !ALLOWED_MIME_TYPES.has(`image/${fileExt}`) && fileExt !== "pdf" && fileExt !== "png" && fileExt !== "jpg" && fileExt !== "jpeg") {
      return NextResponse.json(
        {
          success: false,
          error: "Unsupported file type. Allowed formats: PDF, PNG, JPEG/JPG.",
        },
        { status: 400 }
      );
    }

    // 6.3 Validate File Size Limit (Max 25MB)
    if (fileSizeBytes > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds the 25 MB limit (${(fileSizeBytes / (1024 * 1024)).toFixed(1)} MB).`,
        },
        { status: 400 }
      );
    }

    // 7. Store Reference in Supabase Storage & Database
    const reportId = `rep-${Date.now()}`;
    const storagePath = `medical-records/patient/${targetPatientDbId}/${reportId}.${fileExt || "pdf"}`;
    const nowIso = new Date().toISOString();

    try {
      await supabase.from("medical_reports").insert({
        id: reportId.includes("-") ? undefined : reportId,
        patient_id: targetPatientDbId,
        encounter_id: encounterId || null,
        uploaded_by_staff_id: staffRecordId,
        report_title: reportTitle,
        report_type: reportType,
        file_url: storagePath,
        file_name: fileName,
        file_size_bytes: fileSizeBytes,
        is_confidential: false,
        created_at: nowIso,
      });
    } catch {
      // Handled via runtime store
    }

    // 8. Synchronize with Runtime Store
    const savedReport = addMedicalReport({
      id: reportId,
      patient_id: medibaseId,
      encounter_id: encounterId,
      uploaded_by_staff_id: staffRecordId,
      hospital_name: hospitalName,
      doctor_name: doctorFullName.startsWith("Dr.") ? doctorFullName : `Dr. ${doctorFullName}`,
      report_title: reportTitle,
      report_type: reportType,
      file_name: fileName,
      file_size_bytes: fileSizeBytes,
      mime_type: mimeType,
      storage_path: storagePath,
      created_at: nowIso,
    });

    // 9. Audit Event Logging (medical_file_uploaded)
    try {
      await supabase.from("audit_logs").insert({
        actor_profile_id: user?.id || staffRecordId,
        actor_role: "doctor",
        patient_id: targetPatientDbId,
        hospital_id: hospitalRecordId,
        action: "medical_file_uploaded",
        resource_type: "medical_reports",
        resource_id: reportId,
        metadata: {
          medibase_id: medibaseId,
          file_name: fileName,
          file_size_bytes: fileSizeBytes,
          mime_type: mimeType,
          storage_path: storagePath,
        },
      });
    } catch {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      authorized: true,
      report_id: savedReport.id,
      patient_id: medibaseId,
      file_name: fileName,
      storage_path: storagePath,
      message: "Medical file uploaded securely and attached to patient records.",
      report: savedReport,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to upload medical file.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
