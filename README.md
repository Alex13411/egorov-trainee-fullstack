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

## Deployment (TODO)

- Frontend: Vercel / Netlify / GitHub Pages
- Backend: Render / Railway / Fly.io

Update `FRONTEND_URL`, `GOOGLE_REDIRECT_URI`, and `CORS_ORIGINS` for production.
