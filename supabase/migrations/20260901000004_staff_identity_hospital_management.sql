-- ==============================================================================
-- Migration: 20260901000004_staff_identity_hospital_management.sql
-- Description: Phase 7 — Hospital Staff Identity & Hospital Management
--   - Security Definer helper functions to avoid recursive RLS policy cycles
--   - Unique constraints and lookup indexes on hospital_staff
--   - Robust RLS policies for profiles, hospital_staff, and hospitals
--   - Safe hospital lookup & association functions
-- ==============================================================================

-- 1. Helper Security Definer Functions (Bypasses RLS to avoid recursive evaluation)
CREATE OR REPLACE FUNCTION public.is_hospital_staff(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.hospital_staff
        WHERE profile_id = user_uuid AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_patient(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.patients
        WHERE profile_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_staff_hospital_id(user_uuid UUID)
RETURNS UUID AS $$
DECLARE
    h_id UUID;
BEGIN
    SELECT hospital_id INTO h_id
    FROM public.hospital_staff
    WHERE profile_id = user_uuid AND is_active = true
    LIMIT 1;
    RETURN h_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Indexes and Constraints
CREATE INDEX IF NOT EXISTS idx_hospital_staff_profile_lookup ON public.hospital_staff(profile_id);
CREATE INDEX IF NOT EXISTS idx_hospital_staff_hospital_lookup ON public.hospital_staff(hospital_id);
CREATE INDEX IF NOT EXISTS idx_hospitals_name_lower ON public.hospitals(lower(name));

-- 3. Row Level Security Policies

-- 3.1 Profiles RLS Policies
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_staff_lookup" ON public.profiles;
CREATE POLICY "profiles_staff_lookup" ON public.profiles
    FOR SELECT USING (public.is_hospital_staff(auth.uid()));

-- 3.2 Hospital Staff RLS Policies
DROP POLICY IF EXISTS "Staff profiles are viewable by authenticated users" ON public.hospital_staff;
DROP POLICY IF EXISTS "staff_select_own" ON public.hospital_staff;
CREATE POLICY "staff_select_own" ON public.hospital_staff
    FOR SELECT USING (
        profile_id = auth.uid() OR
        public.is_hospital_staff(auth.uid())
    );

DROP POLICY IF EXISTS "staff_insert_own" ON public.hospital_staff;
CREATE POLICY "staff_insert_own" ON public.hospital_staff
    FOR INSERT WITH CHECK (profile_id = auth.uid());

DROP POLICY IF EXISTS "staff_update_own" ON public.hospital_staff;
CREATE POLICY "staff_update_own" ON public.hospital_staff
    FOR UPDATE USING (profile_id = auth.uid());

-- 3.3 Hospitals RLS Policies
DROP POLICY IF EXISTS "Hospitals are viewable by authenticated users" ON public.hospitals;
DROP POLICY IF EXISTS "hospitals_select_all" ON public.hospitals;
CREATE POLICY "hospitals_select_all" ON public.hospitals
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "hospitals_insert_authenticated" ON public.hospitals;
CREATE POLICY "hospitals_insert_authenticated" ON public.hospitals
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 4. Safe Hospital Deduplication Function
CREATE OR REPLACE FUNCTION public.get_or_create_hospital(
    p_name TEXT,
    p_city TEXT DEFAULT 'Metro City',
    p_state TEXT DEFAULT 'State',
    p_phone TEXT DEFAULT '+91 80 0000 0000',
    p_email TEXT DEFAULT 'contact@hospital.org'
)
RETURNS UUID AS $$
DECLARE
    v_hospital_id UUID;
    v_clean_name TEXT;
    v_license TEXT;
BEGIN
    v_clean_name := trim(p_name);
    
    -- Check if hospital already exists by name (case insensitive)
    SELECT id INTO v_hospital_id
    FROM public.hospitals
    WHERE lower(name) = lower(v_clean_name)
    LIMIT 1;

    IF v_hospital_id IS NOT NULL THEN
        RETURN v_hospital_id;
    END IF;

    -- If not found, insert new hospital
    v_license := 'HOSP-' || upper(regexp_replace(v_clean_name, '[^a-zA-Z0-9]', '', 'g')) || '-' || floor(extract(epoch from now()))::text;
    
    INSERT INTO public.hospitals (name, license_number, address, city, state, postal_code, phone_number, email, is_verified)
    VALUES (v_clean_name, v_license, 'Medical Center District', p_city, p_state, '110001', p_phone, p_email, true)
    RETURNING id INTO v_hospital_id;

    RETURN v_hospital_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
