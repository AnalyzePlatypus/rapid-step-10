// The 404 page isn't paginated per language like index.njk / apps.njk, so give it the English
// language object explicitly. Base layout and the i18n filter need the object (lang.locale,
// lang.dir, lang.path), not just the "en" string.
module.exports = {
  eleventyComputed: {
    lang: data => data.configuredLanguages.find(l => l.locale === "en"),
  },
};
