// Backend: User Routes
// src/routes/user.js

import express from 'express';
import * as userModel from '../models/userModel.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get current user profile
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await userModel.findUserById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get user by ID
router.get('/:userId', async (req, res) => {
  try {
    const user = await userModel.findUserById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user profile
router.put('/me/profile', verifyToken, async (req, res) => {
  const { firstName, lastName, bio, profileImageUrl } = req.body;

  try {
    const user = await userModel.updateUserProfile(req.user.userId, {
      firstName,
      lastName,
      bio,
      profileImageUrl,
    });

    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get user's following
router.get('/:userId/following', async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;

  try {
    const following = await userModel.getUserFollowing(req.params.userId, parseInt(limit), parseInt(offset));
    res.json(following);
  } catch (error) {
    console.error('Error fetching following:', error);
    res.status(500).json({ error: 'Failed to fetch following' });
  }
});

// Get user's followers
router.get('/:userId/followers', async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;

  try {
    const followers = await userModel.getUserFollowers(req.params.userId, parseInt(limit), parseInt(offset));
    res.json(followers);
  } catch (error) {
    console.error('Error fetching followers:', error);
    res.status(500).json({ error: 'Failed to fetch followers' });
  }
});

// Follow user
router.post('/:userId/follow', verifyToken, async (req, res) => {
  try {
    if (req.user.userId === req.params.userId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    await userModel.followUser(req.user.userId, req.params.userId);
    res.json({ success: true, message: 'User followed' });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ error: 'Failed to follow user' });
  }
});

// Unfollow user
router.delete('/:userId/follow', verifyToken, async (req, res) => {
  try {
    const success = await userModel.unfollowUser(req.user.userId, req.params.userId);
    if (!success) {
      return res.status(400).json({ error: 'Not following this user' });
    }
    res.json({ success: true, message: 'User unfollowed' });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ error: 'Failed to unfollow user' });
  }
});

export default router;
