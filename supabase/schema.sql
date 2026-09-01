-- ==============================================================================
-- MediBase PostgreSQL Database Architecture Schema
-- ==============================================================================

-- Enums
CREATE TYPE user_role AS ENUM ('patient', 'hospital_staff', 'system_admin');
CREATE TYPE staff_role AS ENUM ('doctor', 'nurse', 'admin', 'paramedic');
CREATE TYPE visit_type AS ENUM ('outpatient', 'inpatient', 'emergency', 'telehealth');
CREATE TYPE report_type AS ENUM ('lab_report', 'imaging_xray_mri', 'discharge_summary', 'prescription', 'other');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected', 'expired', 'revoked');
CREATE TYPE access_level AS ENUM ('view_only', 'view_and_contribute');
CREATE TYPE notification_type AS ENUM ('access_request', 'emergency_access_alert', 'record_updated', 'access_revoked');

-- 1. Profiles (Extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'patient',
    full_name TEXT NOT NULL,
    phone_number TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Patients
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
    medibase_id TEXT NOT NULL UNIQUE,
    qr_code_token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    date_of_birth DATE,
    gender TEXT,
    blood_group TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    allergies TEXT[] DEFAULT '{}',
    chronic_conditions TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Hospitals
CREATE TABLE hospitals (
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

-- 4. Hospital Staff
CREATE TABLE hospital_staff (
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

-- 5. Visits
CREATE TABLE visits (
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

-- 6. Medical Reports
CREATE TABLE medical_reports (
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

-- 7. Access Requests
CREATE TABLE access_requests (
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

-- 8. Access Grants
CREATE TABLE access_grants (
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

-- 9. Emergency Access (Break-Glass)
CREATE TABLE emergency_access (
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

-- 10. Audit Logs
CREATE TABLE audit_logs (
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

-- 11. Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    reference_id UUID,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_patients_medibase_id ON patients(medibase_id);
CREATE INDEX idx_patients_qr_code_token ON patients(qr_code_token);
CREATE INDEX idx_visits_patient_id ON visits(patient_id);
CREATE INDEX idx_medical_reports_visit_id ON medical_reports(visit_id);
CREATE INDEX idx_access_requests_patient_status ON access_requests(patient_id, status);
CREATE INDEX idx_access_grants_lookup ON access_grants(patient_id, hospital_id, staff_id, is_active, valid_until);
CREATE INDEX idx_emergency_access_active ON emergency_access(patient_id, staff_id, access_ended_at);
CREATE INDEX idx_audit_logs_patient ON audit_logs(patient_id, created_at DESC);
CREATE INDEX idx_notifications_recipient ON notifications(recipient_profile_id, is_read, created_at DESC);
