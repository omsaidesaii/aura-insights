# Deployment Checklist

Use this checklist to ensure everything is configured correctly before and after deployment.

## Pre-Deployment Checklist

### MongoDB Atlas
- [ ] MongoDB Atlas account created
- [ ] Cluster created (M0 FREE tier)
- [ ] Database user created with password
- [ ] Network Access configured (0.0.0.0/0 for development)
- [ ] Connection string copied and saved
- [ ] Connection string includes database name: `synapse_sentiment`

### Backend (Render)
- [ ] GitHub repository is public or Render has access
- [ ] `backend/requirements.txt` is up to date
- [ ] `backend/Dockerfile` exists and is correct
- [ ] `backend/Procfile` exists (optional, Dockerfile handles it)
- [ ] All environment variables prepared:
  - [ ] `MONGO_URI`
  - [ ] `DATABASE_NAME`
  - [ ] `CORS_ORIGINS` (will update after Vercel deployment)
  - [ ] `CLERK_SECRET_KEY` (if using Clerk)
  - [ ] `PORT=5000`

### Frontend (Vercel)
- [ ] GitHub repository is public or Vercel has access
- [ ] `frontend/package.json` has build script
- [ ] `vercel.json` is configured correctly
- [ ] All environment variables prepared:
  - [ ] `VITE_API_BASE_URL` (will set to Render URL after deployment)
  - [ ] `VITE_CLERK_PUBLISHABLE_KEY` (if using Clerk)

---

## Deployment Steps Checklist

### Step 1: MongoDB Atlas
- [ ] Cluster is running
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string saved

### Step 2: Render Backend
- [ ] Render account created
- [ ] GitHub repository connected
- [ ] Web service created
- [ ] Root directory set to `backend`
- [ ] Runtime set to `Docker`
- [ ] Environment variables added (except CORS_ORIGINS)
- [ ] Service deployed successfully
- [ ] Backend URL saved: `https://your-backend.onrender.com`
- [ ] Test endpoint works: `/test`

### Step 3: Vercel Frontend
- [ ] Vercel account created
- [ ] GitHub repository connected
- [ ] Project created
- [ ] Root directory set to `frontend`
- [ ] Framework preset: `Vite`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variables added (with Render backend URL)
- [ ] Frontend deployed successfully
- [ ] Frontend URL saved: `https://your-app.vercel.app`

### Step 4: Final Configuration
- [ ] Updated Render `CORS_ORIGINS` with Vercel URL
- [ ] Restarted Render service
- [ ] Verified Vercel `VITE_API_BASE_URL` points to Render URL
- [ ] Redeployed Vercel (if needed)

---

## Post-Deployment Testing Checklist

### Backend Tests
- [ ] Backend URL is accessible
- [ ] `/test` endpoint returns success
- [ ] Backend logs show no errors
- [ ] MongoDB connection successful (check logs)

### Frontend Tests
- [ ] Frontend URL is accessible
- [ ] Page loads without errors
- [ ] No console errors in browser
- [ ] API calls to backend work
- [ ] CORS errors resolved

### Database Tests
- [ ] Can make predictions through frontend
- [ ] Data saves to MongoDB Atlas
- [ ] Can view data in MongoDB Atlas dashboard
- [ ] Collections created: `users`, `reviews`, `analysis_sessions`

### Integration Tests
- [ ] User can register/login (if using auth)
- [ ] User can upload CSV file
- [ ] Predictions work correctly
- [ ] Data persists across sessions
- [ ] Dashboard displays user data

---

## Common Issues Checklist

### If Backend Won't Deploy
- [ ] Check Render build logs
- [ ] Verify Dockerfile syntax
- [ ] Ensure all dependencies in requirements.txt
- [ ] Check for Python version compatibility
- [ ] Verify Procfile format (if using)

### If Frontend Won't Deploy
- [ ] Check Vercel build logs
- [ ] Verify package.json scripts
- [ ] Ensure all dependencies installed
- [ ] Check for TypeScript errors
- [ ] Verify vercel.json configuration

### If API Calls Fail
- [ ] Verify `VITE_API_BASE_URL` is correct
- [ ] Check backend is running (not spun down)
- [ ] Verify CORS_ORIGINS includes frontend URL
- [ ] Check browser console for errors
- [ ] Verify environment variables are set

### If Database Connection Fails
- [ ] Verify MONGO_URI format is correct
- [ ] Check username/password are correct
- [ ] Verify Network Access allows connections
- [ ] Check Render logs for connection errors
- [ ] Ensure database name is included in URI

---

## Environment Variables Reference

### Render (Backend)
```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/synapse_sentiment?retryWrites=true&w=majority
DATABASE_NAME=synapse_sentiment
CORS_ORIGINS=https://your-app.vercel.app
CLERK_SECRET_KEY=sk_test_...
PORT=5000
```

### Vercel (Frontend)
```bash
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

---

## URLs to Save

- **MongoDB Atlas Cluster**: `https://cloud.mongodb.com/...`
- **Render Backend**: `https://your-backend.onrender.com`
- **Vercel Frontend**: `https://your-app.vercel.app`
- **MongoDB Connection String**: `mongodb+srv://...`

---

## Next Steps After Deployment

- [ ] Set up custom domain (optional)
- [ ] Configure monitoring and alerts
- [ ] Set up automated backups for MongoDB
- [ ] Review security settings
- [ ] Test all features thoroughly
- [ ] Share your deployed app! 🎉

