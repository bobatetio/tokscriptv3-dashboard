/** Simulate downloading a video — creates a small text blob and triggers browser download */
export function simulateVideoDownload(title: string): void {
  const blob = new Blob([`[Mock video file for: ${title}]\nThis is a simulated download.`], { type: 'video/mp4' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_')}.mp4`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Download a cover image by fetching the thumbnail URL */
export async function simulateCoverDownload(title: string, thumbnailUrl: string): Promise<void> {
  try {
    const res = await fetch(thumbnailUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_')}_cover.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    // Fallback: open in new tab
    window.open(thumbnailUrl, '_blank');
  }
}

/** Simulate a zip download of multiple items */
export function simulateZipDownload(titles: string[], zipName: string): void {
  const content = titles.map((t, i) => `${i + 1}. ${t}`).join('\n');
  const blob = new Blob([`[Mock ZIP archive: ${zipName}]\n\nContents:\n${content}`], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${zipName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
