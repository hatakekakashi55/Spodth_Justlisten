// Backend: JWT Authentication Middleware
// src/middleware/auth.js

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Verify JWT token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Generate JWT token
export const generateToken = (userId, email, username) => {
  return jwt.sign(
    { userId, email, username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );
};

// Verify refresh token and issue new access token
export const refreshToken = (req, res) => {
  const token = req.body.refreshToken;

  if (!token) {
    return res.status(400).json({ error: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const newToken = generateToken(decoded.userId, decoded.email, decoded.username);
    res.json({ accessToken: newToken });
  } catch (error) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
};

export default {
  verifyToken,
  generateToken,
  refreshToken,
};
