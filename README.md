# Rapid Step 10
[![Netlify Status](https://api.netlify.com/api/v1/badges/1bc9e509-3377-4d86-a20a-1109dac51203/deploy-status)](https://app.netlify.com/sites/rapid-step-10/deploys)

Do a AA-style 10th Step Inventory in 3 minutes or less!
Based on _Alcoholics Anonymous_ p. 84.

* 🚀 Fast: 100% Lighthouse performance score
* 🔒 Private: No information leaves the browser
* 🌙 Light and dark themes (matches system settings)
* 🐘 Incomplete inventories are saved to Local Storage
* 📎 Copy to clipboard for sharing
* 🎉 Celebrate with confetti!


## Development

```bash
npm install
npm run serve         # dev server
npm run tailwind      # CSS watcher (second terminal)
npm run refresh-data  # pull content from the Google Sheet (needs .env)
```

Every push to `master` deploys to production on Netlify.

All text content (translations and the defect/asset list) is edited in a Google Sheet, not in this repo.
See [`docs/google-sheet.md`](docs/google-sheet.md) and [`docs/adding-a-language.md`](docs/adding-a-language.md).
Contributor and agent guidelines are in [`AGENTS.md`](AGENTS.md).

There are companion iOS and Android apps. They are fully standalone, with no accounts and no sync.


## Roadmap

- [x] Ask to confirm before clearing form
- [x] Copy to Clipboard
- [x] Collapse defects & asset lists
- [x] Custom defects & assets
- [x] Fathom analytics
- [x] Confetti!
- [x] 404 page with auto-reporting
- [x] No-JS banner
- [x] Automatic asset download retries (powered by [assets-retry](https://www.npmjs.com/package/assets-retry))
- [ ] Offline support via Service Worker?
- [x] Sticky "Show More" and "Show Less" buttons by character assets/defects


## Thank you

Thanks to all testers for feedback!
The defect list is partly based on the work of Nicholas S in the UK.

Built with:
* [Eleventy](http://11ty.dev) (Static site generator)
* [Tailwind CSS](http://tailwindcss.com)
* [Alpine.js](https://alpinejs.dev) (with the [Persist](https://alpinejs.dev/plugins/persist), [Collapse](https://alpinejs.dev/plugins/collapse), and [Autosize](https://github.com/marcreichel/alpine-autosize) plugins)
* Clipboard by [Clipboard.js](http://clipboardjs.com)
* Confetti by [canvas-confetti](https://github.com/catdad/canvas-confetti)
* [assets-retry](https://www.npmjs.com/package/assets-retry) Web asset robust redownload script
* Error Monitoring by [Honeybadger](http://honeybadger.io)
* Privacy-respecting analytics by [Fathom](https://usefathom.com/ref/BDXYGB). (affiliate link! 😄)
* Deployed to [Netlify](https://netlify.com)

🤠 Dat's all, folks!
