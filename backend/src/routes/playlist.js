// Backend: Playlist Routes
// src/routes/playlist.js

import express from 'express';
import * as playlistModel from '../models/playlistModel.js';
import * as trackModel from '../models/trackModel.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Create playlist
router.post('/', verifyToken, async (req, res) => {
  const { title, description, isPublic } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Playlist title required' });
  }

  try {
    const playlist = await playlistModel.createPlaylist(
      req.user.userId,
      title,
      description,
      isPublic
    );
    res.status(201).json(playlist);
  } catch (error) {
    console.error('Error creating playlist:', error);
    res.status(500).json({ error: 'Failed to create playlist' });
  }
});

// Get user's playlists
router.get('/', verifyToken, async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;

  try {
    const playlists = await playlistModel.getUserPlaylists(
      req.user.userId,
      parseInt(limit),
      parseInt(offset)
    );
    res.json(playlists);
  } catch (error) {
    console.error('Error fetching playlists:', error);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

// Get playlist details
router.get('/:playlistId', async (req, res) => {
  try {
    const playlist = await playlistModel.getPlaylistById(req.params.playlistId);
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    res.json(playlist);
  } catch (error) {
    console.error('Error fetching playlist:', error);
    res.status(500).json({ error: 'Failed to fetch playlist' });
  }
});

// Get playlist tracks
router.get('/:playlistId/tracks', async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;

  try {
    const tracks = await playlistModel.getPlaylistTracks(
      req.params.playlistId,
      parseInt(limit),
      parseInt(offset)
    );
    res.json(tracks);
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    res.status(500).json({ error: 'Failed to fetch playlist tracks' });
  }
});

// Add track to playlist
router.post('/:playlistId/tracks', verifyToken, async (req, res) => {
  const { trackId, position } = req.body;

  if (!trackId) {
    return res.status(400).json({ error: 'Track ID required' });
  }

  try {
    // Verify playlist ownership or collaboration
    const playlist = await playlistModel.getPlaylistById(req.params.playlistId);
    if (!playlist || (playlist.user_id !== req.user.userId && !playlist.is_collaborative)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await playlistModel.addTrackToPlaylist(
      req.params.playlistId,
      trackId,
      req.user.userId,
      position
    );

    res.status(201).json({ success: true, result });
  } catch (error) {
    console.error('Error adding track to playlist:', error);
    res.status(500).json({ error: 'Failed to add track' });
  }
});

// Remove track from playlist
router.delete('/:playlistId/tracks/:trackId', verifyToken, async (req, res) => {
  try {
    // Verify playlist ownership
    const playlist = await playlistModel.getPlaylistById(req.params.playlistId);
    if (!playlist || playlist.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await playlistModel.removeTrackFromPlaylist(
      req.params.playlistId,
      req.params.trackId
    );

    res.json({ success: true, message: 'Track removed' });
  } catch (error) {
    console.error('Error removing track:', error);
    res.status(500).json({ error: 'Failed to remove track' });
  }
});

// Update playlist
router.put('/:playlistId', verifyToken, async (req, res) => {
  const { title, description, imageUrl, isPublic } = req.body;

  try {
    // Verify ownership
    const playlist = await playlistModel.getPlaylistById(req.params.playlistId);
    if (!playlist || playlist.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await playlistModel.updatePlaylist(req.params.playlistId, {
      title,
      description,
      imageUrl,
      isPublic,
    });

    res.json(updated);
  } catch (error) {
    console.error('Error updating playlist:', error);
    res.status(500).json({ error: 'Failed to update playlist' });
  }
});

// Delete playlist
router.delete('/:playlistId', verifyToken, async (req, res) => {
  try {
    // Verify ownership
    const playlist = await playlistModel.getPlaylistById(req.params.playlistId);
    if (!playlist || playlist.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await playlistModel.deletePlaylist(req.params.playlistId);
    res.json({ success: true, message: 'Playlist deleted' });
  } catch (error) {
    console.error('Error deleting playlist:', error);
    res.status(500).json({ error: 'Failed to delete playlist' });
  }
});

// Add collaborator
router.post('/:playlistId/collaborators', verifyToken, async (req, res) => {
  const { collaboratorId } = req.body;

  if (!collaboratorId) {
    return res.status(400).json({ error: 'Collaborator ID required' });
  }

  try {
    // Verify ownership
    const playlist = await playlistModel.getPlaylistById(req.params.playlistId);
    if (!playlist || playlist.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await playlistModel.addCollaborator(req.params.playlistId, collaboratorId);
    res.json({ success: true, message: 'Collaborator added' });
  } catch (error) {
    console.error('Error adding collaborator:', error);
    res.status(500).json({ error: 'Failed to add collaborator' });
  }
});

// Get collaborators
router.get('/:playlistId/collaborators', async (req, res) => {
  try {
    const collaborators = await playlistModel.getPlaylistCollaborators(req.params.playlistId);
    res.json(collaborators);
  } catch (error) {
    console.error('Error fetching collaborators:', error);
    res.status(500).json({ error: 'Failed to fetch collaborators' });
  }
});

export default router;
