// Backend: Track Routes  
// src/routes/track.js

import express from 'express';
import * as trackModel from '../models/trackModel.js';
import * as spotifyService from '../utils/spotifyService.js';
import { query } from '../config/database.js';
import { verifyToken } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Search Spotify for tracks and add to database
router.get('/search', async (req, res) => {
  const { q, limit = 20, offset = 0 } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query required' });
  }

  try {
    const tracks = await spotifyService.searchTracks(q, parseInt(limit), parseInt(offset));

    // Upsert tracks into database
    const processedTracks = await Promise.all(
      tracks.map(async (track) => {
        await trackModel.upsertTrack(track);
        return {
          id: track.id,
          title: track.name,
          artists: track.artists.map(a => a.name).join(', '),
          duration: track.duration_ms,
          image: track.album.images[0]?.url,
          preview: track.preview_url,
          explicit: track.explicit,
        };
      })
    );

    res.json(processedTracks);
  } catch (error) {
    console.error('Error searching tracks:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get track details
router.get('/:trackId', async (req, res) => {
  try {
    const track = await trackModel.getTrackDetails(req.params.trackId);
    if (!track) {
      return res.status(404).json({ error: 'Track not found' });
    }
    res.json(track);
  } catch (error) {
    console.error('Error fetching track:', error);
    res.status(500).json({ error: 'Failed to fetch track' });
  }
});

// Add track to liked songs
router.post('/:trackId/like', verifyToken, async (req, res) => {
  try {
    const result = await query(
      `INSERT INTO liked_songs (user_id, track_id) VALUES ($1, $2)
       ON CONFLICT DO NOTHING
       RETURNING id`,
      [req.user.userId, req.params.trackId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Track already liked' });
    }

    res.json({ success: true, message: 'Track liked' });
  } catch (error) {
    console.error('Error liking track:', error);
    res.status(500).json({ error: 'Failed to like track' });
  }
});

// Remove track from liked songs
router.delete('/:trackId/like', verifyToken, async (req, res) => {
  try {
    const result = await query(
      `DELETE FROM liked_songs WHERE user_id = $1 AND track_id = $2`,
      [req.user.userId, req.params.trackId]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ error: 'Track not liked' });
    }

    res.json({ success: true, message: 'Track unliked' });
  } catch (error) {
    console.error('Error unliking track:', error);
    res.status(500).json({ error: 'Failed to unlike track' });
  }
});

// Get user's liked songs
router.get('/me/liked', verifyToken, async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;

  try {
    const result = await query(
      `SELECT t.id, t.spotify_id, t.title, t.duration_ms, t.artwork_url, t.popularity, ls.liked_at,
              array_agg(json_build_object('name', a.name)) as artists
       FROM liked_songs ls
       JOIN tracks t ON ls.track_id = t.id
       LEFT JOIN track_artists ta ON t.id = ta.track_id
       LEFT JOIN artists a ON ta.artist_id = a.id
       WHERE ls.user_id = $1
       GROUP BY t.id, ls.liked_at
       ORDER BY ls.liked_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.userId, parseInt(limit), parseInt(offset)]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching liked songs:', error);
    res.status(500).json({ error: 'Failed to fetch liked songs' });
  }
});

// Log playback history
router.post('/:trackId/play', verifyToken, async (req, res) => {
  const { deviceId, contextType = 'track', progressMs = 0 } = req.body;

  try {
    const result = await query(
      `INSERT INTO playback_history (user_id, track_id, device_id, context_type, progress_ms)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [req.user.userId, req.params.trackId, deviceId, contextType, progressMs]
    );

    res.json({ success: true, playbackId: result.rows[0].id });
  } catch (error) {
    console.error('Error logging playback:', error);
    res.status(500).json({ error: 'Failed to log playback' });
  }
});

// Get audio features for a track
router.get('/:trackId/features', async (req, res) => {
  try {
    // Try to get from database first
    let track = await trackModel.getTrackDetails(req.params.trackId);
    
    if (track && track.energy) {
      return res.json({
        bpm: track.bpm,
        energy: track.energy,
        danceability: track.danceability,
        valence: track.valence,
        acousticness: track.acousticness,
        instrumentalness: track.instrumentalness,
        liveness: track.liveness,
        speechiness: track.speechiness,
      });
    }

    // Fetch from Spotify if not in database
    const features = await spotifyService.getAudioFeatures(req.params.trackId);
    res.json(features);
  } catch (error) {
    console.error('Error fetching audio features:', error);
    res.status(500).json({ error: 'Failed to fetch audio features' });
  }
});

export default router;
