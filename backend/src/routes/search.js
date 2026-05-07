// Backend: Search Routes
// src/routes/search.js

import express from 'express';
import * as spotifyService from '../utils/spotifyService.js';
import * as trackModel from '../models/trackModel.js';

const router = express.Router();

// Search all types (tracks, artists, albums, playlists)
router.get('/', async (req, res) => {
  const { q, type = 'track', limit = 20, offset = 0 } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Search query required' });
  }

  try {
    let results;

    switch (type) {
      case 'track':
        results = await spotifyService.searchTracks(q, parseInt(limit), parseInt(offset));
        results = results.map(track => ({
          type: 'track',
          id: track.id,
          name: track.name,
          artists: track.artists.map(a => a.name),
          image: track.album?.images?.[0]?.url,
          duration: track.duration_ms,
          preview: track.preview_url,
        }));
        break;

      case 'artist':
        results = await spotifyService.searchArtists(q, parseInt(limit), parseInt(offset));
        results = results.map(artist => ({
          type: 'artist',
          id: artist.id,
          name: artist.name,
          image: artist.images?.[0]?.url,
          genres: artist.genres,
          followers: artist.followers?.total,
        }));
        break;

      default:
        return res.status(400).json({ error: 'Invalid search type' });
    }

    res.json({
      query: q,
      type,
      results,
      total: results.length,
    });
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get trending tracks
router.get('/trending/tracks', async (req, res) => {
  try {
    const playlists = await spotifyService.getFeaturedPlaylists(1, 0);
    const tracks = await spotifyService.getPlaylistTracks(
      playlists.playlists.items[0].id,
      20,
      0
    );

    const processedTracks = tracks.items.map(item => ({
      id: item.track.id,
      name: item.track.name,
      artists: item.track.artists.map(a => a.name),
      image: item.track.album?.images?.[0]?.url,
      duration: item.track.duration_ms,
      preview: item.track.preview_url,
      addedAt: item.added_at,
    }));

    res.json(processedTracks);
  } catch (error) {
    console.error('Error fetching trending:', error);
    res.status(500).json({ error: 'Failed to fetch trending' });
  }
});

// Get new releases
router.get('/new-releases', async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;

  try {
    const releases = await spotifyService.getNewReleases(parseInt(limit), parseInt(offset));

    const albums = releases.albums.items.map(album => ({
      id: album.id,
      name: album.name,
      artists: album.artists.map(a => a.name),
      image: album.images?.[0]?.url,
      releaseDate: album.release_date,
      totalTracks: album.total_tracks,
    }));

    res.json(albums);
  } catch (error) {
    console.error('Error fetching new releases:', error);
    res.status(500).json({ error: 'Failed to fetch new releases' });
  }
});

// Get recommendations
router.post('/recommendations', async (req, res) => {
  const { seedTracks = [], limit = 20 } = req.body;

  if (!seedTracks || seedTracks.length === 0) {
    return res.status(400).json({ error: 'At least one seed track required' });
  }

  try {
    const recommendations = await spotifyService.getRecommendations(seedTracks, parseInt(limit));

    const processed = recommendations.map(track => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map(a => a.name),
      image: track.album?.images?.[0]?.url,
      duration: track.duration_ms,
      preview: track.preview_url,
      popularity: track.popularity,
    }));

    res.json(processed);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

export default router;
