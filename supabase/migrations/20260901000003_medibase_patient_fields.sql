-- ==============================================================================
-- Migration: 20260901000003_medibase_patient_fields.sql
-- Description: Expand MediBase longitudinal schema for Hackathon clinical specifications:
--   - Patient personal information (occupation, height_cm, weight_kg, is_demo)
--   - Emergency contacts table
--   - Longitudinal medical profile table (chief_complaint, medical_history, past_history, family_history, social_history, initial_assessment, treatment_plan)
--   - Vital signs table (temperature_c, pulse_bpm, respiratory_rate, systolic, diastolic, spo2)
--   - Allergies table (allergen, reaction, severity)
--   - Medications table (medication_name, dosage, frequency, route, status)
--   - Medical tests table (test_name, status, result, notes, ordered_at, completed_at)
--   - Visits longitudinal expansion (facility_name, department, assessment, plan)
--   - Row Level Security (RLS) policies for all new tables
-- ==============================================================================

-- 1. Alter patients table to support additional personal info
ALTER TABLE patients 
  ADD COLUMN IF NOT EXISTS occupation TEXT,
  ADD COLUMN IF NOT EXISTS height_cm NUMERIC(5, 1),
  ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(5, 1),
  ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;

-- 2. Emergency Contacts Table
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    emergency_contact_name TEXT NOT NULL,
    emergency_contact_relationship TEXT NOT NULL,
    emergency_contact_phone TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Medical Profiles Table (Longitudinal summary per patient)
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

-- 4. Visits Table Updates
ALTER TABLE visits
  ADD COLUMN IF NOT EXISTS facility_name TEXT NOT NULL DEFAULT 'City General Hospital',
  ADD COLUMN IF NOT EXISTS department TEXT NOT NULL DEFAULT 'Outpatient Clinic',
  ADD COLUMN IF NOT EXISTS medical_history TEXT,
  ADD COLUMN IF NOT EXISTS assessment TEXT,
  ADD COLUMN IF NOT EXISTS plan TEXT;

-- Make hospital_id nullable in visits if facility_name is provided directly
ALTER TABLE visits ALTER COLUMN hospital_id DROP NOT NULL;

-- 5. Vital Signs Table
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

-- 6. Allergies Table
CREATE TABLE IF NOT EXISTS allergies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    allergen TEXT NOT NULL,
    reaction TEXT NOT NULL,
    severity TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Medications Table
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

-- 8. Medical Tests Table
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

