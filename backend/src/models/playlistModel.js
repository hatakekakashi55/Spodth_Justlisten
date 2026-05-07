// Backend: Playlist Model
// src/models/playlistModel.js

import { query, transaction } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

// Create playlist
export const createPlaylist = async (userId, title, description = '', isPublic = false) => {
  const playlistId = uuidv4();

  const result = await query(
    `INSERT INTO playlists (id, user_id, title, description, is_public)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, user_id, title, description, is_public, total_tracks, created_at`,
    [playlistId, userId, title, description, isPublic]
  );

  return result.rows[0];
};

// Get playlist by ID
export const getPlaylistById = async (playlistId) => {
  const result = await query(
    `SELECT p.*, u.username as owner_name
     FROM playlists p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = $1 AND p.deleted_at IS NULL`,
    [playlistId]
  );
  return result.rows[0];
};

// Get all playlists for user
export const getUserPlaylists = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT id, title, description, image_url, is_public, total_tracks, created_at
     FROM playlists
     WHERE user_id = $1 AND deleted_at IS NULL
     ORDER BY updated_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows;
};

// Get playlist tracks
export const getPlaylistTracks = async (playlistId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT t.id, t.spotify_id, t.title, t.duration_ms, t.artwork_url, t.popularity, pt.added_at,
            array_agg(json_build_object('name', a.name)) as artists
     FROM playlist_tracks pt
     JOIN tracks t ON pt.track_id = t.id
     LEFT JOIN track_artists ta ON t.id = ta.track_id
     LEFT JOIN artists a ON ta.artist_id = a.id
     WHERE pt.playlist_id = $1
     GROUP BY t.id, pt.added_at
     ORDER BY pt.position ASC
     LIMIT $2 OFFSET $3`,
    [playlistId, limit, offset]
  );
  return result.rows;
};

// Add track to playlist
export const addTrackToPlaylist = async (playlistId, trackId, userId, position = null) => {
  return transaction(async (client) => {
    // Add track
    const result = await client.query(
      `INSERT INTO playlist_tracks (playlist_id, track_id, added_by_user_id, position)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (playlist_id, track_id) DO NOTHING
       RETURNING id`,
      [playlistId, trackId, userId, position]
    );

    // Update total_tracks count
    await client.query(
      `UPDATE playlists SET total_tracks = total_tracks + 1, updated_at = NOW()
       WHERE id = $1 AND total_tracks < (
         SELECT COUNT(*) FROM playlist_tracks WHERE playlist_id = $1
       )`,
      [playlistId]
    );

    return result.rows[0];
  });
};

// Remove track from playlist
export const removeTrackFromPlaylist = async (playlistId, trackId) => {
  return transaction(async (client) => {
    // Remove track
    await client.query(
      `DELETE FROM playlist_tracks WHERE playlist_id = $1 AND track_id = $2`,
      [playlistId, trackId]
    );

    // Update total_tracks count
    await client.query(
      `UPDATE playlists SET total_tracks = (
         SELECT COUNT(*) FROM playlist_tracks WHERE playlist_id = $1
       ), updated_at = NOW()
       WHERE id = $1`,
      [playlistId]
    );
  });
};

// Update playlist metadata
export const updatePlaylist = async (playlistId, { title, description, imageUrl, isPublic }) => {
  const result = await query(
    `UPDATE playlists 
     SET title = COALESCE($2, title),
         description = COALESCE($3, description),
         image_url = COALESCE($4, image_url),
         is_public = COALESCE($5, is_public),
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, title, description, image_url, is_public`,
    [playlistId, title, description, imageUrl, isPublic]
  );
  return result.rows[0];
};

// Delete playlist
export const deletePlaylist = async (playlistId) => {
  const result = await query(
    `UPDATE playlists SET deleted_at = NOW() WHERE id = $1 RETURNING id`,
    [playlistId]
  );
  return result.rowCount > 0;
};

// Add collaborator to playlist
export const addCollaborator = async (playlistId, collaboratorId) => {
  const result = await query(
    `INSERT INTO playlist_collaborators (playlist_id, collaborator_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING
     RETURNING id`,
    [playlistId, collaboratorId]
  );
  return result.rows[0];
};

// Remove collaborator
export const removeCollaborator = async (playlistId, collaboratorId) => {
  const result = await query(
    `DELETE FROM playlist_collaborators WHERE playlist_id = $1 AND collaborator_id = $2`,
    [playlistId, collaboratorId]
  );
  return result.rowCount > 0;
};

// Get playlist collaborators
export const getPlaylistCollaborators = async (playlistId) => {
  const result = await query(
    `SELECT u.id, u.username, u.profile_image_url
     FROM playlist_collaborators pc
     JOIN users u ON pc.collaborator_id = u.id
     WHERE pc.playlist_id = $1`,
    [playlistId]
  );
  return result.rows;
};

export default {
  createPlaylist,
  getPlaylistById,
  getUserPlaylists,
  getPlaylistTracks,
  addTrackToPlaylist,
  removeTrackFromPlaylist,
  updatePlaylist,
  deletePlaylist,
  addCollaborator,
  removeCollaborator,
  getPlaylistCollaborators,
};
