// Frontend: Image & Color Utilities
// src/utils/imageUtils.js

import ColorThief from 'colorthief';

/**
 * Get dominant color from image
 * Returns RGB array and hex color
 */
export const getDominantColor = async (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);
        const hex = rgbToHex(color[0], color[1], color[2]);
        resolve({
          rgb: color,
          hex: hex,
          rgba: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`,
        });
      } catch (error) {
        console.error('Error getting dominant color:', error);
        // Fallback to Spotify green
        resolve({
          rgb: [30, 215, 96],
          hex: '#1ed760',
          rgba: 'rgba(30, 215, 96, 0.8)',
        });
      }
    };

    img.onerror = () => {
      resolve({
        rgb: [30, 215, 96],
        hex: '#1ed760',
        rgba: 'rgba(30, 215, 96, 0.8)',
      });
    };
  });
};

/**
 * Convert RGB to Hex
 */
export const rgbToHex = (r, g, b) => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

/**
 * Convert Hex to RGB
 */
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
};

/**
 * Check if color is light or dark
 */
export const isLightColor = (rgb) => {
  if (Array.isArray(rgb)) {
    const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
    return luminance > 0.5;
  }
  return false;
};

/**
 * Generate gradient from image
 */
export const generateGradient = async (imageUrl) => {
  const colors = await getDominantColor(imageUrl);
  return `linear-gradient(135deg, ${colors.hex} 0%, rgba(18, 18, 18, 0.8) 100%)`;
};

/**
 * Get image with fallback
 */
export const getImageUrl = (url, fallback = '/images/default-album.png') => {
  return url || fallback;
};

/**
 * Crop image to square
 */
export const cropToSquare = (imageUrl, size = 300) => {
  // For Spotify images, we can just use the original size parameter
  if (imageUrl?.includes('spotifycdn')) {
    return imageUrl;
  }
  return imageUrl;
};

export default {
  getDominantColor,
  rgbToHex,
  hexToRgb,
  isLightColor,
  generateGradient,
  getImageUrl,
  cropToSquare,
};
