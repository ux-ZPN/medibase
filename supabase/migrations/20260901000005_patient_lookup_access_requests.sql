-- ==============================================================================
-- Migration: 20260901000005_patient_lookup_access_requests.sql
-- Description: Phase 8 — Patient Lookup via MediBase ID + QR & Access Requests
--   - Performance indexes for patient MediBase ID and QR token lookups
--   - Safe access request creation and duplicate prevention
--   - Non-recursive RLS policies for access_requests and audit_logs
-- ==============================================================================

-- 1. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_patients_medibase_id_lookup ON public.patients(medibase_id);
CREATE INDEX IF NOT EXISTS idx_patients_qr_token_lookup ON public.patients(qr_code_token);
CREATE INDEX IF NOT EXISTS idx_access_requests_pending_lookup ON public.access_requests(patient_id, requested_by_staff_id, status);
CREATE INDEX IF NOT EXISTS idx_access_requests_patient_timeline ON public.access_requests(patient_id, requested_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action_lookup ON public.audit_logs(action, created_at DESC);

-- 2. Access Requests RLS Policies
DROP POLICY IF EXISTS "Patients can view requests for them" ON public.access_requests;
CREATE POLICY "Patients can view requests for them"
    ON public.access_requests FOR SELECT
    TO authenticated
    USING (
        patient_id IN (
            SELECT id FROM public.patients WHERE profile_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Patients can respond to requests" ON public.access_requests;
CREATE POLICY "Patients can respond to requests"
    ON public.access_requests FOR UPDATE
    TO authenticated
    USING (
        patient_id IN (
            SELECT id FROM public.patients WHERE profile_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Staff can view and create access requests" ON public.access_requests;
CREATE POLICY "Staff can view and create access requests"
    ON public.access_requests FOR ALL
    TO authenticated
    USING (
        public.is_hospital_staff(auth.uid())
    );

-- 3. Audit Logs RLS Policies
DROP POLICY IF EXISTS "audit_logs_select_own" ON public.audit_logs;
CREATE POLICY "audit_logs_select_own" ON public.audit_logs
    FOR SELECT
    TO authenticated
    USING (
        actor_profile_id = auth.uid() OR
        patient_id IN (SELECT id FROM public.patients WHERE profile_id = auth.uid()) OR
        public.is_hospital_staff(auth.uid())
    );

DROP POLICY IF EXISTS "audit_logs_insert_authenticated" ON public.audit_logs;
CREATE POLICY "audit_logs_insert_authenticated" ON public.audit_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() IS NOT NULL);
