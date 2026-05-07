# 🚀 SPODTH Deploy Guide - Hatakekakashi55

**GitHub Repo:** https://github.com/hatakekakashi55/Spodth_Justlisten  
**Status:** ✅ Code pushed successfully!

---

## 🎯 Your Live URLs (After Deploy)

```
🎵 Frontend:  https://justlisten.vercel.app
🔌 Backend:   https://spodth-api.onrender.com
💾 Database:  PostgreSQL (Render)
```

---

## ⚡ Quick Deploy (30 minutes total)

### 1️⃣ Spotify Developer Credentials (2 min)

Go to: https://developer.spotify.com/dashboard
1. Login with Spotify account
2. Click "Create an App"
3. Name: `SPODTH`
4. Accept terms → Create

**Copy these:**
- `Client ID` → Save it
- `Client Secret` → Keep it safe!

**Add Redirect URIs:**
Click "Edit Settings" → Redirect URIs section:
```
https://spodth-api.onrender.com/api/auth/spotify/callback
https://justlisten.vercel.app/auth/spotify/callback
```
Click "Save"

---

### 2️⃣ Deploy Backend to Render (10 min)

**Create Database First:**
1. Go to https://render.com (create account)
2. Click "New +" → "PostgreSQL"
3. Fill in:
   - **Name:** spodth-db
   - **Database:** spodth_db
   - **User:** spodth_user
4. **Pricing Plan:** Free
5. Click "Create Database"

⏳ Wait 3-5 minutes for database to initialize...

**Copy the "External Database URL"** (looks like: `postgresql://user:pass@host:5432/db`)

---

**Deploy Backend Service:**
1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Click "Connect your GitHub repo"
4. Select `hatakekakashi55/Spodth_Justlisten`
5. Fill in:
   - **Name:** spodth-api
   - **Root Directory:** backend
   - **Runtime:** Node
   - **Build:** npm install
   - **Start:** npm start
6. Click "Advanced" and add env vars:

```
PORT=5000
NODE_ENV=production
DATABASE_URL=[paste your PostgreSQL External URL here]
JWT_SECRET=sp0dth_secret_key_change_this_min32chars
SPOTIFY_CLIENT_ID=[paste from Spotify]
SPOTIFY_CLIENT_SECRET=[paste from Spotify]
SPOTIFY_REDIRECT_URI=https://spodth-api.onrender.com/api/auth/spotify/callback
FRONTEND_URL=https://justlisten.vercel.app
RENDER_EXTERNAL_URL=https://spodth-api.onrender.com
```

7. Click "Create Web Service"

⏳ Wait 5-10 minutes...

**Your Backend URL:** Copy from Render dashboard
```
https://spodth-api.onrender.com
```

---

### 3️⃣ Deploy Frontend to Vercel (5 min)

1. Go to https://vercel.com (create account with GitHub)
2. Click "Add New +" → "Project"
3. Click "Import Git Repository"
4. Select `Spodth_Justlisten`
5. Fill in:
   - **Project Name:** justlisten
   - **Framework:** Vite
   - **Root Directory:** frontend
6. Click "Environment Variables" and add:

```
VITE_API_URL=https://spodth-api.onrender.com
VITE_SPOTIFY_CLIENT_ID=[paste from Spotify]
VITE_SPOTIFY_REDIRECT_URI=https://justlisten.vercel.app/auth/spotify/callback
```

7. Click "Deploy"

⏳ Wait 2-3 minutes...

**Your Frontend URL:** Vercel will show it
```
https://justlisten.vercel.app
```

---

### 4️⃣ Test Your App (5 min)

1. Open: https://justlisten.vercel.app
2. Click "Login with Spotify"
3. Authorize SPODTH
4. If you see the home page → ✅ Success!
5. Try searching for a song
6. Try playing a song
7. Try creating a playlist

---

## 🔧 Environment Variables Quick Reference

### Backend (Render)
```
DATABASE_URL        → From Render PostgreSQL
JWT_SECRET          → Generate random 32+ chars
SPOTIFY_CLIENT_ID   → From Spotify Dashboard
SPOTIFY_CLIENT_SECRET → From Spotify Dashboard (keep secret!)
SPOTIFY_REDIRECT_URI → https://spodth-api.onrender.com/api/auth/spotify/callback
FRONTEND_URL        → https://justlisten.vercel.app
RENDER_EXTERNAL_URL → https://spodth-api.onrender.com
```

### Frontend (Vercel)
```
VITE_API_URL                → https://spodth-api.onrender.com
VITE_SPOTIFY_CLIENT_ID      → From Spotify Dashboard
VITE_SPOTIFY_REDIRECT_URI   → https://justlisten.vercel.app/auth/spotify/callback
```

---

## 🐛 Troubleshooting

### ❌ Login not working?
- Check Spotify redirect URIs match exactly (no extra slashes)
- Clear browser cache and cookies
- Try incognito window

### ❌ Backend won't deploy?
- Check DATABASE_URL is correct
- Verify all env vars are set
- Check logs on Render dashboard

### ❌ Search not working?
- Verify SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET
- Check backend logs
- Refresh page

### ❌ "CORS error"?
- Check FRONTEND_URL is set on backend
- Verify API_URL on frontend matches backend URL

---

## 📋 Deployment Checklist

- [ ] Spotify Developer App created
- [ ] Spotify credentials copied
- [ ] GitHub repo has code (✅ Done!)
- [ ] Render PostgreSQL database created
- [ ] Render backend deployed
- [ ] Backend URL working (test `/api/health`)
- [ ] Vercel frontend deployed
- [ ] Frontend URL working
- [ ] Spotify OAuth login tested
- [ ] Search and player working

---

## 🎉 Success Indicators

✅ When deployed successfully, you should see:

1. **Home page loads** with Spotify logo
2. **Login works** - Spotify OAuth flow completes
3. **Search works** - Type a song name and get results
4. **Player controls work** - Play/pause/skip buttons work
5. **Playlists work** - Can create and save playlists
6. **Dynamic colors** - Album art colors change player theme

---

## 📊 Costs

| Service | Cost | Notes |
|---------|------|-------|
| Render Backend | Free | Auto-sleeps after 15 min (use UptimeRobot to keep alive) |
| Vercel Frontend | Free | Always on |
| PostgreSQL | Free | Render free tier |
| Total | $0/month | 🎉 |

---

## 🚀 Keep Backend Awake

Render free tier sleeps. Use **UptimeRobot** (free):

1. Go to https://uptimerobot.com
2. Create free account
3. Add Monitor
4. Monitor type: HTTP(s)
5. Friendly name: SPODTH API
6. URL: https://spodth-api.onrender.com/api/health
7. Monitoring interval: 5 minutes
8. Check "Get alerts if down"
9. Click "Create Monitor"

Your backend stays awake forever! ✅

---

## 📱 Share Your App

After deployment, share this with friends:
```
https://justlisten.vercel.app
```

They can:
1. Login with Spotify
2. Search millions of songs
3. Create playlists
4. Listen to 30-second previews
5. Like/unlike songs

---

## 💡 Pro Tips

1. **Custom Domain:** Buy domain (e.g., justlisten.com) and add to Vercel
2. **Better Backend URL:** Add custom domain to Render
3. **Share playlists:** Use "Copy Link" (add feature)
4. **Analytics:** Monitor Render/Vercel dashboards

---

**Ready to deploy? Start with Step 1 above! 🎵**

Need help? Check logs on:
- Render: https://render.com/dashboard
- Vercel: https://vercel.com/dashboard
