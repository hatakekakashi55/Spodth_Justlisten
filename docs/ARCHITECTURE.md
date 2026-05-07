# SPODTH Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Client Layer                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              React Frontend (Vite)                        │  │
│  │  • Components: Player, Tracks, Playlists, Search         │  │
│  │  • State: Zustand (usePlayerStore)                       │  │
│  │  • Styling: Tailwind CSS + Framer Motion                 │  │
│  │  • Audio: Howler.js + Browser API                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                             ↕ (HTTP/JSON)
┌─────────────────────────────────────────────────────────────────┐
│                  API Gateway Layer (Render)                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │        Express.js Backend Server (Node.js)               │  │
│  │  • Auth Routes (JWT + Spotify OAuth)                     │  │
│  │  • User Routes (Profile, Following)                      │  │
│  │  • Track Routes (Search, Like, Play)                     │  │
│  │  • Playlist Routes (CRUD + Collaboration)                │  │
│  │  • Search Routes (Global, Trending, Recommendations)     │  │
│  │  • Stream Routes (Audio Proxy)                           │  │
│  │  • Middleware: Auth, CORS, Rate Limiting                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                             ↕ (SQL)
┌─────────────────────────────────────────────────────────────────┐
│                    Data Layer                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │          PostgreSQL Database (Render)                    │  │
│  │  • Users Table (with Spotify integration)                │  │
│  │  • Tracks Table (with audio features)                    │  │
│  │  • Artists Table (normalized)                            │  │
│  │  • Albums Table                                          │  │
│  │  • Playlists Table (with metadata)                       │  │
│  │  • Playback History                                      │  │
│  │  • User Relationships (Followers, etc)                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                             ↕ (REST API)
┌─────────────────────────────────────────────────────────────────┐
│                   External Services                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Spotify Web API (Metadata & Auth)                       │  │
│  │  • OAuth 2.0 Authentication                              │  │
│  │  • Track Search & Metadata                               │  │
│  │  • Audio Features & Analysis                             │  │
│  │  • Recommendations API                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Cloudflare R2 Storage (Optional - Phase 2)              │  │
│  │  • Full track audio (Premium feature)                    │  │
│  │  • Album artwork backup                                  │  │
│  │  • User uploads (future)                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### User Authentication Flow
```
1. User clicks "Login with Spotify"
   ↓
2. Frontend redirects to Spotify OAuth
   ↓
3. User authorizes SPODTH app
   ↓
4. Spotify redirects to /auth/spotify/callback with code
   ↓
5. Backend exchanges code for Spotify tokens
   ↓
6. Backend creates/updates user in database
   ↓
7. Backend generates JWT token
   ↓
8. Frontend stores JWT and redirects to app
   ↓
9. All subsequent requests include JWT in Authorization header
```

### Track Playback Flow
```
1. User clicks play on a track
   ↓
2. Frontend searches for preview URL via Spotify API
   ↓
3. Frontend requests stream URL from /stream/url endpoint
   ↓
4. Backend returns proxied stream URL
   ↓
5. Frontend loads audio via Howler.js
   ↓
6. Frontend sends playback event to /track/:id/play
   ↓
7. Backend logs to playback_history table
   ↓
8. Audio plays with full player controls
```

### Playlist Collaboration Flow
```
1. User creates playlist
   ↓
2. User adds collaborator via email
   ↓
3. Backend adds entry to playlist_collaborators table
   ↓
4. Collaborator can now add/remove tracks
   ↓
5. Changes propagate to all viewers (future: WebSocket)
```

## Component Architecture

### Frontend Component Tree
```
App
├── Sidebar
│   ├── Navigation Links
│   └── User Menu
├── Header
│   ├── Search Bar
│   └── User Profile
├── Main Content (Router)
│   ├── Home Page
│   │   ├── Trending Section
│   │   └── New Releases Section
│   ├── Search Page
│   │   └── Search Results Grid
│   ├── Library Page
│   │   └── Playlists Grid
│   └── LikedSongs Page
│       └── Liked Tracks Grid
└── PlayerBar
    ├── Track Info
    ├── Playback Controls
    ├── Progress Bar
    └── Volume Control
```

