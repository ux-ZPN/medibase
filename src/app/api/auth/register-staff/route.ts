import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { registerNewStaff } from "@/lib/identity/access-requests-store";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      fullName,
      hospitalName = "City General Hospital",
      hospitalId,
      email,
      phoneNumber,
      aadhaar,
      licenseNumber,
      role = "doctor",
      department = "Cardiology",
    } = body;

    // 1. Validate Full Name
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter staff full name." },
        { status: 400 }
      );
    }

    const cleanName = fullName.trim();
    const cleanPhone = (phoneNumber || "").toString().trim() || "+91 98765 00000";
    const cleanEmail = (email || "").toString().trim().toLowerCase() ||
      `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, ".")}@cityhospital.com`;
    const cleanLicense = (licenseNumber || "").toString().trim() || `MED-${Date.now().toString().slice(-6)}`;
    const cleanDept = (department || "").toString().trim() || "General Medicine";
    const cleanHospName = (hospitalName || "").toString().trim() || "City General Hospital";

    // 2. Register in Global Memory Store
    const regStaff = registerNewStaff({
      fullName: cleanName,
      staffId: cleanLicense,
      licenseNumber: cleanLicense,
      hospitalId: hospitalId || "a0000000-0000-0000-0000-000000000001",
      hospitalName: cleanHospName,
      department: cleanDept,
      role: role.toLowerCase(),
      email: cleanEmail,
      phoneNumber: cleanPhone,
      aadhaar: aadhaar || "8899",
    });

    // 3. Supabase Relational Database Sync (Non-blocking)
    try {
      const supabase = await createClient();

      await supabase.from("profiles").upsert({
        id: regStaff.id,
        email: cleanEmail,
        role: "hospital_staff",
        full_name: regStaff.full_name,
        phone_number: cleanPhone,
      });

      await supabase.from("hospital_staff").upsert({
        profile_id: regStaff.id,
        hospital_id: regStaff.hospital_id,
        role: regStaff.role,
        license_number: cleanLicense,
        department: cleanDept,
        is_active: true,
      });
    } catch (dbErr) {
      console.warn("Supabase staff registration sync note:", dbErr);
    }

    // 4. Set HTTP Cookies for Instant Session
    const response = NextResponse.json({
      success: true,
      staff_id: regStaff.staff_id,
      hospital_name: regStaff.hospital_name,
      full_name: regStaff.full_name,
      department: regStaff.department,
      role: regStaff.role,
      message: `Staff account registered successfully for ${regStaff.full_name}`,
      redirect: "/staff/dashboard",
    });

    response.cookies.set("medibase_demo_role", "hospital_staff", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    response.cookies.set("medibase_active_staff_id", regStaff.staff_id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    response.cookies.delete("medibase_active_patient_id");

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "An unexpected registration error occurred.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

