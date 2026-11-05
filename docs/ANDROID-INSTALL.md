# NEXUS Omega — Android installation and troubleshooting

## What happened?

Google Play Protect may warn that the publisher of our GitHub Actions debug
APK is unknown. This is **not proof of malware or proof of safety**. Inspect
the build source and use the integrity report before deciding to sideload.

The earlier app used package ID `dev.discordnative.app` and a freshly
generated CI debug signing certificate. Later builds can be signed with a
different key; Android correctly refuses to install them as updates.

Starting with NEXUS Omega 0.2.0, CI outputs an APK with a different, stable
product package ID `dev.nexus.omega` to avoid collisions with the *older*
Discord Native Lab experiment. **This does not bypass Play Protect**, and
future updates will still require a consistent signing certificate.

## Download

Open GitHub > Actions > **Build Android APK** > a **successful run**.
Download the **nexus-omega-android-apk** artifact ZIP. Extract it and install
the `app-debug.apk` within. The ZIP also includes
`signature-report.txt`, `package-report.txt`, and `SHA256SUMS`.
Compare the APK hash to `SHA256SUMS`. GitHub Actions prints the checks,
and the build fails if signing or ARM64 support is missing.

## If installation fails

1. Confirm the app comes from **your** repository and its GitHub Actions
   run; if Play Protect issues a warning, review the source and provenance.
2. On Samsung Galaxy devices, check **Settings > Security and privacy >
   Auto Blocker**. Samsung documents that it may block sideloaded apps. Do
   not disable security settings unless you have independently determined
   the app is safe and accept the risk. Turn them back on afterward.
3. Check **Settings > Apps** for *NEXUS Omega* or the old *Discord Native
   Lab*. The new package can coexist with the old, but builds with the same
   ID may conflict if signed with different certificates.
4. Make sure the installing file manager has permission under **Settings >
   Apps > Special access > Install unknown apps**, if your device offers
   that option. Verify the file really ends in `.apk` (not a ZIP archive).
5. If it still fails, capture the **exact installer error** using Android
   Debug Bridge (ADB) on a computer:

   ```sh
   adb install -r app-debug.apk
   ```

   Error codes distinguish signatures (`INSTALL_FAILED_UPDATE_INCOMPATIBLE`),
   storage (`INSTALL_FAILED_INSUFFICIENT_STORAGE`), unsupported ABI
   (`INSTALL_FAILED_NO_MATCHING_ABIS`) and policy restrictions
   (`INSTALL_FAILED_USER_RESTRICTED`).

**Do not disable Play Protect globally as a general workaround.**

## Release-signing requirement

This repository currently produces a **debug-signed** APK; these builds are
not reliable in-place upgrades across unrelated GitHub CI runners. For
updatable releases, create a private signing keystore, store it securely in
GitHub Actions secrets, and sign every release with the same keystore.
**Never commit a private signing key to this public repository.**

This is a companion app, not a replacement for Discord or a patched official
Discord APK. Installing it does not automatically install the Valenced plugin.
