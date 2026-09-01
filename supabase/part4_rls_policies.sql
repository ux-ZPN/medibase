-- ==============================================================================
-- PART 4: ROW LEVEL SECURITY (RLS) POLICIES
-- Sequence: 4 of 5
-- Run this fourth in Supabase SQL Editor
-- ==============================================================================

-- 4.0 Drop Any Existing Policies on Core Tables (Clean Slate)
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname, tablename 
        FROM pg_policies 
        WHERE schemaname = 'public' 
          AND tablename IN ('profiles', 'patients', 'hospital_staff', 'hospitals', 'access_requests', 'access_grants', 'emergency_access', 'audit_logs', 'notifications', 'encounters', 'vitals', 'diagnoses', 'prescriptions', 'medical_tests', 'medical_reports', 'emergency_contacts', 'medical_profiles')
    ) LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON ' || quote_ident(r.tablename);
    END LOOP;
END $$;

-- 4.1 Enable RLS on All Tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE hospital_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE encounters ENABLE ROW LEVEL SECURITY;
ALTER TABLE vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagnoses ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_reports ENABLE ROW LEVEL SECURITY;

-- 4.2 Profiles Policies (Non-Recursive)
CREATE POLICY "profiles_select" ON profiles
    FOR SELECT TO authenticated
    USING (id = auth.uid() OR is_hospital_staff(auth.uid()));

CREATE POLICY "profiles_insert" ON profiles
    FOR INSERT TO authenticated
    WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update" ON profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid());

-- 4.3 Patients Policies
CREATE POLICY "patients_select" ON patients
    FOR SELECT TO authenticated
    USING (profile_id = auth.uid() OR is_hospital_staff(auth.uid()));

CREATE POLICY "patients_insert" ON patients
    FOR INSERT TO authenticated
    WITH CHECK (profile_id = auth.uid());

CREATE POLICY "patients_update" ON patients
    FOR UPDATE TO authenticated
    USING (profile_id = auth.uid());

-- 4.4 Hospitals Policies
CREATE POLICY "hospitals_select" ON hospitals
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "hospitals_insert" ON hospitals
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

-- 4.5 Hospital Staff Policies (Public authenticated directory lookup)
CREATE POLICY "staff_select" ON hospital_staff
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "staff_insert" ON hospital_staff
    FOR INSERT TO authenticated
    WITH CHECK (profile_id = auth.uid());

CREATE POLICY "staff_update" ON hospital_staff
    FOR UPDATE TO authenticated
    USING (profile_id = auth.uid());

-- 4.6 Emergency Contacts Policies
CREATE POLICY "contacts_select" ON emergency_contacts
    FOR SELECT TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()) OR is_hospital_staff(auth.uid()));

CREATE POLICY "contacts_modify" ON emergency_contacts
    FOR ALL TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()));

-- 4.7 Medical Profiles Policies
CREATE POLICY "medical_profiles_select" ON medical_profiles
    FOR SELECT TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()) OR is_hospital_staff(auth.uid()));

CREATE POLICY "medical_profiles_insert" ON medical_profiles
    FOR INSERT TO authenticated
    WITH CHECK (is_hospital_staff(auth.uid()));

-- 4.8 Access Requests Policies
CREATE POLICY "access_requests_patient_select" ON access_requests
    FOR SELECT TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()));

CREATE POLICY "access_requests_patient_update" ON access_requests
    FOR UPDATE TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()));

CREATE POLICY "access_requests_staff_all" ON access_requests
    FOR ALL TO authenticated
    USING (is_hospital_staff(auth.uid()));

-- 4.9 Access Grants Policies
CREATE POLICY "access_grants_patient_all" ON access_grants
    FOR ALL TO authenticated
    USING (granted_by_patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()));

CREATE POLICY "access_grants_staff_select" ON access_grants
    FOR SELECT TO authenticated
    USING (is_active = true AND valid_until > now());

-- 4.10 Emergency Access Policies
CREATE POLICY "emergency_access_staff_insert" ON emergency_access
    FOR INSERT TO authenticated
    WITH CHECK (is_hospital_staff(auth.uid()));

CREATE POLICY "emergency_access_patient_select" ON emergency_access
    FOR SELECT TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()));

CREATE POLICY "emergency_access_staff_select" ON emergency_access
    FOR SELECT TO authenticated
    USING (is_hospital_staff(auth.uid()));

-- 4.11 Clinical Records Policies
CREATE POLICY "encounters_select" ON encounters
    FOR SELECT TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()) OR is_hospital_staff(auth.uid()));

CREATE POLICY "encounters_insert" ON encounters
    FOR INSERT TO authenticated
    WITH CHECK (is_hospital_staff(auth.uid()));

CREATE POLICY "vitals_select" ON vitals
    FOR SELECT TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()) OR is_hospital_staff(auth.uid()));

CREATE POLICY "vitals_insert" ON vitals
    FOR INSERT TO authenticated
    WITH CHECK (is_hospital_staff(auth.uid()));

CREATE POLICY "diagnoses_select" ON diagnoses
    FOR SELECT TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()) OR is_hospital_staff(auth.uid()));

CREATE POLICY "diagnoses_insert" ON diagnoses
    FOR INSERT TO authenticated
    WITH CHECK (is_hospital_staff(auth.uid()));

CREATE POLICY "prescriptions_select" ON prescriptions
    FOR SELECT TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()) OR is_hospital_staff(auth.uid()));

CREATE POLICY "prescriptions_insert" ON prescriptions
    FOR INSERT TO authenticated
    WITH CHECK (is_hospital_staff(auth.uid()));

CREATE POLICY "medical_tests_select" ON medical_tests
    FOR SELECT TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()) OR is_hospital_staff(auth.uid()));

CREATE POLICY "medical_tests_insert" ON medical_tests
    FOR INSERT TO authenticated
    WITH CHECK (is_hospital_staff(auth.uid()));

CREATE POLICY "medical_reports_select" ON medical_reports
    FOR SELECT TO authenticated
    USING (patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()) OR is_hospital_staff(auth.uid()));

CREATE POLICY "medical_reports_insert" ON medical_reports
    FOR INSERT TO authenticated
    WITH CHECK (is_hospital_staff(auth.uid()));

-- 4.12 Audit Logs Policies (Append-Only)
CREATE POLICY "audit_logs_insert" ON audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "audit_logs_select" ON audit_logs
    FOR SELECT TO authenticated
    USING (
        actor_profile_id = auth.uid() OR
        patient_id IN (SELECT id FROM patients WHERE profile_id = auth.uid()) OR
        is_hospital_staff(auth.uid())
    );

-- 4.13 Notifications Policies
CREATE POLICY "notifications_all" ON notifications
    FOR ALL TO authenticated
    USING (recipient_profile_id = auth.uid());
