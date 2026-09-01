import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPatientNotifications } from "@/lib/identity/access-requests-store";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";

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
      (!authError && !demoRole)
    );

    if (authError && !demoRole) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in as a patient to view your notifications." },
        { status: 401 }
      );
    }

    if (!isPatientSession && demoRole === "hospital_staff") {
      return NextResponse.json(
        { success: false, error: "Forbidden. Hospital staff accounts cannot view patient notification feeds." },
        { status: 403 }
      );
    }

    let patientId = "MB-100001";
    if (user) {
      const { data: dbPatient } = await supabase
        .from("patients")
        .select("id, medibase_id")
        .eq("profile_id", user.id)
        .maybeSingle();

      if (dbPatient) {
        patientId = dbPatient.medibase_id || dbPatient.id;
      }
    }

    const notifications = getPatientNotifications(patientId, category);
    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return NextResponse.json({
      success: true,
      patient_id: patientId,
      total: notifications.length,
      unread_count: unreadCount,
      notifications,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to retrieve notifications.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
