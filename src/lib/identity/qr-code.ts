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
  qr_code_token?: string;
}

export interface QRValidationResult {
  isValid: boolean;
  medibaseId?: string;
  qrCodeToken?: string;
  error?: string;
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

export function parseAndValidatePatientQR(rawPayload: string): QRValidationResult {
  if (!rawPayload || typeof rawPayload !== "string") {
    return { isValid: false, error: "Empty QR code data detected." };
  }

  const trimmed = rawPayload.trim();

  // 1. Try parsing JSON format
  try {
    const parsed = JSON.parse(trimmed);
    if (
      parsed &&
      typeof parsed === "object" &&
      parsed.type === "medibase_patient_ref" &&
      typeof parsed.medibase_id === "string" &&
      /^MB-\w+$/i.test(parsed.medibase_id.trim())
    ) {
      return {
        isValid: true,
        medibaseId: parsed.medibase_id.trim().toUpperCase(),
        qrCodeToken: typeof parsed.qr_code_token === "string" ? parsed.qr_code_token.trim() : undefined,
      };
    }
  } catch {
    // Not a JSON payload, proceed to string format check
  }

  // 2. Try raw MediBase ID format (e.g. MB-102394, MB-100001)
  if (/^MB-\w+$/i.test(trimmed)) {
    return {
      isValid: true,
      medibaseId: trimmed.toUpperCase(),
    };
  }

  // 3. Try MediBase URL format (e.g. https://medibase.org/p/MB-102394)
  const urlMatch = trimmed.match(/\/p\/(MB-\w+)/i);
  if (urlMatch && urlMatch[1]) {
    return {
      isValid: true,
      medibaseId: urlMatch[1].toUpperCase(),
    };
  }

  return {
    isValid: false,
    error: "Invalid or unsupported QR code format. Please scan an authentic MediBase Patient ID card.",
  };
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
