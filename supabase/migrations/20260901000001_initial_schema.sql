-- ==============================================================================
-- MediBase PostgreSQL Database Schema & Initial Migration
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
-- 2. HELPER FUNCTION: auto-update updated_at timestamp
-- ==============================================================================

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- 3. CORE TABLES
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
    date_of_birth DATE,
    gender TEXT,
    blood_group TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    allergies TEXT[] NOT NULL DEFAULT '{}',
    chronic_conditions TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.3 Hospitals
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

-- 3.4 Hospital Staff
CREATE TABLE IF NOT EXISTS hospital_staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE RESTRICT,
    role staff_role NOT NULL DEFAULT 'doctor',
    license_number TEXT NOT NULL,
    department TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.5 Visits (Clinical Encounters)
CREATE TABLE IF NOT EXISTS visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    hospital_id UUID NOT NULL REFERENCES hospitals(id) ON DELETE RESTRICT,
    staff_id UUID REFERENCES hospital_staff(id) ON DELETE SET NULL,
    visit_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    visit_type visit_type NOT NULL DEFAULT 'outpatient',
    chief_complaint TEXT NOT NULL,
    diagnosis TEXT,
    clinical_notes TEXT,
    prescription TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.6 Medical Reports (Metadata pointing to Supabase Storage)
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

-- 3.7 Access Requests
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

-- 3.8 Access Grants (Active Patient Permissions)
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

-- 3.9 Emergency Access (Break-Glass Override)
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

-- 3.10 Audit Logs (Immutable Append-Only Audit Trail)
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

-- 3.11 Notifications
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
-- 4. TRIGGERS FOR UPDATED_AT
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
-- 5. PERFORMANCE & LOOKUP INDEXES
-- ==============================================================================

-- Patient lookups
CREATE INDEX IF NOT EXISTS idx_patients_medibase_id ON patients(medibase_id);
CREATE INDEX IF NOT EXISTS idx_patients_qr_code_token ON patients(qr_code_token);
CREATE INDEX IF NOT EXISTS idx_patients_profile_id ON patients(profile_id);

-- Staff lookups
CREATE INDEX IF NOT EXISTS idx_hospital_staff_profile_id ON hospital_staff(profile_id);
CREATE INDEX IF NOT EXISTS idx_hospital_staff_hospital_id ON hospital_staff(hospital_id);

-- Visits & Clinical data
CREATE INDEX IF NOT EXISTS idx_visits_patient_id ON visits(patient_id, visit_date DESC);
CREATE INDEX IF NOT EXISTS idx_visits_hospital_id ON visits(hospital_id);
CREATE INDEX IF NOT EXISTS idx_visits_staff_id ON visits(staff_id);

-- Medical Reports
CREATE INDEX IF NOT EXISTS idx_medical_reports_visit_id ON medical_reports(visit_id);
CREATE INDEX IF NOT EXISTS idx_medical_reports_patient_id ON medical_reports(patient_id);

-- Access management
CREATE INDEX IF NOT EXISTS idx_access_requests_patient_status ON access_requests(patient_id, status);
CREATE INDEX IF NOT EXISTS idx_access_requests_staff ON access_requests(requested_by_staff_id);
CREATE INDEX IF NOT EXISTS idx_access_grants_lookup ON access_grants(patient_id, is_active, valid_until);
CREATE INDEX IF NOT EXISTS idx_access_grants_facility ON access_grants(hospital_id, staff_id);

-- Emergency Break-Glass
CREATE INDEX IF NOT EXISTS idx_emergency_access_lookup ON emergency_access(patient_id, access_ended_at);
CREATE INDEX IF NOT EXISTS idx_emergency_access_staff ON emergency_access(staff_id);

-- Audit trail & Notifications
CREATE INDEX IF NOT EXISTS idx_audit_logs_patient_timeline ON audit_logs(patient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_unread ON notifications(recipient_profile_id, is_read, created_at DESC);
