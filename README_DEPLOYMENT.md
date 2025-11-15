# Deployment Documentation

Complete guide for deploying Synapse Sentiment Analysis application to production.

## 📚 Documentation Files

1. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Complete step-by-step deployment guide
   - Detailed instructions for MongoDB Atlas, Render, and Vercel
   - Troubleshooting section
   - Security best practices

2. **[QUICK_START_DEPLOYMENT.md](./QUICK_START_DEPLOYMENT.md)** - Quick reference for experienced developers
   - Condensed version with essential steps
   - Perfect for quick deployments

3. **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Pre and post-deployment checklist
   - Ensure nothing is missed
   - Testing checklist
   - Common issues checklist

4. **[ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)** - Environment variables reference
   - All required variables
   - How to obtain each variable
   - Local development setup

## 🚀 Quick Start

### For First-Time Deployment:
1. Read **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** for detailed instructions
2. Use **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** to track progress
3. Reference **[ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)** for configuration

### For Experienced Developers:
1. Follow **[QUICK_START_DEPLOYMENT.md](./QUICK_START_DEPLOYMENT.md)**
2. Use **[ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)** for quick reference

## 📋 Deployment Overview

Your application consists of:

- **Frontend**: React/TypeScript with Vite → Deploy to **Vercel**
- **Backend**: Python Flask API → Deploy to **Render**
- **Database**: MongoDB → Use **MongoDB Atlas**

## 🔗 Platform Links

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) - Database
- [Render](https://dashboard.render.com/) - Backend hosting
- [Vercel](https://vercel.com/dashboard) - Frontend hosting

## ⚙️ Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Vercel    │ ──────▶ │   Render    │ ──────▶ │ MongoDB     │
│  (Frontend) │  HTTPS  │  (Backend)  │  HTTPS  │   Atlas     │
└─────────────┘         └─────────────┘         └─────────────┘
```

## 📝 Prerequisites

- [ ] GitHub account
- [ ] Code pushed to GitHub repository
- [ ] MongoDB Atlas account (free tier)
- [ ] Render account (free tier)
- [ ] Vercel account (free tier)

## 🎯 Deployment Order

1. **MongoDB Atlas** (5 minutes)
   - Create cluster
   - Configure access
   - Get connection string

2. **Render Backend** (10 minutes)
   - Connect repository
   - Configure Docker deployment
   - Set environment variables
   - Deploy

3. **Vercel Frontend** (5 minutes)
   - Connect repository
   - Configure Vite build
   - Set environment variables
   - Deploy

4. **Final Configuration** (2 minutes)
   - Update CORS settings
   - Verify connections
   - Test deployment

**Total Time: ~20-30 minutes**

## 🔑 Key Environment Variables

### Backend (Render)
- `MONGO_URI` - MongoDB connection string
- `DATABASE_NAME` - Database name
- `CORS_ORIGINS` - Frontend URL(s)
- `CLERK_SECRET_KEY` - Clerk secret key (if using)

### Frontend (Vercel)
- `VITE_API_BASE_URL` - Backend URL
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk publishable key (if using)

See **[ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)** for details.

## ✅ Post-Deployment Checklist

- [ ] Backend accessible at Render URL
- [ ] Frontend accessible at Vercel URL
- [ ] API calls working (no CORS errors)
- [ ] Database connection successful
- [ ] Predictions working
- [ ] Data saving to MongoDB
- [ ] All features tested

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| CORS errors | Update `CORS_ORIGINS` in Render with Vercel URL |
| Backend timeout | Free tier spins down after 15min inactivity |
| Database connection fails | Check Network Access in MongoDB Atlas |
| Environment variables not working | Ensure `VITE_` prefix for Vercel variables |

See **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** troubleshooting section for details.

## 📞 Support

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

## 🎉 Next Steps

After successful deployment:

1. Set up custom domain (optional)
2. Configure monitoring and alerts
3. Set up automated backups
4. Review security settings
5. Share your app!

---

**Ready to deploy? Start with [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)!**

