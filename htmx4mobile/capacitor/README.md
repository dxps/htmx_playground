# HTMX4Mobile Capacitor

Store-packaged version of the HTMX movie CRUD app.

This variant keeps the same HTMX 4 UI and IndexedDB data store as the PWA, but removes browser PWA install hooks. Capacitor wraps the `public/` directory into native Android and iOS projects for Google Play and the App Store.

## Run in a Browser

```sh
npm install
npm run dev
```

Then open <http://127.0.0.1:4273>.

## Test

```sh
npm test
```

## Generate Native Projects

```sh
npm run cap:add:android
npm run cap:add:ios
npm run cap:sync
```

After that:

- Android project: `android/`
- iOS project: `ios/`

Use Android Studio and Xcode for signing, store assets, and final submission builds.
