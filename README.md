# NEXUS OMEGA — Discord Android research lab

The project now contains four independent experiments:

1. **Android 17-compatible companion APK** in `app/`: native C++ message
   transforms, overlay composer, local draft vault and image card export.
2. **Reality Room Activity** in `activity/`: interactive web prototype using
   Discord's Embedded App SDK. Hosting and configuration are required.
3. **NEXUS Unleashed Valenced plugin** in `valenced/`: in-client message
   studio for a compatible modified Discord Android app.
4. **NEXUS Share Cards Worker** in `edge/share-cards/`: an optional stateless
   HTTPS service for rich link previews visible to standard Discord clients.

## GitHub builds

- [Build Android APK](https://github.com/switchhunter666-alt/Testing/actions/workflows/android-apk.yml)
  produces `discord-native-debug-apk`.
- [Reality Room web build](https://github.com/switchhunter666-alt/Testing/actions/workflows/activity-check.yml)
  checks the Activity frontend.
- [Build NEXUS Valenced plugin](https://github.com/switchhunter666-alt/Testing/actions/workflows/valenced-plugin.yml)
  produces an installable plugin ZIP.
- [Verify NEXUS Share Cards](https://github.com/switchhunter666-alt/Testing/actions/workflows/share-cards-check.yml)
  tests and packages the optional Cloudflare Worker source.

The Valenced ZIP is **not** an APK. The companion APK is **not** a patched
Discord app. The Share Cards Worker must be independently deployed on a public
HTTPS host before its links produce Discord embeds. No part of this system
overrides Discord permissions or reads unconsenting users' private data.

See [Valenced plugin instructions](valenced/README.md),
[Share Cards deployment](edge/share-cards/README.md), and
[architecture](docs/OMEGA-ARCHITECTURE.md).
