# SPODTH Database Schema

## Overview
PostgreSQL schema for managing users, tracks, albums, playlists, and playback history.

## Core Tables

### 1. Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  profile_image_url TEXT,
  bio TEXT,
  spotify_id VARCHAR(255) UNIQUE,
  spotify_access_token TEXT,
  spotify_refresh_token TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
```

### 2. Tracks Table
```sql
CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spotify_id VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  duration_ms INTEGER NOT NULL,
  explicit BOOLEAN DEFAULT FALSE,
  preview_url TEXT,
  artwork_url TEXT,
  bpm INTEGER,
  key VARCHAR(10),
  mode VARCHAR(10),
  energy DECIMAL(3,2),
  danceability DECIMAL(3,2),
  valence DECIMAL(3,2),
  acousticness DECIMAL(3,2),
  instrumentalness DECIMAL(3,2),
  liveness DECIMAL(3,2),
  speechiness DECIMAL(3,2),
  popularity INTEGER,
  release_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Artists Table
```sql
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spotify_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  image_url TEXT,
  popularity INTEGER,
  followers INTEGER,
  genres TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Track Artists Junction
```sql
CREATE TABLE track_artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  artist_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(track_id, artist_id)
);
```

### 5. Albums Table
```sql
CREATE TABLE albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spotify_id VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  image_url TEXT,
  release_date DATE,
  total_tracks INTEGER,
  album_type VARCHAR(50),
  uri TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 6. Album Tracks Junction
```sql
CREATE TABLE album_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  track_number INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(album_id, track_id)
);
```

### 7. Playlists Table
```sql
CREATE TABLE playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  is_collaborative BOOLEAN DEFAULT FALSE,
  total_tracks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
```

### 8. Playlist Tracks Junction
```sql
CREATE TABLE playlist_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE NOT NULL,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMP DEFAULT NOW(),
  added_by_user_id UUID REFERENCES users(id),
  position INTEGER,
  UNIQUE(playlist_id, track_id)
);
```

### 9. Liked Songs
```sql
CREATE TABLE liked_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE NOT NULL,
  liked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);
```

### 10. Playback History
```sql
CREATE TABLE playback_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  progress_ms INTEGER DEFAULT 0,
  context_id UUID,
  context_type VARCHAR(50),
  device_id VARCHAR(255)
);
```

### 11. Collaborators Junction
```sql
CREATE TABLE playlist_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE NOT NULL,
  collaborator_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(playlist_id, collaborator_id)
);
```

### 12. Followers Junction
```sql
CREATE TABLE user_followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  followed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id)
);
```

## Indexes for Performance

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_spotify_id ON users(spotify_id);
CREATE INDEX idx_tracks_spotify_id ON tracks(spotify_id);
CREATE INDEX idx_artists_spotify_id ON artists(spotify_id);
CREATE INDEX idx_playlists_user_id ON playlists(user_id);
CREATE INDEX idx_liked_songs_user_id ON liked_songs(user_id);
CREATE INDEX idx_playback_history_user_id ON playback_history(user_id);
CREATE INDEX idx_playback_history_created_at ON playback_history(started_at);
CREATE INDEX idx_playlist_tracks_playlist_id ON playlist_tracks(playlist_id);
```

## Key Design Decisions

1. **UUID Primary Keys**: Better for distributed systems and security
2. **Soft Deletes**: `deleted_at` columns preserve data history
3. **Spotify Integration**: Store Spotify IDs for easy sync
4. **Audio Metadata**: BPM, key, energy, etc., for advanced features
5. **Relational Integrity**: Foreign keys ensure data consistency
6. **Timestamp Tracking**: All tables track creation and updates
7. **Collaborative Playlists**: Separate collaborators table for scalability
