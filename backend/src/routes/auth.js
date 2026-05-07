// Backend: Authentication Routes
// src/routes/auth.js

import express from 'express';
import * as userModel from '../models/userModel.js';
import * as spotifyService from '../utils/spotifyService.js';
import { generateToken } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Get Spotify authorization URL
router.get('/spotify-url', (req, res) => {
  try {
    const authUrl = spotifyService.getAuthorizationUrl();
    res.json({ authUrl });
  } catch (error) {
    console.error('Error getting Spotify auth URL:', error);
    res.status(500).json({ error: 'Failed to get authorization URL' });
  }
});

// Spotify OAuth callback
router.post('/spotify-callback', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code required' });
  }

  try {
    // Exchange code for tokens
    const tokens = await spotifyService.getAccessToken(code);
    spotifyService.setAccessToken(tokens.access_token);

    // Get Spotify user profile
    const spotifyProfile = await spotifyService.getCurrentUserProfile();

    // Upsert user in database
    const user = await userModel.upsertSpotifyUser(
      spotifyProfile.id,
      spotifyProfile.email,
      spotifyProfile.display_name || `user_${spotifyProfile.id.slice(0, 6)}`,
      spotifyProfile.display_name?.split(' ')[0] || 'User',
      spotifyProfile.display_name?.split(' ')[1] || '',
      spotifyProfile.images?.[0]?.url,
      tokens.access_token,
      tokens.refresh_token
    );

    // Generate JWT token
    const jwtToken = generateToken(user.id, user.email, user.username);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
        isPremium: user.is_premium,
      },
      accessToken: jwtToken,
      spotifyTokens: {
        accessToken: tokens.access_token,
        expiresIn: tokens.expires_in,
      },
    });
  } catch (error) {
    console.error('Error in Spotify callback:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Email/Password registration
router.post('/register', async (req, res) => {
  const { email, username, password, firstName, lastName } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Email, username, and password required' });
  }

  try {
    // Check if user already exists
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = await userModel.createUser(email, username, password, firstName, lastName);

    // Generate JWT token
    const token = generateToken(user.id, user.email, user.username);

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
      accessToken: token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Email/Password login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const user = await userModel.findUserByEmail(email);

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValid = await userModel.verifyPassword(password, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email, user.username);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      accessToken: token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Refresh token
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const newToken = generateToken(decoded.userId, decoded.email, decoded.username);
    res.json({ accessToken: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

export default router;
