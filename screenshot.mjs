import { chromium } from 'playwright';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const SCREENSHOT_DIR = './temporary screenshots';

// Ensure directory exists
if (!existsSync(SCREENSHOT_DIR)) {
  mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// Get next screenshot number (auto-increment, never overwrite)
function getNextNumber() {
  const files = readdirSync(SCREENSHOT_DIR).filter(f => f.startsWith('screenshot-'));
  const numbers = files.map(f => {
    const match = f.match(/^screenshot-(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  });
  return numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
}

const url = process.argv[2];
const label = process.argv[3];

if (!url) {
  console.error('Usage: node screenshot.mjs <URL> [label]');
  console.error('Example: node screenshot.mjs http://localhost:3000');
  console.error('Example: node screenshot.mjs http://localhost:3000 hero');
  process.exit(1);
}

const num = getNextNumber();
const filename = label
  ? `screenshot-${num}-${label}.png`
  : `screenshot-${num}.png`;
const filepath = join(SCREENSHOT_DIR, filename);

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
});

await page.goto(url, { waitUntil: 'networkidle' });
await page.screenshot({ path: filepath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${filepath}`);
