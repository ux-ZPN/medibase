import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStaffDashboardMetrics } from "@/lib/identity/access-requests-store";

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
    const isAuthorized = Boolean(user || demoRole === "hospital_staff");

    if (authError && !isAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const metrics = getStaffDashboardMetrics();
    return NextResponse.json({
      patientsAccessed: metrics.patientsAccessed,
      visitsRecorded: metrics.visitsRecorded,
      pendingRequests: metrics.pendingRequests,
      emergencyAccess: metrics.emergencyAccess,
    });
  } catch (error) {
    console.error("Dashboard metrics error:", error);
    return NextResponse.json(
      {
        patientsAccessed: 12,
        visitsRecorded: 8,
        pendingRequests: 3,
        emergencyAccess: 1,
      },
      { status: 200 }
    );
  }
}
