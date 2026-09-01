import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidAadhaar, sanitizeAadhaar, getAadhaarLast4, hashAadhaar } from "@/lib/identity/aadhaar";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, phoneNumber, email, aadhaar } = body;

    // 1. Validation
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid full name (minimum 2 characters)." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!phoneNumber || typeof phoneNumber !== "string" || phoneNumber.replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid phone number with at least 10 digits." },
        { status: 400 }
      );
    }

    if (!aadhaar || !isValidAadhaar(aadhaar)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 12-digit Aadhaar ID number." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phoneNumber.trim();
    const cleanName = fullName.trim();
    const sanitizedAadhaar = sanitizeAadhaar(aadhaar);
    const aadhaarLast4 = getAadhaarLast4(sanitizedAadhaar);
    const aadhaarHash = await hashAadhaar(sanitizedAadhaar);

    const supabase = await createClient();

    // 2. Check for duplicate Aadhaar registration in patients table
    const { data: existingPatient } = await supabase
      .from("patients")
      .select("id, medibase_id")
      .eq("aadhaar_hash", aadhaarHash)
      .single();

    if (existingPatient) {
      return NextResponse.json(
        {
          success: false,
          error: "An account with this Aadhaar ID is already registered. Please sign in instead.",
        },
        { status: 409 }
      );
    }

    // 3. Initiate Email OTP via Supabase Auth
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        shouldCreateUser: true,
        data: {
          full_name: cleanName,
          phone: cleanPhone,
          role: "patient",
          aadhaar_last4: aadhaarLast4,
          aadhaar_hash: aadhaarHash,
        },
      },
    });

    if (otpError) {
      return NextResponse.json(
        { success: false, error: otpError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      message: `A 6-digit verification code has been sent to ${cleanEmail}.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "An unexpected registration error occurred.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
