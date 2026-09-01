import QRCode from "qrcode";

/**
 * MediBase Secure Patient Reference QR Code Utility
 *
 * Security Requirements:
 * 1. The patient's QR code must represent the MediBase ID / secure patient reference only.
 * 2. NEVER encode medical history, Aadhaar, diagnosis, prescriptions, or clinical reports into the QR.
 */

export interface PatientQRReference {
  type: "medibase_patient_ref";
  medibase_id: string;
  qr_code_token: string;
}

export function buildPatientQRPayload(medibase_id: string, qr_code_token: string): string {
  // Encodes ONLY the public MediBase ID and a randomized cryptographic QR token
  const payload: PatientQRReference = {
    type: "medibase_patient_ref",
    medibase_id: medibase_id.trim().toUpperCase(),
    qr_code_token: qr_code_token.trim(),
  };
  return JSON.stringify(payload);
}

export async function generatePatientQRCodeDataUrl(
  medibase_id: string,
  qr_code_token: string
): Promise<string> {
  const payload = buildPatientQRPayload(medibase_id, qr_code_token);
  return QRCode.toDataURL(payload, {
    errorCorrectionLevel: "H",
    margin: 2,
    width: 320,
    color: {
      dark: "#0F172A",
      light: "#FFFFFF",
    },
  });
}

export async function generatePatientQRCodeSVG(
  medibase_id: string,
  qr_code_token: string
): Promise<string> {
  const payload = buildPatientQRPayload(medibase_id, qr_code_token);
  return QRCode.toString(payload, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 2,
    color: {
      dark: "#0F172A",
      light: "#FFFFFF",
    },
  });
}
