-- ==============================================================================
-- MediBase PostgreSQL Database Schema
-- Comprehensive longitudinal healthcare record platform
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. ENUMS & CUSTOM DOMAINS
-- ==============================================================================

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('patient', 'hospital_staff', 'system_admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'staff_role') THEN
        CREATE TYPE staff_role AS ENUM ('doctor', 'nurse', 'admin', 'paramedic');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'visit_type') THEN
        CREATE TYPE visit_type AS ENUM ('outpatient', 'inpatient', 'emergency', 'telehealth');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'report_type') THEN
        CREATE TYPE report_type AS ENUM ('lab_report', 'imaging_xray_mri', 'discharge_summary', 'prescription', 'other');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_status') THEN
        CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected', 'expired', 'revoked');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'access_level') THEN
        CREATE TYPE access_level AS ENUM ('view_only', 'view_and_contribute');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
        CREATE TYPE notification_type AS ENUM ('access_request', 'emergency_access_alert', 'record_updated', 'access_revoked');
    END IF;
END $$;

-- ==============================================================================
-- 2. HELPER FUNCTIONS
-- ==============================================================================

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_unique_medibase_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    is_unique BOOLEAN := false;
BEGIN
    WHILE NOT is_unique LOOP
        new_id := 'MB-' || LPAD(FLOOR(RANDOM() * 900000 + 100000)::TEXT, 6, '0');
        IF NOT EXISTS (SELECT 1 FROM patients WHERE medibase_id = new_id) THEN
            is_unique := true;
        END IF;
    END LOOP;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION is_hospital_staff(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM hospital_staff
        WHERE profile_id = user_uuid AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_patient(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM patients
        WHERE profile_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_staff_hospital_id(user_uuid UUID)
RETURNS UUID AS $$
DECLARE
    h_id UUID;
BEGIN
    SELECT hospital_id INTO h_id
    FROM hospital_staff
    WHERE profile_id = user_uuid AND is_active = true
    LIMIT 1;
    RETURN h_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================================================
-- 3. CORE IDENTITY & DEMOGRAPHICS TABLES
-- ==============================================================================

-- 3.1 Profiles (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'patient',
    full_name TEXT NOT NULL,
    phone_number TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.2 Patients
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    medibase_id TEXT NOT NULL UNIQUE,
    qr_code_token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    aadhaar_last4 VARCHAR(4),
    aadhaar_hash TEXT,
    date_of_birth DATE,
    gender TEXT,
    blood_group TEXT,
    occupation TEXT,
    height_cm NUMERIC(5, 1),
    weight_kg NUMERIC(5, 1),
    is_demo BOOLEAN NOT NULL DEFAULT false,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    allergies TEXT[] NOT NULL DEFAULT '{}',
    chronic_conditions TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.3 Emergency Contacts (Part 2)
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    emergency_contact_name TEXT NOT NULL,
    emergency_contact_relationship TEXT NOT NULL,
    emergency_contact_phone TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.4 Hospitals
CREATE TABLE IF NOT EXISTS hospitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    license_number TEXT NOT NULL UNIQUE,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.5 Hospital Staff
CREATE TABLE IF NOT EXISTS hospital_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE RESTRICT,
    role staff_role NOT NULL DEFAULT 'doctor',
    license_number TEXT NOT NULL,
    department TEXT,
    aadhaar_last4 VARCHAR(4),
    aadhaar_hash TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 4. CLINICAL & LONGITUDINAL MEDICAL TABLES
-- ==============================================================================

-- 4.1 Medical Profiles (Longitudinal Summary per Patient)
CREATE TABLE IF NOT EXISTS medical_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL UNIQUE REFERENCES patients(id) ON DELETE CASCADE,
    chief_complaint TEXT,
    medical_history TEXT,
    past_medical_history TEXT,
    family_history TEXT,
    social_history TEXT,
    initial_assessment TEXT,
    treatment_plan TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.2 Visits (Clinical Encounters)
CREATE TABLE IF NOT EXISTS visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    hospital_id UUID REFERENCES hospitals(id) ON DELETE RESTRICT,
    staff_id UUID REFERENCES hospital_staff(id) ON DELETE SET NULL,
    facility_name TEXT NOT NULL DEFAULT 'City General Hospital',
    department TEXT NOT NULL DEFAULT 'Outpatient Clinic',
    visit_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    visit_type visit_type NOT NULL DEFAULT 'outpatient',
    chief_complaint TEXT NOT NULL,
    medical_history TEXT,
    assessment TEXT,
    plan TEXT,
    diagnosis TEXT,
    clinical_notes TEXT,
    prescription TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.3 Vital Signs (Part 4)
CREATE TABLE IF NOT EXISTS vital_signs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,
    temperature_c NUMERIC(4, 1),
    pulse_bpm INTEGER,
    respiratory_rate INTEGER,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    spo2 NUMERIC(4, 1),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.4 Allergies (Part 5)
CREATE TABLE IF NOT EXISTS allergies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    allergen TEXT NOT NULL,
    reaction TEXT NOT NULL,
    severity TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.5 Medications (Part 6)
CREATE TABLE IF NOT EXISTS medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,
    medication_name TEXT NOT NULL,
    dosage TEXT,
    frequency TEXT,
    route TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.6 Medical Tests (Part 7)
CREATE TABLE IF NOT EXISTS medical_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,
    test_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ordered',
    result TEXT,
    notes TEXT,
    ordered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.7 Medical Reports (Storage attachments)
CREATE TABLE IF NOT EXISTS medical_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    uploaded_by_staff_id UUID REFERENCES hospital_staff(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    report_type report_type NOT NULL DEFAULT 'other',
    file_path TEXT NOT NULL,
    file_size_bytes BIGINT,
    mime_type TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 5. ACCESS CONTROL & AUDIT TABLES
-- ==============================================================================

-- 5.1 Access Requests
CREATE TABLE IF NOT EXISTS access_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    requested_by_staff_id UUID NOT NULL REFERENCES hospital_staff(id) ON DELETE CASCADE,
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    status request_status NOT NULL DEFAULT 'pending',
    reason TEXT NOT NULL,
    access_type access_level NOT NULL DEFAULT 'view_only',
    requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '15 minutes'),
    responded_at TIMESTAMPTZ
);

-- 5.2 Access Grants
CREATE TABLE IF NOT EXISTS access_grants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    access_request_id UUID REFERENCES access_requests(id) ON DELETE SET NULL,
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES hospital_staff(id) ON DELETE SET NULL,
    granted_by_patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    access_type access_level NOT NULL DEFAULT 'view_only',
    is_active BOOLEAN NOT NULL DEFAULT true,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT now(),
    valid_until TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '24 hours'),
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5.3 Emergency Access
CREATE TABLE IF NOT EXISTS emergency_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES hospital_staff(id) ON DELETE RESTRICT,
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE RESTRICT,
    emergency_reason TEXT NOT NULL,
    access_started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    access_ended_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '12 hours'),
    supervisor_notified BOOLEAN NOT NULL DEFAULT true,
    patient_notified BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5.4 Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    actor_role TEXT NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    hospital_id UUID REFERENCES hospitals(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    ip_address TEXT,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5.5 Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    reference_id UUID,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 6. TRIGGERS
-- ==============================================================================

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_profiles_updated_at') THEN
        CREATE TRIGGER trg_profiles_updated_at
            BEFORE UPDATE ON profiles
            FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_patients_updated_at') THEN
        CREATE TRIGGER trg_patients_updated_at
            BEFORE UPDATE ON patients
            FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_emergency_contacts_updated_at') THEN
        CREATE TRIGGER trg_emergency_contacts_updated_at
            BEFORE UPDATE ON emergency_contacts
            FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_medical_profiles_updated_at') THEN
        CREATE TRIGGER trg_medical_profiles_updated_at
            BEFORE UPDATE ON medical_profiles
            FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_hospitals_updated_at') THEN
        CREATE TRIGGER trg_hospitals_updated_at
            BEFORE UPDATE ON hospitals
            FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_hospital_staff_updated_at') THEN
        CREATE TRIGGER trg_hospital_staff_updated_at
            BEFORE UPDATE ON hospital_staff
            FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_visits_updated_at') THEN
        CREATE TRIGGER trg_visits_updated_at
            BEFORE UPDATE ON visits
            FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_medical_reports_updated_at') THEN
        CREATE TRIGGER trg_medical_reports_updated_at
            BEFORE UPDATE ON medical_reports
            FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
    END IF;
END $$;

-- ==============================================================================
-- 7. PERFORMANCE & LOOKUP INDEXES
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_patients_medibase_id ON patients(medibase_id);
CREATE INDEX IF NOT EXISTS idx_patients_qr_token ON patients(qr_code_token);
CREATE INDEX IF NOT EXISTS idx_patients_aadhaar_hash ON patients(aadhaar_hash);
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_patient_id ON emergency_contacts(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_profiles_patient_id ON medical_profiles(patient_id);
CREATE INDEX IF NOT EXISTS idx_visits_patient_id ON visits(patient_id);
CREATE INDEX IF NOT EXISTS idx_visits_hospital_id ON visits(hospital_id);
CREATE INDEX IF NOT EXISTS idx_vital_signs_patient_id ON vital_signs(patient_id);
CREATE INDEX IF NOT EXISTS idx_vital_signs_visit_id ON vital_signs(visit_id);
CREATE INDEX IF NOT EXISTS idx_allergies_patient_id ON allergies(patient_id);
CREATE INDEX IF NOT EXISTS idx_medications_patient_id ON medications(patient_id);
CREATE INDEX IF NOT EXISTS idx_medications_visit_id ON medications(visit_id);
CREATE INDEX IF NOT EXISTS idx_medical_tests_patient_id ON medical_tests(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_tests_visit_id ON medical_tests(visit_id);
CREATE INDEX IF NOT EXISTS idx_reports_patient_id ON medical_reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_reports_visit_id ON medical_reports(visit_id);
CREATE INDEX IF NOT EXISTS idx_access_requests_patient_id ON access_requests(patient_id);
CREATE INDEX IF NOT EXISTS idx_access_requests_status ON access_requests(status);
CREATE INDEX IF NOT EXISTS idx_access_grants_patient_id ON access_grants(patient_id);
CREATE INDEX IF NOT EXISTS idx_access_grants_active ON access_grants(is_active);
CREATE INDEX IF NOT EXISTS idx_emergency_access_patient ON emergency_access(patient_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_patient_id ON audit_logs(patient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_profile_id);

-- ==============================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 8.1 Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by authenticated users" ON profiles;
CREATE POLICY "Public profiles are viewable by authenticated users"
    ON profiles FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- 8.2 Patients Policies
DROP POLICY IF EXISTS "Patients can view their own record" ON patients;
CREATE POLICY "Patients can view their own record"
    ON patients FOR SELECT
    TO authenticated
    USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "Staff can view patient records" ON patients;
CREATE POLICY "Staff can view patient records"
    ON patients FOR SELECT
    TO authenticated
    USING (is_hospital_staff(auth.uid()));

DROP POLICY IF EXISTS "Patients can update their own record" ON patients;
CREATE POLICY "Patients can update their own record"
    ON patients FOR UPDATE
    TO authenticated
    USING (profile_id = auth.uid());

-- 8.3 Hospitals Policies
DROP POLICY IF EXISTS "Hospitals are viewable by authenticated users" ON hospitals;
DROP POLICY IF EXISTS "hospitals_select_all" ON hospitals;
CREATE POLICY "hospitals_select_all" ON hospitals
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "hospitals_insert_authenticated" ON hospitals;
CREATE POLICY "hospitals_insert_authenticated" ON hospitals
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 8.4 Hospital Staff Policies
DROP POLICY IF EXISTS "Staff profiles are viewable by authenticated users" ON hospital_staff;
DROP POLICY IF EXISTS "staff_select_own" ON hospital_staff;
CREATE POLICY "staff_select_own" ON hospital_staff
    FOR SELECT USING (
        profile_id = auth.uid() OR
        is_hospital_staff(auth.uid())
    );

DROP POLICY IF EXISTS "staff_insert_own" ON hospital_staff;
CREATE POLICY "staff_insert_own" ON hospital_staff
    FOR INSERT WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "staff_update_own" ON hospital_staff;
CREATE POLICY "staff_update_own" ON hospital_staff
    FOR UPDATE USING (profile_id = auth.uid());

-- 8.5 Emergency Contacts Policies
DROP POLICY IF EXISTS "Patients can view their emergency contacts" ON emergency_contacts;
CREATE POLICY "Patients can view their emergency contacts"
    ON emergency_contacts FOR SELECT
    TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Staff can view emergency contacts" ON emergency_contacts;
CREATE POLICY "Staff can view emergency contacts"
    ON emergency_contacts FOR SELECT
    TO authenticated
    USING (EXISTS (SELECT 1 FROM hospital_staff hs WHERE hs.profile_id = auth.uid()));

-- 8.6 Medical Profiles Policies
DROP POLICY IF EXISTS "Patients can view their medical profile" ON medical_profiles;
CREATE POLICY "Patients can view their medical profile"
    ON medical_profiles FOR SELECT
    TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Staff can view medical profiles" ON medical_profiles;
CREATE POLICY "Staff can view medical profiles"
    ON medical_profiles FOR SELECT
    TO authenticated
    USING (EXISTS (SELECT 1 FROM hospital_staff hs WHERE hs.profile_id = auth.uid()));

-- 8.7 Visits Policies
DROP POLICY IF EXISTS "Patients can view their visits" ON visits;
CREATE POLICY "Patients can view their visits"
    ON visits FOR SELECT
    TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Staff can view visits" ON visits;
CREATE POLICY "Staff can view visits"
    ON visits FOR SELECT
    TO authenticated
    USING (EXISTS (SELECT 1 FROM hospital_staff hs WHERE hs.profile_id = auth.uid()));

DROP POLICY IF EXISTS "Staff can insert visits" ON visits;
CREATE POLICY "Staff can insert visits"
    ON visits FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM hospital_staff hs WHERE hs.profile_id = auth.uid()));

-- 8.8 Vital Signs Policies
DROP POLICY IF EXISTS "Patients can view their vital signs" ON vital_signs;
CREATE POLICY "Patients can view their vital signs"
    ON vital_signs FOR SELECT
    TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Staff can view vital signs" ON vital_signs;
CREATE POLICY "Staff can view vital signs"
    ON vital_signs FOR SELECT
    TO authenticated
    USING (EXISTS (SELECT 1 FROM hospital_staff hs WHERE hs.profile_id = auth.uid()));

DROP POLICY IF EXISTS "Staff can record vital signs" ON vital_signs;
CREATE POLICY "Staff can record vital signs"
    ON vital_signs FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM hospital_staff hs WHERE hs.profile_id = auth.uid()));

