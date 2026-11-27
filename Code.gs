/**
 * Jesus Reigns 2026 — Delegate Registration backend
 * Google Apps Script bound to a Google Sheet (the database).
 *
 * Setup:
 *  1. Create a Google Sheet → Extensions → Apps Script → paste this file.
 *  2. Project Settings → Script properties → add ADMIN_KEY = (a long secret password).
 *  3. Run setup() once (authorize when asked).
 *  4. Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone → Deploy.
 *  5. Copy the /exec URL into SCRIPT_URL in index.html and admin.html.
 */

const SHEET_NAME = 'Registrations';
const HEADERS = ['Reference No.', 'Timestamp', 'Church', 'Pastor', 'Location',
                 'Delegates', 'Notes'];
const MAX_DELEGATES = 1000;

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS])
    .setFontWeight('bold').setBackground('#061833').setFontColor('#e7b52c');
  sh.setFrozenRows(1);
  sh.autoResizeColumns(1, HEADERS.length);
}

function sheet_() {
  const sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sh) throw new Error('Run setup() first.');
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Stops spreadsheet formula injection (=, +, -, @) and trims length.
function clean_(v, max) {
  let s = String(v == null ? '' : v).trim().slice(0, max || 200);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

/** Receives a registration from index.html */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    const d = JSON.parse(e.postData.contents || '{}');
    if (d.website) return json_({ ok: false, error: 'Rejected.' }); // honeypot

    const delegates = parseInt(d.delegates, 10);
    const required = ['church', 'pastor', 'location'];
    for (const k of required) {
      if (!String(d[k] || '').trim()) return json_({ ok: false, error: 'Missing ' + k + '.' });
    }
    if (!(delegates >= 1 && delegates <= MAX_DELEGATES)) return json_({ ok: false, error: 'Invalid number of delegates.' });

    lock.waitLock(20000);
    const sh = sheet_();
    const ref = 'JR26-' + String(sh.getLastRow()).padStart(4, '0'); // row 2 → JR26-0001
    sh.appendRow([
      ref, new Date(),
      clean_(d.church, 120), clean_(d.pastor, 100), clean_(d.location, 160),
      delegates, clean_(d.remarks, 500)
    ]);
    SpreadsheetApp.flush();
    return json_({ ok: true, ref: ref });
  } catch (err) {
    return json_({ ok: false, error: String(err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

/** Admin data for admin.html: ?action=list&key=ADMIN_KEY */
function doGet(e) {
  const p = (e && e.parameter) || {};
  // Script property ADMIN_KEY overrides this default if set.
  const key = PropertiesService.getScriptProperties().getProperty('ADMIN_KEY') || 'JESUSREIGN2026';
  if (p.action !== 'list') return json_({ ok: true, service: 'Jesus Reigns 2026 registration' });
  if (!key || p.key !== key) return json_({ ok: false, error: 'Wrong admin key.' });

  const values = sheet_().getDataRange().getValues();
  const headers = values.shift();
  const rows = values.map(r => r.map(c => c instanceof Date
    ? Utilities.formatDate(c, 'Asia/Manila', 'yyyy-MM-dd HH:mm') : c));
  return json_({ ok: true, headers: headers, rows: rows });
}
