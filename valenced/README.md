# NEXUS Unleashed — in-Discord plugin

This is a **Valenced JS-only external plugin**, built separately from the
Android companion APK in the repository root.

## Current functionality

- Opens a **NEXUS Studio** inside Valenced plugin settings in the Discord
  Android client.
- Previews nine message transformations, including Markdown, spoiler, code
  fences, fullwidth Unicode, a checklist and a NEXUS frame.
- Copies the selected output to the clipboard so it can be pasted into
  Discord conversations. Other users see the **supported message content**,
  not the plugin UI.
- Works offline with no user tokens, no injected network requests and
  no background account automation.

## GitHub Actions build

Open **Actions → Build NEXUS Valenced plugin**. The workflow runs Bun-based
unit tests, a TypeScript check and Valenced's published plugin CLI build, then
packages `manifest.json` and `index.js` into:

`dev.nexus.unleashed@0.1.0.zip`

Download the **nexus-unleashed-valenced-plugin** artifact from a successful
workflow run. Install through a compatible Valenced plugin manager.
Before installing, back up your data and confirm compatibility with the
Discord/Valenced version on your device.

## Local development

```sh
cd valenced
bun install
bun test
bun run check
bun run build nexus-unleashed
```

The companion APK is produced independently by **Build Android APK** and can
share files/text via Android's standard share sheet. This plugin does not
replace Discord, grant server permissions, or deploy the Discord Activity.
