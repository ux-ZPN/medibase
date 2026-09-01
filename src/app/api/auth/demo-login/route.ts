import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const role = body.role === "hospital_staff" ? "hospital_staff" : "patient";

    const cookieStore = await cookies();
    cookieStore.set("medibase_demo_role", role, {
      path: "/",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    });

    const supabase = await createClient();

    if (role === "patient") {
      const email = "demo.patient@medibase.org";
      const password = "DemoPatient2024!";
      const fullName = "Rahul Sharma";
      const phone = "+91 98765 43210";
      const medibaseId = "MB-102394";

      try {
        const { data: initialAuth, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        let targetUserId = initialAuth?.user?.id;

        if (signInError || !targetUserId) {
          const { data: signUpData } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                phone: phone,
                role: "patient",
                aadhaar_last4: "1234",
              },
            },
          });

          if (signUpData?.user) {
            targetUserId = signUpData.user.id;
          }
        }

        if (targetUserId) {
          await supabase.from("profiles").upsert({
            id: targetUserId,
            email: email,
            role: "patient",
            full_name: fullName,
            phone_number: phone,
          });

          await supabase.from("patients").upsert({
            profile_id: targetUserId,
            medibase_id: medibaseId,
            aadhaar_last4: "1234",
            aadhaar_hash: "demo_hash_1234",
            blood_group: "O+",
            allergies: ["Penicillin", "Dust Mites"],
            chronic_conditions: ["Mild Hypertension"],
          });
        }
      } catch (authErr) {
        console.warn("Supabase Auth sync for demo patient skipped:", authErr);
      }

      const response = NextResponse.json({
        success: true,
        redirect: "/patient/dashboard",
        medibase_id: medibaseId,
        user: { email, full_name: fullName },
      });

      response.cookies.set("medibase_demo_role", "patient", {
        path: "/",
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      });

      return response;
    } else {
      // Hospital Staff Demo Login
      const email = "demo.doctor@cityhospital.com";
      const password = "DemoDoctor2024!";
      const fullName = "Dr. Rahul Sharma";
      const phone = "+91 98765 43211";
      const licenseNumber = "MED-REG-2024-8941";

      try {
        const { data: initialAuth, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        let targetUserId = initialAuth?.user?.id;

        if (signInError || !targetUserId) {
          const { data: signUpData } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                phone: phone,
                role: "hospital_staff",
                license_number: licenseNumber,
              },
            },
          });

          if (signUpData?.user) {
            targetUserId = signUpData.user.id;
          }
        }

        if (targetUserId) {
          const { data: hosp } = await supabase
            .from("hospitals")
            .select("id")
            .limit(1)
            .single();

          const hospitalId = hosp?.id || "a0000000-0000-0000-0000-000000000001";

          await supabase.from("profiles").upsert({
            id: targetUserId,
            email: email,
            role: "hospital_staff",
            full_name: fullName,
            phone_number: phone,
          });

          await supabase.from("hospital_staff").upsert({
            profile_id: targetUserId,
            hospital_id: hospitalId,
            role: "doctor",
            license_number: licenseNumber,
            department: "Cardiology",
            aadhaar_last4: "5678",
            is_active: true,
          });
        }
      } catch (authErr) {
        console.warn("Supabase Auth sync for demo doctor skipped:", authErr);
      }

      const response = NextResponse.json({
        success: true,
        redirect: "/staff/dashboard",
        user: { email, full_name: fullName },
      });

      response.cookies.set("medibase_demo_role", "hospital_staff", {
        path: "/",
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      });

      return response;
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to execute demo login.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
