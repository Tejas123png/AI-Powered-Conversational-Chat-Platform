# Deployment Guide

This repository is set up with a decoupled architecture:
- **Backend (Node.js/Express)** deployed on **Railway** (or Render)
- **Frontend (React/Vite)** deployed on **Vercel** (or Netlify)

---

## 1. Deploying the Backend to Railway

### Step-by-step in Railway Dashboard:
1. Go to [Railway.app](https://railway.app) and create a **New Project** -> **Deploy from GitHub repo**.
2. Select your repository: `AI-Powered-Conversational-Chat-Platform`.
3. Railway will detect the Node.js project using root [package.json](package.json).
4. In Railway **Settings**:
   - **Root Directory**: leave default (`/`)
   - **Build Command**: leave blank (Railway will simply run `npm install`)
   - **Start Command**: `npm start` (or `node app.js`)
5. In Railway **Variables**, add:
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: `<Your Google Gemini API Key>`
   - `mongoatlas_url`: `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET`: `<Your strong JWT secret>`
   - `CLIENT_URL`: `https://your-frontend-app.vercel.app` *(Set this once your Vercel URL is ready so CORS and cookies are allowed)*
   - `PORT`: (Railway assigns this automatically)
6. Go to **Networking** in Railway and click **Generate Domain** (e.g. `https://your-backend.up.railway.app`).

---

## 2. Deploying the Frontend to Vercel

1. Go to [Vercel.com](https://vercel.com) and import the same repository.
2. In the configuration screen:
   - **Root Directory**: Click *Edit* and select `frontend`.
   - **Framework Preset**: Vite (detected automatically).
   - **Build Command**: `npm run build` (or `vite build`).
   - **Output Directory**: `dist`.
3. In **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://your-backend.up.railway.app` *(No trailing slash)*
4. Click **Deploy**.
5. Once your Vercel frontend is live (e.g., `https://novamind-chat.vercel.app`), update the `CLIENT_URL` variable in your Railway dashboard to match it.
