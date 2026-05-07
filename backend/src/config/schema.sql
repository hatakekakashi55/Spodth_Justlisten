-- SPODTH Database Schema Initialization
-- PostgreSQL 14+

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
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

-- Tracks Table
CREATE TABLE IF NOT EXISTS tracks (
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

-- Artists Table
CREATE TABLE IF NOT EXISTS artists (
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

-- Track Artists Junction
CREATE TABLE IF NOT EXISTS track_artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
  artist_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(track_id, artist_id)
);

-- Albums Table
CREATE TABLE IF NOT EXISTS albums (
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

-- Album Tracks Junction
CREATE TABLE IF NOT EXISTS album_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE,
  track_number INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(album_id, track_id)
);

-- Playlists Table
CREATE TABLE IF NOT EXISTS playlists (
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

-- Playlist Tracks Junction
CREATE TABLE IF NOT EXISTS playlist_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE NOT NULL,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMP DEFAULT NOW(),
  added_by_user_id UUID REFERENCES users(id),
  position INTEGER,
  UNIQUE(playlist_id, track_id)
);

-- Liked Songs
CREATE TABLE IF NOT EXISTS liked_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  track_id UUID REFERENCES tracks(id) ON DELETE CASCADE NOT NULL,
  liked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);

-- Playback History
CREATE TABLE IF NOT EXISTS playback_history (
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

-- Playlist Collaborators
CREATE TABLE IF NOT EXISTS playlist_collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE NOT NULL,
  collaborator_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(playlist_id, collaborator_id)
);

-- User Followers
CREATE TABLE IF NOT EXISTS user_followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  followed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id)
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_spotify_id ON users(spotify_id);
CREATE INDEX IF NOT EXISTS idx_tracks_spotify_id ON tracks(spotify_id);
CREATE INDEX IF NOT EXISTS idx_artists_spotify_id ON artists(spotify_id);
CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_liked_songs_user_id ON liked_songs(user_id);
CREATE INDEX IF NOT EXISTS idx_playback_history_user_id ON playback_history(user_id);
CREATE INDEX IF NOT EXISTS idx_playback_history_started_at ON playback_history(started_at);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist_id ON playlist_tracks(playlist_id);
CREATE INDEX IF NOT EXISTS idx_track_artists_track_id ON track_artists(track_id);
CREATE INDEX IF NOT EXISTS idx_album_tracks_album_id ON album_tracks(album_id);

-- Grant permissions to application user (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO spodth_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO spodth_user;
