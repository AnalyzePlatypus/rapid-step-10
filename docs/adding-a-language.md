# Adding a language

Adding a language takes three things: translations in the [content sheet](google-sheet.md), an
entry in [`_data/configuredLanguages.json`](../_data/configuredLanguages.json), and a data
refresh. No template changes are needed.

## 1. Translate in the Google Sheet

- **"App Text" tab:** add a column whose header is the language's `languageKey` (e.g.
  `Portuguese`), and fill in every row.
- **"Defect & Assets" tab:** add `Defect_<Lang>` and `Asset_<Lang>` columns (e.g.
  `Defect_Portuguese`, `Asset_Portuguese`), and fill in every row. A pair with either cell empty
  won't appear on that language's page.

## 2. Add the language config

Add an object to `_data/configuredLanguages.json`. The language picker shows languages in the
order of this array.

```json
{
  "title": "Português",
  "locale": "pt",
  "dir": "ltr",
  "path": "/pt",
  "languageKey": "Portuguese",
  "defectKey": "Defect_Portuguese",
  "assetKey": "Asset_Portuguese",
  "icon": "/node_modules/svg-country-flags/svg/pt.svg"
}
```

| Field | Notes |
|---|---|
| `title` | Shown in the language picker. Write it in the language itself. |
| `locale` | Key in `i18n.json`, plus the `hreflang` value and `content-language` meta tag. |
| `dir` | `ltr` or `rtl`. |
| `path` | URL of the language's page. Must be unique. |
| `languageKey` | Must exactly match the "App Text" column header. |
| `defectKey` / `assetKey` | Must exactly match the "Defect & Assets" column headers. |
| `icon` | Flag SVG from the [`svg-country-flags`](https://www.npmjs.com/package/svg-country-flags) package (ISO 3166 country code), inlined at build time. |

Do this **before** refreshing. The refresh only exports the languages listed in this file.

## 3. Refresh and check

```bash
npm run refresh-data
npm run build
```

- Search the build output for `NO_TRANSLATION_FOUND` and `Invalid defect/asset pair`.
- Run `npm run serve` and open `/<path>/`. Check the picker, the page direction, and the
  copied-to-clipboard text.
- Commit `configuredLanguages.json`, `i18n.json` and `defectsAndAssets.json` together.

## Existing quirks

- Hebrew uses locale `il` (a country code) rather than `he`.
- Arabic uses locale `ar-SA` but path `/ar`. [`public/_redirects`](../public/_redirects) redirects
  `/ar-SA` to `/ar`.
