/**
 * demo-produce.mjs — Polished demo video with labels, transitions, Ken Burns, scrolling.
 * Uses Playwright for text rendering (no drawtext needed).
 * Run: node demo-produce.mjs
 */

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const BASE  = 'http://localhost:3000';
const FPS   = 30;
const W     = 1440;
const H     = 900;
const CLIPS = './demo-clips';
const OUT   = 'tokscript-demo-v2.mp4';

if (fs.existsSync(CLIPS)) fs.rmSync(CLIPS, { recursive: true });
fs.mkdirSync(CLIPS, { recursive: true });

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── ffmpeg wrapper ────────────────────────────────────────────────────────────
function ffrun(args, label = '') {
  const result = spawnSync('ffmpeg', ['-y', ...args], { encoding: 'utf8' });
  if (result.status !== 0) {
    console.error(`ffmpeg failed${label ? ' (' + label + ')' : ''}:\n`, result.stderr?.slice(-600));
    process.exit(1);
  }
}

// ── Render an HTML slide to a static mp4 clip (via Playwright screenshot) ────
async function htmlClip(page, html, dur, outFile, label = '') {
  const tmpPng = outFile.replace('.mp4', '-slide.png');
  await page.setViewportSize({ width: W, height: H });
  await page.setContent(html, { waitUntil: 'load' });
  await sleep(200);
  await page.screenshot({ path: tmpPng, fullPage: false });

  ffrun([
    '-loop', '1', '-i', tmpPng,
    '-vf', `fade=t=in:st=0:d=0.4,fade=t=out:st=${(dur - 0.4).toFixed(2)}:d=0.4`,
    '-t', String(dur),
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', outFile,
  ], label);

  console.log(`  ✓ ${path.basename(outFile)} (${dur}s) — ${label}`);
  return dur;
}

// ── Render a label PNG using Playwright ───────────────────────────────────────
async function renderLabel(page, text, outFile) {
  await page.setViewportSize({ width: 500, height: 60 });
  await page.setContent(`<!DOCTYPE html>
<html><body style="margin:0;background:transparent;display:flex;align-items:center;justify-content:flex-start;padding:10px 0">
  <div style="background:rgba(0,0,0,0.62);color:white;font:500 19px/1 -apple-system,Helvetica Neue,sans-serif;
              padding:9px 18px;border-radius:100px;display:inline-block;letter-spacing:-0.01em;white-space:nowrap">
    ${text}
  </div>
</body></html>`, { waitUntil: 'load' });
  await sleep(100);
  await page.screenshot({ path: outFile, fullPage: false, omitBackground: true });
}

// ── Convert frame dir to zoompan clip with optional label overlay ─────────────
async function framesClip(page, framesDir, outFile, sectionLabel, frameCount) {
  const dur = frameCount / FPS;
  const zInc = (0.04 / frameCount).toFixed(7);
  const zoompan = `zoompan=z='min(zoom+${zInc},1.04)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frameCount}:s=${W}x${H}:fps=${FPS}`;

  if (sectionLabel) {
    const labelPng = path.join(CLIPS, `label-${path.basename(outFile, '.mp4')}.png`);
    await renderLabel(page, sectionLabel, labelPng);
    ffrun([
      '-r', String(FPS), '-i', path.join(framesDir, 'f%05d.png'),
      '-i', labelPng,
      '-filter_complex', `[0:v]${zoompan}[base];[1:v]format=rgba[lbl];[base][lbl]overlay=32:H-56[out]`,
      '-map', '[out]',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18',
      '-t', String(dur), outFile,
    ], sectionLabel);
  } else {
    ffrun([
      '-r', String(FPS), '-i', path.join(framesDir, 'f%05d.png'),
      '-vf', zoompan,
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18',
      '-t', String(dur), outFile,
    ], 'no label');
  }

  console.log(`  ✓ ${path.basename(outFile)} (${dur.toFixed(1)}s)`);
  return dur;
}

// ── Section capture helper ────────────────────────────────────────────────────
async function captureSection(page, dir, captureFn) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  let fi = 0;

  const shot = async (holdMs = 33) => {
    const file = path.join(dir, `f${String(fi).padStart(5,'0')}.png`);
    await page.screenshot({ path: file, fullPage: false });
    const extra = Math.round((holdMs / 1000) * FPS) - 1;
    for (let i = 1; i <= extra; i++)
      fs.copyFileSync(file, path.join(dir, `f${String(fi+i).padStart(5,'0')}.png`));
    fi += extra + 1;
  };

  await captureFn(page, shot);
  return fi;
}