-- 9. Performance & Lookup Indexes
CREATE INDEX IF NOT EXISTS idx_emergency_contacts_patient_id ON emergency_contacts(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_profiles_patient_id ON medical_profiles(patient_id);
CREATE INDEX IF NOT EXISTS idx_vital_signs_patient_id ON vital_signs(patient_id);
CREATE INDEX IF NOT EXISTS idx_vital_signs_visit_id ON vital_signs(visit_id);
CREATE INDEX IF NOT EXISTS idx_allergies_patient_id ON allergies(patient_id);
CREATE INDEX IF NOT EXISTS idx_medications_patient_id ON medications(patient_id);
CREATE INDEX IF NOT EXISTS idx_medications_visit_id ON medications(visit_id);
CREATE INDEX IF NOT EXISTS idx_medical_tests_patient_id ON medical_tests(patient_id);
CREATE INDEX IF NOT EXISTS idx_medical_tests_visit_id ON medical_tests(visit_id);

-- 10. Triggers for updated_at
DO $$ BEGIN
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
END $$;

-- 11. Row Level Security (RLS)
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_tests ENABLE ROW LEVEL SECURITY;

-- 11.1 Emergency Contacts RLS Policies
DROP POLICY IF EXISTS "Patients can view their emergency contacts" ON emergency_contacts;
CREATE POLICY "Patients can view their emergency contacts"
    ON emergency_contacts FOR SELECT
    TO authenticated
    USING (
        patient_id IN (
            SELECT id FROM patients WHERE profile_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Staff can view emergency contacts with access" ON emergency_contacts;
CREATE POLICY "Staff can view emergency contacts with access"
    ON emergency_contacts FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM hospital_staff hs
            WHERE hs.profile_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Patients can manage their emergency contacts" ON emergency_contacts;
CREATE POLICY "Patients can manage their emergency contacts"
    ON emergency_contacts FOR ALL
    TO authenticated
    USING (
        patient_id IN (
            SELECT id FROM patients WHERE profile_id = auth.uid()
        )
    );

-- 11.2 Medical Profiles RLS Policies
DROP POLICY IF EXISTS "Patients can view their medical profile" ON medical_profiles;
CREATE POLICY "Patients can view their medical profile"
    ON medical_profiles FOR SELECT
    TO authenticated
    USING (
        patient_id IN (
            SELECT id FROM patients WHERE profile_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Staff can view medical profiles" ON medical_profiles;
CREATE POLICY "Staff can view medical profiles"
    ON medical_profiles FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM hospital_staff hs
            WHERE hs.profile_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Staff can update medical profiles" ON medical_profiles;
CREATE POLICY "Staff can update medical profiles"
    ON medical_profiles FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM hospital_staff hs
            WHERE hs.profile_id = auth.uid()
        )
    );

-- 11.3 Vital Signs RLS Policies
DROP POLICY IF EXISTS "Patients can view their vital signs" ON vital_signs;
CREATE POLICY "Patients can view their vital signs"
    ON vital_signs FOR SELECT
    TO authenticated
    USING (
        patient_id IN (
            SELECT id FROM patients WHERE profile_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Staff can view vital signs" ON vital_signs;
CREATE POLICY "Staff can view vital signs"
    ON vital_signs FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM hospital_staff hs
            WHERE hs.profile_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Staff can record vital signs" ON vital_signs;
CREATE POLICY "Staff can record vital signs"
    ON vital_signs FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM hospital_staff hs
            WHERE hs.profile_id = auth.uid()
        )
    );

-- 11.4 Allergies RLS Policies
DROP POLICY IF EXISTS "Patients can view their allergies" ON allergies;
CREATE POLICY "Patients can view their allergies"
    ON allergies FOR SELECT
    TO authenticated
    USING (
        patient_id IN (
            SELECT id FROM patients WHERE profile_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Staff can view allergies" ON allergies;
CREATE POLICY "Staff can view allergies"
    ON allergies FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM hospital_staff hs
            WHERE hs.profile_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Staff can insert allergies" ON allergies;
CREATE POLICY "Staff can insert allergies"
    ON allergies FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM hospital_staff hs
            WHERE hs.profile_id = auth.uid()
        )
    );

-- 11.5 Medications RLS Policies
DROP POLICY IF EXISTS "Patients can view their medications" ON medications;
CREATE POLICY "Patients can view their medications"
    ON medications FOR SELECT
    TO authenticated
    USING (
        patient_id IN (
            SELECT id FROM patients WHERE profile_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Staff can view medications" ON medications;
CREATE POLICY "Staff can view medications"
    ON medications FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM hospital_staff hs
            WHERE hs.profile_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Staff can manage medications" ON medications;
CREATE POLICY "Staff can manage medications"
    ON medications FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM hospital_staff hs
            WHERE hs.profile_id = auth.uid()
        )
    );

-- 11.6 Medical Tests RLS Policies
DROP POLICY IF EXISTS "Patients can view their medical tests" ON medical_tests;
CREATE POLICY "Patients can view their medical tests"
    ON medical_tests FOR SELECT
    TO authenticated
    USING (
        patient_id IN (
            SELECT id FROM patients WHERE profile_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Staff can view medical tests" ON medical_tests;
CREATE POLICY "Staff can view medical tests"
    ON medical_tests FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM hospital_staff hs
            WHERE hs.profile_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Staff can manage medical tests" ON medical_tests;
CREATE POLICY "Staff can manage medical tests"
    ON medical_tests FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM hospital_staff hs
            WHERE hs.profile_id = auth.uid()
        )
    );
