# The content Google Sheet

All of RapidStep10's text content (UI strings in every language, and the defect/asset list) is
edited in one Google Sheet. The same sheet supplies the content of the iOS and Android apps.

**Sheet:** [RapidStep10 Translation](https://docs.google.com/spreadsheets/d/1vZnXXewDedgKmHgf8yi2bz03FTf7Csz0SXY64M_v8Ec)

## Tabs

The refresh script reads the tabs **by position**, not by name. Don't reorder them.

### Tab 1: "App Text" → `_data/i18n.json`

One row per UI string.

| Column | Meaning |
|---|---|
| `id` | Row number (not used by the site) |
| `translationKey` | Key used in templates, e.g. `{{ 'appTitle' \| i18n(lang) }}` |
| `English`, `Espanol`, `Francais`, `Deutsch`, `Italiano`, `Dansk`, `Finnish`, `Hungarian`, `عربي`, `Hebrew` | The string in that language. Each header must exactly match a `languageKey` in [`_data/configuredLanguages.json`](../_data/configuredLanguages.json). |

The output is keyed `translationKey → locale → string`, using only the languages listed in
`configuredLanguages.json`.

### Tab 2: "Defect & Assets" → `_data/defectsAndAssets.json`

One row per defect/asset pair (a character defect and its opposite asset, e.g. Anger / Calm).

| Column | Meaning |
|---|---|
| `id` | Stable pair ID. Saved drafts reference it, so don't renumber existing rows. |
| `Defect_<Lang>`, `Asset_<Lang>` | The pair in that language. Each header must match `defectKey` / `assetKey` in `configuredLanguages.json`. |

Every column comes through to the JSON. If a pair is missing the defect or the asset for a
language, it is **dropped from that language's page**, and the build logs
`[embedDefectsAndAssets] ❗ Invalid defect/asset pair`.

## Access

The script logs in with a Google Cloud **service account**, which must have at least view
access to the sheet. Put its credentials in a `.env` file at the repo root. The file is
gitignored, so never commit it.

```bash
GOOGLE_SHEETS_SPREADSHEET_ID=...   # the long ID in the sheet's URL
GOOGLE_API_CLIENT_EMAIL=...        # service account email
GOOGLE_API_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

The script stops with `Missing required env var` if any of these is missing.

## Refreshing the site's data

Only do this after the sheet has changed:

```bash
npm run refresh-data
```

This overwrites `_data/i18n.json` and `_data/defectsAndAssets.json`. Check the diff, run
`npm run build`, look for `NO_TRANSLATION_FOUND` or `Invalid defect/asset pair` in the output,
then commit both files. Pushing to `master` deploys to production.

Never hand-edit the two generated files. The next refresh will overwrite your changes.
