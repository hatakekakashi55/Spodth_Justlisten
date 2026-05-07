# SPODTH Quick Start Guide

## 🚀 5-Minute Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Git
- Spotify Developer Account

---

## 1. Clone & Setup

```bash
# Clone repository
git clone <your-repo-url>
cd SPODTH

# Setup Backend
cd backend
cp .env.example .env
npm install

# Setup Frontend
cd ../frontend
cp .env.example .env
npm install
```

---

## 2. Configure Environment

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/spodth_db

# JWT
JWT_SECRET=your-super-secret-key-change-this

# Spotify
SPOTIFY_CLIENT_ID=your-spotify-id
SPOTIFY_CLIENT_SECRET=your-spotify-secret
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/auth/spotify/callback

# URLs
FRONTEND_URL=http://localhost:5173
API_URL=http://localhost:5000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
VITE_SPOTIFY_CLIENT_ID=your-spotify-id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/auth/spotify/callback
```

---

## 3. Database Setup

```bash
# Open PostgreSQL
psql postgresql://user:password@localhost:5432

# Create database
CREATE DATABASE spodth_db;

# Connect to database
\c spodth_db

# Run schema
\i backend/src/config/schema.sql

# Verify
\dt
```

---

## 4. Start Development Servers

### Terminal 1: Backend
```bash
cd backend
npm run dev
# Server running on http://localhost:5000
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
# App running on http://localhost:5173
```

---

## 5. Access Application

1. Open http://localhost:5173
2. Click "Login with Spotify"
3. Authorize the application
4. Start streaming!

---

## 🎵 Features Available

### Core Features
- ✅ Spotify OAuth authentication
- ✅ Track search & discovery
- ✅ Audio preview playback (30s)
- ✅ Create & manage playlists
- ✅ Like/unlike songs
- ✅ User profiles & following
- ✅ Trending & new releases

### UI/UX
- ✅ Glassmorphic design
- ✅ Global player bar
- ✅ Dynamic color palette
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Dark theme

---

## 📱 Browser Testing

```bash
# Desktop
http://localhost:5173

# Mobile (same machine)
http://<your-ip>:5173

# Android Device (same network)
http://<your-machine-ip>:5173
```

---

## 🔧 Useful Commands

### Backend
```bash
npm run dev      # Start development server
npm start        # Start production server
npm run migrate  # Run database migrations
npm run seed     # Seed sample data (future)
npm test         # Run tests
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
npm run format   # Format code with Prettier
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Kill process on port 5173
lsof -i :5173
kill -9 <PID>
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Check DATABASE_URL format
# postgresql://user:password@host:port/database
```

### Spotify OAuth Not Working
```bash
# Verify redirect URI matches exactly
# Case-sensitive, must use HTTPS in production
# Check Spotify Developer Dashboard
```

### CORS Errors
```bash
# Check FRONTEND_URL in backend .env
# Should match exactly: http://localhost:5173
```

---

## 📚 Project Structure

```
SPODTH/
├── backend/
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── models/        # Database models
│   │   ├── middleware/    # Auth, validation
│   │   ├── utils/         # Helper functions
│   │   ├── config/        # Database config
│   │   └── index.js       # Server entry
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── stores/        # Zustand stores
│   │   ├── utils/         # Helper functions
│   │   ├── styles/        # CSS files
│   │   ├── App.jsx        # Main app
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── package.json
│   └── .env
│
├── docs/
│   ├── ARCHITECTURE.md    # System design
│   ├── API.md             # API documentation
│   ├── DATABASE.md        # Schema design
│   └── DEPLOYMENT.md      # Deployment guide
│
└── README.md
```

---

## 🚀 Next Steps

1. Customize branding (logo, colors)
2. Add more playlist features
3. Implement offline mode
4. Add user notifications
5. Deploy to production
6. Monitor & optimize

---

## 📖 Documentation

- [Architecture Guide](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

---

## 💡 Tips

- Use browser DevTools to inspect network requests
- Check backend logs for API errors
- Use Spotify Developer Dashboard to generate new tokens
- Read Howler.js docs for audio player customization
- Reference Tailwind & Framer Motion docs for UI

---

## 🤝 Support

For issues:
1. Check the troubleshooting section
2. Review documentation
3. Check browser console & network tabs
4. Review backend logs

---

## ✨ Happy Coding!

Build amazing music experiences with SPODTH!
