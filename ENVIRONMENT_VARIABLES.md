# Environment Variables Reference

This document lists all environment variables needed for deployment.

## Backend (Render) Environment Variables

Add these in your Render service settings → Environment:

```bash
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/synapse_sentiment?retryWrites=true&w=majority
DATABASE_NAME=synapse_sentiment

# CORS Configuration
# Add your Vercel frontend URL(s) separated by commas
# Example: https://your-app.vercel.app,https://your-app-git-main.vercel.app
CORS_ORIGINS=https://your-app.vercel.app

# Clerk Authentication (if using)
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Server Configuration
PORT=5000
```

### How to Get Each Variable:

1. **MONGO_URI**: 
   - From MongoDB Atlas → Connect → Connect your application
   - Replace `<username>` and `<password>` with your database user credentials
   - Add database name: `synapse_sentiment`

2. **DATABASE_NAME**: 
   - Set to: `synapse_sentiment` (or your preferred name)

3. **CORS_ORIGINS**: 
   - Add your Vercel frontend URL after deployment
   - Can add multiple URLs separated by commas
   - Example: `https://synapse-app.vercel.app,https://synapse-app-git-main.vercel.app`

4. **CLERK_SECRET_KEY**: 
   - From Clerk Dashboard → API Keys → Secret Key
   - Starts with `sk_test_` or `sk_live_`

5. **PORT**: 
   - Set to: `5000` (Render will override with $PORT, but good to have)

---

## Frontend (Vercel) Environment Variables

Add these in your Vercel project settings → Environment Variables:

```bash
# API Configuration
# Set this to your Render backend URL
VITE_API_BASE_URL=https://your-backend.onrender.com

# Clerk Authentication (if using)
# Get this from your Clerk dashboard
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### How to Get Each Variable:

1. **VITE_API_BASE_URL**: 
   - Your Render backend URL (e.g., `https://synapse-backend.onrender.com`)
   - **Important**: No trailing slash
   - Must start with `https://`

2. **VITE_CLERK_PUBLISHABLE_KEY**: 
   - From Clerk Dashboard → API Keys → Publishable Key
   - Starts with `pk_test_` or `pk_live_`
   - **Note**: Vercel requires `VITE_` prefix for client-side variables

---

## Local Development (.env files)

For local development, create these files (they're in .gitignore):

### `backend/.env`
```bash
MONGO_URI=mongodb://localhost:27017/
DATABASE_NAME=synapse_sentiment
CORS_ORIGINS=*
CLERK_SECRET_KEY=sk_test_your_key
PORT=5000
```

### `frontend/.env`
```bash
VITE_API_BASE_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key
```

---

## Important Notes

1. **Vercel Environment Variables**:
   - Must have `VITE_` prefix to be accessible in client-side code
   - Changes require redeployment
   - Can set different values for Production, Preview, and Development

2. **Render Environment Variables**:
   - Changes require service restart
   - Can be updated without redeployment
   - Use "Manual Deploy" after updating

3. **Security**:
   - Never commit `.env` files to Git
   - Use environment variables in platform settings
   - Rotate secrets regularly
   - Use different keys for development and production

4. **CORS**:
   - Must include exact frontend URL (with https://)
   - Can include multiple URLs separated by commas
   - No trailing slashes
   - Update after getting Vercel URL

---

## Verification Checklist

After setting environment variables:

- [ ] All backend variables set in Render
- [ ] All frontend variables set in Vercel
- [ ] `VITE_API_BASE_URL` points to Render backend
- [ ] `CORS_ORIGINS` includes Vercel frontend URL
- [ ] No trailing slashes in URLs
- [ ] All variables use correct prefixes (`VITE_` for Vercel)
- [ ] Service restarted/redeployed after changes

---

## Troubleshooting

**Problem: Frontend can't connect to backend**
- Verify `VITE_API_BASE_URL` is correct
- Check for trailing slashes
- Ensure backend is running
- Check CORS settings

**Problem: CORS errors**
- Verify `CORS_ORIGINS` includes exact frontend URL
- Check for typos in URLs
- Restart Render service after updating
- Check browser console for exact error

**Problem: Environment variables not working**
- Vercel: Ensure `VITE_` prefix is used
- Redeploy after adding variables
- Check variable names match exactly
- Clear browser cache

