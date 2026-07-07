# KAIROS — Trainee FullStack Task

Landing page for the Egorov Agency trainee assignment.

## Stack

- **Frontend:** Vite + TypeScript + vanilla CSS
- **Backend:** Python + FastAPI + Google OAuth2
- **Realtime crypto prices:** Binance public WebSocket API

## Project structure

```text
egorov-trainee-fullstack/
├── frontend/                 # Vite + TypeScript landing page
│   └── src/
│       ├── main.ts           # entry point
│       ├── app/              # mount, events, modals, crypto stream, UI state
│       ├── ui/               # HTML templates (page, auth, crypto, modals)
│       ├── services/         # auth, crypto stream, catalog, watchlist, icons
│       ├── content/          # Figma copy strings
│       ├── utils/            # shared helpers (html escaping)
│       └── styles/main.css
├── backend/                  # FastAPI Google OAuth API
│   └── app/
│       ├── main.py           # app factory + middleware
│       ├── config.py         # environment settings
│       ├── oauth.py          # Google OAuth client setup
│       └── routes/           # health + auth endpoints
├── render.yaml               # backend deploy
└── dev.ps1                   # local dev script
```

## Architecture

The project is a small **monorepo** with a static frontend and a thin auth API.

| Layer | Role |
|-------|------|
| **`ui/`** | Builds HTML from Figma copy. No business logic. |
| **`services/`** | Auth, Binance WebSocket stream, coin catalog, watchlist persistence. |
| **`app/`** | Application wiring only: mount, delegated events, modal state, crypto lifecycle. |
| **`backend/routes/`** | HTTP endpoints only. OAuth setup lives in `oauth.py`. |

**Design principles used in this repo:**

- **KISS:** no UI framework, no database, no unnecessary abstractions.
- **Single responsibility:** templates in `ui/`, side effects in `services/`, glue code in `app/`.
- **Stable DOM updates:** crypto prices patch in place instead of re-rendering the page.

**Data flow:**

1. User clicks **Sign in with Google** → frontend redirects to backend `/api/auth/google/login`
2. Backend completes OAuth with Google → redirects back to frontend with user info in the URL
3. Frontend saves user in `sessionStorage` and re-renders the header
4. Crypto prices stream directly from Binance WebSocket to the browser (no backend proxy)

This keeps the backend minimal (as required by the task) while the frontend stays readable without a UI framework.

## Prerequisites

- Node.js 20+
- Python 3.11+ (`py` launcher on Windows)

## Local setup

Quick start (Windows):

```powershell
cd egorov-trainee-fullstack
.\dev.ps1
```

This starts backend on `http://localhost:8000` and frontend on `http://localhost:5173`.

### 1. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

### 2. Backend

```bash
cd backend
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Fill in Google OAuth credentials in `.env`, then run:

```bash
uvicorn app.main:app --reload --port 8000
```

### 3. Hero video

Download `HP.mp4.zip` from the Notion task page and place the extracted file at:

```text
frontend/public/videos/hero.mp4
```

## Google OAuth setup

1. Open [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project
3. Enable **Google+ API / Google Identity**
4. Create **OAuth 2.0 Client ID** (Web application)
5. Add redirect URI:
   - local: `http://localhost:8000/api/auth/google/callback`
   - production: `https://YOUR-BACKEND/api/auth/google/callback`
6. Copy Client ID and Secret into `backend/.env`

## Scripts

```bash
# frontend
npm run dev
npm run build
npm run preview

# backend
uvicorn app.main:app --reload --port 8000
```

## Design reference

- Figma: https://www.figma.com/design/GRJbf19lk1BMSN8khHiUG8/
- Notion task: https://egorovagency.notion.site/Trainee-Task-FullStack-2c44adedc33280ed982ff85778e0e429

## Live demo

- **Frontend:** https://egorov-trainee-fullstack.vercel.app/
- **Backend:** https://kairos-api-pk0k.onrender.com/api/health
- **GitHub:** https://github.com/Alex13411/egorov-trainee-fullstack

## Deployment

**Production URLs:**

- Frontend: `https://egorov-trainee-fullstack.vercel.app`
- Backend: `https://kairos-api-pk0k.onrender.com`

### 1. Backend — Render

1. Open [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**
2. Connect GitHub repo `Alex13411/egorov-trainee-fullstack`
3. Render reads `render.yaml` and creates the `kairos-api` service
4. Set environment variables in Render:

| Variable | Example |
|----------|---------|
| `GOOGLE_CLIENT_ID` | from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | from Google Cloud Console |
| `GOOGLE_REDIRECT_URI` | `https://kairos-api-pk0k.onrender.com/api/auth/google/callback` |
| `FRONTEND_URL` | `https://egorov-trainee-fullstack.vercel.app` |
| `CORS_ORIGINS` | `https://egorov-trainee-fullstack.vercel.app` |

5. Wait for deploy → check `https://kairos-api-pk0k.onrender.com/api/health`

> **Note:** Render free tier sleeps after inactivity. The first OAuth request may take up to 60 seconds while the backend wakes up.

### 2. Frontend — Vercel

1. Open [Vercel](https://vercel.com/) → **Add New Project** → import GitHub repo
2. Set **Root Directory** to `frontend`
3. Add environment variable:

| Variable | Value |
|----------|-------|
| `VITE_AUTH_API_BASE` | `https://kairos-api-pk0k.onrender.com` |

4. Deploy → open the Vercel URL

### 3. Google OAuth (production)

In [Google Cloud Console](https://console.cloud.google.com/apis/credentials) add:

- **Authorized redirect URI:** `https://kairos-api-pk0k.onrender.com/api/auth/google/callback`
- **Authorized JavaScript origin:** `https://egorov-trainee-fullstack.vercel.app`

### 4. Verify production

1. Open frontend URL → hero video + crypto prices load
2. Click **Sign in with Google** → login → avatar appears in header
3. Refresh page → user stays signed in (sessionStorage)

Update `FRONTEND_URL`, `GOOGLE_REDIRECT_URI`, `CORS_ORIGINS`, and `VITE_AUTH_API_BASE` whenever URLs change.

## Submission checklist

- [x] Public GitHub repository
- [x] Live frontend URL (Vercel)
- [x] Live backend URL (Render)
- [x] Google OAuth on production
- [x] Hero background video with autoplay
- [x] Real-time crypto prices via WebSocket
- [x] Responsive layout (desktop / tablet / mobile)
- [x] README with setup and deploy instructions
