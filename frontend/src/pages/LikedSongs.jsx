// Frontend: Liked Songs Page
// src/pages/LikedSongs.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import TrackCard from '../components/Track/TrackCard';
import { trackAPI } from '../utils/api';

const LikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const response = await trackAPI.getLikedSongs(50);
        setLikedSongs(response.data);
      } catch (error) {
        console.error('Error fetching liked songs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedSongs();
  }, []);

  const handleUnlike = async (track) => {
    try {
      await trackAPI.unlikeTrack(track.id);
      setLikedSongs(likedSongs.filter(t => t.id !== track.id));
    } catch (error) {
      console.error('Error unliking track:', error);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-24 h-24 bg-gradient-to-br from-sp-primary to-sp-accent rounded-lg flex items-center justify-center">
            <Heart size={48} fill="currentColor" className="text-sp-dark" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Liked Songs</h1>
            <p className="text-sp-text-secondary mt-2">{likedSongs.length} songs</p>
          </div>
        </div>
      </motion.div>

      {/* Liked Songs Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-sp-primary border-t-transparent rounded-full"
          />
        </div>
      ) : likedSongs.length > 0 ? (
        <div className="grid-auto">
          {likedSongs.map((track, idx) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
            >
              <TrackCard
                track={track}
                isLiked={true}
                onLike={() => handleUnlike(track)}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart size={64} className="mx-auto mb-4 text-sp-text-secondary opacity-50" />
          <p className="text-lg text-sp-text-secondary">No liked songs yet</p>
          <p className="text-sp-text-secondary mt-2">Songs you like will appear here</p>
        </div>
      )}
    </div>
  );
};

export default LikedSongs;
