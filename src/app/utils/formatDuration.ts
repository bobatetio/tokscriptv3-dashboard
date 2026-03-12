/**
 * formatDuration
 * Accepts a duration string in M:SS, MM:SS, or H:MM:SS format and returns a
 * clean display string:
 *   • Content under 1 hour  → M:SS  (e.g. "0:45", "3:12", "28:14")
 *   • Content 1 hour+       → H:MM:SS (e.g. "1:44:10", "3:08:44")
 *
 * Crucially, any three-part string where hours === 0 (e.g. "0:03:44") is
 * collapsed to the two-part short-form "3:44" — no leading "0:" hour marker.
 */
export function formatDuration(raw: string | null | undefined): string {
  if (!raw) return '';

  const parts = raw.split(':').map(Number);

  let totalSec: number;
  if (parts.length === 3) {
    totalSec = parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    totalSec = parts[0] * 60 + parts[1];
  } else {
    return raw; // unrecognised format — pass through unchanged
  }

  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;

  if (h > 0) {
    // Long-form: H:MM:SS
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  // Short-form: M:SS  (no zero-padding on minutes)
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * parseDuration
 * Returns total seconds for a duration string. Useful for sort / filter logic.
 */
export function parseDuration(raw: string): number {
  const parts = raw.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return parts[0] * 60 + (parts[1] ?? 0);
}
