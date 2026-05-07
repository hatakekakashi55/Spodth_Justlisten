# 📋 Deployment Checklist - SPODTH

## Before You Start: Checklist ✅

- [ ] GitHub account created (https://github.com)
- [ ] Render account created (https://render.com)
- [ ] Vercel account created (https://vercel.com)
- [ ] Spotify Developer account (https://developer.spotify.com)

---

## 🔑 Credentials You'll Need to Collect

### 1. Spotify Developer Credentials
```
From: https://developer.spotify.com/dashboard

Client ID:        [_________________________________]
Client Secret:    [_________________________________]
Redirect URI 1:   http://localhost:3000/auth/spotify/callback
Redirect URI 2:   https://spodth-api.onrender.com/api/auth/spotify/callback
Redirect URI 3:   https://spodth.vercel.app/auth/spotify/callback
```

### 2. Database Credentials
```
From: Render PostgreSQL

External URL:     [_________________________________]
Database Name:    spodth_db
Database User:    spodth_user
Database Password: [_________________________________]
```

### 3. GitHub Repository
```
Repository URL:   https://github.com/[YOUR_USERNAME]/spodth
Branch:           main
Folder Structure:
  - /backend
  - /frontend
  - /docs
```

---

## Step-by-Step Deployment Tasks

### ☐ PHASE 1: Setup (5 minutes)

- [ ] Create Spotify Developer App
- [ ] Create Render Account
- [ ] Create Vercel Account
- [ ] Create GitHub Repository
- [ ] Run `git push -u origin main`

### ☐ PHASE 2: Database (10 minutes)

- [ ] Create PostgreSQL on Render
- [ ] Wait for database initialization
- [ ] Copy connection string
- [ ] Initialize schema in database
- [ ] Verify 12 tables created

### ☐ PHASE 3: Backend (10 minutes)

- [ ] Go to Render dashboard
- [ ] Create Web Service
- [ ] Connect GitHub repo (`spodth`)
- [ ] Set root directory to `backend`
- [ ] Add all environment variables
- [ ] Deploy and wait for completion
- [ ] Verify `/api/health` endpoint works
- [ ] Copy backend URL: https://spodth-api.onrender.com

### ☐ PHASE 4: Frontend (5 minutes)

- [ ] Go to Vercel dashboard
- [ ] Import GitHub project
- [ ] Set root directory to `frontend`
- [ ] Add environment variables
- [ ] Deploy and wait for completion
- [ ] Copy frontend URL: https://spodth.vercel.app

### ☐ PHASE 5: Testing (5 minutes)

- [ ] Open https://spodth.vercel.app
- [ ] Click "Login with Spotify"
- [ ] Authorize the app
- [ ] See home page
- [ ] Test search functionality
- [ ] Test player controls
- [ ] Try creating a playlist

### ☐ PHASE 6: Production (5 minutes)

- [ ] Enable auto-deploy on Render
- [ ] Setup monitoring (UptimeRobot)
- [ ] Add custom domain (optional)
- [ ] Setup analytics

---

## Environment Variables Template

### Backend (.env on Render)

```env
PORT=5000
NODE_ENV=production
DATABASE_URL=postgresql://spodth_user:PASSWORD@HOST:5432/spodth_db
JWT_SECRET=your_super_secret_key_min_32_chars_long_1234567890
SPOTIFY_CLIENT_ID=YOUR_SPOTIFY_CLIENT_ID_HERE
SPOTIFY_CLIENT_SECRET=YOUR_SPOTIFY_CLIENT_SECRET_HERE
SPOTIFY_REDIRECT_URI=https://spodth-api.onrender.com/api/auth/spotify/callback
FRONTEND_URL=https://spodth.vercel.app
RENDER_EXTERNAL_URL=https://spodth-api.onrender.com
```

### Frontend (Environment on Vercel)

```env
VITE_API_URL=https://spodth-api.onrender.com
VITE_SPOTIFY_CLIENT_ID=YOUR_SPOTIFY_CLIENT_ID_HERE
VITE_SPOTIFY_REDIRECT_URI=https://spodth.vercel.app/auth/spotify/callback
```

---

## 🎯 Expected Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Setup | 5 min | Quick |
| Database | 10 min | Render needs time |
| Backend | 10 min | First build takes time |
| Frontend | 5 min | Vercel is fast |
| Testing | 5 min | Verify everything |
| **Total** | **~35 minutes** | ✅ |

---

## 🔗 Direct Links You'll Need

**Create Accounts:**
- GitHub: https://github.com/signup
- Render: https://render.com
- Vercel: https://vercel.com
- Spotify Dev: https://developer.spotify.com

**Deployment:**
- Render Dashboard: https://render.com/dashboard
- Vercel Dashboard: https://vercel.com/dashboard
- Spotify Dashboard: https://developer.spotify.com/dashboard

**GitHub:**
- Create Repo: https://github.com/new
- Your SPODTH Repo: https://github.com/YOUR_USERNAME/spodth

**Monitoring (Optional):**
- UptimeRobot: https://uptimerobot.com

---

## 🚨 Common Mistakes to Avoid

❌ **Don't:**
- Commit `.env` files to GitHub (use `.env.example`)
- Use same password everywhere
- Leave default ports in production
- Skip database schema initialization
- Forget redirect URI trailing slashes

✅ **Do:**
- Use strong JWT_SECRET (32+ chars, random)
- Keep CLIENT_SECRET hidden
- Double-check redirect URIs exactly
- Test before going live
- Monitor logs after deploy

---

## 📞 Getting Help

If deployment fails:

1. **Check logs on Render:** Dashboard → Select service → Logs
2. **Check logs on Vercel:** Dashboard → Select project → Deployments → View logs
3. **Common issues:** See DEPLOYMENT_STEPS.md troubleshooting section

---

**Let me know when you start! I'll help troubleshoot any issues. 🚀**
