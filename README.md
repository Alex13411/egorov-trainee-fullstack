# KAIROS — Trainee FullStack Task

Landing page for the Egorov Agency trainee assignment.

## Stack

- **Frontend:** Vite + TypeScript + vanilla CSS
- **Backend:** Python + FastAPI + Google OAuth2
- **Realtime crypto prices:** Binance public WebSocket API

## Project structure

```text
frontend/   # Vite app
backend/    # FastAPI auth API
```

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

## Deployment

**Live URLs (fill in after deploy):**

- Frontend: `https://YOUR-FRONTEND.vercel.app`
- Backend: `https://YOUR-BACKEND.onrender.com`

### 1. Backend — Render

1. Open [Render Dashboard](https://dashboard.render.com/) → **New** → **Blueprint**
2. Connect GitHub repo `Alex13411/egorov-trainee-fullstack`
3. Render reads `render.yaml` and creates the `kairos-api` service
4. Set environment variables in Render:

| Variable | Example |
|----------|---------|
| `GOOGLE_CLIENT_ID` | from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | from Google Cloud Console |
| `GOOGLE_REDIRECT_URI` | `https://YOUR-BACKEND.onrender.com/api/auth/google/callback` |
| `FRONTEND_URL` | `https://YOUR-FRONTEND.vercel.app` |
| `CORS_ORIGINS` | `https://YOUR-FRONTEND.vercel.app` |

5. Wait for deploy → check `https://YOUR-BACKEND.onrender.com/api/health`

### 2. Frontend — Vercel

1. Open [Vercel](https://vercel.com/) → **Add New Project** → import GitHub repo
2. Set **Root Directory** to `frontend`
3. Add environment variable:

| Variable | Value |
|----------|-------|
| `VITE_AUTH_API_BASE` | `https://YOUR-BACKEND.onrender.com` |

4. Deploy → open the Vercel URL

### 3. Google OAuth (production)

In [Google Cloud Console](https://console.cloud.google.com/apis/credentials) add:

- **Authorized redirect URI:** `https://YOUR-BACKEND.onrender.com/api/auth/google/callback`
- **Authorized JavaScript origin (optional):** `https://YOUR-FRONTEND.vercel.app`

### 4. Verify production

1. Open frontend URL → hero video + crypto prices load
2. Click **Sign in with Google** → login → avatar appears in header
3. Refresh page → user stays signed in (sessionStorage)

Update `FRONTEND_URL`, `GOOGLE_REDIRECT_URI`, `CORS_ORIGINS`, and `VITE_AUTH_API_BASE` whenever URLs change.
