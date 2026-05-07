// Backend: Audio Streaming Routes
// src/routes/stream.js

import express from 'express';
import axios from 'axios';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * Stream track from preview URL
 * Supports Range headers for seeking
 * CORS-enabled for browser playback
 */
router.get('/preview/:trackId', async (req, res) => {
  const { previewUrl } = req.query;

  if (!previewUrl) {
    return res.status(400).json({ error: 'Preview URL required' });
  }

  try {
    // Validate URL is from Spotify
    if (!previewUrl.includes('spotify')) {
      return res.status(400).json({ error: 'Invalid preview URL' });
    }

    // Get file size from Spotify
    const headResponse = await axios.head(previewUrl);
    const contentLength = headResponse.headers['content-length'];

    // Handle Range requests for seeking
    const range = req.headers.range;
    let start = 0;
    let end = contentLength - 1;

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      start = parseInt(parts[0], 10);
      end = parts[1] ? parseInt(parts[1], 10) : contentLength - 1;

      if (start > end || start < 0 || end >= contentLength) {
        res.status(416).set('Content-Range', `bytes */${contentLength}`).send();
        return;
      }

      res.status(206);
      res.set('Content-Range', `bytes ${start}-${end}/${contentLength}`);
    }

    res.set({
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Content-Type': 'audio/mpeg',
      'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
      'Cache-Control': 'public, max-age=3600',
    });

    // Stream the audio
    const audioResponse = await axios.get(previewUrl, {
      responseType: 'stream',
      headers: {
        Range: `bytes=${start}-${end}`,
      },
    });

    audioResponse.data.pipe(res);

    audioResponse.data.on('error', (err) => {
      console.error('Error streaming audio:', err);
      res.status(500).json({ error: 'Stream error' });
    });
  } catch (error) {
    console.error('Error streaming preview:', error.message);
    res.status(500).json({ error: 'Failed to stream preview' });
  }
});

/**
 * Stream full track (requires user authentication and premium access)
 * This would integrate with Cloudflare R2 or other storage
 */
router.get('/full/:trackId', verifyToken, async (req, res) => {
  try {
    // Check if user is premium
    // TODO: Implement premium check and R2 streaming logic

    res.status(403).json({
      error: 'Full track streaming requires premium subscription',
      message: 'Use preview endpoint for 30-second previews',
    });
  } catch (error) {
    console.error('Error streaming full track:', error);
    res.status(500).json({ error: 'Stream error' });
  }
});

/**
 * Get stream URL for a track preview
 * Returns CORS-compatible URL
 */
router.post('/url', async (req, res) => {
  const { previewUrl, trackId } = req.body;

  if (!previewUrl) {
    return res.status(400).json({ error: 'Preview URL required' });
  }

  try {
    // Create proxy URL that bypasses CORS
    const proxyUrl = `${process.env.API_URL || 'http://localhost:5000'}/api/stream/preview/${trackId}?previewUrl=${encodeURIComponent(previewUrl)}`;

    res.json({
      url: proxyUrl,
      type: 'preview',
      corsEnabled: true,
    });
  } catch (error) {
    console.error('Error generating stream URL:', error);
    res.status(500).json({ error: 'Failed to generate stream URL' });
  }
});

/**
 * HLS Stream (for adaptive bitrate streaming in future)
 * Currently placeholder for future implementation
 */
router.get('/hls/:trackId/playlist.m3u8', async (req, res) => {
  res.status(501).json({
    error: 'HLS streaming not yet implemented',
    message: 'Use preview endpoint for current version',
  });
});

export default router;
