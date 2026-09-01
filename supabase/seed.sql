-- ==============================================================================
-- MediBase PostgreSQL Database Seed Data
-- Source of Truth: Database Hackathon.pdf (10 Demo Patients)
-- Idempotent: Safe to execute repeatedly without generating duplicate records.
-- ==============================================================================

-- Enable pgcrypto for password hashing if needed
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 0. CLEANUP PREVIOUS CONFLICTING DEMO USERS (Ensures clean unique email & ID inserts)
-- ==============================================================================

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

-- ==============================================================================
-- 1. SEED HOSPITALS
-- ==============================================================================

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

-- ==============================================================================
-- 2. SEED AUTH USERS (Satisfies foreign key constraint profiles_id_fkey -> auth.users)
-- ==============================================================================

INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
)
VALUES
    (
        '00000000-0000-0000-0000-000000000099',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'demo.doctor@cityhospital.com',
        crypt('DemoDoctor2024!', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Dr. Rahul Sharma","role":"hospital_staff"}'::jsonb,
        now(),
        now()
    ),
    (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'anjali.mehta@email.in',
        crypt('DemoPatient2024!', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Anjali Mehta","role":"patient"}'::jsonb,
        now(),
        now()
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'vikram.singh@email.in',
        crypt('DemoPatient2024!', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Vikram Singh","role":"patient"}'::jsonb,
        now(),
        now()
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'priya.reddy@email.in',
        crypt('DemoPatient2024!', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Priya Reddy","role":"patient"}'::jsonb,
        now(),
        now()
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'suresh.patel@email.in',
        crypt('DemoPatient2024!', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Suresh Patel","role":"patient"}'::jsonb,
        now(),
        now()
    ),
    (
        '00000000-0000-0000-0000-000000000005',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'kavita.sharma@email.in',
        crypt('DemoPatient2024!', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Kavita Sharma","role":"patient"}'::jsonb,
        now(),
        now()
    ),
    (
        '00000000-0000-0000-0000-000000000006',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'manoj.desai@demo.medibase.local',
        crypt('DemoPatient2024!', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Manoj Desai","role":"patient"}'::jsonb,
        now(),
        now()
    ),
    (
        '00000000-0000-0000-0000-000000000007',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'neha.gupta@email.in',
        crypt('DemoPatient2024!', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Neha Gupta","role":"patient"}'::jsonb,
        now(),
        now()
    ),
    (
        '00000000-0000-0000-0000-000000000008',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'ramesh.iyer@email.in',
        crypt('DemoPatient2024!', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Ramesh Iyer","role":"patient"}'::jsonb,
        now(),
        now()
    ),
    (
        '00000000-0000-0000-0000-000000000009',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'deepa.nair@email.in',
        crypt('DemoPatient2024!', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Deepa Nair","role":"patient"}'::jsonb,
        now(),
        now()
    ),
    (
        '00000000-0000-0000-0000-000000000010',
        '00000000-0000-0000-0000-000000000000',
        'authenticated',
        'authenticated',
        'rajesh.kumar@email.in',
        crypt('DemoPatient2024!', gen_salt('bf')),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"full_name":"Rajesh Kumar","role":"patient"}'::jsonb,
        now(),
        now()
    )
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 3. SEED STAFF / CLINICAL PROVIDER PROFILES
-- ==============================================================================

-- 3.1 Staff Auth User Profile (Dr. Rahul Sharma)
INSERT INTO profiles (id, email, role, full_name, phone_number)
VALUES
    ('00000000-0000-0000-0000-000000000099', 'demo.doctor@cityhospital.com', 'hospital_staff', 'Dr. Rahul Sharma', '+91 98765 43211')
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name;

-- 3.2 Hospital Staff Record
INSERT INTO hospital_staff (id, profile_id, hospital_id, role, license_number, department, is_active)
VALUES
    ('b0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000099', 'a0000000-0000-0000-0000-000000000001', 'doctor', 'MED-REG-2024-8941', 'Cardiology', true)
ON CONFLICT (id) DO UPDATE SET
    hospital_id = EXCLUDED.hospital_id,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    license_number = EXCLUDED.license_number;

-- ==============================================================================
-- 4. SEED 10 DEMO PATIENT PROFILES (From Database Hackathon.pdf)
-- ==============================================================================

-- 4.1 Patient User Profiles
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
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    role = EXCLUDED.role,
    full_name = EXCLUDED.full_name,
    phone_number = EXCLUDED.phone_number;

-- 4.2 Patients Table Records
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
    blood_group = EXCLUDED.blood_group,
    occupation = EXCLUDED.occupation,
    height_cm = EXCLUDED.height_cm,
    weight_kg = EXCLUDED.weight_kg,
    is_demo = EXCLUDED.is_demo,
    emergency_contact_name = EXCLUDED.emergency_contact_name,
    emergency_contact_phone = EXCLUDED.emergency_contact_phone;

-- ==============================================================================
-- 5. SEED EMERGENCY CONTACTS (Part 2)
-- ==============================================================================

INSERT INTO emergency_contacts (id, patient_id, emergency_contact_name, emergency_contact_relationship, emergency_contact_phone)
VALUES
    ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Rakesh Mehta', 'Husband', '+91 9123456790'),
    ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Meera Singh', 'Daughter', '+91 9988776656'),
    ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'Suresh Reddy', 'Father', '+91 9001234568'),
    ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'Kavita Patel', 'Wife', '+91 9871234561'),
    ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', 'Rajesh Sharma', 'Brother', '+91 9123678902'),
    ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000007', 'Arjun Gupta', 'Brother', '+91 9009876544'),
    ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000008', 'Lakshmi Iyer', 'Daughter', '+91 9870987655'),
    ('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000009', 'Rajiv Nair', 'Husband', '+91 9123098766')
ON CONFLICT (id) DO UPDATE SET
    emergency_contact_name = EXCLUDED.emergency_contact_name,
    emergency_contact_relationship = EXCLUDED.emergency_contact_relationship,
    emergency_contact_phone = EXCLUDED.emergency_contact_phone;

-- ==============================================================================
-- 6. SEED MEDICAL PROFILES (Part 3)
-- ==============================================================================

INSERT INTO medical_profiles (
    id, patient_id, chief_complaint, medical_history, past_medical_history,
    family_history, social_history, initial_assessment, treatment_plan
)
VALUES
    (
        '30000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000001',
        'Cough with sputum production for 3 weeks',
        'Mild asthma in childhood, currently asymptomatic, no surgeries',
        NULL,
        'Mother with asthma, father healthy',
        'Non-smoker, no alcohol, lives with family',
        'Suspected lower respiratory tract infection',
        'Start empirical antibiotics avoiding penicillin; Monitor symptoms and review after tests'
    ),
    (
        '30000000-0000-0000-0000-000000000002',
        '10000000-0000-0000-0000-000000000002',
        'Pain and swelling in right knee after a fall 1 week ago',
        'Twisted right knee while working in the field, pain increasing with movement, swelling and restricted motion. No previous joint problems or systemic symptoms.',
        'No chronic illnesses, no surgeries.',
        'Father with osteoarthritis.',
        'Non-smoker, occasional alcohol, physically active.',
        'Probable soft tissue injury or ligament strain',
        'Immobilization advised, NSAIDs prescribed, imaging to rule out fracture, and follow-up in 1 week.'
    ),
    (
        '30000000-0000-0000-0000-000000000003',
        '10000000-0000-0000-0000-000000000003',
        'Fatigue and palpitations for 1 month',
        'Episodes of rapid heartbeat, fatigue, and shortness of breath on mild exertion. No chest pain or syncope. No history of thyroid disease.',
        'None significant',
        'Mother with hypothyroidism.',
        'Non-smoker, no alcohol, moderate exercise.',
        'Suspected arrhythmia possibly related to thyroid dysfunction',
        'Urgent cardiac evaluation advised, start symptomatic care, follow-up after tests.'
    ),
    (
        '30000000-0000-0000-0000-000000000004',
        '10000000-0000-0000-0000-000000000004',
        'Increased frequency of urination and excessive thirst for 2 months',
        'Symptoms consistent with polyuria, polydipsia, and fatigue. No weight loss or vision changes. No known diabetes.',
        'None significant, no surgeries.',
        'Father diabetic, mother hypertensive.',
        'Smoker (5 cigarettes/day), no alcohol.',
        'Probable new onset diabetes mellitus',
        'Initiate lifestyle counseling, start blood sugar monitoring, and plan for diabetic management after confirmation.'
    ),
    (
        '30000000-0000-0000-0000-000000000005',
        '10000000-0000-0000-0000-000000000005',
        'Abdominal pain and intermittent nausea for 10 days',
        'Cramping lower abdominal pain, worse after meals, associated with nausea but no vomiting. No blood in stool. No weight loss. No chronic illnesses.',
        'Appendectomy 15 years ago.',
        'No significant illnesses.',
        'Non-smoker, non-alcoholic.',
        'Likely gastritis or peptic ulcer disease',
        'Initiate symptomatic treatment, schedule imaging, follow-up in one week.'
    ),
    (
        '30000000-0000-0000-0000-000000000006',
        '10000000-0000-0000-0000-000000000006',
        'Chest discomfort and shortness of breath on exertion for 3 days',
        'Gradual onset of mild chest tightness during work, relieved by rest. No diaphoresis or radiation of pain. Smoker for 20 years.',
        'Hyperlipidemia diagnosed 2 years ago.',
        'Father died of myocardial infarction at 60.',
        'Smoker 10 cigarettes/day, occasional alcohol.',
        'Suspected angina',
        'Urgent cardiac evaluation needed, initiate aspirin, advise smoking cessation, and schedule follow-up.'
    ),
    (
        '30000000-0000-0000-0000-000000000007',
        '10000000-0000-0000-0000-000000000007',
        'Recurrent episodes of wheezing and cough for 6 months',
        'Episodic wheezing, dry cough mostly at night and early morning, triggered by dust and cold. No fever or weight loss.',
        'Diagnosed with mild intermittent asthma in childhood.',
        'Sister with allergic rhinitis.',
        'Non-smoker, no alcohol, urban resident.',
        'Asthma exacerbation',
        'Optimize inhaler therapy, avoid triggers, asthma action plan education, and follow-up in 1 month.'
    ),
    (
        '30000000-0000-0000-0000-000000000008',
        '10000000-0000-0000-0000-000000000008',
        'Memory loss and confusion over past 3 months',
        'Gradual cognitive decline with forgetfulness, occasional disorientation, difficulty in managing daily tasks. No history of stroke or head injury.',
        'Hypertension, controlled; cataract surgery 2 years ago.',
        NULL,
        'Non-smoker, non-alcoholic.',
        'Possible early dementia',
        'Refer to neurology, initiate cognitive testing, counsel family and plan multidisciplinary care.'
    ),
    (
        '30000000-0000-0000-0000-000000000009',
        '10000000-0000-0000-0000-000000000009',
        'Right wrist pain and swelling after a fall 5 days ago',
        'Fell on outstretched hand, acute pain and swelling over right wrist, difficulty moving fingers. No numbness or tingling. No previous injuries.',
        'None',
        'No significant illnesses.',
        'Non-smoker, occasional alcohol.',
        'Suspected wrist sprain or fracture',
        'Immobilize wrist, avoid NSAIDs, prescribe analgesics, arrange orthopedic review.'
    ),
    (
        '30000000-0000-0000-0000-000000000010',
        '10000000-0000-0000-0000-000000000010',
        'Persistent headache and occasional dizziness for 2 weeks.',
        'Hypertension diagnosed 3 years ago, controlled with medication.',
        'Hypertension diagnosed 3 years ago, controlled with medication.',
        NULL,
        'Non-smoker, occasional alcohol use, sedentary lifestyle.',
        NULL,
        NULL
    )
ON CONFLICT (id) DO UPDATE SET
    chief_complaint = EXCLUDED.chief_complaint,
    medical_history = EXCLUDED.medical_history,
    past_medical_history = EXCLUDED.past_medical_history,
    family_history = EXCLUDED.family_history,
    social_history = EXCLUDED.social_history,
    initial_assessment = EXCLUDED.initial_assessment,
    treatment_plan = EXCLUDED.treatment_plan;

-- ==============================================================================
-- 7. SEED VISITS / CLINICAL ENCOUNTERS (Part 8)
-- ==============================================================================

INSERT INTO visits (
    id, patient_id, hospital_id, staff_id, facility_name, department,
    visit_date, visit_type, chief_complaint, medical_history, assessment, plan,
    diagnosis, clinical_notes, prescription
)
VALUES
    (
        '40000000-0000-0000-0000-000000000001',
        '10000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        'City General Hospital',
        'Pulmonology / Outpatient Clinic',
        now() - interval '2 days',
        'outpatient',
        'Cough with sputum production for 3 weeks',
        'Mild asthma in childhood, currently asymptomatic, no surgeries',
        'Suspected lower respiratory tract infection',
        'Start empirical antibiotics avoiding penicillin; Monitor symptoms and review after tests',
        'Lower Respiratory Tract Infection',
        'Patient presents with productive cough. Penicillin allergy noted.',
        'Azithromycin 500mg daily for 5 days'
    ),
    (
        '40000000-0000-0000-0000-000000000002',
        '10000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        'City General Hospital',
        'Orthopedics / Outpatient Clinic',
        now() - interval '4 days',
        'outpatient',
        'Pain and swelling in right knee after a fall 1 week ago',
        'Twisted right knee while working in the field, pain increasing with movement, swelling and restricted motion.',
        'Probable soft tissue injury or ligament strain',
        'Immobilization advised, NSAIDs prescribed, imaging to rule out fracture, and follow-up in 1 week.',
        'Right Knee Ligament Strain',
        'Knee joint swelling present. Restricted range of motion.',
        'Aceclofenac 100mg + Paracetamol 325mg twice daily after meals'
    ),
    (
        '40000000-0000-0000-0000-000000000003',
        '10000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        'City General Hospital',
        'Cardiology / Outpatient Clinic',
        now() - interval '3 days',
        'outpatient',
        'Fatigue and palpitations for 1 month',
        'Episodes of rapid heartbeat, fatigue, and shortness of breath on mild exertion.',
        'Suspected arrhythmia possibly related to thyroid dysfunction',
        'Urgent cardiac evaluation advised, start symptomatic care, follow-up after tests.',
        'Palpitations - R/O Hyperthyroidism',
        'Tachycardia on exam (110 bpm). Sulfa allergy noted.',
        'Propranolol 20mg twice daily'
    ),
    (
        '40000000-0000-0000-0000-000000000004',
        '10000000-0000-0000-0000-000000000004',
        'a0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        'City General Hospital',
        'Internal Medicine',
        now() - interval '5 days',
        'outpatient',
        'Increased frequency of urination and excessive thirst for 2 months',
        'Symptoms consistent with polyuria, polydipsia, and fatigue.',
        'Probable new onset diabetes mellitus',
        'Initiate lifestyle counseling, start blood sugar monitoring, and plan for diabetic management after confirmation.',
        'Type 2 Diabetes Mellitus (Probable)',
        'Polyuria and polydipsia for 2 months. Blood pressure 140/85.',
        'Metformin 500mg once daily after dinner'
    ),
    (
        '40000000-0000-0000-0000-000000000005',
        '10000000-0000-0000-0000-000000000005',
        'a0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        'City General Hospital',
        'Gastroenterology',
        now() - interval '1 day',
        'outpatient',
        'Abdominal pain and intermittent nausea for 10 days',
        'Cramping lower abdominal pain, worse after meals, associated with nausea but no vomiting.',
        'Likely gastritis or peptic ulcer disease',
        'Initiate symptomatic treatment, schedule imaging, follow-up in one week.',
        'Acute Gastritis',
        'Epigastric tenderness present. Appendectomy scar noted.',
        'Pantoprazole 40mg once daily before breakfast'
    ),
    (
        '40000000-0000-0000-0000-000000000006',
        '10000000-0000-0000-0000-000000000006',
        'a0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        'City General Hospital',
        'Cardiology / Emergency Dept',
        now() - interval '12 hours',
        'emergency',
        'Chest discomfort and shortness of breath on exertion for 3 days',
        'Gradual onset of mild chest tightness during work, relieved by rest. Smoker for 20 years.',
        'Suspected angina',
        'Urgent cardiac evaluation needed, initiate aspirin, advise smoking cessation, and schedule follow-up.',
        'Suspected Stable Angina / CAD',
        'BP elevated at 150/95. ECG and cardiac enzymes ordered urgently.',
        'Aspirin 75mg daily, Atorvastatin 10mg daily'
    ),
    (
        '40000000-0000-0000-0000-000000000007',
        '10000000-0000-0000-0000-000000000007',
        'a0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        'City General Hospital',
        'Pulmonology Clinic',
        now() - interval '6 days',
        'outpatient',
        'Recurrent episodes of wheezing and cough for 6 months',
        'Episodic wheezing, dry cough mostly at night and early morning, triggered by dust and cold.',
        'Asthma exacerbation',
        'Optimize inhaler therapy, avoid triggers, asthma action plan education, and follow-up in 1 month.',
        'Bronchial Asthma Exacerbation',
        'Expiratory wheeze heard bilaterally. RR 20/min.',
        'Budesonide + Formoterol inhaler 200/6 mcg twice daily PRN'
    ),
    (
        '40000000-0000-0000-0000-000000000008',
        '10000000-0000-0000-0000-000000000008',
        'a0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        'City General Hospital',
        'Neurology Clinic',
        now() - interval '8 days',
        'outpatient',
        'Memory loss and confusion over past 3 months',
        'Gradual cognitive decline with forgetfulness, occasional disorientation, difficulty in managing daily tasks.',
        'Possible early dementia',
        'Refer to neurology, initiate cognitive testing, counsel family and plan multidisciplinary care.',
        'Early Cognitive Impairment / Dementia Evaluation',
        'MMSE administered. Controlled hypertension on Enalapril.',
        'Continue Enalapril 10mg daily'
    ),
    (
        '40000000-0000-0000-0000-000000000009',
        '10000000-0000-0000-0000-000000000009',
        'a0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        'City General Hospital',
        'Emergency / Orthopedics',
        now() - interval '3 days',
        'emergency',
        'Right wrist pain and swelling after a fall 5 days ago',
        'Fell on outstretched hand, acute pain and swelling over right wrist, difficulty moving fingers.',
        'Suspected wrist sprain or fracture',
        'Immobilize wrist, avoid NSAIDs, prescribe analgesics, arrange orthopedic review.',
        'Right Distal Radial Sprain / R/O Fracture',
        'Wrist splint applied. NSAID allergy noted.',
        'Paracetamol 500mg every 6 hours as needed'
    ),
    (
        '40000000-0000-0000-0000-000000000010',
        '10000000-0000-0000-0000-000000000010',
        'a0000000-0000-0000-0000-000000000001',
        'b0000000-0000-0000-0000-000000000001',
        'City General Hospital',
        'General Medicine',
        now() - interval '10 days',
        'outpatient',
        'Persistent headache and occasional dizziness for 2 weeks.',
        'Hypertension diagnosed 3 years ago, controlled with medication.',
        'Essential Hypertension Follow-up',
        'Continue current anti-hypertensive regimen; lifestyle modification counseling.',
        'Essential Hypertension',
        'Sedentary lifestyle. Advised 30 mins walking daily.',
        'Amlodipine 5mg daily'
    )
ON CONFLICT (id) DO UPDATE SET
    chief_complaint = EXCLUDED.chief_complaint,
    medical_history = EXCLUDED.medical_history,
    assessment = EXCLUDED.assessment,
    plan = EXCLUDED.plan,
    diagnosis = EXCLUDED.diagnosis;

-- ==============================================================================
-- 8. SEED VITAL SIGNS (Part 4)
-- ==============================================================================

INSERT INTO vital_signs (
    id, patient_id, visit_id, temperature_c, pulse_bpm, respiratory_rate,
    blood_pressure_systolic, blood_pressure_diastolic, spo2, recorded_at
)
VALUES
    ('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 37.5, 90, 18, 120, 80, 96.0, now() - interval '2 days'),
    ('50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', 36.7, 82, NULL, 130, 85, NULL, now() - interval '4 days'),
    ('50000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000003', 36.5, 110, NULL, 110, 70, NULL, now() - interval '3 days'),
    ('50000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000004', 36.9, 88, NULL, 140, 85, NULL, now() - interval '5 days'),
    ('50000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000005', 37.0, 76, NULL, 118, 75, NULL, now() - interval '1 day'),
    ('50000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000006', 36.8, 90, NULL, 150, 95, NULL, now() - interval '12 hours'),
    ('50000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000007', NULL, 80, 20, 115, 70, NULL, now() - interval '6 days'),
    ('50000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000008', 36.6, 70, NULL, 135, 80, NULL, now() - interval '8 days'),
    ('50000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000009', 36.7, 76, NULL, 120, 78, NULL, now() - interval '3 days')
ON CONFLICT (id) DO UPDATE SET
    temperature_c = EXCLUDED.temperature_c,
    pulse_bpm = EXCLUDED.pulse_bpm,
    respiratory_rate = EXCLUDED.respiratory_rate,
    blood_pressure_systolic = EXCLUDED.blood_pressure_systolic,
    blood_pressure_diastolic = EXCLUDED.blood_pressure_diastolic,
    spo2 = EXCLUDED.spo2;

-- ==============================================================================
-- 9. SEED ALLERGIES (Part 5)
-- (Only for patients with verified allergies from PDF; none for "None")
-- ==============================================================================

INSERT INTO allergies (id, patient_id, allergen, reaction, severity)
VALUES
    ('60000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Penicillin', 'rash', 'moderate'),
    ('60000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'Sulfa drugs', 'rash', 'moderate'),
    ('60000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000009', 'NSAIDs', 'rash', 'moderate')
ON CONFLICT (id) DO UPDATE SET
    allergen = EXCLUDED.allergen,
    reaction = EXCLUDED.reaction,
    severity = EXCLUDED.severity;

-- ==============================================================================
-- 10. SEED MEDICATIONS (Part 6)
-- (Only for patients with active medications from PDF; none for "None")
-- ==============================================================================

INSERT INTO medications (id, patient_id, visit_id, medication_name, dosage, frequency, route, status)
VALUES
    ('70000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000006', 'Atorvastatin', '10 mg', 'daily', 'oral', 'active'),
    ('70000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000007', 'Inhaled corticosteroids', NULL, 'PRN', 'inhalation', 'active'),
    ('70000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000008', 'Enalapril', '10 mg', 'daily', 'oral', 'active'),
    ('70000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000009', 'Paracetamol', '500 mg', 'as needed', 'oral', 'active')
ON CONFLICT (id) DO UPDATE SET
    medication_name = EXCLUDED.medication_name,
    dosage = EXCLUDED.dosage,
    frequency = EXCLUDED.frequency,
    route = EXCLUDED.route,
    status = EXCLUDED.status;

-- ==============================================================================
-- 11. SEED MEDICAL TESTS (Part 7)
-- (Exact tests from PDF "TESTS REQUIRED"; none fabricated for Rajesh Kumar)
-- ==============================================================================

INSERT INTO medical_tests (id, patient_id, visit_id, test_name, status, notes)
VALUES
    -- Anjali Mehta (3 tests)
    ('80000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Chest X-ray', 'ordered', 'R/O consolidation or pneumonic patch'),
    ('80000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Sputum culture and sensitivity', 'ordered', 'Check for bacterial pathogen and antibiotic sensitivities'),
    ('80000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'CBC', 'ordered', 'Check for leukocytosis'),

    -- Vikram Singh (3 tests)
    ('80000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', 'X-ray right knee', 'ordered', 'AP & Lateral views to rule out fracture'),
    ('80000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', 'CBC', 'ordered', 'Baseline blood work'),
    ('80000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', 'ESR', 'ordered', 'Inflammatory marker evaluation'),

    -- Priya Reddy (3 tests)
    ('80000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000003', 'ECG', 'ordered', '12-lead resting electrocardiogram'),
    ('80000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000003', 'Thyroid function tests', 'ordered', 'TSH, Free T3, Free T4'),
    ('80000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000003', 'Complete blood count', 'ordered', 'Check for anemia and infection'),

    -- Suresh Patel (3 tests)
    ('80000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000004', 'Fasting blood glucose', 'ordered', 'Diagnostic fasting plasma glucose'),
    ('80000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000004', 'HbA1c', 'ordered', 'Glycated hemoglobin percentage'),
    ('80000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000004', 'Urine routine and microscopy', 'ordered', 'Check for glucosuria, proteinuria, ketones'),

    -- Kavita Sharma (3 tests)
    ('80000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000005', 'Abdominal ultrasound', 'ordered', 'Evaluate hepatobiliary and gastric regions'),
    ('80000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000005', 'CBC', 'ordered', 'Complete blood count'),
    ('80000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000005', 'Liver function tests', 'ordered', 'Bilirubin, SGOT, SGPT, ALP'),

    -- Manoj Desai (3 tests)
    ('80000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000006', 'ECG', 'ordered', 'Urgent 12-lead ECG for ischemic changes'),
    ('80000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000006', 'Lipid profile', 'ordered', 'Total cholesterol, HDL, LDL, Triglycerides'),
    ('80000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000006', 'Cardiac enzymes', 'ordered', 'Troponin I, CK-MB'),

    -- Neha Gupta (2 tests)
    ('80000000-0000-0000-0000-000000000019', '10000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000007', 'Pulmonary function tests', 'ordered', 'Spirometry with bronchodilator reversibility'),
    ('80000000-0000-0000-0000-000000000020', '10000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000007', 'Chest X-ray', 'ordered', 'PA view for hyperinflation or infection'),

    -- Ramesh Iyer (3 tests)
    ('80000000-0000-0000-0000-000000000021', '10000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000008', 'MRI brain', 'ordered', 'Brain MRI with cognitive protocol (volumetric study)'),
    ('80000000-0000-0000-0000-000000000022', '10000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000008', 'Cognitive assessment tests', 'ordered', 'MoCA and neuropsychological battery'),
    ('80000000-0000-0000-0000-000000000023', '10000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000008', 'Vitamin B12 levels', 'ordered', 'Serum B12 and folate levels'),

    -- Deepa Nair (2 tests)
    ('80000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000009', 'X-ray right wrist', 'ordered', 'PA and lateral views of right wrist'),
    ('80000000-0000-0000-0000-000000000025', '10000000-0000-0000-0000-000000000009', '40000000-0000-0000-0000-000000000009', 'CBC', 'ordered', 'Complete blood count')
ON CONFLICT (id) DO UPDATE SET
    test_name = EXCLUDED.test_name,
    status = EXCLUDED.status,
    notes = EXCLUDED.notes;

-- ==============================================================================
-- 12. SUMMARY OUTPUT REPORT (Part 13)
-- ==============================================================================

DO $$
DECLARE
    patient_count INT;
    visit_count INT;
    allergy_count INT;
    medication_count INT;
    test_count INT;
    rec RECORD;
BEGIN
    SELECT count(*) INTO patient_count FROM patients WHERE is_demo = true;
    SELECT count(*) INTO visit_count FROM visits WHERE patient_id IN (SELECT id FROM patients WHERE is_demo = true);
    SELECT count(*) INTO allergy_count FROM allergies WHERE patient_id IN (SELECT id FROM patients WHERE is_demo = true);
    SELECT count(*) INTO medication_count FROM medications WHERE patient_id IN (SELECT id FROM patients WHERE is_demo = true);
    SELECT count(*) INTO test_count FROM medical_tests WHERE patient_id IN (SELECT id FROM patients WHERE is_demo = true);

    RAISE NOTICE ' ';
    RAISE NOTICE '==================================================';
    RAISE NOTICE 'MEDIBASE PATIENTS CREATED';
    RAISE NOTICE '==================================================';
    RAISE NOTICE '%-36s  %-30s', 'MediBase ID', 'Patient Name';
    RAISE NOTICE '----------------------------------------------------------------------';

    FOR rec IN 
        SELECT p.medibase_id, pr.full_name 
        FROM patients p 
        JOIN profiles pr ON p.profile_id = pr.id 
        WHERE p.is_demo = true 
        ORDER BY p.medibase_id ASC
    LOOP
        RAISE NOTICE '%-36s  %-30s', rec.medibase_id, rec.full_name;
    END LOOP;

    RAISE NOTICE '----------------------------------------------------------------------';
    RAISE NOTICE 'Total patients: %', patient_count;
    RAISE NOTICE 'Total visits created: %', visit_count;
    RAISE NOTICE 'Total allergy records: %', allergy_count;
    RAISE NOTICE 'Total medication records: %', medication_count;
    RAISE NOTICE 'Total medical-test records: %', test_count;
    RAISE NOTICE '==================================================';
END $$;
