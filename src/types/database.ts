export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "patient" | "hospital_staff" | "system_admin";
export type StaffRole = "doctor" | "nurse" | "admin" | "paramedic";
export type VisitType = "outpatient" | "inpatient" | "emergency" | "telehealth";
export type ReportType =
  | "lab_report"
  | "imaging_xray_mri"
  | "discharge_summary"
  | "prescription"
  | "other";
export type RequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "expired"
  | "revoked";
export type AccessLevel = "view_only" | "view_and_contribute";
export type NotificationType =
  | "access_request"
  | "emergency_access_alert"
  | "record_updated"
  | "access_revoked";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: UserRole;
          full_name: string;
          phone_number: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: UserRole;
          full_name: string;
          phone_number?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: UserRole;
          full_name?: string;
          phone_number?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
      };
      patients: {
        Row: {
          id: string;
          profile_id: string;
          medibase_id: string;
          qr_code_token: string;
          aadhaar_last4: string | null;
          aadhaar_hash: string | null;
          date_of_birth: string | null;
          gender: string | null;
          blood_group: string | null;
          occupation: string | null;
          height_cm: number | null;
          weight_kg: number | null;
          is_demo: boolean;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          allergies: string[];
          chronic_conditions: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          medibase_id: string;
          qr_code_token?: string;
          aadhaar_last4?: string | null;
          aadhaar_hash?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
          blood_group?: string | null;
          occupation?: string | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          is_demo?: boolean;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          allergies?: string[];
          chronic_conditions?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          medibase_id?: string;
          qr_code_token?: string;
          aadhaar_last4?: string | null;
          aadhaar_hash?: string | null;
          date_of_birth?: string | null;
          gender?: string | null;
          blood_group?: string | null;
          occupation?: string | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          is_demo?: boolean;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          allergies?: string[];
          chronic_conditions?: string[];
          updated_at?: string;
        };
      };
      emergency_contacts: {
        Row: {
          id: string;
          patient_id: string;
          emergency_contact_name: string;
          emergency_contact_relationship: string;
          emergency_contact_phone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          emergency_contact_name: string;
          emergency_contact_relationship: string;
          emergency_contact_phone: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          emergency_contact_name?: string;
          emergency_contact_relationship?: string;
          emergency_contact_phone?: string;
          updated_at?: string;
        };
      };
      medical_profiles: {
        Row: {
          id: string;
          patient_id: string;
          chief_complaint: string | null;
          medical_history: string | null;
          past_medical_history: string | null;
          family_history: string | null;
          social_history: string | null;
          initial_assessment: string | null;
          treatment_plan: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          chief_complaint?: string | null;
          medical_history?: string | null;
          past_medical_history?: string | null;
          family_history?: string | null;
          social_history?: string | null;
          initial_assessment?: string | null;
          treatment_plan?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          chief_complaint?: string | null;
          medical_history?: string | null;
          past_medical_history?: string | null;
          family_history?: string | null;
          social_history?: string | null;
          initial_assessment?: string | null;
          treatment_plan?: string | null;
          updated_at?: string;
        };
      };
      vital_signs: {
        Row: {
          id: string;
          patient_id: string;
          visit_id: string | null;
          temperature_c: number | null;
          pulse_bpm: number | null;
          respiratory_rate: number | null;
          blood_pressure_systolic: number | null;
          blood_pressure_diastolic: number | null;
          spo2: number | null;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          visit_id?: string | null;
          temperature_c?: number | null;
          pulse_bpm?: number | null;
          respiratory_rate?: number | null;
          blood_pressure_systolic?: number | null;
          blood_pressure_diastolic?: number | null;
          spo2?: number | null;
          recorded_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          visit_id?: string | null;
          temperature_c?: number | null;
          pulse_bpm?: number | null;
          respiratory_rate?: number | null;
          blood_pressure_systolic?: number | null;
          blood_pressure_diastolic?: number | null;
          spo2?: number | null;
        };
      };
      allergies: {
        Row: {
          id: string;
          patient_id: string;
          allergen: string;
          reaction: string;
          severity: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          allergen: string;
          reaction: string;
          severity?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          allergen?: string;
          reaction?: string;
          severity?: string | null;
        };
      };
      medications: {
        Row: {
          id: string;
          patient_id: string;
          visit_id: string | null;
          medication_name: string;
          dosage: string | null;
          frequency: string | null;
          route: string | null;
          status: string;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          visit_id?: string | null;
          medication_name: string;
          dosage?: string | null;
          frequency?: string | null;
          route?: string | null;
          status?: string;
          recorded_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          visit_id?: string | null;
          medication_name?: string;
          dosage?: string | null;
          frequency?: string | null;
          route?: string | null;
          status?: string;
        };
      };
      medical_tests: {
        Row: {
          id: string;
          patient_id: string;
          visit_id: string | null;
          test_name: string;
          status: string;
          result: string | null;
          notes: string | null;
          ordered_at: string;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          visit_id?: string | null;
          test_name: string;
          status?: string;
          result?: string | null;
          notes?: string | null;
          ordered_at?: string;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          visit_id?: string | null;
          test_name?: string;
          status?: string;
          result?: string | null;
          notes?: string | null;
          ordered_at?: string;
          completed_at?: string | null;
        };
      };
      hospitals: {
        Row: {
          id: string;
          name: string;
          license_number: string;
          address: string;
          city: string;
          state: string;
          postal_code: string;
          phone_number: string;
          email: string;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          license_number: string;
          address: string;
          city: string;
          state: string;
          postal_code: string;
          phone_number: string;
          email: string;
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          license_number?: string;
          address?: string;
          city?: string;
          state?: string;
          postal_code?: string;
          phone_number?: string;
          email?: string;
          is_verified?: boolean;
          updated_at?: string;
        };
      };
      hospital_staff: {
        Row: {
          id: string;
          profile_id: string;
          hospital_id: string;
          role: StaffRole;
          license_number: string;
          department: string | null;
          aadhaar_last4: string | null;
          aadhaar_hash: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          hospital_id: string;
          role?: StaffRole;
          license_number: string;
          department?: string | null;
          aadhaar_last4?: string | null;
          aadhaar_hash?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          hospital_id?: string;
          role?: StaffRole;
          license_number?: string;
          department?: string | null;
          aadhaar_last4?: string | null;
          aadhaar_hash?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      visits: {
        Row: {
          id: string;
          patient_id: string;
          hospital_id: string | null;
          staff_id: string | null;
          facility_name: string;
          department: string;
          visit_date: string;
          visit_type: VisitType;
          chief_complaint: string;
          medical_history: string | null;
          assessment: string | null;
          plan: string | null;
          diagnosis: string | null;
          clinical_notes: string | null;
          prescription: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          hospital_id?: string | null;
          staff_id?: string | null;
          facility_name?: string;
          department?: string;
          visit_date?: string;
          visit_type?: VisitType;
          chief_complaint: string;
          medical_history?: string | null;
          assessment?: string | null;
          plan?: string | null;
          diagnosis?: string | null;
          clinical_notes?: string | null;
          prescription?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          hospital_id?: string | null;
          staff_id?: string | null;
          facility_name?: string;
          department?: string;
          visit_date?: string;
          visit_type?: VisitType;
          chief_complaint?: string;
          medical_history?: string | null;
          assessment?: string | null;
          plan?: string | null;
          diagnosis?: string | null;
          clinical_notes?: string | null;
          prescription?: string | null;
          updated_at?: string;
        };
      };
      medical_reports: {
        Row: {
          id: string;
          visit_id: string;
          patient_id: string;
          uploaded_by_staff_id: string | null;
          title: string;
          report_type: ReportType;
          file_path: string;
          file_size_bytes: number | null;
          mime_type: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          visit_id: string;
          patient_id: string;
          uploaded_by_staff_id?: string | null;
          title: string;
          report_type?: ReportType;
          file_path: string;
          file_size_bytes?: number | null;
          mime_type?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          visit_id?: string;
          patient_id?: string;
          uploaded_by_staff_id?: string | null;
          title?: string;
          report_type?: ReportType;
          file_path?: string;
          file_size_bytes?: number | null;
          mime_type?: string | null;
          updated_at?: string;
        };
      };
      access_requests: {
        Row: {
          id: string;
          patient_id: string;
          requested_by_staff_id: string;
          hospital_id: string;
          status: RequestStatus;
          reason: string;
          access_type: AccessLevel;
          requested_at: string;
          expires_at: string;
          responded_at: string | null;
        };
        Insert: {
          id?: string;
          patient_id: string;
          requested_by_staff_id: string;
          hospital_id: string;
          status?: RequestStatus;
          reason: string;
          access_type?: AccessLevel;
          requested_at?: string;
          expires_at?: string;
          responded_at?: string | null;
        };
        Update: {
          id?: string;
          patient_id?: string;
          requested_by_staff_id?: string;
          hospital_id?: string;
          status?: RequestStatus;
          reason?: string;
          access_type?: AccessLevel;
          requested_at?: string;
          expires_at?: string;
          responded_at?: string | null;
        };
      };
      access_grants: {
        Row: {
          id: string;
          patient_id: string;
          access_request_id: string | null;
          hospital_id: string;
          staff_id: string | null;
          granted_by_patient_id: string;
          access_type: AccessLevel;
          is_active: boolean;
          valid_from: string;
          valid_until: string;
          revoked_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          access_request_id?: string | null;
          hospital_id: string;
          staff_id?: string | null;
          granted_by_patient_id: string;
          access_type?: AccessLevel;
          is_active?: boolean;
          valid_from?: string;
          valid_until?: string;
          revoked_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          access_request_id?: string | null;
          hospital_id?: string;
          staff_id?: string | null;
          granted_by_patient_id?: string;
          access_type?: AccessLevel;
          is_active?: boolean;
          valid_from?: string;
          valid_until?: string;
          revoked_at?: string | null;
        };
      };
      emergency_access: {
        Row: {
          id: string;
          patient_id: string;
          staff_id: string;
          hospital_id: string;
          emergency_reason: string;
          access_started_at: string;
          access_ended_at: string;
          supervisor_notified: boolean;
          patient_notified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          staff_id: string;
          hospital_id: string;
          emergency_reason: string;
          access_started_at?: string;
          access_ended_at?: string;
          supervisor_notified?: boolean;
          patient_notified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          staff_id?: string;
          hospital_id?: string;
          emergency_reason?: string;
          access_started_at?: string;
          access_ended_at?: string;
          supervisor_notified?: boolean;
          patient_notified?: boolean;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor_profile_id: string | null;
          actor_role: string;
          patient_id: string | null;
          hospital_id: string | null;
          action: string;
          resource_type: string;
          resource_id: string | null;
          ip_address: string | null;
          user_agent: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_profile_id?: string | null;
          actor_role: string;
          patient_id?: string | null;
          hospital_id?: string | null;
          action: string;
          resource_type: string;
          resource_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_profile_id?: string | null;
          actor_role?: string;
          patient_id?: string | null;
          hospital_id?: string | null;
          action?: string;
          resource_type?: string;
          resource_id?: string | null;
          ip_address?: string | null;
          user_agent?: string | null;
          metadata?: Json;
        };
      };
      notifications: {
        Row: {
          id: string;
          recipient_profile_id: string;
          title: string;
          message: string;
          type: NotificationType;
          reference_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          recipient_profile_id: string;
          title: string;
          message: string;
          type: NotificationType;
          reference_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          recipient_profile_id?: string;
          title?: string;
          message?: string;
          type?: NotificationType;
          reference_id?: string | null;
          is_read?: boolean;
        };
      };
    };
  };
}
