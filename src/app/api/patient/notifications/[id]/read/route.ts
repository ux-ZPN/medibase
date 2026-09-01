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

    const marked = markNotificationRead(notifId, patientId);
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
      message: "Notification marked as read.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to mark notification as read.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
