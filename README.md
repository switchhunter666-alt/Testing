# Discord Native Lab

Android 17 (API 37) native C++ starter application with a GitHub Actions APK build.

## Build
Open the Actions tab and run **Build Android APK**, or push to main. After a successful run, download the `discord-native-debug-apk` artifact.

This is a starter shell. Discord API integration and OAuth2 are not implemented yet. Use official Discord OAuth2 and bot APIs; never embed bot tokens in an APK.

C++26 language mode is requested via `-std=c++2c`, with feature support depending on the installed NDK Clang toolchain.
