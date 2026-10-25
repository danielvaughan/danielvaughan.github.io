# Vendored JSSpeccy 3.2 and its two patches

`jsspeccy/` is JSSpeccy 3.2 (2024-11-23) by Matt Westcott, GPL-3.0 (see `jsspeccy/COPYING`,
`jsspeccy/CHANGELOG.md`, `jsspeccy/README.md`). It was copied from
`mower-mayhem-128k-v2/.tools/jsspeccy/` without `jsspeccy-core.wasm.map` (956 KB, debug only).

## Patch 1: expose the emulator (jsspeccy.js)

In `jsspeccy/jsspeccy.js`, the unique string

    this.msPerFrame=20,

was replaced with

    this.msPerFrame=20,window.__zxEmu=this,

so the page can reach the `Emulator` instance.
To re-apply after an upgrade, check the string still occurs exactly once (the unit test
`test_patch_applied` checks this).

## Patch 2: memory/PC peek (jsspeccy-worker.js)

The emulator core runs in a Web Worker and JSSpeccy 3.2 has no message that reads memory or
registers back, but the WASM core already exports `peek(addr)` (through the current paging),
`getPC()` and `getTStates()`. In `jsspeccy/jsspeccy-worker.js`, the unique string

    default:console.log("message received by worker:",e.data)

was prefixed with one extra `case`:

    case"peek":postMessage({message:"peekResult",id:e.data.id,pc:o.getPC(),tstates:o.getTStates(),bytes:e.data.addrs.map((q=>o.peek(q)))});break;

(`o` is the worker's core-exports variable, set by `loadCore`.) The worker handles messages in
order, so a `peek` posted after a stepped frame's `frameCompleted` reads the state at that frame
boundary. `harness.js` wraps the host's `worker.onmessage` so `peekResult` is not logged as an
unknown message. `test_worker_peek_patch_applied` checks the patch. Nothing else in the vendored
files changed.

## JSSpeccy internals the harness relies on

| What | Where in jsspeccy.js | Used by |
| --- | --- | --- |
| `emu.msPerFrame` (20 = 50 fps) | Emulator constructor; read by `runAnimationFrame` and the `frameCompleted` handler | `zx.speed(pct)` sets `20*100/pct` and resets `nextFrameTime` |
| `emu.pause()` | sets `isRunning=false`, unbinds the keyboard listeners (`keyboardHandler.stop()`), stops audio | `zx.pause()`, `zx.step()` |
| `emu.start()` | sets `isRunning`, rebinds keyboard, restarts audio and the rAF loop | `zx.resume()` |
| `emu.runFrame()` | sets `isExecutingFrame=true`, posts `{message:'runFrame', frameBuffer}` to the worker | `zx.step()` |
| worker `{message:'frameCompleted'}` | host `worker.onmessage`; when paused it only clears `isExecutingFrame` | harness listens with `worker.addEventListener('message')` to count frames and to await each stepped frame before the next |
| `emu.displayHandler.readyToShow()/show()` | the rAF loop paints the last frame; it is not running while paused | harness calls it after `step()` and in `screenshot()` |
| `emu.canvas` | 320x240 2D canvas (shown at zoom 2) | `zx.screenshot()` uses `toDataURL` |
| keyboard root | `setKeyboardEventRoot(appContainer)`; listeners on `keydown`/`keyup` map `keyCode` through the standard key table | `zx.keyDown/keyUp` dispatch `KeyboardEvent` on the canvas, which bubbles to the root (same approach as mower-mayhem `emulator.html`) |
| worker key messages `{message:'keyDown', row, mask}` and `{message:'keyUp', row, mask}` | `Rr.sendKeyMessage`, called from `keyboardHandler.keydownHandler/keyupHandler` | while paused the listeners are unbound (`keyboardHandler.eventsAreBound === false`), so the harness calls `keyboardHandler.keydownHandler(ev)` / `keyupHandler(ev)` directly; these post `keyDown`/`keyUp` straight to the worker, so key state holds across `step()` |
| worker `{message:'fileOpened', mediaType:'snapshot'}` | with `autoLoadTapes`, after the tape opens JSSpeccy loads `tapeloaders/tape_<machine>.szx` (the machine waiting at `LOAD ""`) | harness records `loaderFrame`; `&hold=1` pauses there; `replay()` counts from here |
| worker `peek` / `peekResult` (patch 2) | see above | `zx.peek()`, `zx.peekWord()`, `zx.pc()`, `zx.replay()` |
| `alert()` on file-open failure | `openUrlList(...).catch(e => alert(e))` | harness overrides `window.alert` to show the `#zx-error` banner |

`fetch()` does not fail on 404, so JSSpeccy would try to parse the 404 page as a tape; the
harness fetches the tap first and shows `#zx-error` instead of starting the emulator.

## Harness notes

- `zx.saveScreenshot(name)` PUTs `zx.screenshot()` to `/media/<name>.png`; `playtest_server.py` writes
  `<game_dir>/playtest/media/<name>.png` (name `^[A-Za-z0-9_.-]+\.png$`, PNG only, at most 2 MB).
- `zx.ready` resolves once JSSpeccy has opened the tap and called `start()` (its own `onReady`
  fires earlier, before the tap is open). It rejects if the tap 404s, the page is on `file://`,
  or JSSpeccy reports an error.
- JSSpeccy's click-to-start overlay button is hidden with CSS (it covers the screen while
  paused); the page has its own pause/step/speed buttons.
