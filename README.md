# neuro.ad

Frontend for neuro.ad. Know how a campaign lands before you spend.

Live site: [neuroad-frontend.vercel.app](https://neuroad-frontend.vercel.app)

## Run locally

Node.js 20 or 22.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dev server listens on `0.0.0.0:3000`.

## Routes

| Path | Page |
| --- | --- |
| `/` | Landing |
| `/landing2` | Alternate landing |
| `/demo` | Sample creative analysis |
| `/signup`, `/login` | Account |
| `/survey` | Short survey |
| `/dashboard` | Workspace overview |
| `/creative-analysis` | Creative analyses |
| `/campaign-history` | Campaign history |
| `/trend-analysis` | Trend analysis |
| `/connect-socials` | Connect socials |
| `/profile` | Profile |
| `/settings` | Settings |
| `/results/text` | Text result |
| `/results/audio` | Audio result |
| `/results/video` | Video result |
| `/results/image` | Image result |

## This build

Scores and analysis reads are local fixtures, not a live measurement. Profile, survey, and waitlist data stay in this browser. There is no backend.

React 18, React Router, and Vite 6. Motion uses Anime.js. DM Sans, Inter, and IBM Plex Mono load from Google Fonts.
