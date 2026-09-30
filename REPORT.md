# NeuroAd frontend — change report

Date: 2026-09-30

New app at this repo. The marketing site (`Silly-Goose-duh/neuroad`) and the survey API (`afthahjr/neuroadsurveyfork`) were not modified.

## What landed

Frontend shell from landing through signup, survey, and dashboard.

| Route | What it is |
|---|---|
| `/` | Landing. Three.js neural field, brand wordmark `neuro.ad`, CTA into signup. |
| `/signup` | Google, GitHub, Facebook, and email. Fixture only — no real OAuth. |
| `/login` | Same providers. Existing profile goes to the dashboard; otherwise the survey. |
| `/survey` | Basic company details. Partial profile is enough to continue. |
| `/dashboard` | Dark sidebar shell (layout reference only, not a podcast clone). |
| `/dashboard/run` | Test Campaigns using NMFM. File stays on the device. Scores are fixtures. |
| `/dashboard/socials` | Connect Instagram, Facebook, YouTube. Saved in localStorage. Not live. |
| `/dashboard/trends` | Sample bar chart. Not a live prediction. |
| `/dashboard/history` | Sample campaign list. |
| `/dashboard/profile` | Edit the company profile. |
| `/dashboard/settings` | Sign out, or clear local sample data. |

NMFM test lives at `/dashboard/run` because a `test` directory could not be created on this Windows machine.

## Brand (neuro.ad)

- Wordmark: `neuro.ad`
- Type: DM Sans
- Ink `#1C1C1C`, cream `#FFFDE1`, orange `#BE5205`, gold `#F59E0B`, void `#111111`
- Radius 16
- Tagline: Clever | Strategic | Adaptable
- Tokens: `lib/brand.ts`, `app/globals.css`

## What is not real yet

- Sign-in and profile are `localStorage` on this browser. Nothing is uploaded.
- Scores (overall 82 and the six signals) are fixtures in `lib/fixtures.ts`, labeled sample.
- NMFM is not connected. The landing paper citation (TRIBE v2, arXiv 2605.04326) is not this model.
- No `.env` file exists. There is no secret to restore after sign-out.
- `node_modules` and `.next` are gitignored. Restore with `npm install`.

## Pipeline this UI follows

New user → survey (basic company details, partial or complete) → dashboard. The only action that produces the seven-score report is **Test Campaigns using NMFM**. Connect Socials, trend analysis, history, profile, and settings are separate nav items.

Report scores: Audience Match, Emotional Impact, Attention, Memory Retention, Purchase Intent, Trend Alignment, Overall Neuromarketing Score.

## How to run

```bash
npm install
npm run dev
```

Open http://localhost:3000.

`npm run build` succeeded on 2026-09-30 (Next.js 15.5.26). Routes `/`, `/signup`, `/login`, `/survey`, `/dashboard`, and `/dashboard/run` returned HTTP 200 from the dev server.
