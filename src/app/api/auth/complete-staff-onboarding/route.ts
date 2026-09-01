import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { StaffRole } from "@/types/database";

export async function POST() {
  try {
    const supabase = await createClient();

    // 1. Verify authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized session. Please sign in to staff portal." },
        { status: 401 }
      );
    }

    const metadata = user.user_metadata || {};
    const fullName = metadata.full_name || user.email?.split("@")[0] || "Hospital Staff";
    const phone = user.phone || metadata.phone || null;
    const staffRole: StaffRole = (metadata.staff_role as StaffRole) || "doctor";
    const licenseNumber = metadata.license_number || `MED-REG-${user.id.slice(0, 8).toUpperCase()}`;
    const department = metadata.department || "General Medicine";
    const aadhaarLast4 = metadata.aadhaar_last4 || null;
    const aadhaarHash = metadata.aadhaar_hash || null;

    // 2. Ensure Profile exists with role 'hospital_staff' (never allow client role overwrite)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email || `${user.id}@medibase.local`,
        role: "hospital_staff",
        full_name: fullName,
        phone_number: phone,
      })
      .select()
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: profileError?.message || "Failed to initialize staff profile." },
        { status: 500 }
      );
    }

    // 3. Resolve Hospital ID
    let targetHospitalId = metadata.hospital_id;

    if (targetHospitalId) {
      const { data: matchedHosp } = await supabase
        .from("hospitals")
        .select("id, name")
        .eq("id", targetHospitalId)
        .maybeSingle();

      if (!matchedHosp) {
        targetHospitalId = null;
      }
    }

    if (!targetHospitalId) {
      const { data: defaultHosp } = await supabase
        .from("hospitals")
        .select("id, name")
        .limit(1)
        .maybeSingle();

      targetHospitalId = defaultHosp?.id || "a0000000-0000-0000-0000-000000000001";
    }

    // 4. Ensure hospital_staff record exists
    let { data: staffRecord } = await supabase
      .from("hospital_staff")
      .select("id, hospital_id, role, department, license_number, aadhaar_last4, hospitals(name)")
      .eq("profile_id", user.id)
      .maybeSingle();

    if (!staffRecord) {
      const { data: newStaff, error: createStaffError } = await supabase
        .from("hospital_staff")
        .upsert({
          profile_id: user.id,
          hospital_id: targetHospitalId,
          role: staffRole,
          license_number: licenseNumber,
          department: department,
          aadhaar_last4: aadhaarLast4,
          aadhaar_hash: aadhaarHash,
          is_active: true,
        })
        .select("id, hospital_id, role, department, license_number, aadhaar_last4, hospitals(name)")
        .single();

      if (createStaffError || !newStaff) {
        return NextResponse.json(
          { success: false, error: createStaffError?.message || "Failed to establish hospital staff affiliation." },
          { status: 500 }
        );
      }
      staffRecord = newStaff;
    }

    const hospitalName = Array.isArray(staffRecord.hospitals)
      ? (staffRecord.hospitals[0] as { name?: string })?.name
      : (staffRecord.hospitals as { name?: string })?.name || metadata.hospital_name || "City General Hospital";

    return NextResponse.json({
      success: true,
      user_id: user.id,
      staff_id: staffRecord.id,
      hospital_id: staffRecord.hospital_id,
      hospital_name: hospitalName,
      role: staffRecord.role,
      profile: {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        phone_number: profile.phone_number,
        role: profile.role,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to complete staff onboarding.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
