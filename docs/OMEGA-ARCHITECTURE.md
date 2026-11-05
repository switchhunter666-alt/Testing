# NEXUS OMEGA — reviewed architecture

## Product objective
Make genuinely novel experiences visible to other Discord users **without requiring a modified Discord client**.

## Research findings (November 2026)
1. **Discord Activities** run hosted web apps inside Discord. Embedded App SDK supports client context and SDK commands. A public deployment, Discord developer application, Activity URL mapping, and configuration are still required.
2. **User-installed Discord apps** can be invoked from DMs, GDMs, and servers and can respond with interactive components. A Discord app and a serverless HTTPS interaction endpoint with signature verification are required.
3. **Components V2** support rich Discord-native message layouts and buttons in application/webhook messages. They do **not** let arbitrary Android user clients alter messages or inject buttons into ordinary user messages.
4. **Android media sharing** allows normal recipients to see exported images and media without installing NEXUS.
5. **Self-bots and undocumented user-token automation** are excluded.

## System architecture
- **Android APK**: local composer, overlays, draft vault, share receiver and FileProvider media export.
- **C++26-oriented native core**: Unicode/Markdown transformations. The Android NDK's actual C++2c implementation and compatibility must be checked in CI.
- **Activity web client**: Reality Room prototype using the official Embedded App SDK. Standalone preview works without credentials; Discord integration needs deployment.
- **Future interaction service**: authorized user-installable application using HTTPS interactions and signature verification; no bot-token distribution to clients.
- **Future media engine**: animation, video, audio, reusable effects, export validation.

## Implemented and not implemented
| Module | Implemented | Not yet implemented |
| --- | --- | --- |
| RealityText | Native transforms, preview, sharing | grapheme-aware reversal, complex Unicode layout tests |
| MediaForge | PNG card renderer and FileProvider sharing | animation, video, image layers, audio |
| Floating composer | draggable overlay and clipboard | accessibility-aware docking, notification controls |
| Vault | local single-draft storage | indexed encrypted multi-document search |
| Reality Room | interactive canvas, local energy, palette shift, export | cross-user synchronization, backend persistence, deployment |
| Discord integration | SDK initialization scaffold | registered Discord application, production Activity hosting, OAuth, interaction endpoint |

## Review and risks
- Overlay permission is optional and user-granted. The floating service should be lifecycle-tested on Android 17.
- Text transformation uses UTF-8 codepoints, not full Unicode grapheme clusters. Reversal can split emoji sequences and combining marks.
- The image renderer may clip very long words or messages; future work should add proper wrapping and ellipsis.
- Activity canvas state is **local only**; do not market it as real-time multiplayer until a backend exists.
- No automated successful Android build has been independently verified for this commit series.
- Never put application secrets in an Android APK or browser bundle.

## Release gates
1. Run Gradle debug APK build on GitHub Actions.
2. Run Vite build of the Activity.
3. Install APK on a physical Android 17 device; test sharing, overlay permission, JNI, and file URI grants.
4. Configure Activity app in Discord Developer Portal and host on HTTPS.
5. Test with two independent Discord accounts and clients to verify that recipient-visible behavior actually works.

## Official references
- https://docs.discord.com/developers/activities/overview
- https://docs.discord.com/developers/developer-tools/embedded-app-sdk
- https://docs.discord.com/developers/components/using-message-components
- https://docs.discord.com/developers/tutorials/developing-a-user-installable-app
- https://support.discord.com/hc/en-us/articles/115002192352-Automated-User-Accounts-Self-Bots
