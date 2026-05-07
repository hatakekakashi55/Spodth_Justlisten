# 🚀 SPODTH - Complete Deployment Guide

## Part 1️⃣: Prepare GitHub

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `spodth`
3. Description: "Professional Music Streaming Platform"
4. Public (so Render/Vercel can access)
5. Click "Create repository"

### Step 2: Push Code to GitHub

Copy the commands from your new repo, then in terminal:

```powershell
cd c:\Users\wayne\Documents\SPODTH

# Set your GitHub details
git config user.email "your_email@gmail.com"
git config user.name "Your Name"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/spodth.git
git branch -M main
git push -u origin main
```

Your repo is now at: `https://github.com/YOUR_USERNAME/spodth`

---

## Part 2️⃣: Get Spotify Credentials

### Setup Spotify Developer App

1. Go to https://developer.spotify.com/dashboard
2. Login or create Spotify account
3. Click "Create an App"
4. Accept terms → Create app
5. Name: `SPODTH`
6. Accept terms → Create

### Copy Your Credentials
- **Client ID**: Copy this
- **Client Secret**: Copy this (keep secret!)

### Add Redirect URIs
1. Click "Edit Settings"
2. Redirect URIs section
3. Add:
   ```
   http://localhost:3000/auth/spotify/callback
   https://spodth-api.onrender.com/api/auth/spotify/callback
   https://YOUR_USERNAME.github.io/spodth/auth/spotify/callback
   ```
4. Save

---

## Part 3️⃣: Deploy Backend to Render 🟦

### Step 1: Create PostgreSQL Database

1. Go to https://render.com (create account)
2. Click "New +" → "PostgreSQL"
3. Name: `spodth-db`
4. Database name: `spodth_db`
5. User: `spodth_user`
6. Region: Choose closest to you
7. Pricing: Free tier ✅
8. Click "Create Database"

⏳ **Wait 3-5 minutes** for database to initialize

### Step 2: Copy Database Connection String

1. After created, go to your database page
2. Copy the "External Database URL"
3. It looks like: `postgresql://spodth_user:password@localhost:5432/spodth_db`
4. Save this somewhere safe

### Step 3: Initialize Database Schema

1. In Render, go to Database → "Connect"
2. Copy the PSQL command
3. Paste in PowerShell terminal
4. Once connected, run:
   ```sql
   \i 'C:\Users\wayne\Documents\SPODTH\backend\src\config\schema.sql'
   ```
5. Type `\q` to exit

### Step 4: Deploy Backend Service

1. Go to https://render.com dashboard
2. Click "New +" → "Web Service"
3. "Connect your GitHub repo"
4. Search for `spodth` → Connect
5. Fill in:
   - **Name**: `spodth-api`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend`
6. Click "Advanced"
7. Add these Environment Variables:

```
PORT = 5000
NODE_ENV = production
DATABASE_URL = [paste your PostgreSQL connection string]
JWT_SECRET = [generate: 32 random characters]
SPOTIFY_CLIENT_ID = [from developer dashboard]
SPOTIFY_CLIENT_SECRET = [from developer dashboard]
SPOTIFY_REDIRECT_URI = https://spodth-api.onrender.com/api/auth/spotify/callback
FRONTEND_URL = https://spodth.vercel.app
RENDER_EXTERNAL_URL = https://spodth-api.onrender.com
```

8. Scroll down → Click "Create Web Service"

⏳ **Wait 5-10 minutes** for deployment

### Your Backend URL:
```
https://spodth-api.onrender.com
```

---

## Part 4️⃣: Deploy Frontend to Vercel 🔷

### Step 1: Deploy

1. Go to https://vercel.com (create account with GitHub)
2. Click "Add New +" → "Project"
3. "Import Git Repository"
4. Select `spodth`
5. Click Import
6. Fill in:
   - **Project Name**: `spodth`
   - **Framework**: `Vite`
   - **Root Directory**: `frontend`

### Step 2: Environment Variables

Under "Environment Variables", add:

```
VITE_API_URL = https://spodth-api.onrender.com
VITE_SPOTIFY_CLIENT_ID = [from Spotify dashboard]
VITE_SPOTIFY_REDIRECT_URI = https://spodth.vercel.app/auth/spotify/callback
```

### Step 3: Deploy

Click "Deploy" and wait 2-3 minutes

### Your Frontend URL:
```
https://spodth.vercel.app
```

---

## Part 5️⃣: Final Configuration

### Update Spotify Redirect URIs

Go back to Spotify Dashboard:
1. Edit Settings
2. Add Redirect URI:
   ```
   https://spodth.vercel.app/auth/spotify/callback
   ```
3. Save

### Test Your App

1. Open https://spodth.vercel.app
2. Click "Login with Spotify"
3. Authorize SPODTH
4. Should see home page ✅

---

## 🎉 Your Live URLs

| Component | URL |
|-----------|-----|
| **Frontend** | https://spodth.vercel.app |
| **Backend API** | https://spodth-api.onrender.com |
| **GitHub Repo** | https://github.com/YOUR_USERNAME/spodth |
| **Spotify App** | https://developer.spotify.com/dashboard |

---

## ⚠️ Troubleshooting

### Backend not starting?
```
→ Check DATABASE_URL is correct
→ Ensure database schema is initialized
→ Check Spotify credentials
```

### Login not working?
```
→ Verify Spotify redirect URIs are exact matches
→ Check environment variables on both services
→ Clear browser cache
```

### Build failing on Vercel?
```
→ Check frontend/package.json is valid
→ Ensure VITE_ prefix on env vars
→ Check node_modules not in repo (.gitignore)
```

---

## 🔐 Keeping Your App Awake

Render free tier sleeps after 15 minutes. To keep it alive:

### Option 1: Use UptimeRobot (Free)
1. Go to https://uptimerobot.com
2. Create free account
3. Add "Monitor"
4. URL: `https://spodth-api.onrender.com/api/health`
5. Interval: 5 minutes
6. Monitor runs forever ✅

### Option 2: GitHub Actions (Free)
Create `.github/workflows/ping.yml`:
```yaml
name: Ping API

on:
  schedule:
    - cron: '*/14 * * * *'

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping backend
        run: curl https://spodth-api.onrender.com/api/health
```

---

## 📊 Cost Summary

| Service | Cost | Notes |
|---------|------|-------|
| Render (Backend) | $0 | Free tier (auto-sleep) |
| Vercel (Frontend) | $0 | Free tier unlimited |
| PostgreSQL | $0 | Render free tier |
| Domain | $10-15/year | Optional |
| **Total** | **$0-15/year** | 🎉 Affordable! |

---

## 🚀 What's Next?

✅ App is live!

Next steps:
1. Add custom domain (optional)
2. Setup SSL certificate
3. Monitor with logs
4. Add more features
5. Scale as needed

---

## 💡 Pro Tips

- Keep `JWT_SECRET` and `SPOTIFY_CLIENT_SECRET` safe
- Monitor Render logs for errors
- Set up email alerts on Vercel
- Use GitHub for version control
- Test in browser DevTools
- Monitor database usage

---

**You're all set! 🎵 Music streaming platform is live!**

Share your app: https://spodth.vercel.app
