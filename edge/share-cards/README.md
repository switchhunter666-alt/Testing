# NEXUS Share Cards Worker

A stateless Cloudflare Worker that serves normal HTML pages with embedded
Discord-native component preview JSON. It requires no user tokens, and uses
the documented `discord:component-embed` HTML script tag.

## Deploy

Install Wrangler on your computer or use Cloudflare's dashboard, then:

```sh
cd edge/share-cards
npx wrangler login
npx wrangler deploy
```

After deploy, copy your `https://...workers.dev` HTTPS origin to the
**SHARE AS DISCORD CARD** field inside the Valenced NEXUS Unleashed plugin.
Press **COPY LIVE CARD LINK**. Paste the URL into a Discord chat: Discord
can crawl the HTML and render the structured component preview.

This project is **not automatically deployed by GitHub**. The repository
contains the worker source and its tests; a public domain and Cloudflare
account are required. The card content is encoded into the share URL and
will be visible to anyone who receives that URL. Do not put secrets in it.

To test locally: `bun test src/index.test.js`.

Preview caching, rate limits, client support, and safety filtering are
controlled by Discord. See official docs:
https://docs.discord.com/developers/link-previews/component-embeds
