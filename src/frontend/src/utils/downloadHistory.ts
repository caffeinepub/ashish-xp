const HISTORY_KEY = "axp_download_history";

export interface DownloadRecord {
  id: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  downloadUrl: string;
  timestamp: number;
}

export function getDownloadHistory(): DownloadRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as DownloadRecord[];
  } catch {
    return [];
  }
}

export function addToDownloadHistory(
  record: Omit<DownloadRecord, "timestamp">,
): void {
  const history = getDownloadHistory();
  const entry: DownloadRecord = { ...record, timestamp: Date.now() };
  // Put newest first, limit to 100
  const updated = [entry, ...history].slice(0, 100);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export function clearDownloadHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}

export function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
