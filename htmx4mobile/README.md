# HTMX4Mobile

This repo contains two mobile-oriented versions of the same HTMX movie CRUD app.

## Variants

- `pwa/` keeps the browser-installable Progressive Web App version, including manifest and service worker caching.
- `capacitor/` contains the store-packaged Capacitor version for Android and iOS native wrappers.

Both variants use HTMX 4 and IndexedDB for local movie data.

## Run the PWA

```sh
cd pwa
npm install
npm run dev
```

## Work on the Capacitor App

```sh
cd capacitor
npm install
npm run dev
```

To generate native projects after installing dependencies:

```sh
npm run cap:add:android
npm run cap:add:ios
npm run cap:sync
```