- `speed()` above 100% is limited by the rAF/frame-completed loop: 200% measured about 90 fps
  headless, not 100. Use `step(n)` when exact frame counts matter.
- Headless testing: `--screenshot`/`--dump-dom` capture at the load event, and
  `--virtual-time-budget` lets virtual time run past the worker/WASM boot, so a `--screenshot`
  shows JSSpeccy still paused at frame 0 (the play overlay made the old "not one colour" check
  pass falsely). `tests/unit/test_harness.py` therefore drives a real-time headless Chrome over
  CDP (`tests/unit/cdp.py`, stdlib only). `--dump-dom` is still fine for the error banner tests,
  since a pending fetch holds virtual time.

## Deterministic replay (`zx.replay`)

Why counting from page load drifts: JSSpeccy starts running the ROM before the tap and the
tape-loader snapshot have been fetched, so the number of frames before the loader snapshot (and
hence before the game's code starts) depends on network timing; agent playtests saw 10-12 frames
of spread between page loads. Everything after the loader snapshot is deterministic (tape traps,
fixed snapshot state, no input).

Use it like this:

    http://127.0.0.1:<port>/harness/harness.html?tap=/build/<game>-m<N>.tap&machine=128&hold=1
    const r = await zx.replay(recipe, {screenshots: 'm2-r1-replay', expect: {...}});

- `&hold=1` pauses the emulator the moment the loader snapshot is in (`zx.ready` then resolves
  paused, `status().loaderFrame` set). Without it `replay()` still works if called before the game
  starts, and rejects with "game code is already running" otherwise.
- **Alignment rule (default `align: 'pc'`)**: step one frame at a time from the loader snapshot and
  peek PC at each frame boundary. Before `RANDOMIZE USR start`, PC is only ever in ROM or the
  system-variable area (the 128K ROM's `$5Bxx` paging stubs), never above CLEAR; the first frame
  that ends with PC above CLEAR (`clear` from `/sym.json`) is the frame in which PC reached
  `start`. That frame is **recipe frame 0**.
- **Mapping to run_bot**: run_bot's frame 0 is the partial frame that starts at the tap2sna
  snapshot (PC == `start`) and ends at the next frame boundary; zx_trace counts frames by
  `T // frame_duration` from there and records the `watch` bytes at the end of each frame. In the
  harness recipe frame `r` is the `r`-th full frame after recipe frame 0, and a checkpoint at
  `r` peeks the same bytes at the end of that frame. A key entry `F-G:KEY` is pressed before
  frame F runs and released before frame G+1 runs; like zx_trace only the first entry covering a
  frame applies. Keys listed for frame 0 apply from frame 1 (frame 0 has already run when it is
  detected; `result.warnings` says so). The template recipe in `test_replay_is_deterministic_and_matches_run_bot`
  gives identical HARNESS_* values to run_bot's `frames.json` at every checkpoint.
- `align: {symbol, value, frame}` instead aligns on the first frame boundary at which the byte at
  `symbol` equals `value`, taken to be recipe frame `frame` (e.g. from run_bot's `symbols` /
  `state_trace`); recipe keys at or before that frame are rejected.
- Options: `frames` (default `recipe.frames`), `checkpoints` (default `recipe.screenshots`),
  `watch` (symbol names, default the HARNESS_* bytes; `words` lists the 2-byte ones, default
  HARNESS_updates and HARNESS_score), `screenshots` (prefix: `saveScreenshot('<prefix>-<frame>')`
  per checkpoint), `expect` (`{frame: {symbol: value}}`, mismatches in `result.diverged`; compared only at checkpoint frames, so an expect frame missing from `checkpoints` is added as a checkpoint and noted in `result.warnings`, and one outside the run is warned as unchecked),
  `alignLimit` (default 5000 frames).
- Result: `{alignFrame, loaderOffset, start, startPc, frames, endFrame, checkpoints: [{frame,
  values, pc, screenshot?}], diverged: [{frame, symbol, expected, got}], warnings}`.
  `loaderOffset` (frames from the loader snapshot to recipe frame 0) is constant for a build; a
  different value between runs means the boot was not deterministic.
- Limits: JSSpeccy 3.2 has no Kempston interface, so `K-*` recipe keys are rejected; recipes
  that only name a `policy` (pilot scripts) have no key log to replay; recipes with `pokes`
  (FIXTURE runs: memory written at frame boundaries) are rejected, since the harness has no
  matching write hook (check fixtures in run_bot / verify, and play from cold here); the harness emulates the
  same machine as build.yaml but not run_bot's exact contention, so long runs of games whose
  logic depends on sub-frame timing can still drift from run_bot (the checkpoints will show it).

### Long replays drift: compare checkpoints, then play on

`zx.replay` is exact for **short** replays only. JSSpeccy and SkoolKit's CMIOSimulator (run_bot,
verify, `sim.py`) do not model memory/IO contention and interrupt timing identically, so a
game whose updates depend on sub-frame timing slowly accumulates differences. Tiger Gorilla M4
round 4 (finding F-14): replays of 200-300 frames matched run_bot exactly at every checkpoint,
while 3,000-12,000-frame key logs were 1-2 px off from about frame 300, grew to 20+ px by
frame 2,800 and then lost lives and failed levels the bot completed (`loaderOffset` constant at
16, so the boot was deterministic). Do not try to make the emulators match. For a long recipe:

- give `expect` checkpoints every 100-300 frames (run_bot's `frames.json` values) and read the
  first entry of `result.diverged`: that frame is the **first divergence**; everything up to
  it is the bot's run, reproduced;
- report the replay as matched up to frame F (and the first mismatching symbol and values);
  this is a harness limit, not a game defect, unless the game itself misbehaves before F;
- from F on, the playtester takes over with its own play (pause, look, keys) from the
  diverged state, rather than watching the rest of the key log fail;
- prefer several short recipes (one acceptance check each, under ~1,000 frames) for anything
  the agent must watch replayed; long completion runs are checked by verify (run_bot and
  policies), not by replay.

Other new calls: `zx.peek(addr|symbol[, count])` (byte or array, current paging),
`zx.peekWord(addr|symbol)`, `zx.pc()`, `zx.symbols()` (the `/sym.json` that `playtest_server.py`
serves: `{tap, milestone, machine, start, clear, sha256, symbols}` from `build-m<N>.json` and the
`.sym`).

## Manual check

2026-10-18, Claude in Chrome (real Chrome window), template built with
`build_game.build(game, 1)` and served by `playtest_server.py --port 8790`:

- `await zx.ready` resolved, running; after ~4 s the title screen was up (frame 226).
- `zx.pause()` held at frame 226; `zx.step(50)` -> frame 276 (exact);
  `zx.tap('SPACE', 4)` while paused -> frame 280; `zx.step(100)` -> frame 380.
- Border pixel went from the title's colour cycle to black and the screenshot showed the
  template play screen (black screen, white player square), status line
  `paused | frame 380 | speed 100% (20 ms/frame)`. `zx.screenshot()` returned a PNG data URL.
- `?tap=/build/none.tap`: `#zx-error` read "tap not found: /build/none.tap (HTTP 404). Build the
  game first." and `zx.ready` rejected with the same message.

Result: PASS. The template reaches play from SPACE sent while paused.
