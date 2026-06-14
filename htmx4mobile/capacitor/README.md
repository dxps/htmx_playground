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

<br/>

## Install on local iPhone

### Prereqs

- macOS with Xcode installed
- iPhone connected by USB, or paired wirelessly
- Apple ID signed into Xcode
  On the iPhone, enable Developer Mode if iOS asks for it

### Steps

Run the followings

```sh
cd /Users/dxps/dev/dxps_gh/htmx_playground/htmx4mobile/capacitor
npm install
npm run cap:sync
npm run cap:open:ios
```

That opens the iOS project in Xcode.
In Xcode:

1. Select the App project.
2. Select the App target.
3. Go to Signing & Capabilities.
4. Pick your Apple account/team.
5. Change the Bundle Identifier if needed, for example:
   `dev.dxps.htmx4mobile`
6. Select your iPhone as the run destination.
7. Press Run.

If Xcode says the developer is untrusted, on the iPhone go to:
`Settings → General → VPN & Device Management`
Then trust your developer profile.

For App Store/TestFlight later, you’ll need an Apple Developer Program account.
For personal device testing, a free Apple ID usually works, but the installed app may expire after a short period.

<br/>

## Install on local Android

### Prereqs

- Android Studio installed
- Android phone connected by USB
- Developer options enabled on the phone
- USB debugging enabled

### Steps

```sh
cd /Users/dxps/dev/dxps_gh/htmx_playground/htmx4mobile/capacitor
npm install
npm run cap:sync
npm run cap:open:android
```

That opens the Android project in Android Studio.
In Android Studio:

1. Wait for Gradle sync to finish.
2. Select your Android phone as the target device.
3. Press Run.

If the phone asks whether to allow USB debugging, accept it.

You can also build an APK from Android Studio:
`Build → Build Bundle(s) / APK(s) → Build APK(s)`

Then transfer/install that APK on your phone, though for development the Run button is easier.