-- 8.9 Allergies Policies
DROP POLICY IF EXISTS "Patients can view their allergies" ON allergies;
CREATE POLICY "Patients can view their allergies"
    ON allergies FOR SELECT
    TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Staff can view allergies" ON allergies;
CREATE POLICY "Staff can view allergies"
    ON allergies FOR SELECT
    TO authenticated
    USING (EXISTS (SELECT 1 FROM hospital_staff hs WHERE hs.profile_id = auth.uid()));

-- 8.10 Medications Policies
DROP POLICY IF EXISTS "Patients can view their medications" ON medications;
CREATE POLICY "Patients can view their medications"
    ON medications FOR SELECT
    TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Staff can view medications" ON medications;
CREATE POLICY "Staff can view medications"
    ON medications FOR SELECT
    TO authenticated
    USING (EXISTS (SELECT 1 FROM hospital_staff hs WHERE hs.profile_id = auth.uid()));

-- 8.11 Medical Tests Policies
DROP POLICY IF EXISTS "Patients can view their medical tests" ON medical_tests;
CREATE POLICY "Patients can view their medical tests"
    ON medical_tests FOR SELECT
    TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Staff can view medical tests" ON medical_tests;
CREATE POLICY "Staff can view medical tests"
    ON medical_tests FOR SELECT
    TO authenticated
    USING (EXISTS (SELECT 1 FROM hospital_staff hs WHERE hs.profile_id = auth.uid()));

