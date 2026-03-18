/**
 * demo-capture.mjs — Captures frames for the Tokscript demo video.
 * Run: node demo-capture.mjs
 * Then assemble with ffmpeg (see output).
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUT_DIR = './demo-frames';
if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

const BASE = 'http://localhost:3000';
const FPS = 30;
let fi = 0; // global frame index

function framePath(idx) {
  return path.join(OUT_DIR, `frame-${String(idx).padStart(5, '0')}.png`);
}

async function capture(page, holdMs = 2000) {
  const file = framePath(fi);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`  frame-${String(fi).padStart(5, '0')} (${holdMs}ms hold)`);
  const extra = Math.round((holdMs / 1000) * FPS) - 1;
  for (let i = 1; i <= extra; i++) fs.copyFileSync(file, framePath(fi + i));
  fi += extra + 1;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// Click a button/link by its text label, tolerant of partial matches
async function clickText(page, text, options = {}) {
  const loc = page.getByText(text, { exact: false }).first();
  if (await loc.count() > 0) {
    await loc.click(options);
    return true;
  }
  return false;
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // ── 1. Dashboard overview ─────────────────────────────────────────────────
  console.log('[1] Dashboard overview');
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' });
  await sleep(600);
  await capture(page, 2500);

  // ── 2. Singles grid — click sidebar button ────────────────────────────────
  console.log('[2] Singles grid');
  // The sidebar "Singles" button navigates with router state
  // Use evaluate to trigger the navigation the same way the button does
  await page.evaluate(() => {
    window.__playwrightClickSingles = true;
    // Find and click the Singles button
    const btns = [...document.querySelectorAll('button, a')];
    const singlesBtn = btns.find(b => b.textContent?.trim() === 'Singles' || b.textContent?.includes('Singles'));
    if (singlesBtn) singlesBtn.click();
  });
  await sleep(800);
  await capture(page, 2000);

  // ── 3. Open first video card ───────────────────────────────────────────────
  console.log('[3] Video detail — Transcript tab');
  await page.evaluate(() => {
    // Find the first clickable video card title/body (not icon buttons)
    const cards = document.querySelectorAll('[data-video-id], .group, article');
    if (cards[0]) {
      const title = cards[0].querySelector('p, h3, h4');
      if (title) title.click();
    }
  });
  await sleep(300);
  // Fallback: click whatever looks like the first card body
  const cardEls = page.locator('p').filter({ hasText: /onboarding|product|brand|hiring|finance/i }).first();
  if (await cardEls.count() > 0) {
    await cardEls.click();
    await sleep(700);
  }
  // Ensure Transcript tab
  const transcriptTab = page.locator('button, span, p').filter({ hasText: /^Transcript$/ }).first();
  if (await transcriptTab.count() > 0) { await transcriptTab.click(); await sleep(400); }
  await capture(page, 3000);

  // ── 4. Caption tab ────────────────────────────────────────────────────────
  console.log('[4] Caption tab');
  const captionTab = page.locator('button, span, p').filter({ hasText: /^Caption$/ }).first();
  if (await captionTab.count() > 0) { await captionTab.click(); await sleep(400); }
  await capture(page, 3000);

  // ── 5. Prompts tab ────────────────────────────────────────────────────────
  console.log('[5] Prompts tab');
  const promptsTab = page.locator('button, span, p').filter({ hasText: /^Prompts$/ }).first();
  if (await promptsTab.count() > 0) { await promptsTab.click(); await sleep(400); }
  await capture(page, 2500);

  // ── 6. Discover ───────────────────────────────────────────────────────────
  console.log('[6] Discover');
  await page.goto(`${BASE}/discover`, { waitUntil: 'networkidle' });
  await sleep(700);
  await capture(page, 2000);

  // ── 7. Videos ─────────────────────────────────────────────────────────────
  console.log('[7] Videos');
  await page.goto(`${BASE}/videos`, { waitUntil: 'networkidle' });
  await sleep(700);
  await capture(page, 2000);

  // ── 8. Profiles ───────────────────────────────────────────────────────────
  console.log('[8] Profiles');
  await page.goto(`${BASE}/profiles`, { waitUntil: 'networkidle' });
  await sleep(700);
  await capture(page, 2000);

  // ── 9. Prompt Base ────────────────────────────────────────────────────────
  console.log('[9] Prompt Base');
  await page.goto(`${BASE}/prompts`, { waitUntil: 'networkidle' });
  await sleep(700);
  await capture(page, 2000);

  // ── 10. Dashboard outro ───────────────────────────────────────────────────
  console.log('[10] Dashboard outro');
  await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' });
  await sleep(600);
  await capture(page, 2500);

  await browser.close();

  const duration = (fi / FPS).toFixed(1);
  console.log(`\n✅ ${fi} frames → ${duration}s at ${FPS}fps`);
  console.log(`\nAssemble command:`);
  console.log(`  ffmpeg -r ${FPS} -i ${OUT_DIR}/frame-%05d.png -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart tokscript-demo.mp4`);
})();
