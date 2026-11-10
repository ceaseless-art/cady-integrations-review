# Cady integrations: Divi handoff

This folder is the whole integrations feature: the landing page and the Integration Explorer. Everything is in separate files. No images are embedded in the code.

```
cady-integrations/
  css/
    explorer.css            Explorer styles (scoped to #cady-ix)
    landing.css             Landing page styles (scoped to #cady-lp / #cady-lp-1…6)
  js/
    integrations-data.js    Settings and the integration list (the only file editors change)
    logos.js                Maps each logo name to its image file
    explorer.js             Explorer behavior
    landing.js              Landing page behavior
  images/
    logos/                  133 logo files (SVG and PNG)
  divi/
    landing-sections/       6 snippets, one per Divi section (01-hero … 06-final-call-to-action)
    landing-page-module.html  The whole landing page in a single Code module (alternative)
    explorer-module.html    The explorer on its own, for any other page
    page-settings/          Optional one-line settings (open on Wildix, Mitel, an industry…)
    team-page-module.html   The private team page for managing the list (section 6)
  google-sheet/
    apps-script.gs          Lets the team page save to the Google Sheet (section 6)
  preview.html              Open locally to preview the full page
  README.md                 This file
```

## 1. Upload the folder

Upload the whole `cady-integrations` folder to **`/wp-content/uploads/cady-integrations/`** on cadybt.com. Use SFTP or the host's file manager: WordPress's Media Library won't accept `.js` or `.css` files.

Check it worked: `https://cadybt.com/wp-content/uploads/cady-integrations/preview.html` should show the full page.

If the folder has to live somewhere else, change the paths at the top of each `divi/` snippet to match.

## 2. Build the landing page in Divi 5

**Recommended: one Code module per section.**
1. Create the page (e.g. `/integrations/`).
2. Add 6 sections. For each, use a full-width row (or set the row width to 100%) with one **Code** module.
3. Paste the matching file from `divi/landing-sections/` into each Code module, in order 01 to 06.
   - Section 01 also loads all the CSS and JavaScript, so keep it first.
   - Section 02 holds the explorer.
4. Set each Divi section's padding to 0. The snippets bring their own spacing and background colors.

**Alternative:** paste `divi/landing-page-module.html` into a single Code module in one full-width section.

**The explorer on other pages:** paste `divi/explorer-module.html` into a Code module. To pre-select something, add a second Code module with a file from `divi/page-settings/` (e.g. `wildix.html`, `mitel.html`, `healthcare.html`, `finance.html`).

## 3. Settings to check

In `js/integrations-data.js`, under `settings`:
- **`bookingUrl`:** Cady's HubSpot booking page (set). The "Book a call" buttons open it in a new tab.
- **`sheetUrl`:** the published CSV link of the **Cady Integrations List** Google Sheet. When it's set, the page reads the integration list from the sheet. Leave it `""` to use the list in this file.
- **`phone`, `contactUrl`:** already set to 800-347-3886 and /contact-us/.

## 4. Sub pages and links

Each app and each pair is its own view, with its own link on the landing page:
- `/integrations/#/apps/salesforce`: Salesforce and how it works with each phone system
- `/integrations/#/wildix/salesforce`: the Wildix + Salesforce pairing
- `/integrations/#/mitel`: apps that work with Mitel

## 5. Updating integrations later

The integration list lives in the **Cady Integrations List** Google Sheet. Edit the Integrations tab and the page picks up the change on its own, usually within 5 minutes. The sheet's **How to use** tab explains each column, and the **Date added** column records when each app went on the page.

To connect the sheet (one time):
1. In the sheet, go to **File > Share > Publish to web**.
2. Choose the **Integrations** tab and **Comma-separated values (.csv)**, then click **Publish**.
3. Copy the link and paste it into `sheetUrl` in `js/integrations-data.js`, then upload that file over the old copy.

Publishing shares only a read-only copy of the Integrations tab's values. The sheet itself stays private to the people it's shared with.

If the sheet can't be reached, the page uses the backup list built into `js/integrations-data.js`, so it never shows up empty. That backup is a snapshot from setup and isn't updated from the sheet.

If a caching or optimization plugin combines scripts, exclude these four files, or clear its cache after updating.

## 6. The private team page

A page for Cady's staff to manage the list: search, **+ Add integration**, **Edit**, and **Hide / Show** (hiding takes an app off the public page without deleting it). It saves to the Google Sheet, and the public page picks up changes within about 5 minutes. Nobody needs a Google account; the WordPress login is what keeps it private.

**Connect the sheet (sheet owner, one time):**
1. Open the sheet, then **Extensions > Apps Script**. Replace everything in `Code.gs` with `google-sheet/apps-script.gs` from this folder.
2. Change `KEY` near the top to a long random phrase and save.
3. **Deploy > New deployment**, type **Web app**. Execute as: **Me**. Who has access: **Anyone**. Deploy, allow access, and copy the **Web app URL**.

**Build the page (website team):**
1. Create a new page, e.g. `/integrations-team/`. In the page's publish settings set **Visibility: Private**, so only logged-in editors and admins can see it.
2. Add one full-width section with one **Code** module, and paste in `divi/team-page-module.html`.
3. At the top of that code, fill in `endpoint` (the Web app URL) and `key` (the same phrase as `KEY`).

Until `endpoint` is filled in, the page runs in demo mode: it shows the list but doesn't save anything.

Keep the page private. Anyone who can see it can edit the list.

## Checks after publishing

- Click Wildix, then Salesforce. The pairing should show a yellow **Works directly** label and logos for both. Press the browser's back button and confirm it returns to the app list.
- Click **Book a call** and confirm it opens Cady's booking page.
- Add a test row to the sheet, wait about 5 minutes, refresh the page and search for it. Then delete the row.
- Log out and open the team page's address. WordPress should show "Page not found".
- On the team page, hide an app and show it again. Both changes should appear in the sheet.
- Check the page on a phone. Nothing should scroll sideways.