-- 8.12 Medical Reports Policies
DROP POLICY IF EXISTS "Patients can view their reports" ON medical_reports;
CREATE POLICY "Patients can view their reports"
    ON medical_reports FOR SELECT
    TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Staff can view reports" ON medical_reports;
CREATE POLICY "Staff can view reports"
    ON medical_reports FOR SELECT
    TO authenticated
    USING (EXISTS (SELECT 1 FROM hospital_staff hs WHERE hs.profile_id = auth.uid()));

DROP POLICY IF EXISTS "Staff can upload reports" ON medical_reports;
CREATE POLICY "Staff can upload reports"
    ON medical_reports FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM hospital_staff hs WHERE hs.profile_id = auth.uid()));

-- 8.13 Access Requests Policies
DROP POLICY IF EXISTS "Patients can view requests for them" ON access_requests;
CREATE POLICY "Patients can view requests for them"
    ON access_requests FOR SELECT
    TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Patients can respond to requests" ON access_requests;
CREATE POLICY "Patients can respond to requests"
    ON access_requests FOR UPDATE
    TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Staff can view and create access requests" ON access_requests;
CREATE POLICY "Staff can view and create access requests"
    ON access_requests FOR ALL
    TO authenticated
    USING (EXISTS (SELECT 1 FROM hospital_staff hs WHERE hs.profile_id = auth.uid()));

