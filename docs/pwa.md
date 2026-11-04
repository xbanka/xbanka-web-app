# Installable app (PWA)

XBanka installs from the browser and opens from a home-screen / desktop icon with no browser bar.
It is "install the website": the app loads live. Only a friendly offline page is cached; API, auth
and balance data are never cached (`public/sw.js`).

| Piece | File |
| --- | --- |
| Manifest | `app/manifest.ts` |
| Icons (regenerate: `python3 scripts/generate-pwa-icons.py`) | `public/icons/*`, `app/apple-icon.png` |
| iOS metadata + theme color | `app/layout.tsx` |
| Service worker + offline page | `public/sw.js`, `public/offline.html` |
| SW headers (no-cache, CSP) | `next.config.ts` |
| Install button (sidebar) | `components/pwa/` |
| Install funnel events | `lib/pwa/telemetry.ts`, `app/api/pwa-events/route.ts` |

## The rule that broke it before
`proxy.ts` must not redirect `/manifest.webmanifest`, `/sw.js` or `/offline.html`. Browsers fetch
them without the auth cookie; a redirect to `/sign-in` makes the manifest invalid and the service
worker fail to register. Guarded by `lib/pwa/__tests__/proxy-matcher.test.ts`.

## Checks
- Gate (fast, local): `npm run test:pwa`
- Pre-ship (needs a running prod build): `npm run build && npm start`, then `npm run smoke:pwa [baseUrl]`
  (point it at the deployed URL after release).
- Manual: Chrome DevTools > Application > Manifest (no errors, "Installable"), then install on
  desktop Chrome, an Android phone and an iPhone.

## Measuring it
Each event is one JSON log line `{"type":"pwa_event","event":...}` on the server:
`install_accepted`, `install_dismissed`, `app_installed`, `standalone_session` (app opened from the icon).
Search the host logs for `"type":"pwa_event"` and count by `event`.

## Known limits
- Install needs HTTPS (localhost excepted).
- iOS installed apps have their own cookie store: users sign in once inside the installed app.
- iOS has no install API, so the button shows "Share > Add to Home Screen" instructions.
