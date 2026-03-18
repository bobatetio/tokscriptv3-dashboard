/**
 * Formats a date string for video card display.
 *
 * Input formats:
 *   'Mar 8, 2026, 10:15 AM'   → '3/8/26 - 10:15AM'
 *   'Feb 18, 2026'            → '2/18/26'
 *   'Feb 24'                  → '2/24/26' (assumes current year)
 *
 * Output: 'M/D/YY - H:MMAM' or 'M/D/YY' if no time component.
 */
export function formatCardDate(dateStr: string): string {
  if (!dateStr) return '';

  // Try parsing as a full date (with or without time)
  const parsed = new Date(dateStr);

  // If Date constructor fails, try manual parsing for short formats like 'Feb 24'
  if (isNaN(parsed.getTime())) {
    // Try 'Mon DD' format (no year)
    const shortMatch = dateStr.match(/^([A-Za-z]+)\s+(\d+)$/);
    if (shortMatch) {
      const withYear = new Date(`${shortMatch[1]} ${shortMatch[2]}, ${new Date().getFullYear()}`);
      if (!isNaN(withYear.getTime())) {
        const m = withYear.getMonth() + 1;
        const d = withYear.getDate();
        const y = String(withYear.getFullYear()).slice(-2);
        return `${m}/${d}/${y}`;
      }
    }
    // Fallback: return original string
    return dateStr;
  }

  const m = parsed.getMonth() + 1;
  const d = parsed.getDate();
  const y = String(parsed.getFullYear()).slice(-2);

  // Check if original string included a time component
  const hasTime = /\d{1,2}:\d{2}\s*(AM|PM)/i.test(dateStr);

  if (hasTime) {
    let hours = parsed.getHours();
    const mins = String(parsed.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${m}/${d}/${y} - ${hours}:${mins}${ampm}`;
  }

  return `${m}/${d}/${y}`;
}
