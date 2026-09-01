import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { markAllNotificationsRead } from "@/lib/identity/access-requests-store";

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const demoRole = cookieStore.get("medibase_demo_role")?.value;

    if (authError && !demoRole) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
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

    const updated = markAllNotificationsRead(patientId);

    return NextResponse.json({
      success: true,
      updated_count: updated,
      message: "All notifications marked as read.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to mark all notifications as read.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
