# 07 — Deployment

> **⚠️ STOP — CRITICAL RULES:**
> 1. **You do NOT have access to the code** — you MUST ask the user for files
> 2. **NEVER create from scratch** — ask "Please provide: [filename]" first
> 3. **READ before editing** — never overwrite without reading
> 4. **BUILD before deploy** — always run `npm run build` first
>
> **AI INSTRUCTION:** Read this module if you need to build or deploy the app. Ask the user for files listed below. This is 1 of 13 modules — see `handover/00-index.md` for the full list.

---

## Other Modules You May Need
- Known issues: `handover/11-known-issues.md`
- Troubleshooting AI: `handover/05-ai-gemini.md`

## Files To Request
- `firebase.json` — Firebase hosting config
- `.firebaserc` — Firebase project linking
- `package.json` — dependencies and scripts
- `vite.config.ts` — Vite build config

---

## Build & Deploy
```bash
# Install dependencies
npm install

# Build (generates single-file dist/index.html)
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

**Live URL:** https://segal-build-app.web.app

## Firebase Configuration

### firebase.json
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "headers": [{
      "source": "**/*.@(html|js|css)",
      "headers": [{ "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" }]
    }]
  }
}
```

### .firebaserc
```json
{
  "projects": { "default": "segal-build-app" }
}
```

## Environment Variables (.env)
```bash
# Optional — AI features (free tier)
VITE_GEMINI_API_KEY=your_gemini_key

# Optional — Photo uploads (base64 fallback if not set)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset

# Future — Firebase database (not yet implemented)
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=segal-build-app
```

## Windows Development
```bash
# Clone
git clone https://github.com/hersvami/segal-build-app.git
cd segal-build-app

# Install
npm install

# Dev server
npm run dev

# Build for production
npm run build

# Deploy
firebase login
firebase deploy
```

## Troubleshooting
| Issue | Solution |
|---|---|
| Build fails with import error | Check file exists, check export name |
| Cache shows old version | Hard refresh: Ctrl+F5 |
| Firebase deploy fails | Run `firebase login` first |
| `firebase.json not found` | Ensure firebase.json is in project root |
| AI not working | Check Gemini API key, or use without (keyword fallback) |
| Photos not uploading | Cloudinary env vars not set — falls back to base64 |
| `#` not recognized (Windows) | Don't copy comment lines, just run the command |

## Console Links
- Firebase: https://console.firebase.google.com/project/segal-build-app
- Cloudinary: https://cloudinary.com/console
- GitHub: https://github.com/hersvami/segal-build-app
- Gemini API Key: https://aistudio.google.com/apikey
