require('dotenv').config();

const fs = require("fs");
const path = require("path");
const { validateEnvVars, readTextFile, readJsonFile, readCsvFile, writeCsvFile, writeJsonFile, ensureDirExists, normalizeToken } = require("./util.js");

const { loadGoogleSheetsData } = require('./googleSheets.js');

const DATA_DIRECTORY = '../_data'
const EXPORT_DIRECTORY = '../_data'

const OUTPUT_FILE_PATH = path.join(EXPORT_DIRECTORY, "translations.json");


const isDefined = o => !(!o);
const isFalse = b => b == false;


function processRow(row) {
	return row;
}

function processSheetRow(row) {
	const headers = row._sheet.headerValues;
	const result = {}
	headers.forEach(h => {
		result[h] = row[h]
	})

	return result;
}

validateEnvVars([
  'GOOGLE_SHEETS_SPREADSHEET_ID'
  'GOOGLE_API_CLIENT_EMAIL',
  'GOOGLE_API_PRIVATE_KEY',
])

async function main() {
	const sheet = await loadGoogleSheetsData();
	const rows = await sheet.getRows()

	console.log(`Sheets: ${rows.length} rows`)

	const results = rows.map(processSheetRow);

	ensureDirExists(EXPORT_DIRECTORY);

	writeJsonFile({
		path: OUTPUT_FILE_PATH,
		data: results
	})

	console.log(`Wrote results to ${OUTPUT_FILE_PATH}`);

	console.log("Done!");

}

main()

