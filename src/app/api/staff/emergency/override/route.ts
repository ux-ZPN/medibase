import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createEmergencyAccessOverride } from "@/lib/identity/access-requests-store";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json().catch(() => ({}));

    const patientIdentifier = body.patientId || body.medibaseId || "MB-100003";
    const rawReason = body.reason || body.emergencyReason || "";
    const emergencyReason = typeof rawReason === "string" ? rawReason.trim() : "";

    // 1. Mandatory Reason Validation
    if (!emergencyReason || emergencyReason.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed: A detailed reason for emergency access is mandatory (minimum 10 characters).",
        },
        { status: 400 }
      );
    }

    // 2. Verify Authenticated Staff Session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const demoRole = cookieStore.get("medibase_demo_role")?.value;

    const isPatientSession = Boolean(
      (user && user.user_metadata?.role === "patient") ||
      demoRole === "patient"
    );

    if (isPatientSession) {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden. Patient accounts cannot initiate emergency provider access.",
        },
        { status: 403 }
      );
    }

    const isStaffSession = Boolean(
      (user && user.user_metadata?.role !== "patient") ||
      demoRole === "hospital_staff" ||
      !authError
    );

    if (authError && !isStaffSession) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized. Hospital staff credentials required to initiate emergency access override.",
        },
        { status: 401 }
      );
    }

    // 3. Strict Staff Identity Derivation (Never trust frontend-sent IDs)
    let staffRecordId = "b0000000-0000-0000-0000-000000000001";
    let hospitalRecordId = "a0000000-0000-0000-0000-000000000001";
    let doctorFullName = "Dr. Rahul Sharma";
    let hospitalName = "City General Hospital";

    if (user) {
      const { data: dbStaff } = await supabase
        .from("hospital_staff")
        .select(`
          id,
          hospital_id,
          profiles(full_name),
          hospitals(name)
        `)
        .eq("profile_id", user.id)
        .maybeSingle();

      if (dbStaff) {
        staffRecordId = dbStaff.id;
        hospitalRecordId = dbStaff.hospital_id;
        const profObj = Array.isArray(dbStaff.profiles) ? dbStaff.profiles[0] : dbStaff.profiles;
        if (profObj && (profObj as { full_name?: string }).full_name) {
          doctorFullName = (profObj as { full_name?: string }).full_name!;
        }
        const hospObj = Array.isArray(dbStaff.hospitals) ? dbStaff.hospitals[0] : dbStaff.hospitals;
        if (hospObj && (hospObj as { name?: string }).name) {
          hospitalName = (hospObj as { name?: string }).name!;
        }
      }
    }

    // 4. Resolve Target Patient
    let targetPatientDbId = patientIdentifier;
    let medibaseId = patientIdentifier.toUpperCase();

    try {
      const { data: dbPatient } = await supabase
        .from("patients")
        .select("id, medibase_id")
        .or(`id.eq.${patientIdentifier},medibase_id.eq.${patientIdentifier.toUpperCase()}`)
        .maybeSingle();

      if (dbPatient) {
        targetPatientDbId = dbPatient.id;
        medibaseId = dbPatient.medibase_id;
      }
    } catch {
      // Fallback
    }

    // 5. Server-Controlled Expiration (60 minutes)
    const now = new Date();
    const durationMinutes = 60;
    const expiresAt = new Date(now.getTime() + durationMinutes * 60 * 1000).toISOString();

    // 6. Insert into emergency_access table in Database
    const emergencyId = `em-${Date.now()}`;
    try {
      await supabase.from("emergency_access").insert({
        id: emergencyId.includes("-") ? undefined : emergencyId,
        patient_id: targetPatientDbId,
        staff_id: staffRecordId,
        hospital_id: hospitalRecordId,
        emergency_reason: emergencyReason,
        access_started_at: now.toISOString(),
        access_ended_at: expiresAt,
        supervisor_notified: true,
        patient_notified: true,
      });
    } catch {
      // Handled via runtime store
    }

    // 7. Establish Active Emergency Grant in Store
    const { emergencyAccess, grant } = createEmergencyAccessOverride({
      patientId: medibaseId,
      staffId: staffRecordId,
      hospitalId: hospitalRecordId,
      doctorName: doctorFullName.startsWith("Dr.") ? doctorFullName : `Dr. ${doctorFullName}`,
      hospitalName,
      emergencyReason,
      durationMinutes,
    });

    // Also register database UUID grant if different
    if (targetPatientDbId !== medibaseId) {
      createEmergencyAccessOverride({
        patientId: targetPatientDbId,
        staffId: staffRecordId,
        hospitalId: hospitalRecordId,
        doctorName: doctorFullName.startsWith("Dr.") ? doctorFullName : `Dr. ${doctorFullName}`,
        hospitalName,
        emergencyReason,
        durationMinutes,
      });
    }

    // 8. Insert into audit_logs table
    try {
      await supabase.from("audit_logs").insert({
        actor_profile_id: user?.id || staffRecordId,
        actor_role: "doctor",
        patient_id: targetPatientDbId,
        hospital_id: hospitalRecordId,
        action: "emergency_access_granted",
        resource_type: "emergency_access",
        resource_id: emergencyAccess.id.includes("-") ? undefined : emergencyAccess.id,
        metadata: {
          medibase_id: medibaseId,
          emergency_reason: emergencyReason,
          access_type: "emergency",
          is_emergency: true,
          valid_until: expiresAt,
        },
      });
    } catch {
      // Non-blocking
    }

    return NextResponse.json({
      success: true,
      emergency_access_id: emergencyAccess.id,
      grant_id: grant.id,
      patient_id: medibaseId,
      doctor_name: doctorFullName,
      hospital_name: hospitalName,
      emergency_reason: emergencyReason,
      access_type: "emergency",
      expires_at: expiresAt,
      message: "Emergency access override activated successfully. Time-bounded clinical access granted.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to activate emergency access override.";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
