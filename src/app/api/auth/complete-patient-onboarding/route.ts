import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateRandomMediBaseId } from "@/lib/identity/medibase-id";

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
        { success: false, error: "Unauthorized session. Please complete verification." },
        { status: 401 }
      );
    }

    const metadata = user.user_metadata || {};
    const fullName = metadata.full_name || user.email?.split("@")[0] || "Patient User";
    const phone = user.phone || metadata.phone || null;
    const aadhaarLast4 = metadata.aadhaar_last4 || null;
    const aadhaarHash = metadata.aadhaar_hash || null;

    // 2. Ensure Profile exists with role 'patient' (Do not allow client role overwrite)
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email || `${user.id}@medibase.local`,
        role: "patient",
        full_name: fullName,
        phone_number: phone,
      })
      .select()
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { success: false, error: profileError?.message || "Failed to create profile." },
        { status: 500 }
      );
    }

    // 3. Ensure Patient record exists with unique MediBase ID
    let { data: patient } = await supabase
      .from("patients")
      .select("id, medibase_id, qr_code_token, aadhaar_last4")
      .eq("profile_id", user.id)
      .single();

    if (!patient) {
      let created = false;
      let attempts = 0;

      while (!created && attempts < 10) {
        attempts++;
        const candidateMediBaseId = generateRandomMediBaseId();

        const { data: newPatient, error: insertPatientError } = await supabase
          .from("patients")
          .insert({
            profile_id: user.id,
            medibase_id: candidateMediBaseId,
            aadhaar_last4: aadhaarLast4,
            aadhaar_hash: aadhaarHash,
          })
          .select()
          .single();

        if (!insertPatientError && newPatient) {
          patient = newPatient;
          created = true;
        } else if (insertPatientError && !insertPatientError.message.includes("unique")) {
          // Non-collision error
          break;
        }
      }
    }

    if (!patient) {
      return NextResponse.json(
        { success: false, error: "Failed to generate unique MediBase ID." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user_id: user.id,
      medibase_id: patient.medibase_id,
      qr_code_token: patient.qr_code_token,
      profile: {
        id: profile.id,
        full_name: profile.full_name,
        email: profile.email,
        phone_number: profile.phone_number,
        role: profile.role,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to complete onboarding.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
