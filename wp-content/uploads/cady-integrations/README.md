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

Upload the `cady-integrations` folder to **`/wp-content/uploads/cady-integrations/`** on cadybt.com. Use SFTP or the host's file manager: WordPress's Media Library won't accept `.js` or `.css` files.

You can leave the `divi/` folder off the server. It only holds the snippets you paste into Divi, so it doesn't need to be online.

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

The list of integrations is a spreadsheet file, **`integrations.csv`**. Whatever is in the newest uploaded copy is what visitors see.

**Where the page looks for it, in order:**
1. The newest file named `integrations….csv` in the WordPress **Media Library**. Uploading through **Media > Add New** works even though WordPress renames repeats to `integrations-1.csv`, `integrations-2.csv` and so on: the newest one wins.
2. `integrations.csv` in this folder, if nothing suitable is in the Media Library.
3. The backup list in `js/integrations-data.js`, so the page never shows up empty. That backup is a snapshot from setup and isn't updated when the CSV changes.

**To change the list:**
1. Open the private team page (section 6). Search, add, edit, or hide apps. Hiding takes an app off the page without deleting it.
2. Click **Download updated file**.
3. In WordPress, go to **Media > Add New** and upload it. The change is live straight away.

**Starting from a spreadsheet:** on the team page, click **Open a spreadsheet** and choose an Excel (`.xlsx`) or CSV file. The team page checks it for problems (unknown categories, missing descriptions, typos in the Wildix or Mitel columns, duplicates) and lists anything to fix. Then download and upload as above. Someone can also save straight from Excel as **CSV UTF-8** and upload that. Keep the column names as they are. GUIDE.md explains each column.

An AI assistant such as Claude can also edit the file: GUIDE.md has a ready-to-paste request and the rules it should follow.

**Good to know:**
- The Media Library lookup uses WordPress's standard REST API (`/wp-json/`). It's on by default, but some security plugins switch it off for visitors who aren't logged in. To check, open `https://cadybt.com/wp-json/wp/v2/media?search=integrations` while logged out: it should show a list, not an error. If it's blocked, upload the CSV over `integrations.csv` in this folder with SFTP instead. The page falls back to that copy automatically.
- If WordPress refuses the upload ("Sorry, you are not allowed to upload this file type"), the host is blocking CSV files. Use the SFTP route above instead.
- Old copies (`integrations-1.csv` and so on) can be deleted from the Media Library whenever you like. Keep the newest one.
- The CSV is a public file, because the public page has to read it. Anyone with its address could see hidden apps and source links, so don't put private notes in it.
- If a caching plugin or CDN caches the uploads folder, clear it after uploading a new CSV. If an optimization plugin combines scripts, exclude these files.
- Anyone who can upload to the Media Library can change the list, which normally means Authors, Editors and Admins.

## 6. The private team page

A page only Cady's staff can see, for managing the list: search, **+ Add integration**, **Edit**, **Hide / Show**, **Open a spreadsheet** and **Download updated file**. It needs no plugin and no outside accounts: the WordPress login is what keeps it private.

1. Create a new page, e.g. `/integrations-team/`. In the page's publish settings set **Visibility: Private**, so only logged-in Editors and Admins can see it. Visitors who aren't logged in get "Page not found", and it stays out of menus and search engines.
2. Add one full-width section with one **Code** module, and paste in `divi/team-page-module.html`.

The team page only prepares the file. Nothing changes on the public page until the downloaded file is uploaded. If someone leaves the page with changes they haven't downloaded, the browser warns them first.

## Checks after publishing

- Click Wildix, then Salesforce. The pairing should show a yellow **Works directly** label and logos for both. Press the browser's back button and confirm it returns to the app list.
- Click **Book a call** and confirm it opens Cady's booking page.
- On the team page, hide one app, download the file and upload it under Media > Add New. Refresh the public page: the app should be gone. Then show it again the same way.
- Log out and open the team page's address. WordPress should show "Page not found".
- Check the page on a phone. Nothing should scroll sideways.
