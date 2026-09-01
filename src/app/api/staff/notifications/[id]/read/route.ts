import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { markNotificationRead } from "@/lib/identity/access-requests-store";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const resolvedParams = await params;
    const notifId = resolvedParams.id;

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
        { success: false, error: "Forbidden. Patient accounts cannot update staff notifications." },
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

    const marked = markNotificationRead(notifId, staffId);
    if (!marked) {
      return NextResponse.json(
        { success: false, error: "Notification not found or access forbidden." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      id: notifId,
      is_read: true,
      message: "Staff notification marked as read.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to mark staff notification as read.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
