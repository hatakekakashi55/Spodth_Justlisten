# SPODTH - Professional Music Streaming Platform

A production-ready music streaming application built with React, Node.js, and PostgreSQL. Integrates with Spotify Web API for real track data while providing a custom backend for user management, playlists, and streaming.

## 🏗️ Architecture

**Monorepo Structure:**
```
SPODTH/
├── frontend/          # React + Vite + Tailwind
├── backend/           # Node.js + Express + PostgreSQL
└── docs/              # Documentation & architecture
```

## 🔧 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, Zustand, Howler.js
- **Backend:** Node.js, Express, PostgreSQL, JWT Auth
- **Storage:** Cloudflare R2 (optional for large deployments)
- **Deployment:** Render, Vercel
- **APIs:** Spotify Web API (OAuth 2.0)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Spotify Developer Account (free tier available)

### Installation

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Configure PostgreSQL and Spotify credentials in .env
npm run migrate
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Configure API endpoints
npm run dev
```

## 📋 Features

### MVP (Phase 1)
- ✅ OAuth 2.0 Authentication (Spotify + Email)
- ✅ Real-time Music Streaming (via Spotify Web API)
- ✅ User Library Management (Liked Songs, Playlists)
- ✅ Search & Discovery
- ✅ Dynamic Player Controls
- ✅ Responsive UI (Mobile, Tablet, Desktop)

### Advanced Features (Phase 2)
- Music video integration
- Offline downloads
- Social sharing
- Device sync (Spotify Connect-like)
- AI-powered recommendations

## 📱 User Interface

The platform features a Spotify-inspired design with:
- Glassmorphic Player Bar
- Dynamic color palette based on album art
- Smooth transitions with Framer Motion
- Optimistic UI updates for premium feel
- Responsive design with Tailwind CSS

## 🔐 Security

- JWT-based authentication
- HTTPS-only communication
- CORS protection
- Rate limiting
- Environment variable protection

## 📊 Database Schema

See [DATABASE.md](./docs/DATABASE.md) for complete PostgreSQL schema design.

## 🚀 Deployment

- Frontend: Deployed to Vercel/Netlify
- Backend: Deployed to Render (with uptime ping strategy)
- Database: Managed PostgreSQL service

## 📝 API Documentation

See [API.md](./docs/API.md) for detailed endpoint documentation.

## 🤝 Contributing

This is a personal project. For modifications, follow the modular code structure and maintain clean separation of concerns.

## 📄 License

MIT License - See LICENSE file for details

---

Built with ❤️ for music streaming enthusiasts
