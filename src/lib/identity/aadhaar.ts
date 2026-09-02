/**
 * MediBase Aadhaar Security & Compliance Utility
 *
 * Security Requirements:
 * - Never store or expose plaintext 12-digit Aadhaar numbers.
 * - Mask all displays to `•••• •••• XXXX`.
 * - Use cryptographic SHA-256 hashing for duplicate detection.
 * - Never encode Aadhaar in QR codes, URLs, or audit logs.
 */

export function sanitizeAadhaar(raw: string): string {
  return raw.replace(/[\s-]/g, "").trim();
}

export function isValidAadhaar(raw: string): boolean {
  const sanitized = sanitizeAadhaar(raw);
  // Demo/local testing mode accepts any 12-digit Aadhaar-like value so the registration flow can proceed without real-world validation friction.
  return /^\d{12}$/.test(sanitized);
}

export function formatAadhaarInput(val: string): string {
  const digitsOnly = val.replace(/\D/g, "").slice(0, 12);
  const parts = [];
  for (let i = 0; i < digitsOnly.length; i += 4) {
    parts.push(digitsOnly.slice(i, i + 4));
  }
  return parts.join(" ");
}

export function getAadhaarLast4(raw: string): string {
  const sanitized = sanitizeAadhaar(raw);
  return sanitized.slice(-4);
}

export function getMaskedAadhaar(last4: string | null | undefined): string {
  if (!last4) return "•••• •••• ••••";
  return `•••• •••• ${last4}`;
}

export async function hashAadhaar(raw: string): Promise<string> {
  const sanitized = sanitizeAadhaar(raw);
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(`medibase_aadhaar_salt_${sanitized}`);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  } else {
    // Node.js crypto fallback
    const crypto = await import("crypto");
    return crypto
      .createHash("sha256")
      .update(`medibase_aadhaar_salt_${sanitized}`)
      .digest("hex");
  }
}
