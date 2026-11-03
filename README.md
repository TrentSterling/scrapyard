# SCRAPYARD SHUTDOWN

Play at https://tront.xyz/scrapyard/ .

A desktop first-person action game by Trent Sterling. Fight through a generated industrial yard, disable three breakers, then reach the shutdown terminal. Eight mixed enemy roles, finite ammunition, a charged wrench, destructible cover, and physical robot wrecks.

This repository is the public runtime release of v0.41. `game.html` is self-contained and playable offline; `index.html` adds controls, version, download and credits. Open the game in a current desktop browser with WebGL enabled. Keyboard and mouse required.

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

## v0.37: Living yard and combat feedback

The approved v0.36 WHACKO sky shader and noise are unchanged. Broad outdoor-only cloud-light modulation is separate from fixture lighting and emission. Two short-lived, room-clipped diffuse pulses illuminate muzzle and impact events without shadow maps or another lighting pass. Breakers dim their circuits to 22% emergency output and coast down three authored wall-fan rotors. Fans mount to validated permanent wall spans rather than doorways.

Hold LMB to fire at the existing cadence. Space performs a short collision-safe directional dodge with a 1.25-second recharge; it is not invulnerability. Movement has quick acceleration and firm braking, viewmodel sway is restrained, and shots gain layered audio and a six-lobed opaque flash. Five-second kill chains, breaker points and completion ranks support local per-seed high scores. Damage and authoritative hit ordering are unchanged.

Performance work: a capped 96-instance opaque spark pool replaces per-spark meshes; HUD glyphs and colors are cached and streamed to persistent buffers. The added lighting runs inside existing materials with one filtered cookie sample and two bounded pulses. In the matched idle view, fans add four visible draws and 1544 triangles (126 to 130 draws). This is not a hardware FPS claim.

Validation: all 22 existing regression entry points, original sky contracts, eight new lighting/movement/resource tests, 360 solid fan placements across 120 seeds, four real browser input checks, 27 objective-loop checks across three seeds, and GPU pixel isolation/reset checks. `verification/v037-qualification.json` retains the compact results.

Debug comparisons: `?fx=off` disables added world lighting/fans; `?weather=off` disables cloud modulation but keeps fixed sky fill; `?weather=debug` exaggerates it. The lighting uses room/roof exposure, not accurate per-object or visible-cloud shadows.

## v0.38: Tactical movement and four map families

Enemies coordinate a pressure actor with reserved flanking positions, share observations locally, and investigate the last known position after losing sight. A small bounded goal planner and cached heap-A* navigation select and reach those positions. Existing weapon windups, locked aim, damage, cover checks and projectile behavior are retained. Friendly lanes are checked before firing.

Drones accelerate, bank, brake and change altitude with swept collision and sensor compensation. This is an inertial kinematic controller, not full rotor aerodynamics. Ground steering adds acceleration, separation and bounded turning.

Map families: Cinder Works, Transfer Depot, Reactor Court and Dogleg Foundry. Different room footprints and connections replace the old fixed six-room arrangement. Fresh launches randomize the seed, explicit query/hash seeds replay, N guarantees a different family, and retry keeps the current map. A title-screen floorplan makes the map visible before starting.

The approved WHACKO sky/noise and v0.37 lighting/weapon/player-feel modules are unchanged. Qualification passed the original 22 regression entry points, 29 attack/collision checks, 261-seed layout validation, planner/flight/perception tests and 54 built-in objective checks on six seeds. Rendered squad tests observed flanking, firing, banking, altitude changes, collision clearance, pause and last-known-position search. Chromium/SwiftShader evidence is not a hardware FPS claim.

## v0.39: Breach combat

G throws a bouncing grenade (three initially, one restored per breaker, maximum four). Fuel barrels arm after damage and explode on a short delay; chains are queued. Intact cover blocks blast damage, including damage to the player. Crates and portable generators are destructible, and crates return four reserve rounds. Player and enemy projectiles share the cover-damage path.

The four map families now have multiple marked, destructible service-wall bays and additional open doorways where space allows. Breaking a bay removes its lower mesh, raycasts, physics and navigation obstruction while retaining the lintel. Structural borders, floors, roofs, large landmarks and objectives remain intact. These are authored destructible sections, not unrestricted runtime CSG.

Ranged enemies use actual hide/peek pairs, short movement bounds, suppression and grenade evasion. Ordinary bullet flinches are shorter and cannot retrigger on every gun shot; heavy hits retain stagger. Tactical stop distances now agree with the existing weapon state machines. The approved sky, lighting and player dodge are unchanged.

Qualification passed the original regression suite, existing attack contracts, 195 seeded layout tests, 32 authored wall-cut cases, and 36 built-in objective checks across four rendered maps. The 195 sampled seeds all retained at least two breach bays, six fuel barrels and 19 breakable cover objects; these are measured sample minima, not a claim about every possible seed. Actual browser tests verified three shots opening a usable wall breach, keyboard G, fuel detonation, full reset, pause, a guard peeking/firing from real crate cover, and a cutter reaching and hitting a stationary target.

Grenades and explosion flashes use fixed four-slot pools. Sparks and physical fracture debris retain their existing caps. Added clutter and separate wall pieces cost rendering work; software-renderer correctness checks are not a hardware FPS benchmark.

## v0.40: Encounter and blast fixes

Enemies transition from lost-sight cover peeks into investigation rather than remaining stuck. Evasion considers overlapping blast zones when selecting a destination. Intact cover also blocks explosion impulses to physical objects, using the same pre-destruction cover state as blast damage.

The final runtime passed automated qualification. Automated ordinary-encounter runs are observations, not proof that combat is fun. The blast-cover fixture and overlapping-evasion tests are focused checks rather than exhaustive gameplay proofs. Software-renderer checks do not measure native GPU performance; human playtesting remains separate.

## v0.41: Useful breach routes

Marked service bays are checked after doors, columns and props are placed. Clear openings are favored when they reduce the local detour around the wall; bays blocked by another intact wall are rejected. Scoring is deterministic and bounded, with a safe fallback when no better opening is available.

Qualification includes 195 sampled seeds and 1,084 bays, independent reference-search comparisons, five controlled player crossings across all four map families, and ordinary automated hostile-contact traversal on four seeds. The grid score measures bay-side detours, not objective-route savings. Controlled crossings position the player near a bay with enemies disabled. These checks are not a human playtest, proof of enjoyable combat, or a native GPU benchmark. The approved WHACKO sky/noise, lighting, dodge and weapon feedback are unchanged.

