# Line Ready: project guide for Claude Code

Line Ready is a vanilla HTML/CSS/JS progressive web app (PWA) for shooters. It is hosted on GitHub Pages and installed to an iPhone Home Screen (iOS 27). It runs locally with no backend; online features are a possible future addition.

Owner: Daniel. Last shipped version: v18 (voice call out fixes: start beep waits for the spoken call out; utterance kept referenced; no cancel before every speak), service worker cache `line-ready-v18`. v17: Test beeps no longer plays a sample call out. v16: call outs note collapsible behind an "i" info button. v15: target call outs speak only the number; start delay minimum 1 s. Previous bundle: v14 (`LineReady-v14-callouts-and-knowledge-page.zip`).

## Stack and constraints
- Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies. Keep it that way unless asked.
- Static files served from the repository root by GitHub Pages (HTTPS). Opening the files from the iOS Files app does not work (JavaScript does not run), so always test over HTTP(S).
- Every `localStorage` read and write must be wrapped in try/catch, and the page must render correctly without it.
- Target: iOS 27 Safari and the Home Screen web app. Layout is mobile first (about 390 px wide).

## Files
| File | Purpose |
|---|---|
| `index.html` | Range calculator page. Early head script applies the saved theme. |
| `targets.js` | Shared `CATEGORIES` and `TARGETS` (17 targets, heights in cm). Used by `index.html` and `knowledge.html`. |
| `par.html` | Par timer / shot timer with call outs, lock button, wake lock. |
| `knowledge.html` | Quizzes: Range estimation tab and Reticle reading tab. |
| `settings.html` | About tile (developed with AI, license CC0-1.0, link to https://creativecommons.org/publicdomain/zero/1.0/) and Theme tile (Default / Classic 2000s / Liquid Glass). |
| `common.js` | Shared sidebar drawer (`PAGES` array, one SVG icon each) and select-all-on-focus for `input[type="text"]`. |
| `app.css` | Base styles, titlebar, drawer, lock button, toast, cue chip, feedback, stats, reticle. Includes `[hidden]{display:none!important}`. |
| `themes.css` | `:root[data-theme="classic"]` and `:root[data-theme="glass"]` overrides. Default theme has no attribute. |
| `sw.js` | Service worker. |
| `manifest.webmanifest`, `icon.svg`, `icon-180.png`, `icon-512.png` | PWA manifest and the original crosshair icon (white circle on #111). |

Adding a page: create the HTML, add it to `PAGES` in `common.js` (with an icon), add it to `ASSETS` in `sw.js`, and bump the cache name.

## Rules that must hold
- **Service worker versioning:** any change to a shipped file needs a new cache name in `sw.js` (`line-ready-v<N>`), and new files must be added to `ASSETS`. The worker is network first (`cache: "no-cache"`) with an offline fallback, and precaches with `cache: "reload"`. Do not return to cache first: that caused stale pages on GitHub Pages (max-age=600). After a deploy, an installed copy can need up to three opens, or removing and re-adding the Home Screen icon, to update.
- **Range formula:** range (m) = target height (cm) × 10 ÷ size in mils. Yards = m × 1.0936133. The result is rounded to the nearest 10 (`Math.round(v / 10) * 10`); if that gives 0, show "<5".
- **Text inputs:** focusing a text input selects all of its text so typing replaces it.
- **Hidden elements:** the `hidden` attribute must work on flex rows (hence the `[hidden]` rule). The custom height field shows only when "custom height" is selected.
- **Themes:** the saved theme is in `localStorage` key `line-ready-theme`; the early script in each page head applies it before paint. Themes may change appearance only. Buttons, functions and layout positions must not change between themes. Glass theme falls back for reduced transparency and for browsers without `backdrop-filter`. Light and dark follow `prefers-color-scheme`.
- **Branding:** the app is called Line Ready. Keep the original crosshair icon until Daniel supplies a new logo.
- **License:** CC0-1.0.

## Par timer details (`par.html`)
- Start delay min must be at least 1 s (`MIN_DELAY`); lower values are rejected with an error on Start / Test beeps.
- Settings: par time, reps, progression step, rest, random delay min/max, start and end beep pitch (High 3000 Hz / Medium 2000 Hz / Low 1000 Hz), volume, call outs.
- `buildTimeline(cfg, t0, rand)` returns reps with `readyT, startT, endT, cue, cueT`. All beeps are scheduled up front on the `AudioContext` clock. The `AudioContext` is created inside the tap handler (iOS requirement).
- Silent switch handling: `navigator.audioSession.type = "playback"`, with a silent looping WAV as fallback. A Wake Lock is requested. If the audio context goes to "interrupted" or suspended, the session aborts.
- Call outs: `cueMode` (off / targets / colors / custom), `cueCount`, `cueList`, `cueDelivery` (both / voice / screen), target call outs show "Target N" on screen but speak only "N" (cue `say` field), `cueTiming` (before the beep: `cueT = readyT + 0.4`, and with voice on `startT` is pushed to at least `cueT + speechSec(cue) + CUE_GAP_SEC` so the beep does not cut the voice off; or at the beep: `cueT = startT`). Reported on iPhone (v14 to v17): the voice stopped mid call out with "Before the start beep"; the v18 changes are the suspected fix, unconfirmed on device. Voice uses `speechSynthesis`, unlocked on Start with a silent utterance. If speech is unsupported, the on-screen `#cue` chip is the fallback. "Test beeps" plays only the two beeps, with no call out (removed in v17 because it confused testing). The Call outs explanation (`#cueNote`) is hidden by default and toggled by the circled "i" button (`#cueInfoBtn`, `.info-btn`) in the section heading.
- Lock button: floating, shown only on this page. Hold 3 s to lock or unlock. Locked = red background with closed padlock; unlocked = blue background with open padlock. When locked, every other body child is `inert`; scrolling stays enabled (`touch-action` is left to allow it on the page, the button itself uses `touch-action:none`). Hold progress is shown as a ring.

## Knowledge page details (`knowledge.html`)
- Range estimation: random target and mils, user enters range. `scoreRange`: error ≤5% Excellent, ≤10% Good, ≤20% Close, otherwise Off.
- Reticle reading: SVG reticles drawn in mil units (mil-hash and mil-dot), viewBox `-6.4 -4.8 12.8 9.6`. `scoreReticle`: ≤0.1 mil Exact; ≤0.2 mil (mil-hash) or ≤0.3 mil (mil-dot) Correct. The reveal overlay shows the answer; the difference is shown to up to 2 decimals.
- Scores persist in `localStorage` key `line-ready-knowledge-v1`, with a Reset scores button.

## Testing
- Verified only in headless Chromium with Playwright (touch emulation, CDP touch events, stubbed `speechSynthesis`). Pre-install: Playwright is available via `require('playwright')` or Python `playwright`.
- **Not verified on a real iPhone:** voice call outs, silent switch behavior, wake lock, audio interruptions, Safari/Home Screen quirks. Treat these as unconfirmed and ask Daniel to test on device.
- Test pattern used: serve or open the files, set values with `evaluate` (hidden call out inputs cannot be `fill`ed), dispatch `change`, tap Start, screenshot at 390×844 in default, classic and glass themes, light and dark.

## Conventions for working with Daniel
- Facts only: concise, objective answers, no filler. If something is unverified, say so.
- When delivering from a chat session, ship a zip named `LineReady-v<N>-<short-change>.zip` so he can track versions. Do not rename the app back to "Range Finder" or "RangeCalc".
- Do not implement features he has only listed as ideas until he says to. Do not push to GitHub unless he asks.
- Commit message trailers and PR descriptions follow the attribution rules given in the Claude Code session.

## Data notes
- USPSA target (`uspsa-target`) is set to 76 cm. Sources conflict (one outlier) and the official rulebook page gave no numeric dimension. Flag this if precision matters.
- `/home/claude/RangeCalc` (SwiftUI) is an abandoned earlier iOS attempt, untested and not part of this repo.

## Roadmap (not started)
- Hold / dial mil corrections: needs Daniel's decisions on click value (e.g., 0.1 mil or 1/4 MOA), and whether to show holds, dial values, or both.
- Other ideas discussed but unselected: home-training features and competition/practical shooting features. Ask before building any.
- Possible online features (accounts, sync) are undefined; the app must keep working fully offline.
