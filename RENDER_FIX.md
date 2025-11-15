# Render Deployment Fix

## Problem
Render is looking for Dockerfile in the root directory, but it's located in `backend/` directory.

## Solution 1: Set Root Directory in Render (Recommended)

1. Go to your Render Dashboard
2. Click on your backend service
3. Go to **Settings** tab
4. Scroll down to **Build & Deploy** section
5. Find **Root Directory** field
6. Set it to: `backend`
7. Click **Save Changes**
8. Go to **Manual Deploy** → **Deploy latest commit**

## Solution 2: Create Root Dockerfile (Alternative)

If Solution 1 doesn't work, create a Dockerfile in the root directory that references the backend:

```dockerfile
# Root Dockerfile - delegates to backend
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Download NLTK data
RUN python -c "import nltk; nltk.download('stopwords', quiet=True)"

# Copy backend application code
COPY backend/ .

# Create directory for models if it doesn't exist
RUN mkdir -p Models

# Expose port
EXPOSE 5000

# Use gunicorn for production
CMD ["gunicorn", "api:app", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "120"]
```

## Verify Settings

Make sure these are set correctly in Render:

- **Root Directory**: `backend` (or leave empty if using root Dockerfile)
- **Runtime**: `Docker`
- **Build Command**: (empty)
- **Start Command**: (empty)

## After Fix

1. Save changes in Render
2. Trigger a new deployment
3. Check build logs to confirm it finds the Dockerfile

