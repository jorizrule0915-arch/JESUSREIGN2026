# Jesus Reigns 2026 – Delegate Registration

Files: `index.html` (public form) · `admin.html` (dashboard + Excel export) · `Code.gs` (database backend)

## 1. Database (Google Sheet) – 5 min
1. Create a new Google Sheet named "Jesus Reigns 2026 Registrations".
2. Extensions → Apps Script → delete the sample code → paste `Code.gs` → Save.
3. Admin key defaults to `JESUSREIGN2026`. To change it without editing code: Project Settings (gear) → Script properties → Add `ADMIN_KEY` = new password.
4. Back in the editor, pick `setup` in the function dropdown → Run → authorise.
5. Deploy → New deployment → type **Web app** → Execute as **Me**, Who has access **Anyone** → Deploy → copy the URL ending in `/exec`.

## 2. Connect the pages
**On Vercel (recommended):** Project → Settings → Environment Variables → add `SCRIPT_URL` = that `/exec` URL (Production, Preview, Development) → Deployments → latest → ⋯ → Redeploy. Both pages read it from `/api/config`.

**Anywhere else:** paste the URL into `let SCRIPT_URL = "";` in **both** `index.html` and `admin.html`.

The yellow "Preview mode" note disappears once it's set.

## 3. Host (free)
Drag the two HTML files onto Netlify Drop (app.netlify.com/drop), or push to GitHub Pages / Vercel. Share the `index.html` link with churches; keep `admin.html` for organisers.

## Data & Excel
- Every submission is a row in the **Registrations** sheet, with a reference no. (JR26-0001…), timestamp, church, pastor, location, delegates, notes.
- **Duplicates:** church names are matched ignoring case, extra spaces and punctuation ("CFF Surigao" = "cff  surigao."). The admin page and Excel show them as GROUP CFF SURIGAO → CFF SURIGAO 1, CFF SURIGAO 2… with a subtotal.
- **Excel:** `admin.html` → **Export to Excel** gives 3 sheets:
  1. *By Church* – grouped list with subtotals (click the [+]/[−] on the left to collapse groups) and a grand total.
  2. *Year Comparison* – one row per church; type last year's delegates in column C and Difference, % Change and Increase/Decrease calculate automatically, including the overall total.
  3. *All Registrations* – every raw entry with filters.
- If you edit `Code.gs` later: Deploy → Manage deployments → Edit → New version (keeps the same URL).
