# 05 — AI & Gemini (FREE Tier Only)

> **⚠️ STOP — CRITICAL RULES:**
> 1. **You do NOT have access to the code** — you MUST ask the user for files
> 2. **NEVER create from scratch** — ask "Please provide: [filename]" first
> 3. **READ before editing** — never overwrite without reading
> 4. **FREE TIER ONLY** — no paid Gemini models, no billing
>
> **AI INSTRUCTION:** Read this module if you need to work on AI features, change the model cascade, or debug Gemini API issues. This is 1 of 13 modules — see `handover/00-index.md` for the full list.

---

## Other Modules You May Need
- Pricing categories (what AI maps to): `handover/04-pricing-categories.md`
- Data types: `handover/06-data-types.md`
- Known issues: `handover/11-known-issues.md`

## Files To Request
- `src/utils/services.ts` — **main file** — all AI logic lives here
- `src/components/variationBuilder/ScopeStep.tsx` — UI that calls AI functions
- `src/utils/pricing/scopeRecogniser.ts` — keyword fallback recogniser
- `src/utils/categories/core.ts` — category IDs that AI maps to

---

## Objective
All AI features use Google Gemini's **FREE tier only** — no credit card, no billing, no paid plans. The app uses a smart model cascade to maximise free daily capacity.

## Free Model Cascade
When a model hits its rate limit (HTTP 429), the app automatically falls back to the next model. Total free capacity: **~2,850 requests/day**.

| Priority | Model | Free RPM | Free RPD | Quality |
|---|---|---|---|---|
| 1st | gemini-2.5-flash | 10 | 250 | Best free quality |
| 2nd | gemini-2.5-flash-lite | 15 | 1,000 | Most generous quota |
| 3rd | gemini-1.5-flash | 15 | 1,500 | Legacy — highest daily |
| 4th | gemini-2.0-flash | 5 | 100 | Stable fallback |
| 5th | Keyword fallback | ∞ | ∞ | No API needed |

### How Cascade Works
1. App tries **gemini-2.5-flash** first (best quality)
2. If 429 (rate limited) or 503 (overloaded): model marked as "rate-limited" for 65 seconds, tries next model
3. If ALL models fail: falls back to keyword matching
4. After 65 seconds, rate-limited models are retried
5. UI shows which model was used and current status

### Key Design Decisions
- **NO paid models** (gemini-2.5-pro was removed — not reliably free)
- **NO billing required**
- App works 100% without API key (keyword fallback)
- API key just adds "✨ polish" — everything else works without it

## Getting Your Free API Key
1. Go to **https://aistudio.google.com/apikey**
2. Sign in with any Google account
3. Click **"Create API Key"**
4. Select or create a Google Cloud project
5. Copy the key
6. Paste into the app's "Gemini API Key" field in the scope builder

**No credit card required. No billing setup needed.**

## AI Features

### 1. Scope Recognition
- Builder types: "bathroom reno 3x2.5m full gut"
- AI identifies: "wet-areas" category with high confidence
- Falls back to keyword matching if no API key

### 2. Scope Polishing (✨ Button)
- Builder types rough notes → AI rewrites into professional Australian construction scope
- Example: "gut bath 2x2, move toilet" → "Complete demolition of existing 4m² bathroom including removal of all fixtures..."

### 3. Category Classification
- AI maps free-text to 43 construction categories
- Uses full category ID list for exact matching

## UI Indicators
- 🟢 "AI Active" badge when key entered
- Model indicator: "Last used: Gemini 2.5 Flash"
- Cascade status display
- "Processing..." during API calls
- Link to get free API key: https://aistudio.google.com/apikey

## Implementation Details
All AI logic is in `src/utils/services.ts`:
- `callGeminiWithFallback()` — core cascade function
- `polishScopeWithAI()` — scope rewriting
- `recogniseScopeWithAI()` — category classification
- `getModelStatus()` — UI status for available/rate-limited models

## Rate Limit Sources
- https://ai.google.dev/pricing
- https://ai.google.dev/gemini-api/docs/rate-limits
