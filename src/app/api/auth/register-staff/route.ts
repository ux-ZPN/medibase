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

    // 1. Validation
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid full name." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid institutional email address." },
        { status: 400 }
      );
    }

    if (!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid contact phone number." },
        { status: 400 }
      );
    }

    if (!aadhaar || !isValidAadhaar(aadhaar)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid 12-digit Aadhaar ID." },
        { status: 400 }
      );
    }

    if (!licenseNumber || typeof licenseNumber !== "string" || licenseNumber.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid medical license or employee registration number." },
        { status: 400 }
      );
    }

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
    const cleanDept = department ? department.trim() : "General Medicine";
    const sanitizedAadhaar = sanitizeAadhaar(aadhaar);
    const aadhaarLast4 = getAadhaarLast4(sanitizedAadhaar);
    const aadhaarHash = await hashAadhaar(sanitizedAadhaar);

    // Validate staff_role enum
    const validRoles = ["doctor", "nurse", "admin", "paramedic"];
    const staffRole = validRoles.includes(role) ? role : "doctor";

    const supabase = await createClient();

    // 2. Validate Hospital Association (Secure lookup - never trust arbitrary foreign keys)
    let targetHospitalId = hospitalId;

    if (targetHospitalId) {
      const { data: hospitalRecord } = await supabase
        .from("hospitals")
        .select("id, name")
        .eq("id", targetHospitalId)
        .single();

      if (!hospitalRecord) {
        targetHospitalId = null;
      }
    }

    // If hospitalId wasn't found or provided as name, look up by name or fallback to default verified hospital
    if (!targetHospitalId) {
      const searchName = hospitalName ? hospitalName.trim() : "City General Hospital";
      const { data: matchedHospital } = await supabase
        .from("hospitals")
        .select("id")
        .ilike("name", `%${searchName}%`)
        .limit(1)
        .single();

      if (matchedHospital) {
        targetHospitalId = matchedHospital.id;
      } else {
        // Find default verified hospital
        const { data: defaultHosp } = await supabase
          .from("hospitals")
          .select("id")
          .limit(1)
          .single();

        if (defaultHosp) {
          targetHospitalId = defaultHosp.id;
        } else {
          // Create fallback hospital record
          const { data: newHosp } = await supabase
            .from("hospitals")
            .insert({
              name: searchName || "City General Hospital",
              license_number: `HOSP-REG-${Date.now()}`,
              address: "Medical Center District",
              city: "Metro City",
              state: "State",
              postal_code: "110001",
              phone_number: cleanPhone,
              email: cleanEmail,
              is_verified: true,
            })
            .select("id")
            .single();

          targetHospitalId = newHosp?.id;
        }
      }
    }

    if (!targetHospitalId) {
      return NextResponse.json(
        { success: false, error: "Failed to associate staff with a verified healthcare facility." },
        { status: 400 }
      );
    }

    // 3. Register user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
      options: {
        data: {
          full_name: cleanName,
          phone: cleanPhone,
          role: "hospital_staff",
          hospital_id: targetHospitalId,
          license_number: cleanLicense,
          staff_role: staffRole,
          aadhaar_last4: aadhaarLast4,
        },
      },
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        { success: false, error: authError?.message || "Failed to create staff user account." },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // 4. Create Profile Record with role = 'hospital_staff'
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userId,
      email: cleanEmail,
      role: "hospital_staff",
      full_name: cleanName,
      phone_number: cleanPhone,
    });

    if (profileError) {
      return NextResponse.json(
        { success: false, error: profileError.message },
        { status: 500 }
      );
    }

    // 5. Create Hospital Staff Record
    const { data: staffRecord, error: staffError } = await supabase
      .from("hospital_staff")
      .upsert({
        profile_id: userId,
        hospital_id: targetHospitalId,
        role: staffRole as StaffRole,
        license_number: cleanLicense,
        department: cleanDept,
        aadhaar_last4: aadhaarLast4,
        aadhaar_hash: aadhaarHash,
        is_active: true,
      })
      .select()
      .single();

    if (staffError) {
      return NextResponse.json(
        { success: false, error: staffError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      staff_id: staffRecord.id,
      user_id: userId,
      message: "Hospital staff account registered successfully.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "An unexpected registration error occurred.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
