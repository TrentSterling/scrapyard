import {chromium} from 'playwright';
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';

const release = JSON.parse(await fs.readFile('release.json', 'utf8'));
const out = 'live-evidence';
await fs.mkdir(out, {recursive: true});
const report = {passed: false, version: release.version, expectedHash: release.sha256, errors: []};
let browser;
try {
  for (let attempt = 0; attempt < 24; attempt++) {
    try {
      const response = await fetch('https://tront.xyz/scrapyard/game.html?verify=' + Date.now(), {signal: AbortSignal.timeout(15000)});
      assert.equal(response.status, 200);
      report.liveHash = createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex');
      if (report.liveHash === release.sha256) break;
    } catch (error) {report.lastFetchError = error.message;}
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  assert.equal(report.liveHash, release.sha256, 'Deployed runtime must match the qualified artifact byte for byte');
  browser = await chromium.launch({headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--no-sandbox']});
  const page = await browser.newPage({viewport: {width: 1280, height: 758}});
  page.on('pageerror', e => report.errors.push(e.message));
  page.on('console', m => {if (m.type() === 'error') report.errors.push(m.text());});
  await page.addInitScript(() => {
    window.__testFrame = null;
    window.__testNow = 0;
    window.requestAnimationFrame = callback => {
      if (!window.__testFrame) window.__testNow = performance.now();
      window.__testFrame = callback;
      return 1;
    };
    window.__testDraw = () => window.__testFrame(window.__testNow);
  });
  await page.goto('https://tront.xyz/scrapyard/?verify=' + Date.now() + '#seed=1337');
  await page.waitForFunction(() => document.querySelector('iframe')?.contentWindow?.__game?.ready, {}, {polling: 100, timeout: 120000});
  assert.ok((await page.locator('header').innerText()).includes('v' + release.version));
  const frame = page.frames().find(f => /\/game\.html/.test(f.url()));
  assert.ok(frame, 'Game iframe exists');
  report.state = await frame.evaluate(() => ({seed: __game.state.level.seed, sky: __game.state.sky, renderFailureCount: __game.state.renderFailureCount}));
  assert.equal(report.state.seed, 1337, 'Seed hash is forwarded');
  assert.equal(report.state.sky.enabled, true);
  await frame.evaluate(() => {
    __game.reset(); __game.resume();
    const room = __game.state.level.rooms.find(r => !r.roof);
    __game.setPlayer(room.x, room.z + room.d * .22, 0, .23);
    __testDraw();
  });
  await page.screenshot({path: out + '/live-courtyard.png', timeout: 120000});
  report.state.renderFailureCount = await frame.evaluate(() => __game.state.renderFailureCount);
  assert.equal(report.state.renderFailureCount, 0);
  assert.equal(report.errors.length, 0, report.errors.join('\n'));
  report.passed = true;
  console.log(JSON.stringify(report, null, 2));
} finally {
  await fs.writeFile(out + '/report.json', JSON.stringify(report, null, 2));
  await browser?.close();
}
