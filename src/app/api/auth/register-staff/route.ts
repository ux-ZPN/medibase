import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidAadhaar, sanitizeAadhaar, getAadhaarLast4, hashAadhaar } from "@/lib/identity/aadhaar";
import type { StaffRole } from "@/types/database";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      hospitalName,
      hospitalId,
      email,
      phoneNumber,
      aadhaar,
      licenseNumber,
      role = "doctor",
      department,
      password,
    } = body;

    // 1. Validate Full Name
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter your full legal name (minimum 2 characters)." },
        { status: 400 }
      );
    }

    // 2. Validate Institutional Email
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid institutional work email address." },
        { status: 400 }
      );
    }

    // 3. Validate Contact Phone Number
    const rawPhoneDigits = (phoneNumber || "").toString().replace(/\D/g, "");
    if (!phoneNumber || typeof phoneNumber !== "string" || rawPhoneDigits.length < 10) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid contact phone number with at least 10 digits." },
        { status: 400 }
      );
    }

    // 4. Validate Aadhaar
    if (!aadhaar || !isValidAadhaar(aadhaar)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid 12-digit Aadhaar ID number." },
        { status: 400 }
      );
    }

    // 5. Validate Medical License / Staff ID
    if (!licenseNumber || typeof licenseNumber !== "string" || licenseNumber.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid medical license or employee registration number." },
        { status: 400 }
      );
    }

    // 6. Validate Password
    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phoneNumber.trim();
    const cleanName = fullName.trim();
    const cleanLicense = licenseNumber.trim();
    const cleanDept = department && department.trim() ? department.trim() : "General Medicine";
    const sanitizedAadhaar = sanitizeAadhaar(aadhaar);
    const aadhaarLast4 = getAadhaarLast4(sanitizedAadhaar);
    const aadhaarHash = await hashAadhaar(sanitizedAadhaar);

    // Validate Staff Role Enum
    const validRoles: StaffRole[] = ["doctor", "nurse", "admin", "paramedic"];
    const staffRole: StaffRole = validRoles.includes(role as StaffRole) ? (role as StaffRole) : "doctor";

    const supabase = await createClient();

    // 7. Check for duplicate Aadhaar across hospital staff
    try {
      const { data: existingStaffWithAadhaar } = await supabase
        .from("hospital_staff")
        .select("id")
        .eq("aadhaar_hash", aadhaarHash)
        .maybeSingle();

      if (existingStaffWithAadhaar) {
        return NextResponse.json(
          {
            success: false,
            error: "A staff profile with this Aadhaar ID is already registered. Please sign in instead.",
          },
          { status: 409 }
        );
      }
    } catch {
      // Continue if table lookup error occurs
    }

    // 8. Hospital Lookup and Deduplication (Never create duplicate hospitals)
    let targetHospitalId: string | null = null;
    let targetHospitalName: string = "City General Hospital";

    // A. Check if provided hospitalId exists
    if (hospitalId) {
      const { data: matchedById } = await supabase
        .from("hospitals")
        .select("id, name")
        .eq("id", hospitalId)
        .maybeSingle();

      if (matchedById) {
        targetHospitalId = matchedById.id;
        targetHospitalName = matchedById.name;
      }
    }

    // B. If not found by ID, lookup by hospital name (case-insensitive deduplication)
    if (!targetHospitalId) {
      const lookupName = (hospitalName || "").toString().trim() || "City General Hospital";
      targetHospitalName = lookupName;

      const { data: matchedByName } = await supabase
        .from("hospitals")
        .select("id, name")
        .ilike("name", lookupName)
        .limit(1)
        .maybeSingle();

      if (matchedByName) {
        targetHospitalId = matchedByName.id;
        targetHospitalName = matchedByName.name;
      }
    }

    // C. If still not found, check for any verified hospital
    if (!targetHospitalId) {
      const { data: fallbackHosp } = await supabase
        .from("hospitals")
        .select("id, name")
        .eq("is_verified", true)
        .limit(1)
        .maybeSingle();

      if (fallbackHosp) {
        targetHospitalId = fallbackHosp.id;
        targetHospitalName = fallbackHosp.name;
      }
    }

    // D. If no hospital exists in the database at all, create a new verified hospital record
    if (!targetHospitalId) {
      const hospitalLicense = `HOSP-REG-${Date.now()}`;
      const { data: newHosp, error: createHospError } = await supabase
        .from("hospitals")
        .insert({
          name: targetHospitalName,
          license_number: hospitalLicense,
          address: "Medical Center District",
          city: "Metro City",
          state: "State",
          postal_code: "110001",
          phone_number: cleanPhone,
          email: cleanEmail,
          is_verified: true,
        })
        .select("id, name")
        .single();

      if (createHospError || !newHosp) {
        return NextResponse.json(
          { success: false, error: "Failed to establish verified healthcare facility affiliation." },
          { status: 500 }
        );
      }

      targetHospitalId = newHosp.id;
      targetHospitalName = newHosp.name;
    }

    // 9. Register User in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
      options: {
        data: {
          full_name: cleanName,
          phone: cleanPhone,
          role: "hospital_staff",
          hospital_id: targetHospitalId,
          hospital_name: targetHospitalName,
          license_number: cleanLicense,
          staff_role: staffRole,
          department: cleanDept,
          aadhaar_last4: aadhaarLast4,
          aadhaar_hash: aadhaarHash,
        },
      },
    });

    if (authError || !authData.user) {
      const isDuplicateEmail =
        authError?.message?.toLowerCase().includes("already registered") ||
        authError?.message?.toLowerCase().includes("unique constraint") ||
        authError?.status === 422;

      return NextResponse.json(
        {
          success: false,
          error: isDuplicateEmail
            ? "An account with this institutional email address already exists. Please sign in instead."
            : authError?.message || "Failed to create hospital staff user account.",
        },
        { status: isDuplicateEmail ? 409 : 400 }
      );
    }

    const userId = authData.user.id;

    // 10. Upsert User Profile
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userId,
      email: cleanEmail,
      role: "hospital_staff",
      full_name: cleanName,
      phone_number: cleanPhone,
    });

    if (profileError) {
      console.warn("Profile upsert notice in staff registration:", profileError.message);
    }

    // 11. Upsert Hospital Staff Record
    const { data: staffRecord, error: staffError } = await supabase
      .from("hospital_staff")
      .upsert({
        profile_id: userId,
        hospital_id: targetHospitalId,
        role: staffRole,
        license_number: cleanLicense,
        department: cleanDept,
        aadhaar_last4: aadhaarLast4,
        aadhaar_hash: aadhaarHash,
        is_active: true,
      })
      .select()
      .maybeSingle();

    if (staffError) {
      console.warn("Staff record upsert notice in staff registration:", staffError.message);
    }

    return NextResponse.json({
      success: true,
      user_id: userId,
      staff_id: staffRecord?.id || userId,
      hospital_id: targetHospitalId,
      hospital_name: targetHospitalName,
      role: staffRole,
      message: "Hospital staff account registered successfully.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "An unexpected registration error occurred.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
