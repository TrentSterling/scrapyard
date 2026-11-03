# SCRAPYARD SHUTDOWN

Play at https://tront.xyz/scrapyard/ .

A desktop first-person action game by Trent Sterling. Fight through a generated industrial yard, disable three breakers, then reach the shutdown terminal. Eight mixed enemy roles, finite ammunition, a charged wrench, destructible cover, and physical robot wrecks.

This repository is the public runtime release of v0.36. `game.html` is self-contained and playable offline; `index.html` adds controls, version, download and credits. Open the game in a current desktop browser with WebGL enabled. Keyboard and mouse required.

Controls: WASD move, Shift sprint, mouse aim, left click fire, R reload, right click wrench (hold/release to charge), hold E at a breaker lever, E at the final terminal, Escape pause, N new layout from title/ending screens. Drag/arrow aiming is available if mouse lock is denied.

Third-party dependency notices are in `licenses/` and linked from `credits.html`. These licenses apply to the corresponding libraries, not the original game content.

## v0.34

Adds a one-triangle procedural sky with drifting clouds, horizon haze and an aligned sun. Charged wrench hits now deal 72 damage and have a charge-ready cue. Existing interiors are unchanged. The launch page forwards seed/debug parameters and uses a versioned game URL.

Verified with the existing source regression suite, sky resource/depth tests, matched browser captures, and complete objective-loop checks on seeds 42, 1337 and 9001. Measured sky overhead: one draw call and one triangle; two noise texture samples. `release.json` records the exact runtime checksum.

## v0.35

Sky-only upgrade: rounded cloud banks, animated UV displacement, single-offset heightfield parallax, directional relief and sun occlusion. The yard lighting, fog, materials and gameplay are unchanged.

The sky remains one opaque triangle and one draw call. It uses four texture samples instead of two, with one startup-generated 256x256 packed height/gradient/noise texture (349524 bytes with mipmaps). No raymarching, transparent cloud meshes, render targets or additional lights.

All 22 existing regression entry points and 27 gameplay checks across seeds 42, 1337 and 9001 passed in qualification. Matched browser captures retained exactly 57 draw calls and 56069 triangles in the test view; the covered entry was pixel-identical to v0.34. Chromium/SwiftShader tests establish correctness, not hardware GPU frame times.

## v0.36: Original WHACKO cloud ceiling

Corrects v0.35, which shipped the sculpted-cloud substitute rather than the requested SimpleOvercast port. Restores the supplied 512x512 noise pixels, plane projection, two-sample parallax, sag 0.3, depth 2.42, density 6.84 and wind +0.05 UV/sec on both axes. Original linear purple/blue material values are used. The texture is embedded, repeat-wrapped, and bilinear level-zero sampled.

One opaque far-depth triangle, one draw call, two texture samples, no raymarch or extra lights. The game waits for the embedded PNG before becoming ready. This is a sky-only change; gameplay and yard lighting are unchanged.

Verified: all 22 existing regression entry points, 27 built-in checks across three seeds, supplied-noise pixel hash, 1428 GPU/CPU comparisons of original height and Beer attenuation, visible motion over half a second, four-second in-game animation capture, pause behavior and pixel-identical covered interior. Readback maximum error was 0.001967; these are software-renderer correctness checks, not hardware FPS claims.
