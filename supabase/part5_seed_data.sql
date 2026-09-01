-- ==============================================================================
-- PART 5: SEED DEMO DATA
-- Sequence: 5 of 5
-- Run this fifth in Supabase SQL Editor
-- ==============================================================================

-- Enable pgcrypto for password hashing if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 5.1 Cleanup Previous Demo Users If Any
DELETE FROM auth.users WHERE email IN (
    'demo.doctor@cityhospital.com',
    'anjali.mehta@email.in',
    'vikram.singh@email.in',
    'priya.reddy@email.in',
    'suresh.patel@email.in',
    'kavita.sharma@email.in',
    'manoj.desai@demo.medibase.local',
    'neha.gupta@email.in',
    'ramesh.iyer@email.in',
    'deepa.nair@email.in',
    'rajesh.kumar@email.in'
) OR id IN (
    '00000000-0000-0000-0000-000000000099',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000009',
    '00000000-0000-0000-0000-000000000010'
);

-- 5.2 Seed Verified Hospitals
INSERT INTO hospitals (id, name, license_number, address, city, state, postal_code, phone_number, email, is_verified)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'City General Hospital', 'HOSP-CGH-2024-001', '124 Healthcare Boulevard', 'Metro City', 'State', '560001', '+91 80 2345 6789', 'admin@citygeneral.hosp', true),
    ('a0000000-0000-0000-0000-000000000002', 'Metro Health Institute', 'HOSP-MHI-2024-002', '45 Medical Center Road', 'Metro City', 'State', '560002', '+91 80 2345 6790', 'info@metrohealth.org', true),
    ('a0000000-0000-0000-0000-000000000003', 'St. Mary''s Hospital', 'HOSP-SMH-2024-003', '78 Cathedral Avenue', 'Metro City', 'State', '560003', '+91 80 2345 6791', 'support@stmarys.org', true),
    ('a0000000-0000-0000-0000-000000000004', 'Apex Super Specialty Hospital', 'HOSP-ASH-2024-004', '99 Ring Road', 'Metro City', 'State', '560004', '+91 80 2345 6792', 'desk@apexhospital.com', true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    license_number = EXCLUDED.license_number,
    is_verified = EXCLUDED.is_verified;

-- 5.3 Seed Demo Auth Users
INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at
)
VALUES
    ('00000000-0000-0000-0000-000000000099', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'demo.doctor@cityhospital.com', crypt('SecureDoctor2024!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Dr. Rahul Sharma","role":"hospital_staff","staff_role":"doctor"}', false, now(), now()),
    ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'anjali.mehta@email.in', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Anjali Mehta","role":"patient"}', false, now(), now()),
    ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'vikram.singh@email.in', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Vikram Singh","role":"patient"}', false, now(), now()),
    ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'priya.reddy@email.in', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Priya Reddy","role":"patient"}', false, now(), now()),
    ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'suresh.patel@email.in', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Suresh Patel","role":"patient"}', false, now(), now()),
    ('00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'kavita.sharma@email.in', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Kavita Sharma","role":"patient"}', false, now(), now()),
    ('00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'manoj.desai@demo.medibase.local', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Manoj Desai","role":"patient"}', false, now(), now()),
    ('00000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'neha.gupta@email.in', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Neha Gupta","role":"patient"}', false, now(), now()),
    ('00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ramesh.iyer@email.in', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Ramesh Iyer","role":"patient"}', false, now(), now()),
    ('00000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'deepa.nair@email.in', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Deepa Nair","role":"patient"}', false, now(), now()),
    ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rajesh.kumar@email.in', crypt('Password123!', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Rajesh Kumar","role":"patient"}', false, now(), now())
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data;

-- 5.4 Seed Doctor Profile and Staff Record
INSERT INTO profiles (id, email, role, full_name, phone_number)
VALUES ('00000000-0000-0000-0000-000000000099', 'demo.doctor@cityhospital.com', 'hospital_staff', 'Dr. Rahul Sharma', '+91 80 2345 6780')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, full_name = EXCLUDED.full_name;

INSERT INTO hospital_staff (id, profile_id, hospital_id, role, license_number, department, is_active)
VALUES ('b0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000099', 'a0000000-0000-0000-0000-000000000001', 'doctor', 'MED-CGH-DOC-001', 'Cardiology OPD', true)
ON CONFLICT (profile_id) DO UPDATE SET hospital_id = EXCLUDED.hospital_id, department = EXCLUDED.department;

-- 5.5 Seed 10 Demo Patient Profiles
INSERT INTO profiles (id, email, role, full_name, phone_number)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'anjali.mehta@email.in', 'patient', 'Anjali Mehta', '+91 9123456789'),
    ('00000000-0000-0000-0000-000000000002', 'vikram.singh@email.in', 'patient', 'Vikram Singh', '+91 9998776655'),
    ('00000000-0000-0000-0000-000000000003', 'priya.reddy@email.in', 'patient', 'Priya Reddy', '+91 9001234567'),
    ('00000000-0000-0000-0000-000000000004', 'suresh.patel@email.in', 'patient', 'Suresh Patel', '+91 9871234560'),
    ('00000000-0000-0000-0000-000000000005', 'kavita.sharma@email.in', 'patient', 'Kavita Sharma', '+91 9123678901'),
    ('00000000-0000-0000-0000-000000000006', 'manoj.desai@demo.medibase.local', 'patient', 'Manoj Desai', NULL),
    ('00000000-0000-0000-0000-000000000007', 'neha.gupta@email.in', 'patient', 'Neha Gupta', '+91 9009876543'),
    ('00000000-0000-0000-0000-000000000008', 'ramesh.iyer@email.in', 'patient', 'Ramesh Iyer', '+91 9870987654'),
    ('00000000-0000-0000-0000-000000000009', 'deepa.nair@email.in', 'patient', 'Deepa Nair', '+91 9123098765'),
    ('00000000-0000-0000-0000-000000000010', 'rajesh.kumar@email.in', 'patient', 'Rajesh Kumar', '+91 9876543210')
ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role, full_name = EXCLUDED.full_name, phone_number = EXCLUDED.phone_number;

