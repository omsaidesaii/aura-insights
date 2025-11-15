# MongoDB Setup Guide

This guide will help you set up MongoDB for the Synapse Sentiment Analysis application.

## Prerequisites

1. **MongoDB installed and running**
   - Download from: https://www.mongodb.com/try/download/community
   - Or use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`

2. **Python dependencies installed**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

## Configuration

1. **Create `.env` file in `backend/` directory:**
   ```env
   MONGO_URI=mongodb://localhost:27017/
   DATABASE_NAME=synapse_sentiment
   CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here
   ```

2. **Start MongoDB:**
   - If installed locally: Make sure MongoDB service is running
   - If using Docker: `docker start mongodb` (or use the docker run command above)

## Collections Created

The application automatically creates the following collections:

1. **users** - Stores user information linked to Clerk IDs
   - Fields: `clerk_user_id`, `email`, `name`, `created_at`, `updated_at`, `total_reviews`, `total_sessions`

2. **reviews** - Stores individual review predictions
   - Fields: `clerk_user_id`, `text`, `predicted_sentiment`, `confidence`, `created_at`, `session_id` (optional)

3. **analysis_sessions** - Stores bulk analysis sessions
   - Fields: `clerk_user_id`, `filename`, `total_reviews`, `positive_count`, `negative_count`, `created_at`

## Testing Connection

1. **Start the backend:**
   ```bash
   cd backend
   python api.py
   ```

2. **Check for connection message:**
   You should see: `✅ Connected to MongoDB: synapse_sentiment`

## How It Works

1. **User Authentication:**
   - When a user logs in with Clerk, their user ID is stored
   - All data is linked to the user's Clerk ID

2. **Data Storage:**
   - When a user uploads a CSV file, all reviews are saved to MongoDB
   - When a user makes a single prediction, it's saved immediately
   - Sessions track bulk uploads

3. **Data Retrieval:**
   - When a user logs back in, their data is automatically loaded
   - The Dashboard component fetches all reviews on mount
   - Data persists across sessions

## Troubleshooting

**MongoDB connection error:**
- Make sure MongoDB is running: `mongosh` or check service status
- Verify connection string in `.env` file
- Check if port 27017 is available

**Authentication issues:**
- The app works in development mode without Clerk secret key
- For production, set `CLERK_SECRET_KEY` in `.env`
- Get your key from: https://dashboard.clerk.com

**Data not loading:**
- Check browser console for errors
- Verify backend is running on port 5000
- Check MongoDB for stored documents: `mongosh` then `use synapse_sentiment` and `db.reviews.find()`

