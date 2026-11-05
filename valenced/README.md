# NEXUS Unleashed — in-Discord plugin

This is a **Valenced JS-only external plugin**, built separately from the
Android companion APK in the repository root.

## Current functionality

- Opens a **NEXUS Studio** inside Valenced plugin settings in the Discord
  Android client.
- Previews nine message transformations, including Markdown, spoiler, code
  fences, fullwidth Unicode, a checklist and a NEXUS frame.
- Copies selected output to the clipboard for pasting into Discord.
- Generates a share URL for the optional **NEXUS Share Cards Worker**.
  Once that HTTPS worker is deployed, ordinary Discord users may see a
  native card preview from the URL (no modified client needed).
- Works without account tokens, injected network requests or background
  automation.

## GitHub Actions build

Open **Actions → Build NEXUS Valenced plugin**. The workflow runs Bun tests,
TypeScript checks and the Valenced plugin CLI build, then packages
`manifest.json` and `index.js` as:

`dev.nexus.unleashed@0.1.0.zip`

Download **nexus-unleashed-valenced-plugin** from a successful workflow run.
Install with a compatible Valenced manager.

## Local development

```sh
cd valenced
bun install
bun test
bun run check
bun run build nexus-unleashed
```

See [Share Cards](../edge/share-cards/README.md) for its optional HTTPS
deployment. Share links encode their content directly into the URL.

The companion APK is built independently by **Build Android APK**.
This plugin does not replace Discord or grant server permissions.
