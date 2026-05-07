# Quick Deployment Guide - SPODTH

## Prerequisites
- GitHub account (https://github.com)
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- Spotify Developer credentials (https://developer.spotify.com/dashboard)

## Step 1: Create GitHub Repository

```bash
cd c:\Users\wayne\Documents\SPODTH

# Initialize git
git init
git add .
git commit -m "Initial SPODTH commit"

# Create GitHub repo named 'spodth' at https://github.com/new
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/spodth.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Render

### 2a. Create render.yaml in root directory

This file tells Render how to deploy your app.

### 2b. In Render Dashboard
1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Select `backend` as root directory
5. Environment: Node
6. Build command: `npm install`
7. Start command: `npm start`
8. Add environment variables:
   - DATABASE_URL
   - JWT_SECRET
   - SPOTIFY_CLIENT_ID
   - SPOTIFY_CLIENT_SECRET
   - SPOTIFY_REDIRECT_URI
   - FRONTEND_URL

### 2c. Create PostgreSQL Database on Render
1. Click "New +" → "PostgreSQL"
2. Choose free tier
3. Copy the connection string
4. Run schema: https://.../#/logs (paste schema.sql content)

## Step 3: Deploy Frontend to Vercel

### 3a. In Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "Import Project"
3. Import from GitHub
4. Select your SPODTH repository
5. Root Directory: `frontend`
6. Environment Variables:
   - VITE_API_URL = (your Render backend URL)
   - VITE_SPOTIFY_CLIENT_ID
   - VITE_SPOTIFY_REDIRECT_URI

### 3b. Deploy
- Click "Deploy"
- Wait ~2 minutes
- Get your live URL!

## Your URLs Will Be
- **Backend:** https://spodth-api.onrender.com
- **Frontend:** https://spodth.vercel.app

---

## Environment Variables Needed

### Backend (.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_key_change_this
SPOTIFY_CLIENT_ID=your_id
SPOTIFY_CLIENT_SECRET=your_secret
SPOTIFY_REDIRECT_URI=https://spodth-api.onrender.com/api/auth/spotify/callback
FRONTEND_URL=https://spodth.vercel.app
```

### Frontend (.env)
```
VITE_API_URL=https://spodth-api.onrender.com
VITE_SPOTIFY_CLIENT_ID=your_id
VITE_SPOTIFY_REDIRECT_URI=https://spodth.vercel.app/auth/spotify/callback
```

---

**Total Deployment Time:** ~10-15 minutes
**Estimated Cost:** $0/month (free tiers)
