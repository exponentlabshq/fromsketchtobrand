/**
 * From Sketch to Brand — email capture
 * Deploy: open the target Sheet -> Extensions -> Apps Script -> paste this in
 * as Code.gs -> Deploy -> New deployment -> Web app -> Execute as: Me ->
 * Who has access: Anyone -> Deploy -> copy the /exec URL.
 */
const SHEET_ID = '1U33-31B1-GHRQEp6rpDeG8GZjBdObalVAFHMnEq7D8I';
const SHEET_NAME = 'Emails';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const email = String(data.email || '').trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonOut_({ status: 'error', message: 'Invalid email' });
    }

    const ss = SpreadsheetApp.openById(SHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Email', 'Source']);
    }
    sheet.appendRow([new Date(), email, String(data.source || 'fromsketchtobrand.netlify.app')]);

    return jsonOut_({ status: 'ok' });
  } catch (err) {
    return jsonOut_({ status: 'error', message: err.message });
  }
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
