// Frontend: Track Card Component
// src/components/Track/TrackCard.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Play, MoreVertical } from 'lucide-react';
import usePlayerStore from '../../stores/usePlayerStore';

const TrackCard = ({ track, isLiked = false, onLike, onPlay, onMenu }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { playTrack } = usePlayerStore();

  const handlePlay = (e) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay(track);
    } else {
      playTrack(track);
    }
  };

  const duration = track.duration_ms
    ? `${Math.floor(track.duration_ms / 60000)}:${((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, '0')}`
    : '--:--';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="track-card group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Artwork */}
      <div className="relative mb-4 overflow-hidden rounded-lg aspect-square">
        {track.artwork_url && (
          <img
            src={track.artwork_url}
            alt={track.title}
            className="w-full h-full object-cover"
          />
        )}
        {!track.artwork_url && (
          <div className="w-full h-full bg-sp-gray flex items-center justify-center">
            <span className="text-sp-text-secondary">No Image</span>
          </div>
        )}

        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePlay}
            className="p-3 rounded-full bg-sp-primary text-sp-dark hover:bg-sp-accent shadow-lg transition"
            aria-label="Play"
          >
            <Play size={24} fill="currentColor" />
          </motion.button>

          {onLike && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onLike(track);
              }}
              className={`p-3 rounded-full transition ${
                isLiked
                  ? 'bg-sp-primary text-sp-dark'
                  : 'bg-sp-gray text-sp-text hover:bg-sp-primary hover:text-sp-dark'
              }`}
              aria-label="Like"
            >
              <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            </motion.button>
          )}

          {onMenu && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onMenu(track);
              }}
              className="p-3 rounded-full bg-sp-gray text-sp-text hover:bg-sp-primary hover:text-sp-dark transition"
              aria-label="More"
            >
              <MoreVertical size={20} />
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Track Info */}
      <div className="min-w-0">
        <h3 className="font-semibold text-sp-text truncate group-hover:text-sp-primary transition">
          {track.title}
        </h3>
        <p className="text-sm text-sp-text-secondary truncate">
          {track.artists?.map(a => a.name).join(', ') || 'Unknown Artist'}
        </p>
        <p className="text-xs text-sp-text-secondary mt-1">{duration}</p>
      </div>
    </motion.div>
  );
};

export default TrackCard;
