-- ==============================================================================
-- PART 1: ENUMS & EXTENSIONS
-- Sequence: 1 of 5
-- Run this first in Supabase SQL Editor
-- ==============================================================================

-- Enable pgcrypto extension for UUIDs and cryptographic hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Create Custom Enumeration Types
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