// ── Assemble clips with xfade transitions ────────────────────────────────────
function assembleWithXfade(clips) {
  // clips: [{dur, file}]
  const TRANS = 0.4;
  const N = clips.length;
  const inputs = clips.map(c => ['-i', c.file]).flat();

  let filterParts = [];
  let offset = 0;
  let prevLabel = '0:v';

  for (let i = 1; i < N; i++) {
    offset += clips[i-1].dur - TRANS;
    const nextLabel = i === N - 1 ? 'vfinal' : `v${i}`;
    filterParts.push(
      `[${prevLabel}][${i}:v]xfade=transition=fade:duration=${TRANS}:offset=${offset.toFixed(3)}[${nextLabel}]`
    );
    prevLabel = nextLabel;
  }

  // Final fade out
  const totalDur = clips.reduce((s, c) => s + c.dur, 0) - TRANS * (N - 1);
  filterParts.push(
    `[vfinal]fade=t=out:st=${(totalDur - 0.6).toFixed(2)}:d=0.6[vout]`
  );

  ffrun([
    ...inputs,
    '-filter_complex', filterParts.join(';'),
    '-map', '[vout]',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17',
    '-movflags', '+faststart',
    OUT,
  ], 'final assembly');

  return totalDur;
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
(async () => {
  console.log('\n🎬 Starting demo production...\n');

  const browser = await chromium.launch({ headless: true });
  const appCtx  = await browser.newContext({ viewport: { width: W, height: H } });
  const appPage = await appCtx.newPage();

  // Separate context for label rendering (small viewport)
  const uiCtx   = await browser.newContext({ viewport: { width: 500, height: 60 } });
  const uiPage  = await uiCtx.newPage();

  const clips = []; // { dur, file }

  // ───────────────────────────────────────────────────────────────────────────
  // 0. Title card
  // ───────────────────────────────────────────────────────────────────────────
  console.log('[0] Title card');
  const titleFile = path.join(CLIPS, '00-title.mp4');
  const titleDur = await htmlClip(uiPage, `<!DOCTYPE html>
<html><body style="margin:0;width:${W}px;height:${H}px;background:#0d0d0d;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px">
  <div style="font:-apple-system-ui-serif,ui-serif,serif;font-size:72px;font-weight:700;
              color:white;letter-spacing:-0.04em;font-family:-apple-system,Helvetica Neue,sans-serif">
    tokscript
  </div>
  <div style="font-size:23px;color:rgba(255,255,255,0.52);font-family:-apple-system,Helvetica Neue,sans-serif;
              font-weight:400;letter-spacing:0.01em">
    AI transcript studio for creators
  </div>
</body></html>`, 2.8, titleFile, 'Title');
  clips.push({ dur: titleDur, file: titleFile });

  // ───────────────────────────────────────────────────────────────────────────
  // 1. Dashboard overview — scroll slowly
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n[1] Dashboard overview');
  const d1dir = path.join(CLIPS, 's01');
  const d1n = await captureSection(appPage, d1dir, async (pg, shot) => {
    await pg.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' });
    await sleep(400);
    await shot(900);
    for (let i = 0; i < 6; i++) { await pg.mouse.wheel(0, 130); await sleep(60); await shot(60); }
    await shot(700);
    for (let i = 0; i < 6; i++) { await pg.mouse.wheel(0, -130); await sleep(60); await shot(60); }
    await shot(600);
  });
  const d1file = path.join(CLIPS, '01-dashboard.mp4');
  const d1dur = await framesClip(uiPage, d1dir, d1file, 'Dashboard', d1n);
  clips.push({ dur: d1dur, file: d1file });

  // ───────────────────────────────────────────────────────────────────────────
  // 2. Singles library — scroll grid, hover card
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n[2] Transcript Library');
  const d2dir = path.join(CLIPS, 's02');
  const d2n = await captureSection(appPage, d2dir, async (pg, shot) => {
    await pg.evaluate(() => {
      const btn = [...document.querySelectorAll('button, a')].find(b => b.textContent?.trim() === 'Singles');
      if (btn) btn.click();
    });
    await sleep(500);
    await shot(800);
    for (let i = 0; i < 5; i++) { await pg.mouse.wheel(0, 180); await sleep(70); await shot(70); }
    await shot(600);
    for (let i = 0; i < 5; i++) { await pg.mouse.wheel(0, -180); await sleep(70); await shot(70); }
    await shot(500);
  });
  const d2file = path.join(CLIPS, '02-singles.mp4');
  const d2dur = await framesClip(uiPage, d2dir, d2file, 'Transcript Library', d2n);
  clips.push({ dur: d2dur, file: d2file });

  // ───────────────────────────────────────────────────────────────────────────
  // 3. Detail panel — Transcript tab (scroll content)
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n[3] Detail — Transcript Tab');
  const d3dir = path.join(CLIPS, 's03');
  const d3n = await captureSection(appPage, d3dir, async (pg, shot) => {
    const card = pg.locator('p').filter({ hasText: /onboarding|product|brand|hiring|finance/i }).first();
    if (await card.count() > 0) { await card.click(); await sleep(500); }
    const tTab = pg.locator('button, span').filter({ hasText: /^Transcript$/ }).first();
    if (await tTab.count() > 0) { await tTab.click(); await sleep(300); }
    await shot(700);
    // Scroll inside the transcript text (right panel)
    for (let i = 0; i < 7; i++) { await pg.mouse.wheel(850, 500, { deltaY: 110 }); await sleep(65); await shot(65); }
    await shot(700);
    for (let i = 0; i < 4; i++) { await pg.mouse.wheel(850, 500, { deltaY: -110 }); await sleep(65); await shot(65); }
    await shot(500);
  });
  const d3file = path.join(CLIPS, '03-transcript.mp4');
  const d3dur = await framesClip(uiPage, d3dir, d3file, 'Transcript Tab', d3n);
  clips.push({ dur: d3dur, file: d3file });

  // ───────────────────────────────────────────────────────────────────────────
  // 4. Caption tab — scroll to metadata
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n[4] Caption Tab');
  const d4dir = path.join(CLIPS, 's04');
  const d4n = await captureSection(appPage, d4dir, async (pg, shot) => {
    const cTab = pg.locator('button, span').filter({ hasText: /^Caption$/ }).first();
    if (await cTab.count() > 0) { await cTab.click(); await sleep(350); }
    await shot(600);
    for (let i = 0; i < 5; i++) { await pg.mouse.wheel(850, 500, { deltaY: 100 }); await sleep(65); await shot(65); }
    await shot(600);
    for (let i = 0; i < 5; i++) { await pg.mouse.wheel(850, 500, { deltaY: -100 }); await sleep(65); await shot(65); }
    await shot(500);
  });
  const d4file = path.join(CLIPS, '04-caption.mp4');
  const d4dur = await framesClip(uiPage, d4dir, d4file, 'Caption Tab', d4n);
  clips.push({ dur: d4dur, file: d4file });

  // ───────────────────────────────────────────────────────────────────────────
  // 5. AI Prompts tab
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n[5] AI Prompts Tab');
  const d5dir = path.join(CLIPS, 's05');
  const d5n = await captureSection(appPage, d5dir, async (pg, shot) => {
    const pTab = pg.locator('button, span').filter({ hasText: /^Prompts$/ }).first();
    if (await pTab.count() > 0) { await pTab.click(); await sleep(350); }
    await shot(700);
    for (let i = 0; i < 4; i++) { await pg.mouse.wheel(850, 500, { deltaY: 110 }); await sleep(70); await shot(70); }
    await shot(700);
  });
  const d5file = path.join(CLIPS, '05-prompts.mp4');
  const d5dur = await framesClip(uiPage, d5dir, d5file, 'AI Prompts', d5n);
  clips.push({ dur: d5dur, file: d5file });

  // ───────────────────────────────────────────────────────────────────────────
  // 6. Discover
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n[6] Discover');
  const d6dir = path.join(CLIPS, 's06');
  const d6n = await captureSection(appPage, d6dir, async (pg, shot) => {
    await pg.goto(`${BASE}/discover`, { waitUntil: 'networkidle' });
    await sleep(500);
    await shot(700);
    for (let i = 0; i < 4; i++) { await pg.mouse.wheel(0, 160); await sleep(80); await shot(80); }
    await shot(600);
  });
  const d6file = path.join(CLIPS, '06-discover.mp4');
  const d6dur = await framesClip(uiPage, d6dir, d6file, 'Discover', d6n);
  clips.push({ dur: d6dur, file: d6file });

  // ───────────────────────────────────────────────────────────────────────────
  // 7. Videos
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n[7] Videos');
  const d7dir = path.join(CLIPS, 's07');
  const d7n = await captureSection(appPage, d7dir, async (pg, shot) => {
    await pg.goto(`${BASE}/videos`, { waitUntil: 'networkidle' });
    await sleep(500);
    await shot(700);
    for (let i = 0; i < 5; i++) { await pg.mouse.wheel(0, 150); await sleep(70); await shot(70); }
    await shot(600);
  });
  const d7file = path.join(CLIPS, '07-videos.mp4');
  const d7dur = await framesClip(uiPage, d7dir, d7file, 'Videos', d7n);
  clips.push({ dur: d7dur, file: d7file });

  // ───────────────────────────────────────────────────────────────────────────
  // 8. Creator Profiles
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n[8] Creator Profiles');
  const d8dir = path.join(CLIPS, 's08');
  const d8n = await captureSection(appPage, d8dir, async (pg, shot) => {
    await pg.goto(`${BASE}/profiles`, { waitUntil: 'networkidle' });
    await sleep(500);
    await shot(700);
    for (let i = 0; i < 3; i++) { await pg.mouse.wheel(0, 120); await sleep(80); await shot(80); }
    await shot(600);
  });
  const d8file = path.join(CLIPS, '08-profiles.mp4');
  const d8dur = await framesClip(uiPage, d8dir, d8file, 'Creator Profiles', d8n);
  clips.push({ dur: d8dur, file: d8file });

  // ───────────────────────────────────────────────────────────────────────────
  // 9. Outro card
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n[9] Outro');
  const outroFile = path.join(CLIPS, '09-outro.mp4');
  const outroDur = await htmlClip(uiPage, `<!DOCTYPE html>
<html><body style="margin:0;width:${W}px;height:${H}px;background:#0d0d0d;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px">
  <div style="font-size:60px;font-weight:700;color:white;letter-spacing:-0.04em;
              font-family:-apple-system,Helvetica Neue,sans-serif">tokscript</div>
  <div style="font-size:20px;color:rgba(255,255,255,0.42);font-family:-apple-system,Helvetica Neue,sans-serif">
    tokscript.io
  </div>
</body></html>`, 2.5, outroFile, 'Outro');
  clips.push({ dur: outroDur, file: outroFile });

  await browser.close();

  // ── Assemble ───────────────────────────────────────────────────────────────
  console.log('\n🔗 Assembling with crossfade transitions...');
  const totalDur = assembleWithXfade(clips);

  const sizeMB = (fs.statSync(OUT).size / 1024 / 1024).toFixed(1);
  console.log(`\n✅  ${OUT}`);
  console.log(`   Duration: ${totalDur.toFixed(1)}s  |  Size: ${sizeMB}MB`);
  console.log(`   Open: open ${OUT}\n`);

  function assembleWithXfade(clips) {
    const TRANS = 0.4;
    const N = clips.length;
    const inputs = clips.map(c => ['-i', c.file]).flat();
    let filterParts = [];
    let offset = 0;
    let prevLabel = '0:v';

    for (let i = 1; i < N; i++) {
      offset += clips[i-1].dur - TRANS;
      const nextLabel = i === N - 1 ? 'vfinal' : `v${i}`;
      filterParts.push(
        `[${prevLabel}][${i}:v]xfade=transition=fade:duration=${TRANS}:offset=${offset.toFixed(3)}[${nextLabel}]`
      );
      prevLabel = nextLabel;
    }

    const totalDur = clips.reduce((s, c) => s + c.dur, 0) - TRANS * (N - 1);
    filterParts.push(
      `[vfinal]fade=t=out:st=${(totalDur - 0.6).toFixed(2)}:d=0.6[vout]`
    );

    ffrun([
      ...inputs,
      '-filter_complex', filterParts.join(';'),
      '-map', '[vout]',
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17',
      '-movflags', '+faststart',
      OUT,
    ], 'final assembly');

    return totalDur;
  }
})();
