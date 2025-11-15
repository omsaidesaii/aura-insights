# Complete Deployment Guide: Vercel + Render + MongoDB Atlas

This guide will walk you through deploying your Synapse Sentiment Analysis application using:
- **Vercel** for the frontend (React/TypeScript)
- **Render** for the backend (Python Flask)
- **MongoDB Atlas** for the database

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Step 1: MongoDB Atlas Setup](#step-1-mongodb-atlas-setup)
3. [Step 2: Deploy Backend to Render](#step-2-deploy-backend-to-render)
4. [Step 3: Deploy Frontend to Vercel](#step-3-deploy-frontend-to-vercel)
5. [Step 4: Configure Environment Variables](#step-4-configure-environment-variables)
6. [Step 5: Update CORS Settings](#step-5-update-cors-settings)
7. [Step 6: Test Your Deployment](#step-6-test-your-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- GitHub account (for connecting repositories)
- MongoDB Atlas account (free tier available)
- Vercel account (free tier available)
- Render account (free tier available)
- Your code pushed to a GitHub repository

---

## Step 1: MongoDB Atlas Setup

### 1.1 Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Verify your email address

### 1.2 Create a Cluster
1. After logging in, click **"Build a Database"**
2. Choose **"M0 FREE"** (Free Shared Cluster)
3. Select your preferred cloud provider and region (choose closest to your Render region)
4. Click **"Create"** (cluster creation takes 3-5 minutes)

### 1.3 Configure Database Access
1. Go to **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username and generate a secure password (save this!)
5. Set user privileges to **"Atlas admin"** (or custom with read/write access)
6. Click **"Add User"**

### 1.4 Configure Network Access
1. Go to **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. For production, click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ **Security Note**: For better security, add only Render's IP ranges after deployment
4. Click **"Confirm"**

### 1.5 Get Connection String
1. Go to **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Select **"Python"** and version **"3.6 or later"**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with your database user credentials
7. Add your database name at the end:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/synapse_sentiment?retryWrites=true&w=majority
   ```

**Save this connection string - you'll need it for Render!**

---

## Step 2: Deploy Backend to Render

### 2.1 Prepare Your Backend
1. Ensure your `backend/requirements.txt` is up to date
2. Ensure your `backend/Dockerfile` exists (you already have one)
3. Ensure your `backend/Procfile` exists (you already have one)

### 2.2 Create Render Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository (authorize Render if needed)
4. Select your repository

### 2.3 Configure Render Service
Fill in the following settings:

**Basic Settings:**
- **Name**: `synapse-backend` (or your preferred name)
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: `backend`
- **Runtime**: `Docker` (since you have a Dockerfile)
- **Instance Type**: `Free` (or upgrade for production)

**Build & Deploy:**
- **Build Command**: (leave empty - Docker handles this)
- **Start Command**: (leave empty - Dockerfile CMD handles this)

**Environment Variables** (add these now or after creation):
```
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/synapse_sentiment?retryWrites=true&w=majority
DATABASE_NAME=synapse_sentiment
CORS_ORIGINS=https://your-vercel-app.vercel.app
CLERK_SECRET_KEY=your_clerk_secret_key
PORT=5000
```

### 2.4 Deploy
1. Click **"Create Web Service"**
2. Render will start building your Docker image
3. Wait for deployment to complete (5-10 minutes)
4. Once deployed, you'll get a URL like: `https://synapse-backend.onrender.com`

**Save this URL - you'll need it for Vercel!**

### 2.5 Important Render Settings
After deployment, go to your service settings:
1. Enable **"Auto-Deploy"** (deploys on every push to main branch)
2. Set **"Health Check Path"**: `/test` (if you have a test endpoint)
3. Note: Free tier services spin down after 15 minutes of inactivity (first request may be slow)

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Prepare Your Frontend
1. Ensure your `frontend/package.json` has a build script (you already have it)
2. Update `vercel.json` if needed (you already have one)

### 3.2 Create Vercel Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select your repository

### 3.3 Configure Vercel Project
Fill in the following settings:

**Project Settings:**
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (or `yarn build`)
- **Output Directory**: `dist`
- **Install Command**: `npm install` (or `yarn install`)

**Environment Variables** (add these):
```
VITE_API_BASE_URL=https://synapse-backend.onrender.com
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 3.4 Deploy
1. Click **"Deploy"**
2. Vercel will build and deploy your frontend
3. Once deployed, you'll get a URL like: `https://synapse-frontend.vercel.app`

**Save this URL - you'll need it to update Render CORS!**

---

## Step 4: Configure Environment Variables

### 4.1 Update Render Environment Variables
Go back to your Render service and update:

1. **CORS_ORIGINS**: Add your Vercel URL
   ```
   CORS_ORIGINS=https://synapse-frontend.vercel.app,https://synapse-frontend-git-main-yourusername.vercel.app
   ```
   (Add both the production URL and preview URLs if needed)

2. **MONGO_URI**: Ensure it's set correctly with your MongoDB Atlas connection string

3. **CLERK_SECRET_KEY**: Add your Clerk secret key (if using Clerk auth)

### 4.2 Update Vercel Environment Variables
Go to your Vercel project settings:

1. **VITE_API_BASE_URL**: Set to your Render backend URL
   ```
   https://synapse-backend.onrender.com
   ```

2. **VITE_CLERK_PUBLISHABLE_KEY**: Add your Clerk publishable key

3. **Redeploy** after adding environment variables

---

## Step 5: Update CORS Settings

### 5.1 Update Backend CORS
Your backend already has CORS configuration in `api.py`. Make sure:

1. The `CORS_ORIGINS` environment variable in Render includes your Vercel URL
2. After updating, **restart your Render service**:
   - Go to Render dashboard → Your service → Manual Deploy → Clear build cache & deploy

### 5.2 Verify CORS Configuration
Check your `backend/api.py` - it should handle CORS like this:
```python
allowed_origins = os.getenv("CORS_ORIGINS", "*")
if allowed_origins == "*":
    CORS(app)
else:
    origins = [origin.strip() for origin in allowed_origins.split(",")]
    CORS(app, origins=origins, supports_credentials=True)
```

---

## Step 6: Test Your Deployment

### 6.1 Test Backend
1. Visit: `https://your-backend.onrender.com/test`
2. Should return a success message

### 6.2 Test Frontend
1. Visit your Vercel URL
2. Try making a prediction
3. Check browser console for errors
4. Check Network tab to see if API calls are working

### 6.3 Test Database Connection
1. Make a prediction through the frontend
2. Check MongoDB Atlas → Browse Collections
3. Verify data is being saved

---

## Troubleshooting

### Backend Issues

**Problem: Build fails on Render**
- Check that all dependencies are in `requirements.txt`
- Ensure Dockerfile is correct
- Check Render build logs for specific errors

**Problem: Backend returns 503 or times out**
- Free tier services spin down after inactivity
- First request after spin-down takes 30-60 seconds
- Consider upgrading to paid tier for always-on service

**Problem: MongoDB connection fails**
- Verify connection string is correct
- Check Network Access in MongoDB Atlas (should allow 0.0.0.0/0)
- Verify username/password are correct
- Check Render logs for connection errors

**Problem: CORS errors**
- Verify `CORS_ORIGINS` includes your Vercel URL
- Ensure no trailing slashes in URLs
- Restart Render service after updating environment variables

### Frontend Issues

**Problem: API calls fail**
- Verify `VITE_API_BASE_URL` is set correctly
- Check that backend is running (visit backend URL directly)
- Check browser console for CORS errors
- Ensure environment variables are set in Vercel

**Problem: Build fails on Vercel**
- Check that all dependencies are in `package.json`
- Verify build command is correct
- Check Vercel build logs

**Problem: Environment variables not working**
- Vercel requires `VITE_` prefix for client-side variables
- Redeploy after adding environment variables
- Clear browser cache

### Database Issues

**Problem: Data not saving**
- Check MongoDB Atlas connection string
- Verify database user has write permissions
- Check Render logs for database errors
- Verify collection names match your code

**Problem: Connection timeout**
- Check Network Access settings in MongoDB Atlas
- Verify connection string format
- Check if IP is whitelisted (or use 0.0.0.0/0 for development)

---

## Additional Configuration

### Custom Domain (Optional)

**Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

**Render:**
1. Go to Service Settings → Custom Domains
2. Add your custom domain
3. Update DNS records as instructed

### Monitoring

**Render:**
- View logs in Render dashboard
- Set up alerts for deployment failures

**Vercel:**
- View analytics in Vercel dashboard
- Check function logs for serverless functions

**MongoDB Atlas:**
- Monitor database usage in Atlas dashboard
- Set up alerts for connection issues

---

## Security Best Practices

1. **Never commit `.env` files** - Use environment variables in platforms
2. **Use strong MongoDB passwords** - Generate secure passwords
3. **Limit MongoDB Network Access** - Add specific IPs instead of 0.0.0.0/0 for production
4. **Use HTTPS** - Both Vercel and Render provide HTTPS by default
5. **Rotate secrets regularly** - Update API keys and passwords periodically
6. **Enable MongoDB Atlas encryption** - Use at-rest encryption for sensitive data

---

## Quick Reference: Environment Variables

### Render (Backend)
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/synapse_sentiment?retryWrites=true&w=majority
DATABASE_NAME=synapse_sentiment
CORS_ORIGINS=https://your-app.vercel.app
CLERK_SECRET_KEY=sk_test_...
PORT=5000
```

### Vercel (Frontend)
```
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

---

## Support Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Flask CORS Documentation](https://flask-cors.readthedocs.io/)

---

**Congratulations! Your application should now be live! 🎉**

