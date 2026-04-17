# 01 — Overview

> **⚠️ STOP — CRITICAL RULES:**
> 1. **You do NOT have access to the code** — you MUST ask the user for files
> 2. **NEVER create from scratch** — ask "Please provide: [filename]" first
> 3. **READ before editing** — never overwrite without reading
> 4. **Only work on files in "Files To Request"** — don't touch other files
>
> **AI INSTRUCTION:** Read this module to understand the project context and rules. This is background only — for specific tasks, read the relevant module from `handover/00-index.md`.

---

## Other Modules You May Need
- File inventory: `handover/02-file-structure.md`
- Features: `handover/03-features.md`
- Data types: `handover/06-data-types.md`
- This is 1 of 13 modules — see `handover/00-index.md` for the full list

## Files To Request
- `src/constants/companies.ts` — company configurations
- `src/logic/state.ts` — state management and persistence
- `package.json` — dependencies

---

## What Is Segal Build?
Professional construction quoting and variation management app for Australian domestic builders. Enables builders to create projects, generate AI-assisted multi-scope quotes with Rawlinsons/Cordell-aligned pricing, manage variations, track progress, and communicate with customers.

## Tech Stack
| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript (strict) |
| Build | Vite 7 + vite-plugin-singlefile |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| State | localStorage with version-checked persistence (v2.0) |
| AI | Google Gemini API (FREE tier only — see `handover/05-ai-gemini.md`) |
| Photos | Cloudinary upload with base64 fallback |
| Hosting | Firebase Hosting |

## Companies (2 supported — user switches between them)

### Segal Build Pty Ltd
- ABN: 83 671 632 230
- Phone: 0416 460 164
- Email: james@thesegals.com.au
- Licence: DB-L 12345 (VBA)
- Default OH: 12% | Default Profit: 15%

### Segval
- ABN: 22 334 455 667
- Phone: 0416 460 164
- Email: info@segval.com.au
- Default OH: 12% | Default Profit: 15%

## 12 Important Rules (MUST follow)
1. **No Firebase database** — all state in localStorage (Firestore migration planned)
2. **No "Decline" button** — always "Request Revised Quote" (keeps job alive)
3. **Tailwind CSS v4** — use `@import "tailwindcss"` only in index.css
4. **Single-file build** — vite-plugin-singlefile inlines JS/CSS into one HTML
5. **Gemini API is optional** — keyword fallback always works without API key
6. **Gemini is FREE only** — no paid models, no billing, no credit card
7. **Company logos** — loaded from GitHub raw URLs
8. **Version-checked localStorage** — bump APP_VERSION to clear old data on upgrade
9. **No cache on deploy** — firebase.json has no-cache headers
10. **Quote vs Variation** — separate document types with different workflows
11. **New Variation** — only available when approved quote exists (or external baseline linked)
12. **Files must stay under 300 lines** — split into multiple files if needed
