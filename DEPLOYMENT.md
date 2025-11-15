# Deployment Guide

This guide will help you deploy the Synapse Sentiment Analysis application to production.

## Architecture Overview

- **Frontend**: React + Vite (Static files)
- **Backend**: Flask (Python)
- **Database**: MongoDB (Cloud or self-hosted)
- **Authentication**: Clerk

## Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend) - Recommended

**Best for**: Quick deployment, automatic SSL, easy scaling

#### Frontend Deployment (Vercel)

1. **Build the frontend:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Deploy to Vercel:**
   - Install Vercel CLI: `npm i -g vercel`
   - Run `vercel` in the `frontend` directory
   - Or connect your GitHub repo to Vercel dashboard

3. **Set Environment Variables in Vercel:**
   - `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
   - `VITE_API_BASE_URL`: Your backend URL (e.g., `https://your-backend.railway.app`)

#### Backend Deployment (Railway)

1. **Create `railway.json` in backend folder** (see below)
2. **Connect GitHub repo to Railway**
3. **Set Environment Variables:**
   - `MONGO_URI`: Your MongoDB connection string
   - `DATABASE_NAME`: `synapse_sentiment`
   - `CLERK_SECRET_KEY`: Your Clerk secret key
   - `FLASK_ENV`: `production`
   - `PORT`: Railway will set this automatically

### Option 2: Render (Full Stack)

**Best for**: Simple deployment, both frontend and backend in one place

1. **Backend Service:**
   - Create new Web Service
   - Connect GitHub repo
   - Root directory: `backend`
   - Build command: `pip install -r requirements.txt`
   - Start command: `gunicorn api:app --bind 0.0.0.0:$PORT`
   - Add environment variables (see below)

2. **Frontend Static Site:**
   - Create new Static Site
   - Root directory: `frontend`
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`
   - Add environment variables

### Option 3: Docker + Cloud Provider

**Best for**: Full control, custom infrastructure

See `Dockerfile` and `docker-compose.yml` files below.

## Environment Variables

### Backend (.env)

```env
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
DATABASE_NAME=synapse_sentiment

# Clerk Authentication
CLERK_SECRET_KEY=sk_live_your_secret_key_here

# Flask
FLASK_ENV=production
PORT=5000
```

### Frontend (.env.production)

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_publishable_key_here
VITE_API_BASE_URL=https://your-backend-url.com
```

## Pre-Deployment Checklist

- [ ] Update `VITE_API_BASE_URL` in frontend to point to production backend
- [ ] Set production Clerk keys (not test keys)
- [ ] Configure MongoDB Atlas or production MongoDB instance
- [ ] Test all API endpoints
- [ ] Build frontend and test locally
- [ ] Set up CORS on backend for production domain
- [ ] Review security settings
- [ ] Set up error monitoring (optional)

## Step-by-Step Deployment

### 1. Prepare MongoDB

**Option A: MongoDB Atlas (Recommended)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster (free tier available)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all, or specific IPs)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/`

**Option B: Self-hosted MongoDB**
- Use your existing MongoDB instance
- Connection string: `mongodb://host:port/`

### 2. Configure Clerk

1. Go to https://dashboard.clerk.com
2. Get your **Publishable Key** (starts with `pk_live_`)
3. Get your **Secret Key** (starts with `sk_live_`)
4. Configure allowed origins in Clerk dashboard:
   - Add your frontend URL
   - Add your backend URL

### 3. Deploy Backend

**Using Railway:**
1. Sign up at https://railway.app
2. New Project → Deploy from GitHub
3. Select your repository
4. Set root directory to `backend`
5. Add environment variables
6. Deploy

**Using Render:**
1. Sign up at https://render.com
2. New Web Service
3. Connect GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn api:app --bind 0.0.0.0:$PORT`
5. Add environment variables
6. Deploy

### 4. Deploy Frontend

**Using Vercel:**
1. Sign up at https://vercel.com
2. Import GitHub repository
3. Settings:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables
5. Deploy

**Using Netlify:**
1. Sign up at https://netlify.com
2. New site from Git
3. Settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Add environment variables
5. Deploy

## Post-Deployment

1. **Test the application:**
   - Visit frontend URL
   - Sign up/login
   - Upload a test CSV file
   - Verify data is saved to MongoDB

2. **Monitor logs:**
   - Check backend logs for errors
   - Monitor MongoDB connection
   - Check Clerk authentication

3. **Set up custom domain (optional):**
   - Configure DNS
   - Update Clerk allowed origins
   - Update `VITE_API_BASE_URL`

## Troubleshooting

**Backend not connecting to MongoDB:**
- Check connection string format
- Verify IP whitelist in MongoDB Atlas
- Check network connectivity

**CORS errors:**
- Verify frontend URL is in backend CORS settings
- Check `VITE_API_BASE_URL` matches backend URL

**Authentication not working:**
- Verify Clerk keys are production keys (not test)
- Check allowed origins in Clerk dashboard
- Verify environment variables are set correctly

**Build errors:**
- Check Node.js version (should be 18+)
- Check Python version (should be 3.9+)
- Verify all dependencies are installed

## Production Best Practices

1. **Security:**
   - Use production Clerk keys
   - Enable HTTPS only
   - Set secure CORS origins
   - Use environment variables for secrets

2. **Performance:**
   - Enable gzip compression
   - Use CDN for frontend assets
   - Enable MongoDB indexes (already configured)
   - Monitor API response times

3. **Monitoring:**
   - Set up error tracking (Sentry, etc.)
   - Monitor MongoDB usage
   - Track API usage
   - Set up uptime monitoring

4. **Backup:**
   - Regular MongoDB backups
   - Version control for code
   - Document configuration changes

## Support

For issues or questions:
- Check logs in your hosting platform
- Review MongoDB connection
- Verify environment variables
- Test endpoints with Postman/curl

