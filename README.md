# SCRAPYARD SHUTDOWN

Play at https://tront.xyz/scrapyard/ .

A desktop first-person action game by Trent Sterling. Fight through a generated industrial yard, disable three breakers, then reach the shutdown terminal. Eight mixed enemy roles, finite ammunition, a charged wrench, destructible cover, and physical robot wrecks.

This repository is the public runtime release of v0.34. `game.html` is self-contained and playable offline; `index.html` adds controls, version, download and credits. Open the game in a current desktop browser with WebGL enabled. Keyboard and mouse required.

Controls: WASD move, Shift sprint, mouse aim, left click fire, R reload, right click wrench (hold/release to charge), hold E at a breaker lever, E at the final terminal, Escape pause, N new layout from title/ending screens. Drag/arrow aiming is available if mouse lock is denied.

Third-party dependency notices are in `licenses/` and linked from `credits.html`. These licenses apply to the corresponding libraries, not the original game content.

## v0.34

Adds a one-triangle procedural sky with drifting clouds, horizon haze and an aligned sun. Charged wrench hits now deal 72 damage and have a charge-ready cue. Existing interiors are unchanged. The launch page forwards seed/debug parameters and uses a versioned game URL.

Verified with the existing source regression suite, sky resource/depth tests, matched browser captures, and complete objective-loop checks on seeds 42, 1337 and 9001. Measured sky overhead: one draw call and one triangle; two noise texture samples. `release.json` records the exact runtime checksum.
