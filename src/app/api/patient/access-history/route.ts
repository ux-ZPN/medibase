import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPatientAccessHistory, StoredAuditLog } from "@/lib/identity/access-requests-store";

interface SupabaseAuditLogRow {
  id: string;
  action: string;
  resource_type: string;
  created_at: string;
  metadata?: { provider_name?: string; hospital_name?: string; reason?: string };
  hospital_id?: string;
  hospitals?: { name?: string } | Array<{ name?: string }>;
  profiles?: { full_name?: string } | Array<{ full_name?: string }>;
}

export async function GET() {
  try {
    const supabase = await createClient();

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

    // 2. Resolve Target Patient Record ID
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

    // 3. Query Database Audit Logs
    let dbLogs: Array<{
      id: string;
      timestamp: string;
      actor_name: string;
      actor_role: string;
      hospital_name: string;
      action: string;
      action_label: string;
      purpose: string;
      patient_id: string;
      is_emergency: boolean;
    }> = [];

    try {
      const { data: rawLogs } = await supabase
        .from("audit_logs")
        .select(`
          id,
          action,
          resource_type,
          created_at,
          metadata,
          hospital_id,
          hospitals (name),
          profiles:actor_profile_id (full_name)
        `)
        .eq("patient_id", patientRecordId)
        .order("created_at", { ascending: false });

      if (rawLogs && rawLogs.length > 0) {
        dbLogs = (rawLogs as unknown as SupabaseAuditLogRow[]).map((log) => {
          const hospObj = Array.isArray(log.hospitals) ? log.hospitals[0] : log.hospitals;
          const profObj = Array.isArray(log.profiles) ? log.profiles[0] : log.profiles;

          const actorName = profObj?.full_name || log.metadata?.provider_name || "Healthcare Provider";
          const hospitalName = hospObj?.name || log.metadata?.hospital_name || "Affiliated Facility";

          let actionLabel = "Viewed medical history";
          if (log.action === "access_request_created") actionLabel = "Access Request Initiated";
          else if (log.action === "access_request_approved") actionLabel = "Access Authorization Granted";
          else if (log.action === "access_request_denied") actionLabel = "Access Request Denied";
          else if (log.action === "emergency_access_initiated") actionLabel = "Break-Glass Emergency Access";

          const formattedDate = new Date(log.created_at).toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          });

          return {
            id: log.id,
            timestamp: formattedDate,
            actor_name: actorName.startsWith("Dr.") ? actorName : `Dr. ${actorName}`,
            actor_role: "Attending Staff",
            hospital_name: hospitalName,
            action: log.action.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()),
            action_label: actionLabel,
            purpose: log.metadata?.reason || "Clinical Consultation",
            patient_id: patientRecordId,
            is_emergency: log.action.includes("emergency"),
          };
        });
      }
    } catch {
      // Handled by runtime store
    }

    // Combine with runtime audit log store
    const runtimeLogs = getPatientAccessHistory(patientRecordId);
    const existingIds = new Set(dbLogs.map((l) => l.id));

    const combinedEvents = [
      ...dbLogs,
      ...runtimeLogs.filter((l: StoredAuditLog) => !existingIds.has(l.id)),
    ];

    return NextResponse.json({
      success: true,
      patient_id: patientRecordId,
      events: combinedEvents,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to load access history.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
