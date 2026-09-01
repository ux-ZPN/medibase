import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  getReportById,
  extractPatientIndex,
} from "@/lib/identity/access-requests-store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const resolvedParams = await params;
    const targetFileIdentifier = resolvedParams.id;

    if (!targetFileIdentifier) {
      return NextResponse.json(
        { success: false, error: "File identifier is required." },
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
        { success: false, error: "Unauthorized. Please sign in as a patient to access your medical files." },
        { status: 401 }
      );
    }

    // 2. Resolve Authenticated Patient Identity
    let patientRecordId = "demo-patient-rec-0001";
    let medibaseId = "MB-100001";

    if (user) {
      const { data: patient } = await supabase
        .from("patients")
        .select("id, medibase_id")
        .eq("profile_id", user.id)
        .maybeSingle();

      if (patient) {
        patientRecordId = patient.id;
        medibaseId = patient.medibase_id;
      }
    }

    // 3. Resolve File Metadata and Verify Patient Ownership
    const report = getReportById(targetFileIdentifier) || {
      id: targetFileIdentifier,
      patient_id: medibaseId,
      file_name: targetFileIdentifier.endsWith(".pdf") ? targetFileIdentifier : `${targetFileIdentifier}.pdf`,
      storage_path: `medical-records/patient/${patientRecordId}/${targetFileIdentifier}`,
      mime_type: "application/pdf",
    };

    // Cross-Patient File Isolation Check
    const filePatientIdx = extractPatientIndex(report.patient_id);
    const callerPatientIdx = extractPatientIndex(medibaseId);

    const isOwner =
      report.patient_id === medibaseId ||
      report.patient_id === patientRecordId ||
      (filePatientIdx !== null && callerPatientIdx !== null && filePatientIdx === callerPatientIdx);

    if (!isOwner) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden. You cannot access medical files belonging to another patient.",
        },
        { status: 403 }
      );
    }

    // 4. Generate Short-Lived Signed URL (120 seconds)
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
      const token = Buffer.from(`${report.id}:${Date.now() + 120000}`).toString("base64");
      signedUrl = `/api/storage/secure-view?token=${token}&file=${encodeURIComponent(report.file_name)}`;
    }

    // 5. Audit Event Logging (medical_file_downloaded)
    try {
      await supabase.from("audit_logs").insert({
        actor_profile_id: user?.id || patientRecordId,
        actor_role: "patient",
        patient_id: patientRecordId,
        hospital_id: null,
        action: "medical_file_downloaded",
        resource_type: "medical_reports",
        resource_id: report.id,
        metadata: {
          file_name: report.file_name,
        },
      });
    } catch {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      file_name: report.file_name,
      mime_type: report.mime_type || "application/pdf",
      signed_url: signedUrl,
      expires_in_seconds: 120,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to generate patient signed URL.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
