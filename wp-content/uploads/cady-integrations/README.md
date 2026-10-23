# Cady integrations: Divi handoff

This folder is the whole integrations feature: the landing page and the Integration Explorer. Everything is in separate files. No images are embedded in the code.

```
cady-integrations/
  css/
    explorer.css            Explorer styles (scoped to #cady-ix)
    landing.css             Landing page styles (scoped to #cady-lp / #cady-lp-1…7)
  js/
    integrations-data.js    Settings and the integration list (the only file editors change)
    logos.js                Maps each logo name to its image file
    explorer.js             Explorer behavior
    landing.js              Landing page behavior
  images/
    logos/                  133 logo files (SVG and PNG)
  divi/
    landing-sections/       7 snippets, one per Divi section (01-hero … 07-final-call-to-action)
    landing-page-module.html  The whole landing page in a single Code module (alternative)
    explorer-module.html    The explorer on its own, for any other page
    page-settings/          Optional one-line settings (open on Wildix, Mitel, an industry…)
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
2. Add 7 sections. For each, use a full-width row (or set the row width to 100%) with one **Code** module.
3. Paste the matching file from `divi/landing-sections/` into each Code module, in order 01 to 07.
   - Section 01 also loads all the CSS and JavaScript, so keep it first.
   - Section 02 holds the explorer.
4. Set each Divi section's padding to 0. The snippets bring their own spacing and background colors.

**Alternative:** paste `divi/landing-page-module.html` into a single Code module in one full-width section.

**The explorer on other pages:** paste `divi/explorer-module.html` into a Code module. To pre-select something, add a second Code module with a file from `divi/page-settings/` (e.g. `wildix.html`, `mitel.html`, `healthcare.html`, `finance.html`).

## 3. Settings to check

In `js/integrations-data.js`, under `settings`:
- **`bookingUrl`:** Cady's booking page. **Not set yet:** until it's filled in, the "Book a call" buttons show but don't go anywhere.
- **`phone`, `contactUrl`:** already set to 800-347-3886 and /contact-us/.

## 4. Sub pages and links

Each app and each pair is its own view, with its own link on the landing page:
- `/integrations/#/apps/salesforce`: Salesforce and how it works with each phone system
- `/integrations/#/wildix/salesforce`: the Wildix + Salesforce pairing
- `/integrations/#/mitel`: apps that work with Mitel

## 5. Updating integrations later

Edit `js/integrations-data.js` (see GUIDE.md), then upload it over the old copy. New logos go in `images/logos/`; then use the file's URL in the integration's `logo` field, or add the name to `js/logos.js`.

If a caching or optimization plugin combines scripts, exclude these four files, or clear its cache after updating.

## Checks after publishing

- Click Wildix, then Salesforce. The pairing should show a yellow **Works directly** label and logos for both. Press the browser's back button and confirm it returns to the app list.
- Once `bookingUrl` is set, click **Book a call** and confirm it opens Cady's booking page.
- Check the page on a phone. Nothing should scroll sideways.
