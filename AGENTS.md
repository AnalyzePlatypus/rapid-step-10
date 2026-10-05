# AGENTS.md

RapidStep10 ([rapidstep10.com](https://rapidstep10.com)) is a one-page web form for doing an
AA-style 10th Step inventory (based on _Alcoholics Anonymous_ p. 84) in a few minutes. The user
fills it in, copies the result to the clipboard, and pastes it into their own notes. It is
available in ten languages.

## Principles

These outrank convenience. Raise any change that bends one with the user before making it.

1. **Extremely simple.** One static page per language and a handful of CDN scripts. There is no
   backend, database, build-time API, or user accounts. Don't add any.
2. **Costs nothing to run.** Static hosting on Netlify's free tier. Don't add paid services or
   anything that needs a server.
3. **Extremely private.** Inventory responses never leave the device. We don't store them, so
   saving them is the user's job: they copy the result into their own notes.
4. **Never lose a keystroke.** Drafts are saved to the browser's `localStorage` as the user types
   (Alpine `$persist`), so a refresh or a device reboot loses nothing. They stay there until the
   user clears the form.

### Allowed exceptions to "private"

Only these. Nothing in them identifies the user or carries inventory content.

- **[Fathom](https://usefathom.com) analytics** ([`_includes/head/fathom.njk`](_includes/head/fathom.njk)).
  It doesn't use cookies, so no consent banner is needed. The 404 page records a Fathom goal on load
  ([`404.njk`](404.njk)).
- **[Honeybadger](https://honeybadger.io) error monitoring** ([`_includes/head/honeybadger.njk`](_includes/head/honeybadger.njk)).
  It stores no identifiers. The API key is a public browser-side key and is hardcoded in that
  template on purpose.
- **The 404 page's `mailto:` broken-link report.** It only sends something if the user taps it and
  then chooses to send the email.

## Stack

- [Eleventy 2](https://11ty.dev) static site generator. Config is in [`.eleventy.js`](.eleventy.js)
  and the output goes to `_site/`.
- [Tailwind CSS 3](https://tailwindcss.com). The CLI compiles [`css/index.css`](css/index.css) after
  Eleventy runs.
- [Alpine.js](https://alpinejs.dev) with the Persist, Collapse and Autosize plugins, plus
  Clipboard.js, canvas-confetti and assets-retry. These all load from CDNs
  ([`_includes/head/javascript-libs.njk`](_includes/head/javascript-libs.njk)), so there is no JS
  bundler.
- **Node 24.** It's pinned in both [`mise.toml`](mise.toml) (local) and [`.nvmrc`](.nvmrc), which
  is what Netlify reads. Change them together.
- **`sharp` override.** `razorux-eleventy-tools` loads `@11ty/eleventy-img` 2, which depends on an
  old `sharp` that won't compile on Node 24. `package.json` `overrides` forces `sharp` ^0.34, which
  ships prebuilt binaries. The site doesn't use any image helpers.
  - If Homebrew `vips` is installed on your machine, `sharp` tries to build against it and fails.
    Install with `SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install` instead.
- `package-lock.json` is gitignored, so Netlify resolves dependencies fresh on every build.
- Markdown files outside the site, such as `README.md`, `AGENTS.md` and `docs/`, must be listed in
  [`.eleventyignore`](.eleventyignore). Otherwise Eleventy renders them as pages and publishes
  them.

## How the site is built

- [`index.njk`](index.njk) is the whole app. It paginates over
  [`_data/configuredLanguages.json`](_data/configuredLanguages.json) and emits one page per
  language at `/<lang.path>/` (`/en`, `/fr`, `/ar`, ...). `/` redirects to `/en`
  ([`public/_redirects`](public/_redirects)).
- UI strings come from [`_data/i18n.json`](_data/i18n.json) through the `i18n` filter, e.g.
  `{{ 'appTitle' | i18n(lang) }}`. A missing key renders `❗ NO_TRANSLATION_FOUND`.
- The defect/asset pairs come from [`_data/defectsAndAssets.json`](_data/defectsAndAssets.json),
  which the `embedDefectsAndAssets` shortcode embeds into each page as JSON.
- RTL languages (Arabic, Hebrew) set `dir: "rtl"` in their language config.
- `public/` is copied as-is to the site root.

## Content lives in a Google Sheet

All UI translations and the defect/asset list are edited in a Google Sheet, **not in this repo**.
`npm run refresh-data` ([`scripts/refreshSpreadsheetData.js`](scripts/refreshSpreadsheetData.js))
downloads the sheet and regenerates `_data/i18n.json` and `_data/defectsAndAssets.json`. Both files
are committed.

- Don't hand-edit those two JSON files. Change the sheet, then refresh.
- The refresh is run by hand and only occasionally, when the sheet changes. Netlify never contacts
  the sheet.
- Credentials come from a local `.env` (gitignored).
- The same sheet also supplies the content of the mobile apps.

Details: [`docs/google-sheet.md`](docs/google-sheet.md). Adding a language:
[`docs/adding-a-language.md`](docs/adding-a-language.md).

## Commands

```bash
npm run serve         # dev server with live reload (Eleventy only)
npm run tailwind      # in a second terminal: rebuild CSS on change
npm run build         # full production build into _site/
npm run refresh-data  # pull the Google Sheet into _data/ (needs .env)
```

There are no tests or linters.

## Deployment

Production is **[rapidstep10.com](https://rapidstep10.com)**, hosted on Netlify (site `rapid-step-10`).
Netlify builds and deploys **every push to `master` straight to production** through its built-in
GitHub integration ([`netlify.toml`](netlify.toml): `npm run build`, publish `_site`). There are no
deploy previews and no staging site, so treat pushing to `master` as releasing.

## Companion mobile apps

There are companion iOS and Android apps. They are completely standalone: no sync, no login, and
no shared backend. Each keeps its own local database on the device and does nothing else. Their
only link to this repo is that they use the same Google Sheet for content.

## Known leftovers

Parts of the Eleventy starter template are still here and are slated for removal. Don't build on
them:

- `about/`, `archive.njk`, `page-list.njk`, `_includes/postslist.njk`,
  `_includes/layouts/post.njk`
- `_data/translations.json`, which nothing reads (the real file is `_data/i18n.json`)
- Unused dependencies: `@11ty/eleventy-plugin-rss`, `@11ty/eleventy-plugin-syntaxhighlight`,
  `eleventy-plugin-i18n`, `eleventy-plugin-pwa`, `eleventy-plugin-tailwindcss`

## Docs and task tracking

- [`docs/`](docs/) holds design documents: discussions, investigations, postmortems, architecture
  notes and specs. Put new ones there. See [`docs/README.md`](docs/README.md).
- Work is tracked on Fizzy (🔟 RapidStep10 board). See [`.fizzy-workflows.yaml`](.fizzy-workflows.yaml)
  and always pass `--profile=claude_razorux` to the `fizzy` CLI.
