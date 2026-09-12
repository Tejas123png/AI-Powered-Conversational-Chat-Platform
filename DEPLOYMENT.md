# Deployment Guide

This project can be deployed in two standard ways:

---

## Option 1: Unified Fullstack Monolith (Easiest — Render or Railway)
In this mode, Express serves both the backend API and the compiled static frontend files on a single domain and port.

### Build & Run Settings on Host (e.g. Render Web Service):
1. **Root Directory**: `.` (leave default)
2. **Build Command**: 
   ```bash
   npm run install:all && npm run build
   ```
3. **Start Command**:
   ```bash
   npm start
   ```
4. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: `<Your Gemini Key>`
   - `mongoatlas_url`: `<Your MongoDB Connection String>`
   - `JWT_SECRET`: `<A strong random string>`
   - `PORT`: `8080` (or leave default assigned by platform)

---

## Option 2: Decoupled (Frontend on Vercel/Netlify + Backend on Render/Railway)

### Backend Deployment (Render/Railway):
1. **Build Command**: `npm install`
2. **Start Command**: `npm start`
3. **Environment Variables**:
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: `<Your Gemini Key>`
   - `mongoatlas_url`: `<Your MongoDB Connection String>`
   - `JWT_SECRET`: `<A strong random string>`
   - `CLIENT_URL`: `https://your-frontend-app.vercel.app` *(Must match your live frontend URL for CORS & cross-site cookies)*

### Frontend Deployment (Vercel / Netlify):
1. **Root Directory**: `frontend`
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://your-backend.onrender.com` *(Must point to your live backend domain with no trailing slash)*
