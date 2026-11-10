# Adding or changing an integration

**If the page is connected to the Cady Integrations List Google Sheet (`sheetUrl` is set), make changes in the sheet instead.** Its How to use tab covers everything. This guide is for editing the backup list in the file, or for a site that doesn't use the sheet.

Everything you edit lives in **`js/integrations-data.js`** in the uploaded `cady-integrations` folder. (In the single-file preview, `integration-explorer.html`, it's Part 1 at the top.) Don't change the other CSS or JS files. Logos are separate image files in `images/logos/`.

## Add an integration

1. Download `js/integrations-data.js` from `/wp-content/uploads/cady-integrations/` (SFTP or the host's file manager) and open it in a text editor.
2. Find the `integrations: [` list and the category comment it belongs under, such as `/* ---------- CRM & Sales ---------- */`.
3. Copy an existing entry and paste it below. Change the details:

```js
{ name: "Pipedrive", category: "CRM & Sales", systems: { wildix: "Middleware", mitel: "Direct" },
  desc: "See who's calling from your Pipedrive contacts and jump straight to their deal.",
  aka: "pipe drive", logo: "" },
```

4. Make sure every entry **except the last one** ends with `},`. A missing comma is the most common mistake, and it stops the explorer from loading.
5. Save, upload it over the old copy, then open the page (refresh, and clear any caching plugin) and search for the new name to check it.

## The fields

| Field | What to put |
|---|---|
| `name` | The app name customers know. |
| `category` | Exactly one of the names in the `categories` list, spelled the same way. |
| `industries` | Optional. Industries the app is made for, e.g. `industries: ["Legal"]`, using names from the `industries` list. Leave it out for general apps; they show for every industry under "Works for any business". |
| `systems` | Each phone system, then how it connects: `"Direct"`, `"Add-on"`, `"Custom"` or `"Ask"`. **Only add a system if a source confirms it.** Leave a system out and the explorer shows "Ask us" for it. |
| `desc` | One plain-English sentence on what it does for the business. Write it yourself; don't paste vendor text. |
| `note` | Optional caveat for one phone system, placed inside that system's `details`, e.g. `details: { wildix: { note: "Per-user monthly add-on fee applies.", gets: [...], needs: [...] } }`. |
| `featured: true` | Optional. Shows the app first. Use it for names US buyers recognize. |
| `international: true` | Optional. Hides the app until the visitor ticks "Include international listings". |
| `logo` | Optional. Either the name of a logo listed in `js/logos.js` (e.g. `"salesforce"`), or a full image URL, e.g. a square PNG or SVG uploaded to `images/logos/` or the Media Library. Leave `""` for a lettered tile. |
| `aka` | Optional extra search words, separated by spaces, e.g. `"help desk tickets"`. |
| `details` | Optional, but it's what fills the pairing view. For each phone system, a short "What you get" list and "What you need" list, e.g. `details: { wildix: { gets: ["Caller pop-ups", "Click to call"], needs: ["A Pipedrive account"] } }`. Only list what a source confirms. |

## Common changes

- **Mitel data arrives:** add `mitel: "Direct"` (or the right type) to existing entries, add a `mitel: { gets: [...], needs: [...] }` block to their `details`, add new Mitel-only entries, then change Mitel's `status` from `"coming-soon"` to `"live"` in the `systems` list.
- **Launch System 3 or 4:** in the `systems` list, change `name` to the real name and `status` to `"live"`. Keep the `id` short and lowercase (e.g. `"ringcentral"`) and use that same id inside entries' `systems`.
- **Remove an integration:** delete its whole `{ ... },` block.
- **Add a category or industry:** add its name to the `categories` or `industries` list where you want it to appear in the filter.
- **Change phone number, contact page or booking link:** edit `phone`, `contactUrl` or `bookingUrl` in `settings`. Every "Book a call" button uses `bookingUrl`. While it's empty, the buttons are placeholders and don't go anywhere.
- **Rebuild after editing (developers):** source files live in `src/`. Run `python3 build.py dist` to regenerate the single-file previews and the `dist/cady-integrations/` handoff folder.

## Text rules

- Put text inside straight double quotes `"..."`. If the text needs a double quote, use single quotes inside it instead.
- Apostrophes are fine: `"you're"`.
- Keep descriptions to about 100 characters so cards stay even.

## If the explorer disappears after an edit

That almost always means a missing comma, quote or bracket. Undo your last change (Divi keeps revision history), or paste your edited entry into a free JavaScript checker such as jshint.com to find the line.
