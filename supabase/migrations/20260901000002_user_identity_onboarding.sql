-- ==============================================================================
-- MediBase Migration: User Identity, Onboarding & Security (Phase 6)
-- ==============================================================================

-- 1. Add Aadhaar security fields (masked last 4 and cryptographic hash)
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'patients' AND column_name = 'aadhaar_last4'
    ) THEN
        ALTER TABLE patients ADD COLUMN aadhaar_last4 VARCHAR(4);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'patients' AND column_name = 'aadhaar_hash'
    ) THEN
        ALTER TABLE patients ADD COLUMN aadhaar_hash TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'hospital_staff' AND column_name = 'aadhaar_last4'
    ) THEN
        ALTER TABLE hospital_staff ADD COLUMN aadhaar_last4 VARCHAR(4);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'hospital_staff' AND column_name = 'aadhaar_hash'
    ) THEN
        ALTER TABLE hospital_staff ADD COLUMN aadhaar_hash TEXT;
    END IF;
END $$;

-- 2. Create indexes on aadhaar_hash for rapid duplicate detection
CREATE INDEX IF NOT EXISTS idx_patients_aadhaar_hash ON patients(aadhaar_hash);
CREATE INDEX IF NOT EXISTS idx_hospital_staff_aadhaar_hash ON hospital_staff(aadhaar_hash);

-- 3. SQL helper function for generating a collision-free MediBase ID (e.g. MB-102394)
CREATE OR REPLACE FUNCTION generate_unique_medibase_id()
RETURNS TEXT AS $$
DECLARE
    new_id TEXT;
    done BOOLEAN;
    attempts INT := 0;
BEGIN
    done := false;
    WHILE NOT done LOOP
        attempts := attempts + 1;
        -- Format: MB-XXXXXX (6 random digits)
        new_id := 'MB-' || lpad(floor(random() * 900000 + 100000)::text, 6, '0');
        IF NOT EXISTS (SELECT 1 FROM patients WHERE medibase_id = new_id) THEN
            done := true;
        END IF;
        IF attempts > 50 THEN
            -- Fallback with timestamp suffix in extreme density situations
            new_id := 'MB-' || to_char(now(), 'YYMMDD') || lpad(floor(random() * 9000 + 1000)::text, 4, '0');
            done := true;
        END IF;
    END LOOP;
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Seed default verified hospitals for staff onboarding
INSERT INTO hospitals (id, name, license_number, address, city, state, postal_code, phone_number, email, is_verified)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'City General Hospital', 'HOSP-CGH-2024-001', '124 Medical Center Blvd', 'Metro City', 'State', '110001', '+91 11 2345 6789', 'contact@citygeneral.hosp', true),
    ('a0000000-0000-0000-0000-000000000002', 'Metro Health Institute', 'HOSP-MHI-2024-002', '88 Healthcare Avenue', 'Metro City', 'State', '110002', '+91 11 8765 4321', 'admin@metrohealth.org', true),
    ('a0000000-0000-0000-0000-000000000003', 'St. Mary''s Hospital', 'HOSP-SMH-2024-003', '45 Cathedral Road', 'Metro City', 'State', '110003', '+91 11 3456 7890', 'info@stmaryshospital.org', true),
    ('a0000000-0000-0000-0000-000000000004', 'Apex Super Specialty Hospital', 'HOSP-ASH-2024-004', '10 Innovation Parkway', 'Metro City', 'State', '110004', '+91 11 4567 8901', 'support@apexhospital.org', true)
ON CONFLICT (license_number) DO UPDATE
SET name = EXCLUDED.name,
    is_verified = EXCLUDED.is_verified;

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on core tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 5.1 Profiles RLS
DROP POLICY IF EXISTS "profiles_select_own" ON profiles;
CREATE POLICY "profiles_select_own" ON profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON profiles;
CREATE POLICY "profiles_insert_own" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Staff can view profile when looking up patient
DROP POLICY IF EXISTS "profiles_staff_lookup" ON profiles;
CREATE POLICY "profiles_staff_lookup" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM hospital_staff
            WHERE hospital_staff.profile_id = auth.uid()
        )
    );

-- 5.2 Patients RLS
DROP POLICY IF EXISTS "patients_select_own" ON patients;
CREATE POLICY "patients_select_own" ON patients
    FOR SELECT USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "patients_insert_own" ON patients;
CREATE POLICY "patients_insert_own" ON patients
    FOR INSERT WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "patients_update_own" ON patients;
CREATE POLICY "patients_update_own" ON patients
    FOR UPDATE USING (profile_id = auth.uid());

-- Staff can lookup patients by medibase_id / qr_code_token
DROP POLICY IF EXISTS "patients_staff_select" ON patients;
CREATE POLICY "patients_staff_select" ON patients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM hospital_staff
            WHERE hospital_staff.profile_id = auth.uid()
        )
    );

-- 5.3 Hospitals RLS (Read-only for all authenticated & public)
DROP POLICY IF EXISTS "hospitals_select_all" ON hospitals;
CREATE POLICY "hospitals_select_all" ON hospitals
    FOR SELECT USING (true);

-- 5.4 Hospital Staff RLS
DROP POLICY IF EXISTS "staff_select_own" ON hospital_staff;
CREATE POLICY "staff_select_own" ON hospital_staff
    FOR SELECT USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "staff_insert_own" ON hospital_staff;
CREATE POLICY "staff_insert_own" ON hospital_staff
    FOR INSERT WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "staff_update_own" ON hospital_staff;
CREATE POLICY "staff_update_own" ON hospital_staff
    FOR UPDATE USING (profile_id = auth.uid());

-- 5.5 Notifications RLS
DROP POLICY IF EXISTS "notifications_select_own" ON notifications;
CREATE POLICY "notifications_select_own" ON notifications
    FOR SELECT USING (recipient_profile_id = auth.uid());

DROP POLICY IF EXISTS "notifications_update_own" ON notifications;
CREATE POLICY "notifications_update_own" ON notifications
    FOR UPDATE USING (recipient_profile_id = auth.uid());

-- 5.6 Audit Logs RLS
DROP POLICY IF EXISTS "audit_logs_select_own" ON audit_logs;
CREATE POLICY "audit_logs_select_own" ON audit_logs
    FOR SELECT USING (
        actor_profile_id = auth.uid() OR
        patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid())
    );

DROP POLICY IF EXISTS "audit_logs_insert_authenticated" ON audit_logs;
CREATE POLICY "audit_logs_insert_authenticated" ON audit_logs
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
