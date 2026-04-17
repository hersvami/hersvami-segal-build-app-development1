# 03 — Features

> **⚠️ STOP — CRITICAL RULES:**
> 1. **You do NOT have access to the code** — you MUST ask the user for files
> 2. **NEVER create from scratch** — ask "Please provide: [filename]" first
> 3. **READ before editing** — never overwrite without reading
> 4. **CHECK HERE FIRST** — the feature may already be done
>
> **AI INSTRUCTION:** Read this module to understand what features exist and how they work. Ask the user for files listed below. This is 1 of 13 modules — see `handover/00-index.md` for the full list.

---

## Other Modules You May Need
- File locations: `handover/02-file-structure.md`
- Data types: `handover/06-data-types.md`
- What's broken: `handover/09-required-fixes.md`

## Files To Request For Feature Work
- `src/App.tsx` — main routing and state
- `src/types/domain.ts` — all data types
- `src/logic/state.ts` — state management functions
- Then request the specific component file for the feature you're working on

---

## 3.1 Project Management ✅
**Files:** `src/components/ProjectForm.tsx`, `src/components/PhotoCapture.tsx`, `src/App.tsx`
- Create projects with: name, address, customer name/email/phone
- Hero photo upload or camera capture on project creation
- Hero photo displayed as project banner with gradient overlay
- Send welcome message via 5 channels (Gmail, Mail App, Copy, WhatsApp, SMS)
- Welcome message includes: portal URL, login email, temp password, view/download quotation
- Export project data as JSON download
- Company switching (Segal Build / Segval)
- Delete projects with confirmation

## 3.2 Quote & Variation Builder (4-Step Wizard) ✅
**Files:** `src/components/VariationBuilder.tsx`, `src/components/variationBuilder/ScopeStep.tsx`, `src/components/variationBuilder/Editors.tsx`

**Quotes and Variations are SEPARATE document types:**

| | Quote | Variation |
|---|---|---|
| When | Before project starts | After project has started |
| What | Original scope + price | Change to original scope |
| Badge | QTE | VAR |
| Button | "New Quote" (always) | "New Variation" (requires approved quote) |

**Step 1 — Scope Input:**
- Free-text description + AI/keyword category recognition (43 categories)
- Category browser (43 categories in 8 groups)
- Multi-scope support, cross-category suggestions (auto + suggested)
- ✨ AI Polish button, Variation mode: reference quote + reason for change

**Step 2 — Details:** Per-scope dimensions + dynamic category questions
**Step 3 — Pricing:** OH%/Profit%/Contingency% controls, editable PC items/inclusions/exclusions
**Step 4 — Review:** All scopes, full pricing summary, save

## 3.3 External Quote Baseline ✅
**File:** `src/components/ExternalQuoteModal.tsx`
- For jobs that started outside the app
- Enter: reference number, original date, approved amount, scope summary
- Saved as approved baseline record (source: "external", locked)
- Enables creating variations against external jobs

## 3.4 Pricing Engine ✅
**Files:** `src/utils/pricing/engine.ts`, `src/utils/pricing/quoteCalculator.ts`
- Formula: Trade Cost → + OH% → + Profit% → + Contingency% → + GST 10% → Total
- Rate types: $/m², $/lm, $/item, $/allow
- Builder sees full cost transparency; Customer sees client price only

## 3.5 Report Views ✅

### Builder View (`src/components/report/BuilderView.tsx`)
- Pricing sliders (OH%, Profit%, Contingency%)
- Summary cards, profit analysis, trade breakdown
- Multi-scope collapsible sections, PC/Inclusions/Exclusions
- **Action log** — timestamped change log + add internal notes
- Save pricing button

### Customer View (`src/components/report/CustomerView.tsx` + `CustomerViewParts.tsx`)
- Company letterhead with logo, ABN, licence
- Multi-scope pricing tables, PC items, totals
- Progress photos grid (date stamp, stage tag, caption)
- Inclusions (green) / Exclusions (red) panels
- Terms & Conditions, workmanship guarantee
- Approve & Sign / Request Changes (no "Decline" button)

### Progress Hub (`src/components/report/ProgressHub.tsx`)
- Photo upload (Upload + Take Photo via PhotoCapture component)
- Cloudinary upload with base64 fallback
- Stage tracker: Not Started → In Progress → Complete
- Progress update sender

## 3.6 Report Sending ✅
**File:** `src/components/report/ReportSendModal.tsx`
- Email tab: Gmail, Mail App, Copy
- SMS/WhatsApp tab: WhatsApp, SMS
- Professional message with "view and download your quotation/variation"
- Mark as Sent updates document status

## 3.7 Welcome Messages ✅
**Files:** `src/components/SendWelcomeEmailModal.tsx`, `src/components/welcomeMessages.ts`
- 5 channels: Gmail, Mail App, Copy Email, WhatsApp, SMS
- Includes: portal URL, login email, temp password
- Professional branded format with company details

## 3.8 AI Features ✅
**File:** `src/utils/services.ts` (see also `handover/05-ai-gemini.md`)
- Scope recognition + polishing via free Gemini cascade
- ~2,850 free requests/day, keyword fallback without API key

## 3.9 Hero Photo ✅
**Files:** `src/components/PhotoCapture.tsx`, `src/components/ProjectForm.tsx`
- Upload or camera capture during project creation
- Cloudinary upload with base64 fallback
- Displayed as project banner

## 3.10 Cross-Category Linking ✅
- Auto (priority) + Suggested cross-links, chain builder prevents duplicates

## 3.11 Pre-Filled Quote Items ✅
**File:** `src/utils/pricing/quoteDefaults.ts`
- PC Items, Inclusions, Exclusions pre-filled per category, all editable

## 3.12 Project Export ✅
**File:** `src/utils/helpers.ts`
- Download project data as JSON from sidebar
