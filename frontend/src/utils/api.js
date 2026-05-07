// Frontend: API Service
// src/utils/api.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000;

// Create axios instance
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  getSpotifyUrl: () => apiClient.get('/auth/spotify-url'),
  spotifyCallback: (code) => apiClient.post('/auth/spotify-callback', { code }),
  register: (email, username, password, firstName, lastName) =>
    apiClient.post('/auth/register', { email, username, password, firstName, lastName }),
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  refreshToken: (refreshToken) => apiClient.post('/auth/refresh', { refreshToken }),
};

// User API
export const userAPI = {
  getMe: () => apiClient.get('/users/me'),
  getUser: (userId) => apiClient.get(`/users/${userId}`),
  updateProfile: (data) => apiClient.put('/users/me/profile', data),
  getFollowing: (userId, limit = 20, offset = 0) =>
    apiClient.get(`/users/${userId}/following`, { params: { limit, offset } }),
  getFollowers: (userId, limit = 20, offset = 0) =>
    apiClient.get(`/users/${userId}/followers`, { params: { limit, offset } }),
  followUser: (userId) => apiClient.post(`/users/${userId}/follow`),
  unfollowUser: (userId) => apiClient.delete(`/users/${userId}/follow`),
};

// Track API
export const trackAPI = {
  search: (query, limit = 20, offset = 0) =>
    apiClient.get('/tracks/search', { params: { q: query, limit, offset } }),
  getTrack: (trackId) => apiClient.get(`/tracks/${trackId}`),
  likeTrack: (trackId) => apiClient.post(`/tracks/${trackId}/like`),
  unlikeTrack: (trackId) => apiClient.delete(`/tracks/${trackId}/like`),
  getLikedSongs: (limit = 20, offset = 0) =>
    apiClient.get('/tracks/me/liked', { params: { limit, offset } }),
  playTrack: (trackId, deviceId) =>
    apiClient.post(`/tracks/${trackId}/play`, { deviceId }),
  getAudioFeatures: (trackId) => apiClient.get(`/tracks/${trackId}/features`),
};

// Playlist API
export const playlistAPI = {
  createPlaylist: (title, description, isPublic) =>
    apiClient.post('/playlists', { title, description, isPublic }),
  getPlaylists: (limit = 20, offset = 0) =>
    apiClient.get('/playlists', { params: { limit, offset } }),
  getPlaylist: (playlistId) => apiClient.get(`/playlists/${playlistId}`),
  getPlaylistTracks: (playlistId, limit = 20, offset = 0) =>
    apiClient.get(`/playlists/${playlistId}/tracks`, { params: { limit, offset } }),
  addTrackToPlaylist: (playlistId, trackId, position) =>
    apiClient.post(`/playlists/${playlistId}/tracks`, { trackId, position }),
  removeTrackFromPlaylist: (playlistId, trackId) =>
    apiClient.delete(`/playlists/${playlistId}/tracks/${trackId}`),
  updatePlaylist: (playlistId, data) =>
    apiClient.put(`/playlists/${playlistId}`, data),
  deletePlaylist: (playlistId) => apiClient.delete(`/playlists/${playlistId}`),
  addCollaborator: (playlistId, collaboratorId) =>
    apiClient.post(`/playlists/${playlistId}/collaborators`, { collaboratorId }),
  getCollaborators: (playlistId) =>
    apiClient.get(`/playlists/${playlistId}/collaborators`),
};

// Search API
export const searchAPI = {
  search: (query, type = 'track', limit = 20, offset = 0) =>
    apiClient.get('/search', { params: { q: query, type, limit, offset } }),
  getTrending: () => apiClient.get('/search/trending/tracks'),
  getNewReleases: (limit = 20, offset = 0) =>
    apiClient.get('/search/new-releases', { params: { limit, offset } }),
  getRecommendations: (seedTracks, limit = 20) =>
    apiClient.post('/search/recommendations', { seedTracks, limit }),
};

// Stream API
export const streamAPI = {
  getStreamUrl: (trackId, previewUrl) =>
    apiClient.post('/stream/url', { trackId, previewUrl }),
  getPreviewStream: (trackId, previewUrl) =>
    `${API_BASE_URL}/api/stream/preview/${trackId}?previewUrl=${encodeURIComponent(previewUrl)}`,
};

export default apiClient;
