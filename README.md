# NEXUS OMEGA — Discord Android research lab

This repository contains three independent experiments:

1. **Android 17 companion APK** in `app/`: native C++ message transforms,
   Android overlay composer, local draft vault and media card export.
2. **Reality Room Activity** in `activity/`: a standalone interactive web
   prototype using Discord's Embedded App SDK. Hosting and Discord developer
   configuration are required before it can run in the official app.
3. **NEXUS Unleashed Valenced plugin** in `valenced/`: an in-client message
   studio for a compatible modified Android Discord app.

## Build on GitHub

Open the [Actions tab](https://github.com/switchhunter666-alt/Testing/actions)
to get installable build artifacts:

- **Build Android APK** produces `discord-native-debug-apk`.
- **Reality Room web build** checks the embedded Activity frontend.
- **Build NEXUS Valenced plugin** produces `nexus-unleashed-valenced-plugin`,
  containing `dev.nexus.unleashed@0.1.0.zip`.

The Valenced ZIP is **not** an APK, and the companion APK is **not** a
patched Discord client. Neither component grants administrator privileges
or unconsented access to other accounts.

See [Valenced plugin instructions](valenced/README.md) and
[architecture and limitations](docs/OMEGA-ARCHITECTURE.md).
