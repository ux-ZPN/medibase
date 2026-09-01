import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStaffNotifications } from "@/lib/identity/access-requests-store";

export async function GET() {
  try {
    const supabase = await createClient();

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
        { success: false, error: "Forbidden. Patient accounts cannot access hospital staff notifications." },
        { status: 403 }
      );
    }

    if (authError && demoRole !== "hospital_staff") {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Hospital staff credentials required." },
        { status: 401 }
      );
    }

    let staffId = "b0000000-0000-0000-0000-000000000001";
    if (user) {
      const { data: dbStaff } = await supabase
        .from("hospital_staff")
        .select("id")
        .eq("profile_id", user.id)
        .maybeSingle();

      if (dbStaff) {
        staffId = dbStaff.id;
      }
    }

    const notifications = getStaffNotifications(staffId);
    const unreadCount = notifications.filter((n) => !n.is_read).length;

    return NextResponse.json({
      success: true,
      staff_id: staffId,
      total: notifications.length,
      unread_count: unreadCount,
      notifications,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to retrieve staff notifications.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
