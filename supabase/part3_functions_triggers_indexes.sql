-- ==============================================================================
-- PART 3: FUNCTIONS, TRIGGERS & INDEXES
-- Sequence: 3 of 5
-- Run this third in Supabase SQL Editor
-- ==============================================================================

-- 3.1 Updated At Trigger Function
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3.2 Unique MediBase ID Generator
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

-- 3.3 Non-Recursive Security Definer Helpers (Checks profiles.role directly)
CREATE OR REPLACE FUNCTION is_hospital_staff(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = user_uuid AND role = 'hospital_staff'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION is_patient(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles
        WHERE id = user_uuid AND role = 'patient'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION get_staff_hospital_id(user_uuid UUID)
RETURNS UUID AS $$
DECLARE
    hosp_id UUID;
BEGIN
    SELECT hospital_id INTO hosp_id
    FROM hospital_staff
    WHERE profile_id = user_uuid AND is_active = true
    LIMIT 1;
    RETURN hosp_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION get_or_create_hospital(
    hospital_name TEXT,
    hospital_city TEXT DEFAULT 'Metro City'
)
RETURNS UUID AS $$
DECLARE
    found_id UUID;
BEGIN
    SELECT id INTO found_id
    FROM hospitals
    WHERE lower(name) = lower(trim(hospital_name))
    LIMIT 1;

    IF found_id IS NOT NULL THEN
        RETURN found_id;
    END IF;

    INSERT INTO hospitals (name, license_number, address, city, state, postal_code, phone_number, email, is_verified)
    VALUES (
        trim(hospital_name),
        'HOSP-' || upper(substr(md5(random()::text), 1, 8)),
        'Hospital Address, ' || hospital_city,
        hospital_city,
        'State',
        '110001',
        '+91 11 2345 6789',
        'contact@' || lower(regexp_replace(hospital_name, '[^a-zA-Z0-9]', '', 'g')) || '.medibase.org',
        true
    )
    RETURNING id INTO found_id;

    RETURN found_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3.4 Fast Access Grant Verification Helper
CREATE OR REPLACE FUNCTION public.has_active_access_grant(
    target_patient_id UUID,
    requesting_staff_id UUID DEFAULT NULL,
    requesting_hospital_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.access_grants
        WHERE patient_id = target_patient_id
          AND is_active = true
          AND valid_until > now()
          AND (
              (requesting_staff_id IS NOT NULL AND staff_id = requesting_staff_id) OR
              (requesting_hospital_id IS NOT NULL AND hospital_id = requesting_hospital_id) OR
              (requesting_staff_id IS NULL AND requesting_hospital_id IS NULL)
          )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 3.5 Auto-update Triggers
DROP TRIGGER IF EXISTS set_profiles_updated_at ON profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_patients_updated_at ON patients;
CREATE TRIGGER set_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_hospitals_updated_at ON hospitals;
CREATE TRIGGER set_hospitals_updated_at BEFORE UPDATE ON hospitals
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_hospital_staff_updated_at ON hospital_staff;
CREATE TRIGGER set_hospital_staff_updated_at BEFORE UPDATE ON hospital_staff
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_encounters_updated_at ON encounters;
CREATE TRIGGER set_encounters_updated_at BEFORE UPDATE ON encounters
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_prescriptions_updated_at ON prescriptions;
CREATE TRIGGER set_prescriptions_updated_at BEFORE UPDATE ON prescriptions
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- 3.6 Performance & Lookup Indexes
CREATE INDEX IF NOT EXISTS idx_patients_medibase_id ON patients(medibase_id);
CREATE INDEX IF NOT EXISTS idx_patients_qr_code_token ON patients(qr_code_token);
CREATE INDEX IF NOT EXISTS idx_patients_profile_id ON patients(profile_id);
CREATE INDEX IF NOT EXISTS idx_patients_aadhaar_hash ON patients(aadhaar_hash);

CREATE INDEX IF NOT EXISTS idx_hospitals_name_lower ON hospitals(lower(name));
CREATE INDEX IF NOT EXISTS idx_hospital_staff_profile_id ON hospital_staff(profile_id);
CREATE INDEX IF NOT EXISTS idx_hospital_staff_hospital_id ON hospital_staff(hospital_id);
CREATE INDEX IF NOT EXISTS idx_hospital_staff_aadhaar_hash ON hospital_staff(aadhaar_hash);

CREATE INDEX IF NOT EXISTS idx_access_requests_patient ON access_requests(patient_id, status);
CREATE INDEX IF NOT EXISTS idx_access_requests_staff ON access_requests(requested_by_staff_id, status);
CREATE INDEX IF NOT EXISTS idx_access_grants_lookup ON access_grants(patient_id, is_active, valid_until);
CREATE INDEX IF NOT EXISTS idx_access_grants_active_check ON access_grants(patient_id, hospital_id, staff_id, is_active, valid_until);

CREATE INDEX IF NOT EXISTS idx_encounters_patient ON encounters(patient_id, encounter_date DESC);
CREATE INDEX IF NOT EXISTS idx_vitals_encounter ON vitals(encounter_id);
CREATE INDEX IF NOT EXISTS idx_diagnoses_encounter ON diagnoses(encounter_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions(patient_id, is_active);
CREATE INDEX IF NOT EXISTS idx_medical_reports_patient ON medical_reports(patient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_patient ON audit_logs(patient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_profile_id, is_read);
