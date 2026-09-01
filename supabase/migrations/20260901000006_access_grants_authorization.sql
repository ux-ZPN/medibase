-- ==============================================================================
-- Migration: 20260901000006_access_grants_authorization.sql
-- Description: Phase 9 — Patient Access Request + Authorization
--   - Time-limited access grants indexing and lookup functions
--   - Non-recursive RLS validation helpers for patient access grants
-- ==============================================================================

-- 1. Performance Indexes for Access Grants
CREATE INDEX IF NOT EXISTS idx_access_grants_active_check 
    ON public.access_grants(patient_id, hospital_id, staff_id, is_active, valid_until);

CREATE INDEX IF NOT EXISTS idx_access_grants_request_ref 
    ON public.access_grants(access_request_id);

-- 2. Authorization Helper Function (Fast Grant Verification)
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