-- 5.6 Seed Patients Table Records
INSERT INTO patients (
    id, profile_id, medibase_id, qr_code_token, date_of_birth, blood_group,
    occupation, height_cm, weight_kg, is_demo, emergency_contact_name, emergency_contact_phone
)
VALUES
    ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'MB-100001', 'd3b07384-0001-4632-b7e6-8c2ff6d8b901', '1990-07-05', 'O-', 'School Teacher', 158.0, 60.0, true, 'Rakesh Mehta', '+91 9123456790'),
    ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'MB-100002', 'd3b07384-0002-4632-b7e6-8c2ff6d8b902', '1975-11-22', 'A+', 'Farmer', 168.0, 75.0, true, 'Meera Singh', '+91 9988776656'),
    ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 'MB-100003', 'd3b07384-0003-4632-b7e6-8c2ff6d8b903', '1993-01-18', 'AB+', 'Marketing Manager', 165.0, 62.0, true, 'Suresh Reddy', '+91 9001234568'),
    ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000004', 'MB-100004', 'd3b07384-0004-4632-b7e6-8c2ff6d8b904', '1968-09-30', 'O+', 'Shopkeeper', 170.0, 80.0, true, 'Kavita Patel', '+91 9871234561'),
    ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000005', 'MB-100005', 'd3b07384-0005-4632-b7e6-8c2ff6d8b905', '1980-05-14', 'B-', 'Homemaker', 160.0, NULL, true, 'Rajesh Sharma', '+91 9123678902'),
    ('10000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000006', 'MB-100006', 'd3b07384-0006-4632-b7e6-8c2ff6d8b906', NULL, NULL, NULL, NULL, NULL, true, NULL, NULL),
    ('10000000-0000-0000-0000-000000000007', '00000000-0000-0000-0000-000000000007', 'MB-100007', 'd3b07384-0007-4632-b7e6-8c2ff6d8b907', NULL, NULL, NULL, NULL, NULL, true, 'Arjun Gupta', '+91 9009876544'),
    ('10000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000008', 'MB-100008', 'd3b07384-0008-4632-b7e6-8c2ff6d8b908', '1955-08-10', 'O-', 'Retired Professor', 165.0, 68.0, true, 'Lakshmi Iyer', '+91 9870987655'),
    ('10000000-0000-0000-0000-000000000009', '00000000-0000-0000-0000-000000000009', 'MB-100009', 'd3b07384-0009-4632-b7e6-8c2ff6d8b909', '1988-06-17', 'A+', 'Banker', 168.0, 63.0, true, 'Rajiv Nair', '+91 9123098766'),
    ('10000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000010', 'MB-100010', 'd3b07384-0010-4632-b7e6-8c2ff6d8b910', '1985-03-12', 'B+', 'Software Engineer', 172.0, 70.0, true, NULL, NULL)
ON CONFLICT (id) DO UPDATE SET
    medibase_id = EXCLUDED.medibase_id,
    date_of_birth = EXCLUDED.date_of_birth,
    blood_group = EXCLUDED.blood_group;

-- 5.7 Seed Medical Profiles
INSERT INTO medical_profiles (
    id, patient_id, chief_complaint, medical_history, past_medical_history,
    family_history, social_history, initial_assessment, treatment_plan
)
VALUES
    ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Cough with sputum for 3 weeks', 'Mild asthma in childhood, currently asymptomatic', NULL, 'Mother with asthma', 'Non-smoker', 'Suspected LRTI', 'Empirical antibiotics avoiding penicillin'),
    ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Right knee pain and swelling', 'Twisted knee 1 week ago in farm', 'No chronic illness', 'Father with OA', 'Non-smoker', 'Soft tissue ligament strain', 'Immobilization and NSAIDs'),
    ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'Fatigue and palpitations for 1 month', 'Rapid heartbeat on mild exertion', NULL, 'Mother with thyroid disease', 'Non-smoker', 'Suspected arrhythmia', 'Cardiac ECG evaluation')
ON CONFLICT (id) DO UPDATE SET chief_complaint = EXCLUDED.chief_complaint;

-- 5.8 Seed Baseline Access Requests
INSERT INTO access_requests (id, patient_id, requested_by_staff_id, hospital_id, status, reason, access_type, requested_at, expires_at)
VALUES
    ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'pending', 'Consultation & Longitudinal History Review', 'view_only', now() - interval '5 minutes', now() + interval '10 minutes')
ON CONFLICT (id) DO NOTHING;
