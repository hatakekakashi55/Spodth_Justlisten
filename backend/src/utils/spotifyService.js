// Backend: Spotify API Service
// src/utils/spotifyService.js

import SpotifyWebApi from 'spotify-web-api-node';
import dotenv from 'dotenv';

dotenv.config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

// Get authorization URL for user login
export const getAuthorizationUrl = () => {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-library-read',
    'user-library-modify',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-follow-read',
    'user-follow-modify',
  ];

  return spotifyApi.createAuthorizeURL(scopes, 'state_key');
};

// Exchange authorization code for tokens
export const getAccessToken = async (code) => {
  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    return {
      access_token: data.body.access_token,
      refresh_token: data.body.refresh_token,
      expires_in: data.body.expires_in,
    };
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

// Refresh access token
export const refreshAccessToken = async (refreshToken) => {
  try {
    spotifyApi.setRefreshToken(refreshToken);
    const data = await spotifyApi.refreshAccessToken();
    return {
      access_token: data.body.access_token,
      expires_in: data.body.expires_in,
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

// Set access token for API calls
export const setAccessToken = (token) => {
  spotifyApi.setAccessToken(token);
};

// Search tracks, artists, albums, playlists
export const searchTracks = async (query, limit = 20, offset = 0) => {
  try {
    const data = await spotifyApi.searchTracks(query, { limit, offset });
    return data.body.tracks.items;
  } catch (error) {
    console.error('Error searching tracks:', error);
    throw error;
  }
};

export const searchArtists = async (query, limit = 20, offset = 0) => {
  try {
    const data = await spotifyApi.searchArtists(query, { limit, offset });
    return data.body.artists.items;
  } catch (error) {
    console.error('Error searching artists:', error);
    throw error;
  }
};

// Get audio features for a track
export const getAudioFeatures = async (trackId) => {
  try {
    const data = await spotifyApi.getAudioFeaturesForTrack(trackId);
    return data.body;
  } catch (error) {
    console.error('Error getting audio features:', error);
    throw error;
  }
};

// Get current user's liked songs
export const getUserLikedSongs = async (limit = 20, offset = 0) => {
  try {
    const data = await spotifyApi.getMySavedTracks({ limit, offset });
    return data.body;
  } catch (error) {
    console.error('Error getting liked songs:', error);
    throw error;
  }
};

// Save track for user
export const saveTrackForUser = async (trackId) => {
  try {
    await spotifyApi.addToMySavedTracks([trackId]);
    return true;
  } catch (error) {
    console.error('Error saving track:', error);
    throw error;
  }
};

// Remove track from saved
export const removeTrackFromSaved = async (trackId) => {
  try {
    await spotifyApi.removeFromMySavedTracks([trackId]);
    return true;
  } catch (error) {
    console.error('Error removing track:', error);
    throw error;
  }
};

// Get current user profile
export const getCurrentUserProfile = async () => {
  try {
    const data = await spotifyApi.getMe();
    return data.body;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Get user's playlists
export const getUserPlaylists = async (limit = 20, offset = 0) => {
  try {
    const data = await spotifyApi.getMyPlaylists({ limit, offset });
    return data.body;
  } catch (error) {
    console.error('Error getting playlists:', error);
    throw error;
  }
};

// Get playlist tracks
export const getPlaylistTracks = async (playlistId, limit = 20, offset = 0) => {
  try {
    const data = await spotifyApi.getPlaylistTracks(playlistId, { limit, offset });
    return data.body;
  } catch (error) {
    console.error('Error getting playlist tracks:', error);
    throw error;
  }
};

// Get a single track
export const getTrack = async (trackId) => {
  try {
    const data = await spotifyApi.getTrack(trackId);
    return data.body;
  } catch (error) {
    console.error('Error getting track:', error);
    throw error;
  }
};

// Get multiple tracks
export const getTracks = async (trackIds) => {
  try {
    const data = await spotifyApi.getTracks(trackIds);
    return data.body.tracks;
  } catch (error) {
    console.error('Error getting tracks:', error);
    throw error;
  }
};

// Get recommendations based on seed tracks/artists
export const getRecommendations = async (seedTrackIds, limit = 20) => {
  try {
    const data = await spotifyApi.getRecommendations({
      seed_tracks: seedTrackIds.slice(0, 5),
      limit,
    });
    return data.body.tracks;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
};

// Get featured playlists
export const getFeaturedPlaylists = async (limit = 20, offset = 0) => {
  try {
    const data = await spotifyApi.getFeaturedPlaylists({ limit, offset });
    return data.body;
  } catch (error) {
    console.error('Error getting featured playlists:', error);
    throw error;
  }
};

// Get new releases
export const getNewReleases = async (limit = 20, offset = 0) => {
  try {
    const data = await spotifyApi.getNewReleases({ limit, offset });
    return data.body;
  } catch (error) {
    console.error('Error getting new releases:', error);
    throw error;
  }
};

export default spotifyApi;
