# Quick Start Deployment Guide

This is a condensed version for experienced developers. For detailed steps, see `DEPLOYMENT_GUIDE.md`.

## 1. MongoDB Atlas (5 minutes)

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create **M0 FREE** cluster
3. **Database Access**: Create user with password
4. **Network Access**: Allow `0.0.0.0/0` (all IPs)
5. **Get Connection String**: 
   - Connect → Connect your application → Python
   - Format: `mongodb+srv://user:pass@cluster.mongodb.net/synapse_sentiment?retryWrites=true&w=majority`

## 2. Render Backend (10 minutes)

1. Go to [Render](https://dashboard.render.com/) → New Web Service
2. Connect GitHub repo
3. **Settings**:
   - Name: `synapse-backend`
   - Root Directory: `backend`
   - Runtime: `Docker`
   - Branch: `main`
4. **Environment Variables**:
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/synapse_sentiment?retryWrites=true&w=majority
   DATABASE_NAME=synapse_sentiment
   CORS_ORIGINS=https://your-app.vercel.app
   CLERK_SECRET_KEY=your_key
   PORT=5000
   ```
5. Deploy → Save backend URL

## 3. Vercel Frontend (5 minutes)

1. Go to [Vercel](https://vercel.com/dashboard) → Add New Project
2. Import GitHub repo
3. **Settings**:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   VITE_CLERK_PUBLISHABLE_KEY=your_key
   ```
5. Deploy → Save frontend URL

## 4. Final Configuration (2 minutes)

1. **Update Render CORS**:
   - Go to Render service → Environment
   - Update `CORS_ORIGINS` with your Vercel URL
   - Manual Deploy → Clear cache → Deploy

2. **Verify**:
   - Backend: `https://your-backend.onrender.com/test`
   - Frontend: `https://your-app.vercel.app`
   - Test a prediction

## Done! 🎉

Your app is live. Check `DEPLOYMENT_GUIDE.md` for troubleshooting.