### Backend Route Structure
```
/api
├── /auth
│   ├── GET /spotify-url
│   ├── POST /spotify-callback
│   ├── POST /register
│   └── POST /login
├── /users
│   ├── GET /me
│   ├── GET /:userId
│   ├── PUT /me/profile
│   ├── GET /:userId/following
│   ├── POST /:userId/follow
│   └── DELETE /:userId/follow
├── /tracks
│   ├── GET /search
│   ├── GET /:trackId
│   ├── POST /:trackId/like
│   ├── DELETE /:trackId/like
│   ├── GET /me/liked
│   └── GET /:trackId/features
├── /playlists
│   ├── POST /
│   ├── GET /
│   ├── GET /:playlistId
│   ├── GET /:playlistId/tracks
│   ├── POST /:playlistId/tracks
│   ├── DELETE /:playlistId/tracks/:trackId
│   ├── PUT /:playlistId
│   └── DELETE /:playlistId
├── /search
│   ├── GET /
│   ├── GET /trending/tracks
│   ├── GET /new-releases
│   └── POST /recommendations
└── /stream
    ├── POST /url
    ├── GET /preview/:trackId
    └── GET /hls/:trackId/playlist.m3u8
```

## Database Schema Structure

### Relationships
```
Users ──► Playlists
   │        │
   │        └──► Playlist_Tracks ──► Tracks
   │
   ├──► Liked_Songs ──► Tracks
   │
   ├──► Playback_History ──► Tracks
   │
   ├──► User_Followers ──► Users
   │
   └──► Playlist_Collaborators ──► Users

Tracks ──► Track_Artists ──► Artists
   │
   └──► Album_Tracks ──► Albums
```

## State Management

### Zustand Store (usePlayerStore)
```
State:
  - currentTrack: Track object or null
  - queue: Array of Track objects
  - queueIndex: Current position in queue
  - isPlaying: Boolean
  - currentTime: Current playback position (ms)
  - duration: Track duration (ms)
  - volume: Volume level (0-1)
  - shuffle: Boolean
  - repeat: 'off' | 'all' | 'one'

Actions:
  - loadTrack(track, streamUrl)
  - play() / pause() / togglePlayPause()
  - seek(time)
  - next() / previous()
  - setVolume(volume)
  - setQueue(tracks)
  - toggleShuffle()
  - cycleRepeat()
```

## Security Architecture

### Authentication & Authorization
```
Frontend                Backend                Database
   │                        │                      │
   ├─ Store JWT ─────────► Verify JWT ───────────►  │
   │                        │                      │
   │                    Validate scope             │
   │                        │                      │
   │                   Authorize action            │
```

### CORS Configuration
```
Allowed Origins: [FRONTEND_URL]
Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
Allowed Headers: Content-Type, Authorization
Credentials: true
```

### Rate Limiting
```
Endpoint           Requests    Window
/auth/*            5           1 minute
/search*           20          1 minute
/*                 100         15 minutes
```

## Scaling Considerations

### Current (MVP)
- Single server instance
- Shared database
- No caching layer
- Direct Spotify API calls

### Phase 2 (Growth)
- Horizontal scaling with load balancer
- Database read replicas
- Redis caching layer
- Background job queue (Bull.js)

### Phase 3 (Enterprise)
- Microservices (Auth, Search, Streaming)
- Elasticsearch for search
- Kafka for event streaming
- Kubernetes orchestration
- Multi-region deployment

## Performance Optimizations

### Frontend
- Code splitting with Vite
- Image lazy loading
- Virtual scrolling for long lists
- Memoized components with React.memo

### Backend
- Database indexes on frequently queried columns
- Connection pooling
- Query optimization
- Response compression (gzip)
- Caching headers on static assets

### Network
- CDN for frontend assets (Vercel)
- Compression of API responses
- Pagination for large datasets
- Efficient data serialization

## Monitoring & Observability

### Logging
- Backend: Console logs + file logs
- Frontend: Console + error tracking (future)
- Database: Slow query logs

### Metrics
- Request latency
- Database query performance
- User engagement (future)
- API usage statistics

### Alerts
- Server errors (500+)
- Database connectivity issues
- High latency (>1000ms)
- Rate limit violations
