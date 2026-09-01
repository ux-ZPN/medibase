/**
 * MediBase Unique Patient Identifier Utility
 *
 * Example: MB-102394
 *
 * Requirements:
 * - Generate a unique, non-sensitive identifier for every patient.
 * - Used for patient lookups across hospitals and provider workflows.
 * - Non-sensitive and completely decoupled from national IDs (Aadhaar).
 */

export function isValidMediBaseId(id: string): boolean {
  if (!id) return false;
  return /^MB-\d{6,8}$/i.test(id.trim());
}

export function formatMediBaseId(raw: string): string {
  const cleaned = raw.toUpperCase().trim();
  if (cleaned.startsWith("MB-")) return cleaned;
  if (cleaned.startsWith("MB")) return `MB-${cleaned.slice(2)}`;
  return `MB-${cleaned}`;
}

export function generateRandomMediBaseId(): string {
  const randomSixDigits = Math.floor(100000 + Math.random() * 900000);
  return `MB-${randomSixDigits}`;
}
