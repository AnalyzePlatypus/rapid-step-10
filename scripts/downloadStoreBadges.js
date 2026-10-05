// Download the official, localized App Store and Google Play badges for every
// configured language into img/badges/, so the site self-hosts them and never
// makes a request to Apple or Google on the visitor's behalf.
//
// Usage: npm run download-badges
//
// Sources (official marketing tools):
//   Apple:  https://toolbox.marketingtools.apple.com/en-us/app-store/marketing-guidelines
//   Google: https://partnermarketinghub.withgoogle.com/brands/google-play/visual-identity/badge-guidelines/

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { readJsonFile, ensureDirExists } = require("./util.js");

const LANGUAGE_FILE_PATH = "../_data/configuredLanguages.json";
const OUTPUT_DIRECTORY = path.resolve(__dirname, "../img/badges");

const appStoreBadgeUrl = (style, locale) =>
  `https://toolbox.marketingtools.apple.com/api/badges/download-on-the-app-store/${style}/${locale}`;

const googlePlayBadgeUrl = locale =>
  `https://play.google.com/intl/en_us/badges/static/images/badges/${locale}_badge_web_generic.png`;

async function download(url, filePath) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${response.status} ${response.statusText} for ${url}`);
  fs.writeFileSync(filePath, Buffer.from(await response.arrayBuffer()));
  console.log(`✅ ${path.relative(process.cwd(), filePath)}`);
}

// Google's PNGs have transparent padding baked in, and how much varies by language. Crop it so
// both badges can be laid out by their visible edges.
async function trimTransparentPadding(filePath) {
  const trimmed = await sharp(filePath).trim({ threshold: 1 }).toBuffer();
  fs.writeFileSync(filePath, trimmed);
}

async function main() {
  const languages = readJsonFile(LANGUAGE_FILE_PATH);
  ensureDirExists(OUTPUT_DIRECTORY);

  for (const lang of languages) {
    if (!lang.appStoreBadgeLocale || !lang.googlePlayBadgeLocale) {
      throw new Error(`Missing appStoreBadgeLocale / googlePlayBadgeLocale for "${lang.locale}" in configuredLanguages.json`);
    }
    // Black badge for light mode, white for dark mode (per Apple's guidelines)
    await download(appStoreBadgeUrl("black", lang.appStoreBadgeLocale), path.join(OUTPUT_DIRECTORY, `app-store-${lang.locale}-black.svg`));
    await download(appStoreBadgeUrl("white", lang.appStoreBadgeLocale), path.join(OUTPUT_DIRECTORY, `app-store-${lang.locale}-white.svg`));
    const googlePlayPath = path.join(OUTPUT_DIRECTORY, `google-play-${lang.locale}.png`);
    await download(googlePlayBadgeUrl(lang.googlePlayBadgeLocale), googlePlayPath);
    await trimTransparentPadding(googlePlayPath);
  }

  console.log("Done!");
}

main();
