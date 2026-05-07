// Frontend: Global Player Bar Component
// src/components/Player/PlayerBar.jsx

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Repeat2,
  Shuffle,
} from 'lucide-react';
import usePlayerStore from '../../stores/usePlayerStore';
import { getDominantColor } from '../../utils/imageUtils';
import './PlayerBar.css';

const PlayerBar = () => {
  const {
    currentTrack,
    isPlaying,
    duration,
    currentTime,
    volume,
    repeat,
    shuffle,
    play,
    pause,
    seek,
    setVolume,
    next,
    previous,
    toggleShuffle,
    cycleRepeat,
  } = usePlayerStore();

  const [accentColor, setAccentColor] = useState('#1ed760');
  const [showVolume, setShowVolume] = useState(false);

  // Get dominant color from album art
  useEffect(() => {
    if (currentTrack?.artwork_url) {
      getDominantColor(currentTrack.artwork_url).then(colors => {
        setAccentColor(colors.hex);
      });
    }
  }, [currentTrack]);

  if (!currentTrack) return null;

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;
    return `${minutes}:${displaySeconds < 10 ? '0' : ''}${displaySeconds}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="player-bar fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: `linear-gradient(180deg, rgba(18,18,18,0) 0%, rgba(18,18,18,0.95) 50%, rgba(18,18,18,1) 100%)`,
      }}
    >
      {/* Progress Bar */}
      <div className="progress-container w-full h-1 bg-sp-darker hover:h-2 transition-all">
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={(e) => seek(parseInt(e.target.value))}
          className="progress-slider w-full h-full cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${progress}%, rgba(255,255,255,0.1) ${progress}%, rgba(255,255,255,0.1) 100%)`,
          }}
        />
      </div>

      <div className="player-content px-4 py-3 flex items-center justify-between gap-4">
        {/* Left: Track Info */}
        <div className="track-info flex items-center gap-3 min-w-0 w-1/4">
          {currentTrack.artwork_url && (
            <img
              src={currentTrack.artwork_url}
              alt={currentTrack.title}
              className="w-14 h-14 rounded object-cover shadow-md"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{currentTrack.title}</p>
            <p className="text-xs text-sp-text-secondary truncate">
              {currentTrack.artists?.map(a => a.name).join(', ') || 'Unknown Artist'}
            </p>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="controls flex items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleShuffle}
            className={`p-2 rounded-full transition ${
              shuffle ? 'text-sp-primary' : 'text-sp-text-secondary hover:text-sp-text'
            }`}
            aria-label="Shuffle"
          >
            <Shuffle size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={previous}
            className="p-2 rounded-full text-sp-text-secondary hover:text-sp-text transition"
            aria-label="Previous"
          >
            <SkipBack size={20} fill="currentColor" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={isPlaying ? pause : play}
            className="p-4 rounded-full bg-sp-primary text-sp-dark hover:bg-sp-accent shadow-lg transition"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={next}
            className="p-2 rounded-full text-sp-text-secondary hover:text-sp-text transition"
            aria-label="Next"
          >
            <SkipForward size={20} fill="currentColor" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={cycleRepeat}
            className={`p-2 rounded-full transition ${
              repeat !== 'off' ? 'text-sp-primary' : 'text-sp-text-secondary hover:text-sp-text'
            }`}
            aria-label="Repeat"
          >
            <Repeat2 size={18} />
            {repeat === 'one' && (
              <span className="absolute text-xs font-bold">1</span>
            )}
          </motion.button>
        </div>

        {/* Right: Time & Volume */}
        <div className="time-volume flex items-center justify-end gap-4 w-1/4">
          <span className="text-xs text-sp-text-secondary font-mono">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="volume-control relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowVolume(!showVolume)}
              className="p-2 rounded-full text-sp-text-secondary hover:text-sp-text transition"
              aria-label="Volume"
            >
              <Volume2 size={20} />
            </motion.button>

            <motion.div
              animate={{ opacity: showVolume ? 1 : 0, y: showVolume ? 0 : 10 }}
              className="absolute bottom-12 right-0 bg-sp-gray rounded-lg p-2 pointer-events-none"
              style={{ pointerEvents: showVolume ? 'auto' : 'none' }}
            >
              <input
                type="range"
                min="0"
                max="100"
                value={volume * 100}
                onChange={(e) => setVolume(parseInt(e.target.value) / 100)}
                className="h-24 w-1 vertical-slider"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerBar;
