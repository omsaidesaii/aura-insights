# Quick Deployment Guide

## Fastest Deployment Path (Recommended)

### Step 1: Deploy Backend to Railway (5 minutes)

1. **Sign up at [Railway.app](https://railway.app)**
2. **New Project → Deploy from GitHub**
3. **Select your repository**
4. **Configure:**
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn api:app --bind 0.0.0.0:$PORT`

5. **Add Environment Variables:**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
   DATABASE_NAME=synapse_sentiment
   CLERK_SECRET_KEY=sk_live_your_key_here
   CORS_ORIGINS=https://your-frontend-domain.vercel.app
   ```

6. **Deploy** - Railway will give you a URL like `https://your-app.railway.app`

### Step 2: Deploy Frontend to Vercel (5 minutes)

1. **Sign up at [Vercel.com](https://vercel.com)**
2. **Import GitHub Repository**
3. **Configure:**
   - Root Directory: `frontend`
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variables:**
   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_key_here
   VITE_API_BASE_URL=https://your-app.railway.app
   ```

5. **Deploy** - Vercel will give you a URL

### Step 3: Update Clerk Settings

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. **Settings → Allowed Origins**
3. Add your frontend URL (from Vercel)
4. Add your backend URL (from Railway)

### Step 4: Update Backend CORS

1. Go back to Railway
2. Update `CORS_ORIGINS` environment variable:
   ```
   CORS_ORIGINS=https://your-frontend.vercel.app
   ```
3. Redeploy

## Alternative: Render (All-in-One)

### Backend on Render

1. **New Web Service** on [Render.com](https://render.com)
2. Connect GitHub repo
3. Settings:
   - Root Directory: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `gunicorn api:app --bind 0.0.0.0:$PORT`
4. Add environment variables (same as Railway)
5. Deploy

### Frontend on Render

1. **New Static Site** on Render
2. Root Directory: `frontend`
3. Build: `npm install && npm run build`
4. Publish: `dist`
5. Add environment variables
6. Deploy

## MongoDB Setup

### Option 1: MongoDB Atlas (Free Tier Available)

1. Sign up at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (or specific IPs)
5. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/`

### Option 2: Railway MongoDB

1. In Railway, click **New → Database → MongoDB**
2. Railway will provide connection string automatically

## Testing Deployment

1. Visit your frontend URL
2. Sign up/Login
3. Upload a test CSV file
4. Check if data appears in dashboard
5. Verify MongoDB has data

## Troubleshooting

**Backend not starting:**
- Check Railway logs
- Verify all environment variables are set
- Check MongoDB connection string format

**CORS errors:**
- Verify `CORS_ORIGINS` includes your frontend URL
- Check Clerk allowed origins
- Verify `VITE_API_BASE_URL` matches backend URL

**Authentication not working:**
- Verify Clerk keys are production keys (pk_live_/sk_live_)
- Check allowed origins in Clerk dashboard
- Verify environment variables in both frontend and backend

## Cost Estimate

- **Railway**: Free tier available, then ~$5-20/month
- **Vercel**: Free tier available, then ~$20/month
- **MongoDB Atlas**: Free tier (512MB), then ~$9/month
- **Total**: Free to start, ~$15-50/month for production

## Next Steps

- Set up custom domain
- Enable monitoring
- Set up backups
- Configure error tracking (Sentry, etc.)

