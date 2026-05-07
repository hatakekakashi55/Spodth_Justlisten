// Backend: User Model
// src/models/userModel.js

import { query } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

// Create new user
export const createUser = async (email, username, password, firstName, lastName) => {
  const id = uuidv4();
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  const result = await query(
    `INSERT INTO users (id, email, username, password_hash, first_name, last_name)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, email, username, first_name, last_name, created_at`,
    [id, email, username, hashedPassword, firstName, lastName]
  );

  return result.rows[0];
};

// Find user by email
export const findUserByEmail = async (email) => {
  const result = await query(
    'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL',
    [email]
  );
  return result.rows[0];
};

// Find user by ID
export const findUserById = async (userId) => {
  const result = await query(
    'SELECT id, email, username, first_name, last_name, profile_image_url, bio, is_premium, created_at FROM users WHERE id = $1 AND deleted_at IS NULL',
    [userId]
  );
  return result.rows[0];
};

// Find user by Spotify ID
export const findUserBySpotifyId = async (spotifyId) => {
  const result = await query(
    'SELECT * FROM users WHERE spotify_id = $1 AND deleted_at IS NULL',
    [spotifyId]
  );
  return result.rows[0];
};

// Update or create user from Spotify profile
export const upsertSpotifyUser = async (spotifyId, email, username, firstName, lastName, profileImage, accessToken, refreshToken) => {
  const existingUser = await findUserBySpotifyId(spotifyId);

  if (existingUser) {
    // Update existing user
    const result = await query(
      `UPDATE users 
       SET email = $2, username = $3, first_name = $4, last_name = $5, profile_image_url = $6, 
           spotify_access_token = $7, spotify_refresh_token = $8, updated_at = NOW()
       WHERE spotify_id = $1
       RETURNING id, email, username, first_name, last_name, is_premium`,
      [spotifyId, email, username, firstName, lastName, profileImage, accessToken, refreshToken]
    );
    return result.rows[0];
  } else {
    // Create new user
    const id = uuidv4();
    const result = await query(
      `INSERT INTO users (id, spotify_id, email, username, first_name, last_name, profile_image_url, spotify_access_token, spotify_refresh_token)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, email, username, first_name, last_name, is_premium`,
      [id, spotifyId, email, username, firstName, lastName, profileImage, accessToken, refreshToken]
    );
    return result.rows[0];
  }
};

// Verify password
export const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Update user profile
export const updateUserProfile = async (userId, { firstName, lastName, bio, profileImageUrl }) => {
  const result = await query(
    `UPDATE users 
     SET first_name = COALESCE($2, first_name), 
         last_name = COALESCE($3, last_name),
         bio = COALESCE($4, bio),
         profile_image_url = COALESCE($5, profile_image_url),
         updated_at = NOW()
     WHERE id = $1
     RETURNING id, email, username, first_name, last_name, profile_image_url, bio, is_premium`,
    [userId, firstName, lastName, bio, profileImageUrl]
  );
  return result.rows[0];
};

// Update Spotify tokens
export const updateSpotifyTokens = async (userId, accessToken, refreshToken) => {
  const result = await query(
    `UPDATE users 
     SET spotify_access_token = $2, spotify_refresh_token = $3, updated_at = NOW()
     WHERE id = $1
     RETURNING id, email, username`,
    [userId, accessToken, refreshToken]
  );
  return result.rows[0];
};

// Get user following
export const getUserFollowing = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT u.id, u.username, u.profile_image_url FROM user_followers uf
     JOIN users u ON uf.following_id = u.id
     WHERE uf.follower_id = $1 AND u.deleted_at IS NULL
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows;
};

// Get user followers
export const getUserFollowers = async (userId, limit = 20, offset = 0) => {
  const result = await query(
    `SELECT u.id, u.username, u.profile_image_url FROM user_followers uf
     JOIN users u ON uf.follower_id = u.id
     WHERE uf.following_id = $1 AND u.deleted_at IS NULL
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return result.rows;
};

// Follow user
export const followUser = async (followerId, followingId) => {
  const result = await query(
    `INSERT INTO user_followers (follower_id, following_id) VALUES ($1, $2)
     ON CONFLICT DO NOTHING
     RETURNING followed_at`,
    [followerId, followingId]
  );
  return result.rows[0];
};

// Unfollow user
export const unfollowUser = async (followerId, followingId) => {
  const result = await query(
    `DELETE FROM user_followers WHERE follower_id = $1 AND following_id = $2`,
    [followerId, followingId]
  );
  return result.rowCount > 0;
};

export default {
  createUser,
  findUserByEmail,
  findUserById,
  findUserBySpotifyId,
  upsertSpotifyUser,
  verifyPassword,
  updateUserProfile,
  updateSpotifyTokens,
  getUserFollowing,
  getUserFollowers,
  followUser,
  unfollowUser,
};
