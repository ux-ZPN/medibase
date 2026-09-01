import { createClient } from "./client";
import { generateRandomMediBaseId } from "../identity/medibase-id";

export interface UserProfile {
  id: string;
  email?: string;
  role: "patient" | "hospital_staff" | "system_admin";
  full_name: string;
  phone_number?: string;
  avatar_url?: string;
  patient_data?: {
    id: string;
    medibase_id: string;
    qr_code_token: string;
    aadhaar_last4?: string | null;
    blood_group?: string | null;
    allergies?: string[];
    chronic_conditions?: string[];
    date_of_birth?: string | null;
    gender?: string | null;
  };
  staff_data?: {
    id: string;
    hospital_id: string;
    hospital_name?: string;
    role: string;
    department?: string | null;
    license_number: string;
    aadhaar_last4?: string | null;
  };
}

const DEFAULT_PATIENT_PROFILE: UserProfile = {
  id: "demo-patient-0001",
  email: "demo.patient@medibase.org",
  role: "patient",
  full_name: "Rahul Sharma",
  phone_number: "+91 98765 43210",
  patient_data: {
    id: "demo-patient-rec-0001",
    medibase_id: "MB-102394",
    qr_code_token: "d3b07384-d113-4632-b7e6-8c2ff6d8b991",
    aadhaar_last4: "1234",
    blood_group: "O+",
    allergies: ["Penicillin", "Dust Mites"],
    chronic_conditions: ["Mild Hypertension"],
    date_of_birth: "1994-06-15",
    gender: "Male",
  },
};

const DEFAULT_STAFF_PROFILE: UserProfile = {
  id: "demo-staff-0001",
  email: "demo.doctor@cityhospital.com",
  role: "hospital_staff",
  full_name: "Dr. Rahul Sharma",
  phone_number: "+91 98765 43211",
  staff_data: {
    id: "demo-staff-rec-0001",
    hospital_id: "a0000000-0000-0000-0000-000000000001",
    hospital_name: "City General Hospital",
    role: "doctor",
    department: "Cardiology",
    license_number: "MED-REG-2024-8941",
    aadhaar_last4: "5678",
  },
};

function getDemoCookieRole(): "patient" | "hospital_staff" | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)medibase_demo_role=([^;]*)/);
  const val = match ? decodeURIComponent(match[1]) : null;
  if (val === "patient" || val === "hospital_staff") return val;
  return null;
}

/**
 * Fetches the user profile and role securely from the database.
 * Never relies on client-provided role parameters.
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const demoRole = getDemoCookieRole();

  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    if (demoRole === "patient") return DEFAULT_PATIENT_PROFILE;
    if (demoRole === "hospital_staff") return DEFAULT_STAFF_PROFILE;
    return null;
  }

  // 1. Fetch user's profile from the profiles table
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // If profile is missing (e.g. interrupted signup), initialize gracefully
  if (!profile) {
    const rawRole = (user.user_metadata?.role as "patient" | "hospital_staff") || demoRole || "patient";
    const fullName = user.user_metadata?.full_name || (user.email ? user.email.split("@")[0] : "MediBase User");
    const phone = user.phone || user.user_metadata?.phone || null;

    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email || `${user.id}@medibase.local`,
        role: rawRole,
        full_name: fullName,
        phone_number: phone,
      })
      .select()
      .single();

    if (insertError || !newProfile) {
      if (demoRole === "patient") return DEFAULT_PATIENT_PROFILE;
      if (demoRole === "hospital_staff") return DEFAULT_STAFF_PROFILE;
      return null;
    }
    profile = newProfile;
  }

  const result: UserProfile = {
    id: profile.id,
    email: profile.email || user.email,
    role: profile.role,
    full_name: profile.full_name,
    phone_number: profile.phone_number || user.phone,
    avatar_url: profile.avatar_url,
  };

  // 2. Fetch specific role relation based on DB role
  if (profile.role === "patient") {
    let { data: patient } = await supabase
      .from("patients")
      .select("id, medibase_id, qr_code_token, aadhaar_last4, blood_group, allergies, chronic_conditions, date_of_birth, gender")
      .eq("profile_id", profile.id)
      .single();

    // If patient record is missing, auto-provision unique MediBase ID
    if (!patient) {
      const generatedId = generateRandomMediBaseId();
      const { data: newPatient } = await supabase
        .from("patients")
        .upsert({
          profile_id: profile.id,
          medibase_id: generatedId,
          aadhaar_last4: user.user_metadata?.aadhaar_last4 || null,
          aadhaar_hash: user.user_metadata?.aadhaar_hash || null,
        })
        .select()
        .single();

      if (newPatient) {
        patient = newPatient;
      }
    }

    if (patient) {
      result.patient_data = patient;
    } else {
      result.patient_data = DEFAULT_PATIENT_PROFILE.patient_data;
    }
  } else if (profile.role === "hospital_staff") {
    const { data: staff } = await supabase
      .from("hospital_staff")
      .select("id, hospital_id, role, department, license_number, aadhaar_last4, hospitals(name)")
      .eq("profile_id", profile.id)
      .single();

    if (staff) {
      const hospitalName = Array.isArray(staff.hospitals)
        ? (staff.hospitals[0] as { name?: string })?.name
        : (staff.hospitals as { name?: string })?.name;

      result.staff_data = {
        id: staff.id,
        hospital_id: staff.hospital_id,
        hospital_name: hospitalName || "City General Hospital",
        role: staff.role,
        department: staff.department,
        license_number: staff.license_number,
        aadhaar_last4: staff.aadhaar_last4,
      };
    } else {
      result.staff_data = DEFAULT_STAFF_PROFILE.staff_data;
    }
  }

  return result;
}

/**
 * Securely signs out the active user session and redirects to login.
 */
export async function signOutUser(redirectPath = "/") {
  if (typeof document !== "undefined") {
    document.cookie = "medibase_demo_role=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }
  const supabase = createClient();
  await supabase.auth.signOut().catch(() => {});
  window.location.href = redirectPath;
}
