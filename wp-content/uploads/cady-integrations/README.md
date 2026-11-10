# Cady integrations: Divi handoff

This folder is the whole integrations feature: the landing page and the Integration Explorer. Everything is in separate files. No images are embedded in the code.

```
cady-integrations/
  css/
    explorer.css            Explorer styles (scoped to #cady-ix)
    landing.css             Landing page styles (scoped to #cady-lp / #cady-lp-1…6)
  integrations.csv          The integration list the page shows (edit with the team page or Excel)
  js/
    integrations-data.js    Settings, plus a backup copy of the list
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
- **`listFile`:** the file the list is read from, `integrations.csv` in this folder. No need to change it.
- **`phone`, `contactUrl`:** already set to 800-347-3886 and /contact-us/.

## 4. Sub pages and links

Each app and each pair is its own view, with its own link on the landing page:
- `/integrations/#/apps/salesforce`: Salesforce and how it works with each phone system
- `/integrations/#/wildix/salesforce`: the Wildix + Salesforce pairing
- `/integrations/#/mitel`: apps that work with Mitel

## 5. Updating integrations later

The list of integrations is one file: **`integrations.csv`** in this folder. The page reads it every time someone visits, so whatever is in the uploaded file is what visitors see.

To change the list:
1. Open the private team page (section 6). Search, add, edit, or hide apps. Hiding takes an app off the page without deleting it.
2. Click **Download updated file**.
3. Upload the downloaded `integrations.csv` over the old one in `/wp-content/uploads/cady-integrations/` (SFTP or the host's file manager). The change is live straight away.

The file also opens in Excel if someone prefers that: one row per app, `TRUE` / `FALSE` for the tick boxes, and a **Date added** column showing when each app went on the page. Save it as **CSV UTF-8** and upload it the same way. Keep the column names as they are.

Don't upload it through the Media Library: it renames files that already exist, so the page would keep reading the old one.

If `integrations.csv` is missing or can't be read, the page uses the backup list in `js/integrations-data.js`, so it never shows up empty. That backup is a snapshot from setup and isn't updated when the CSV changes.

If a caching or optimization plugin combines scripts, exclude these files, or clear its cache after updating. If a caching plugin or CDN caches files in the uploads folder, clear it after uploading a new CSV.

## 6. The private team page

A page only Cady's staff can see, for managing the list: search, **+ Add integration**, **Edit**, **Hide / Show**, and **Download updated file**. It needs no plugin and no outside accounts: the WordPress login is what keeps it private.

1. Create a new page, e.g. `/integrations-team/`. In the page's publish settings set **Visibility: Private**, so only logged-in editors and admins can see it.
2. Add one full-width section with one **Code** module, and paste in `divi/team-page-module.html`.

The team page only prepares the file. Nothing changes on the public page until the downloaded file is uploaded. If someone leaves the page with changes they haven't downloaded, the browser warns them first.

## Checks after publishing

- Click Wildix, then Salesforce. The pairing should show a yellow **Works directly** label and logos for both. Press the browser's back button and confirm it returns to the app list.
- Click **Book a call** and confirm it opens Cady's booking page.
- On the team page, hide one app, download the file and upload it. Refresh the public page: the app should be gone. Then show it again the same way.
- Log out and open the team page's address. WordPress should show "Page not found".
- Check the page on a phone. Nothing should scroll sideways.
