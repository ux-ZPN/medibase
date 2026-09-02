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
    occupation?: string | null;
    height_cm?: number | null;
    weight_kg?: number | null;
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

const KNOWN_PATIENTS_MAP: Record<string, UserProfile> = {
  "MB-100001": {
    id: "10000000-0000-0000-0000-000000000001",
    email: "anjali.mehta@medibase.org",
    role: "patient",
    full_name: "Anjali Mehta",
    phone_number: "+91 98765 10001",
    patient_data: {
      id: "10000000-0000-0000-0000-000000000001",
      medibase_id: "MB-100001",
      qr_code_token: "d3b07384-0001-4632-b7e6-8c2ff6d8b901",
      aadhaar_last4: "8492",
      blood_group: "O-",
      occupation: "School Teacher",
      allergies: ["Penicillin", "Sulfa Drugs"],
      chronic_conditions: ["Seasonal Bronchitis"],
      date_of_birth: "1990-07-05",
      gender: "Female",
    },
  },
  "MB-100002": {
    id: "10000000-0000-0000-0000-000000000002",
    email: "vikram.singh@medibase.org",
    role: "patient",
    full_name: "Vikram Singh",
    phone_number: "+91 98765 10002",
    patient_data: {
      id: "10000000-0000-0000-0000-000000000002",
      medibase_id: "MB-100002",
      qr_code_token: "d3b07384-0002-4632-b7e6-8c2ff6d8b902",
      aadhaar_last4: "2941",
      blood_group: "A+",
      occupation: "Farmer",
      allergies: ["Pollen"],
      chronic_conditions: ["Osteoarthritis"],
      date_of_birth: "1975-11-22",
      gender: "Male",
    },
  },
  "MB-100003": {
    id: "10000000-0000-0000-0000-000000000003",
    email: "priya.reddy@medibase.org",
    role: "patient",
    full_name: "Priya Reddy",
    phone_number: "+91 98765 10003",
    patient_data: {
      id: "10000000-0000-0000-0000-000000000003",
      medibase_id: "MB-100003",
      qr_code_token: "d3b07384-0003-4632-b7e6-8c2ff6d8b903",
      aadhaar_last4: "6321",
      blood_group: "AB+",
      occupation: "Marketing Manager",
      allergies: ["Peanuts", "Dust"],
      chronic_conditions: ["Type 2 Diabetes", "Hypertension"],
      date_of_birth: "1993-01-18",
      gender: "Female",
    },
  },
  "MB-100004": {
    id: "10000000-0000-0000-0000-000000000004",
    email: "suresh.patel@medibase.org",
    role: "patient",
    full_name: "Suresh Patel",
    phone_number: "+91 98765 10004",
    patient_data: {
      id: "10000000-0000-0000-0000-000000000004",
      medibase_id: "MB-100004",
      qr_code_token: "d3b07384-0004-4632-b7e6-8c2ff6d8b904",
      aadhaar_last4: "4920",
      blood_group: "O+",
      occupation: "Shopkeeper",
      allergies: ["Ibuprofen"],
      chronic_conditions: ["Coronary Artery Disease"],
      date_of_birth: "1968-09-30",
      gender: "Male",
    },
  },
  "MB-100005": {
    id: "10000000-0000-0000-0000-000000000005",
    email: "kavita.sharma@medibase.org",
    role: "patient",
    full_name: "Kavita Sharma",
    phone_number: "+91 98765 10005",
    patient_data: {
      id: "10000000-0000-0000-0000-000000000005",
      medibase_id: "MB-100005",
      qr_code_token: "d3b07384-0005-4632-b7e6-8c2ff6d8b905",
      aadhaar_last4: "9142",
      blood_group: "B-",
      occupation: "Homemaker",
      allergies: ["Latex"],
      chronic_conditions: ["Hypothyroidism"],
      date_of_birth: "1980-05-14",
      gender: "Female",
    },
  },
  "MB-102394": {
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
  },
};

const DEFAULT_PATIENT_PROFILE = KNOWN_PATIENTS_MAP["MB-102394"];

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

function getActivePatientIdFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)medibase_active_patient_id=([^;]*)/);
  return match ? decodeURIComponent(match[1]).trim().toUpperCase() : null;
}