-- 8.14 Access Grants Policies
DROP POLICY IF EXISTS "Patients can view and revoke their grants" ON access_grants;
CREATE POLICY "Patients can view and revoke their grants"
    ON access_grants FOR ALL
    TO authenticated
    USING (granted_by_patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Staff can view active grants" ON access_grants;
CREATE POLICY "Staff can view active grants"
    ON access_grants FOR SELECT
    TO authenticated
    USING (is_active = true AND valid_until > now());

-- 8.15 Emergency Access Policies
DROP POLICY IF EXISTS "Staff can initiate emergency access" ON emergency_access;
CREATE POLICY "Staff can initiate emergency access"
    ON emergency_access FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM hospital_staff hs WHERE hs.profile_id = auth.uid()));

DROP POLICY IF EXISTS "Patients can view emergency access events" ON emergency_access;
CREATE POLICY "Patients can view emergency access events"
    ON emergency_access FOR SELECT
    TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()));

DROP POLICY IF EXISTS "Staff can view active emergency access" ON emergency_access;
CREATE POLICY "Staff can view active emergency access"
    ON emergency_access FOR SELECT
    TO authenticated
    USING (EXISTS (SELECT 1 FROM hospital_staff hs WHERE hs.profile_id = auth.uid()));

-- 8.16 Audit Logs Policies (Append Only)
DROP POLICY IF EXISTS "Audit logs are append-only" ON audit_logs;
CREATE POLICY "Audit logs are append-only"
    ON audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view audit logs involving them" ON audit_logs;
CREATE POLICY "Users can view audit logs involving them"
    ON audit_logs FOR SELECT
    TO authenticated
    USING (
        actor_profile_id = auth.uid()
        OR patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
    );

-- 8.17 Notifications Policies
DROP POLICY IF EXISTS "Users can view and manage their notifications" ON notifications;
CREATE POLICY "Users can view and manage their notifications"
    ON notifications FOR ALL
    TO authenticated
    USING (recipient_profile_id = auth.uid());
