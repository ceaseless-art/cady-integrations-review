# Adding or changing an integration

The integrations page shows whatever is in **`integrations.csv`** in the `cady-integrations` folder (`/wp-content/uploads/cady-integrations/integrations.csv`).

## The easy way: the team page

1. Open the private team page on the website (README section 6).
2. Search for an app, or click **+ Add integration**. Use **Edit** to change one and **Hide** to take one off the page. Nothing is ever deleted.
3. Click **Download updated file**, then upload `integrations.csv` over the old copy using SFTP or the host's file manager. It's live straight away.

## In Excel

Open `integrations.csv` in Excel, make changes, then **File > Save As > CSV UTF-8** and upload it the same way. Keep the column names exactly as they are.

## The columns

| Column | What to put |
|---|---|
| Name | The app name customers know. |
| Category | One of: CRM & Sales, Productivity & Collaboration, Contact Center & Analytics, Hospitality, Healthcare & Nurse Call, Paging & Emergency Notification, Door Phones & Intercoms, Headsets & Devices, Other. A misspelled category shows as Other. |
| Wildix / Mitel | How the app connects to that phone system: `Direct`, `Add-on`, `Custom` or `Ask`. **Only fill this in when a source confirms it.** Leave it blank and the page shows "Ask us" for that system. |
| Description | One plain sentence on what it does for the business, about 100 characters. Write it yourself rather than copying the vendor's text. |
| Industries | Optional. Industries the app is made for, separated by commas: Healthcare, Finance, Hotels & Hospitality, Education & Government, Manufacturing & Warehousing, Legal, IT & Managed Services, Field Service & Trades, Recruiting & Staffing, Retail, Automotive. Leave blank for general apps. |
| Featured | `TRUE` for names US buyers recognize. They come first when visitors sort by best-known. |
| International | `TRUE` for apps sold mainly outside the US. They stay hidden until a visitor chooses to see them. |
| Hide from page | `TRUE` takes the app off the page without deleting the row. |
| Logo | A full image link (a square PNG or SVG uploaded to the Media Library works), or the name of a logo already in `images/logos/`. Leave blank for initials. |
| Search words | Optional extra words people might search for, separated by spaces. |
| Wildix note / Mitel note | Optional short caveat for that phone system, such as an extra fee. |
| What you get / What you need | Optional. Fills in the detail page for that pairing. One item per line (in Excel, Alt+Enter inside the cell, or Option+Cmd+Enter on a Mac). |
| Date added | The date the app went on the page, as `2026-11-10`. The team page fills it in automatically. Apps already on the list at setup show 2026-11-10. |
| Source | Link to the page that confirms the integration. For the team's records only; not shown on the page. |

## Things still set in `js/integrations-data.js`

These change rarely. Edit the file in a text editor and upload it over the old copy.

- **Phone number, contact page, booking link:** `phone`, `contactUrl`, `bookingUrl` under `settings`.
- **A new category or industry:** add its name to the `categories` or `industries` list where it should appear in the filters.
- **A new phone system:** in the `systems` list, change `System 3` to the real name and `status` to `"live"`. Then add four columns to `integrations.csv` named after it, e.g. `RingCentral`, `RingCentral note`, `RingCentral: what you get`, `RingCentral: what you need`. The team page picks them up automatically.

The `integrations` list in that file is only a backup, used if `integrations.csv` can't be loaded. It doesn't need updating.

## If the explorer disappears after editing `integrations-data.js`

That almost always means a missing comma, quote or bracket. Upload the previous copy again, or paste the file into a free JavaScript checker such as jshint.com to find the line.

## Developers

Source files live in `src/`. `python3 build.py dist` rebuilds the handoff folder, including a fresh `integrations.csv` from the backup list in `src/data.html`. Once Cady has edited the live CSV, download it from the site before rebuilding, or the rebuilt copy will be older than theirs.
