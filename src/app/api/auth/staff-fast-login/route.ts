import { NextResponse } from "next/server";
import { findRegisteredStaff, registerNewStaff } from "@/lib/identity/access-requests-store";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { staffId, fullName, hospitalName, department, role, phoneNumber } = body;

    const query = (staffId || fullName || "").toString().trim();

    if (!query && !fullName) {
      return NextResponse.json(
        { success: false, error: "Please provide a Staff ID, Doctor Name, or Employee ID." },
        { status: 400 }
      );
    }

    // 1. Check if staff exists in registry
    let staff = findRegisteredStaff(query);

    // 2. If not found, dynamically register the new staff on the fly!
    if (!staff) {
      staff = registerNewStaff({
        fullName: fullName || (query.startsWith("DOC-") ? `Doctor ${query}` : query),
        staffId: query || `DOC-${Date.now().toString().slice(-6)}`,
        hospitalName: hospitalName || "City General Hospital",
        department: department || "General Medicine",
        role: role || "doctor",
        phoneNumber: phoneNumber || "+91 98765 00000",
        licenseNumber: query.includes("-") ? query : `MED-${query || Date.now().toString().slice(-6)}`,
      });
    }

    // 3. Set cookies for instant authenticated session
    const response = NextResponse.json({
      success: true,
      staff: staff,
      message: `Authenticated as ${staff.full_name} (${staff.hospital_name})`,
      redirect: "/staff/dashboard",
    });

    response.cookies.set("medibase_demo_role", "hospital_staff", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    response.cookies.set("medibase_active_staff_id", staff.staff_id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    // Clear active patient ID
    response.cookies.delete("medibase_active_patient_id");

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Staff login failed.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
