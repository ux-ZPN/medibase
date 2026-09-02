export function normalizeDoctorName(fullName?: string | null): string {
  const raw = (fullName || "Dr. Rahul Sharma").trim();
  if (!raw) return "Dr. Rahul Sharma";

  const normalized = raw.replace(/^dr\.?\s+/i, "").trim();
  const finalName = normalized || raw;

  return finalName.startsWith("Dr.") || finalName.startsWith("DR.")
    ? finalName
    : `Dr. ${finalName}`;
}

export function getTimeBasedGreeting(name?: string | null): string {
  const hour = new Date().getHours();
  const displayName = normalizeDoctorName(name);

  if (hour < 12) return `Good morning, ${displayName}`;
  if (hour < 17) return `Good afternoon, ${displayName}`;
  if (hour < 21) return `Good evening, ${displayName}`;
  return `Good night, ${displayName}`;
}
