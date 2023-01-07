const { GoogleSpreadsheet } = require('google-spreadsheet');

async function loadGoogleSheetsData() {
	const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_SPREADSHEET_ID);
	
	await doc.useServiceAccountAuth({
		client_email: process.env.GOOGLE_API_CLIENT_EMAIL,
		private_key: process.env.GOOGLE_API_PRIVATE_KEY.replace(/\\n/g, "\n")
	}); 
	
	console.log(`🔑 Google Sheets login complete`);
	
	console.log(`📊 Google Sheets loading info...`);
	await doc.loadInfo();
	
	const targetWorksheetName = "Inventory Status";
	const sheet = doc.sheetsByIndex[0];
	
	await sheet.loadCells();
	
	console.log(`📊 Google Sheets info loaded`);
	
	return sheet;
}


exports.loadGoogleSheetsData = loadGoogleSheetsData;