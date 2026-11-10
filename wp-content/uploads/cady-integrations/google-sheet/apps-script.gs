/* Cady integrations: lets the private team page read and save the Integrations tab of this sheet.

   One-time setup (sheet owner):
   1. In the sheet: Extensions > Apps Script. Replace everything in Code.gs with this file.
   2. Change KEY below to a long random phrase. Put the same phrase in the team page's settings.
   3. Deploy > New deployment > type: Web app. Execute as: Me. Who has access: Anyone. Deploy and allow access.
   4. Copy the Web app URL into the team page's settings (endpoint).
   After changing this file later: Deploy > Manage deployments > Edit > Version: New version > Deploy.

   "Anyone" only means the link works without a Google sign-in. Every request must carry KEY,
   and the team page holding KEY sits on a private WordPress page. */
var KEY = "CHANGE-ME";
var TAB = "Integrations";
var CHECKBOXES = ["Featured", "International", "Hide from page"];

function sheet_() {
  var s = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(TAB);
  if (!s) throw new Error('There is no tab named "' + TAB + '".');
  return s;
}
function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function headers_(s) {
  return s.getRange(1, 1, 1, s.getLastColumn()).getValues()[0].map(function (h) { return String(h).trim(); });
}
function text_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), "yyyy-MM-dd");
  return v;
}
function today_() {
  var d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
/* turn a value from the team page into what the cell should hold */
function cell_(header, v) {
  if (CHECKBOXES.indexOf(header) > -1) return v === true || v === "TRUE" || v === "true";
  if (header === "Date added") {
    var m = String(v || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : "";
  }
  v = v == null ? "" : String(v);
  /* stop text being read as a formula */
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}
function list_(s) {
  var h = headers_(s), n = s.getLastRow() - 1, rows = [];
  var vals = n > 0 ? s.getRange(2, 1, n, h.length).getValues() : [];
  vals.forEach(function (r, i) {
    if (String(r[0]).trim() === "") return;
    var o = {};
    h.forEach(function (k, j) { o[k] = text_(r[j]); });
    rows.push({ row: i + 2, data: o });
  });
  return { headers: h, rows: rows };
}

function doGet(e) {
  if (!e || !e.parameter || e.parameter.key !== KEY) return out_({ error: "Not allowed." });
  return out_(list_(sheet_()));
}

function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); } catch (x) { return out_({ error: "Bad request." }); }
  if (body.key !== KEY) return out_({ error: "Not allowed." });
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var s = sheet_(), h = headers_(s), data = body.data || {};
    var col = {};
    h.forEach(function (k, j) { col[k] = j; });
    if (!("Name" in col)) return out_({ error: 'The sheet needs a "Name" column.' });
    var current = list_(s);
    var name = String(data["Name"] == null ? "" : data["Name"]).trim();
    var taken = function (n, exceptRow) {
      return current.rows.some(function (r) { return r.row !== exceptRow && String(r.data["Name"]).trim().toLowerCase() === n.toLowerCase(); });
    };

    if (body.action === "add") {
      if (!name) return out_({ error: "Name is required." });
      if (taken(name, 0)) return out_({ error: name + " is already on the list. Search for it and edit it instead." });
      /* the date it went on the page: today, unless it starts hidden */
      if (!cell_("Hide from page", data["Hide from page"]) && !data["Date added"]) data["Date added"] = Utilities.formatDate(today_(), Session.getScriptTimeZone(), "yyyy-MM-dd");
      var row = h.map(function (k) { return cell_(k, data[k]); });
      s.getRange(s.getLastRow() + 1, 1, 1, h.length).setValues([row]);
    } else if (body.action === "update") {
      var r = Number(body.row);
      if (!(r >= 2 && r <= s.getLastRow())) return out_({ error: "That row no longer exists. Refresh the list." });
      var range = s.getRange(r, 1, 1, h.length), was = range.getValues()[0];
      /* make sure nobody sorted or deleted rows since the page loaded */
      if (String(was[col["Name"]]).trim() !== String(body.name || "").trim()) return out_({ error: "The sheet changed since you opened it. Refresh the list and try again." });
      if ("Name" in data && !name) return out_({ error: "Name is required." });
      if ("Name" in data && taken(name, r)) return out_({ error: name + " is already on the list." });
      var next = was.slice();
      Object.keys(data).forEach(function (k) { if (k in col) next[col[k]] = cell_(k, data[k]); });
      /* first time it's shown on the page: record the date */
      if ("Date added" in col && "Hide from page" in col && !next[col["Hide from page"]] && !next[col["Date added"]]) next[col["Date added"]] = today_();
      range.setValues([next]);
    } else {
      return out_({ error: "Unknown action." });
    }
    SpreadsheetApp.flush();
    return out_(list_(s));
  } finally {
    lock.releaseLock();
  }
}