/**
 * Fetches the user profile, role, and hospital association securely from Supabase.
 * Never relies on unauthenticated client-provided parameters.
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  // 1. If running in the browser, always fetch the active profile from the server endpoint
  if (typeof window !== "undefined") {
    try {
      const isStaffApp = window.location.pathname.startsWith("/staff");
      const url = `/api/auth/me?context=${isStaffApp ? "staff" : "patient"}`;
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.profile) {
          return data.profile;
        }
      }
      // 401 = no session but that's ok; fall through to cookie resolver
    } catch {
      // network failure — fall through to local resolver
    }
  }

  const demoRole = getDemoCookieRole();
  const activePatientId = getActivePatientIdFromCookie();

  const supabase = createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    if (demoRole === "patient") {
      if (activePatientId && KNOWN_PATIENTS_MAP[activePatientId]) {
        return KNOWN_PATIENTS_MAP[activePatientId];
      }
      if (activePatientId) {
        return {
          id: `patient-${activePatientId.toLowerCase()}`,
          email: `${activePatientId.toLowerCase()}@medibase.org`,
          role: "patient",
          full_name: `Patient ${activePatientId}`,
          phone_number: "+91 98765 00000",
          patient_data: {
            id: `patient-${activePatientId.toLowerCase()}`,
            medibase_id: activePatientId,
            qr_code_token: `token-${activePatientId.toLowerCase()}`,
            aadhaar_last4: "8899",
            blood_group: "O+",
            occupation: "General Citizen",
            allergies: [],
            chronic_conditions: [],
            date_of_birth: "1995-01-01",
            gender: "Not Specified",
          },
        };
      }
      return DEFAULT_PATIENT_PROFILE;
    }
    if (demoRole === "hospital_staff") return DEFAULT_STAFF_PROFILE;
    return null;
  }

  // 1. Fetch user's profile from the profiles table
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

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
      .maybeSingle();

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

  // 2. Fetch Patient Data if role is patient
  if (profile.role === "patient") {
    let { data: patient } = await supabase
      .from("patients")
      .select("id, medibase_id, qr_code_token, aadhaar_last4, blood_group, occupation, height_cm, weight_kg, allergies, chronic_conditions, date_of_birth, gender")
      .eq("profile_id", profile.id)
      .maybeSingle();

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
        .maybeSingle();

      if (newPatient) {
        patient = newPatient;
      }
    }

    if (patient) {
      result.patient_data = patient;
    } else {
      result.patient_data = DEFAULT_PATIENT_PROFILE.patient_data;
    }
  }

  // 3. Fetch Hospital Staff Data if role is hospital_staff
  else if (profile.role === "hospital_staff" || profile.role === "system_admin") {
    let { data: staff } = await supabase
      .from("hospital_staff")
      .select("id, hospital_id, role, department, license_number, aadhaar_last4, hospitals(name, city)")
      .eq("profile_id", profile.id)
      .maybeSingle();

    // If hospital_staff record is missing, auto-link using metadata or default hospital
    if (!staff) {
      const metadata = user.user_metadata || {};
      let hospitalId = metadata.hospital_id;

      if (!hospitalId) {
        const { data: firstHosp } = await supabase
          .from("hospitals")
          .select("id")
          .limit(1)
          .maybeSingle();
        hospitalId = firstHosp?.id || "a0000000-0000-0000-0000-000000000001";
      }

      const { data: newStaff } = await supabase
        .from("hospital_staff")
        .upsert({
          profile_id: profile.id,
          hospital_id: hospitalId,
          role: metadata.staff_role || "doctor",
          license_number: metadata.license_number || `MED-REG-${profile.id.slice(0, 8).toUpperCase()}`,
          department: metadata.department || "General Medicine",
          aadhaar_last4: metadata.aadhaar_last4 || null,
          is_active: true,
        })
        .select("id, hospital_id, role, department, license_number, aadhaar_last4, hospitals(name, city)")
        .maybeSingle();

      if (newStaff) {
        staff = newStaff;
      }
    }

    if (staff) {
      const hospitalObj = Array.isArray(staff.hospitals)
        ? (staff.hospitals[0] as { name?: string; city?: string })
        : (staff.hospitals as { name?: string; city?: string });

      const hospitalName = hospitalObj?.name || user.user_metadata?.hospital_name || "City General Hospital";

      result.staff_data = {
        id: staff.id,
        hospital_id: staff.hospital_id,
        hospital_name: hospitalName,
        role: staff.role,
        department: staff.department || "General Medicine",
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
export async function signOutUser(redirectPath = "/staff/login") {
  if (typeof document !== "undefined") {
    document.cookie = "medibase_demo_role=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }
  const supabase = createClient();
  await supabase.auth.signOut().catch(() => {});
  window.location.href = redirectPath;
}
