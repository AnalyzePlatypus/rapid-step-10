require('dotenv').config();

const fs = require("fs");
const path = require("path");
const { validateEnvVars, readTextFile, readJsonFile, readCsvFile, writeCsvFile, writeJsonFile, ensureDirExists, normalizeToken, pipe, map, objectToEntries, entriesToObject, log } = require("./util.js");

const { loadGoogleSheetsData, loadGoogleDoc } = require('./googleSheets.js');

const DATA_DIRECTORY = '../_data/'
const EXPORT_DIRECTORY = './_data'

const OUTPUT_FILE_PATH = path.join(EXPORT_DIRECTORY, "i18n.json");
const DEFECTS_ASSETS_OUTPUT_FILE_PATH = path.join(EXPORT_DIRECTORY, "defectsAndAssets.json");
const LANGUAGE_FILE_PATH = path.join(DATA_DIRECTORY, "configuredLanguages.json");


const isDefined = o => !(!o);
const isFalse = b => b == false;


function processRow(row) {
	return row;
}

function sheetRowToObject(row) {
	const headers = row._sheet.headerValues;
	const result = {}
	headers.forEach(h => {
		result[h] = row[h]
	})

	return result;
}

validateEnvVars([
  'GOOGLE_SHEETS_SPREADSHEET_ID',
  'GOOGLE_API_CLIENT_EMAIL',
  'GOOGLE_API_PRIVATE_KEY',
])



function formatTranslationData(arr, languages) {
  return pipe(
    map(extractTranslationObject(arr)),
    entriesToObject,
  )(languages);
}


const extractTranslationObject = sheetRows => language => {
  console.log(`extractTranslationObject. Lang: ${language.title} (Locale: ${language.locale})`);
  const translations = pipe(
    map(row => [ row.translationKey, row[language.languageKey] ]),
    entriesToObject,
    log
  )(sheetRows);

  return [ language.locale,  {
    language: language,
    ui: translations
  }];
}

// {"id":"1","translationKey":"appTitle","English":"RapidStep10","Deutsch":"RapidStep10","Francais":"10èmeEtapeRapide","Dansk":"Hurtigt10Trin"}

function createI18NFile(rows, languages) {
  return pipe(
    map(row => {
      const translations = languages.map(l => [ l.locale, row[l.languageKey] ]);
      return [ row.translationKey, entriesToObject(translations)];
    }),
    entriesToObject,
    log
  )(rows)
}


async function main() {
  const languageConfigs = await readJsonFile(LANGUAGE_FILE_PATH);

  const doc = await loadGoogleDoc();
  const uiTranslationsSheet = doc.sheetsByIndex[0];
  // await sheet.loadCells();

	const rows = await uiTranslationsSheet.getRows()

	console.log(`UI sheet: ${rows.length} rows`);

	const results = rows.map(sheetRowToObject);

  const formatted = createI18NFile(results, languageConfigs)


  // Defects file

  const defectsAndAssetsSheet = doc.sheetsByIndex[1];
  const defectsAndAssets = (await defectsAndAssetsSheet.getRows()).map(sheetRowToObject);



	ensureDirExists(EXPORT_DIRECTORY);

	writeJsonFile({
		path: OUTPUT_FILE_PATH,
		data: formatted
	});

  writeJsonFile({
    path: DEFECTS_ASSETS_OUTPUT_FILE_PATH,
    data: defectsAndAssets
  });

	console.log(`Wrote UI translations to ${OUTPUT_FILE_PATH}`);
  console.log(`Wrote defectsAndAssets translations to ${DEFECTS_ASSETS_OUTPUT_FILE_PATH}`);

	console.log("Done!");

}

main()

