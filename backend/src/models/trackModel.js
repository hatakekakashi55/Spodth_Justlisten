// Backend: Track Model
// src/models/trackModel.js

import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

// Create or update track from Spotify data
export const upsertTrack = async (spotifyTrack, audioFeatures = null) => {
  const trackId = uuidv4();
  const spotifyId = spotifyTrack.id;
  const title = spotifyTrack.name;
  const durationMs = spotifyTrack.duration_ms;
  const explicit = spotifyTrack.explicit;
  const previewUrl = spotifyTrack.preview_url;
  const artworkUrl = spotifyTrack.album?.images?.[0]?.url;
  const popularity = spotifyTrack.popularity;
  const releaseDate = spotifyTrack.album?.release_date;

  const result = await query(
    `INSERT INTO tracks 
     (id, spotify_id, title, duration_ms, explicit, preview_url, artwork_url, 
      popularity, release_date, bpm, energy, danceability, valence, acousticness, instrumentalness, liveness, speechiness)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
     ON CONFLICT (spotify_id) DO UPDATE SET updated_at = NOW()
     RETURNING id, spotify_id, title, duration_ms, popularity, artwork_url`,
    [
      trackId, spotifyId, title, durationMs, explicit, previewUrl, artworkUrl, popularity, releaseDate,
      audioFeatures?.tempo, audioFeatures?.energy, audioFeatures?.danceability, audioFeatures?.valence,
      audioFeatures?.acousticness, audioFeatures?.instrumentalness, audioFeatures?.liveness, audioFeatures?.speechiness
    ]
  );

  return result.rows[0];
};

// Find track by Spotify ID
export const findTrackBySpotifyId = async (spotifyId) => {
  const result = await query(
    `SELECT t.*, 
            array_agg(json_build_object('id', a.id, 'name', a.name, 'spotify_id', a.spotify_id)) as artists
     FROM tracks t
     LEFT JOIN track_artists ta ON t.id = ta.track_id
     LEFT JOIN artists a ON ta.artist_id = a.id
     WHERE t.spotify_id = $1
     GROUP BY t.id`,
    [spotifyId]
  );
  return result.rows[0];
};

// Get track details by ID
export const getTrackDetails = async (trackId) => {
  const result = await query(
    `SELECT t.*, 
            array_agg(json_build_object('id', a.id, 'name', a.name, 'spotify_id', a.spotify_id)) as artists
     FROM tracks t
     LEFT JOIN track_artists ta ON t.id = ta.track_id
     LEFT JOIN artists a ON ta.artist_id = a.id
     WHERE t.id = $1
     GROUP BY t.id`,
    [trackId]
  );
  return result.rows[0];
};

// Search tracks
export const searchTracks = async (searchQuery, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT t.id, t.title, t.spotify_id, t.duration_ms, t.artwork_url, t.popularity,
            array_agg(json_build_object('name', a.name)) as artists
     FROM tracks t
     LEFT JOIN track_artists ta ON t.id = ta.track_id
     LEFT JOIN artists a ON ta.artist_id = a.id
     WHERE t.title ILIKE $1
     GROUP BY t.id
     ORDER BY t.popularity DESC
     LIMIT $2 OFFSET $3`,
    [`%${searchQuery}%`, limit, offset]
  );
  return result.rows;
};

export default {
  upsertTrack,
  findTrackBySpotifyId,
  getTrackDetails,
  searchTracks,
};
