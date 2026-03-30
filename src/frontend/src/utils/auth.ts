export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const SESSION_KEY = "axp_unlocked";
export const ADMIN_SESSION_KEY = "axp_admin_unlocked";

export function isUnlocked(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

export function setUnlocked(): void {
  sessionStorage.setItem(SESSION_KEY, "true");
}

export function isAdminUnlocked(): boolean {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

export function setAdminUnlocked(): void {
  sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
}

export function clearSessions(): void {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
