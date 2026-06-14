# HTMX4Mobile

An installable mobile PWA built with HTMX. The first use case is a movie CRUD app with local caching so it can keep working when the device is offline.

## Features

- HTMX 4.0.0-beta4 vendored locally for offline-safe `hx-*` behavior.
- PWA manifest with install metadata for Android and iOS.
- Service worker precache for the app shell, HTMX, styles, fragments, and icons.
- Movie CRUD for `id`, `title`, `description`, and `year`.
- IndexedDB-backed movie cache, including seeded examples for first launch.
- Playwright tests for CRUD persistence, manifest availability, service worker registration, and offline loading.

## Run

```sh
npm install
npm run dev
```

Then open <http://127.0.0.1:4173>.

## Test

```sh
npm test
```

The offline test first loads the app online so the service worker can precache assets, then switches the browser context offline and verifies the cached app still renders movie data.

<br/>

## Install

This is installable as a PWA, so mobile install happens from the browser.

### Android Chrome

- Run the app: `npm run dev`
- Open http://127.0.0.1:4173 if testing on the same machine, or expose it over HTTPS for a real phone.
- In Chrome, tap the menu ⋮.
- Tap Add to Home screen or Install app.
- Launch it from the home screen.

### iPhone Safari

- Open the app URL in Safari.
- Tap the Share button.
- Tap Add to Home Screen.
- Confirm the name and tap Add.

For a real phone, the important bit is that PWAs generally need to be served over HTTPS unless you are using localhost. So, for actual device testing you’d deploy the public/ folder to an HTTPS host, or use a tunnel such as ngrok/Cloudflare Tunnel during development.
