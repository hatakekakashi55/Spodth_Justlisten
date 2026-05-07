// Frontend: Library Page
// src/pages/Library.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Music } from 'lucide-react';
import { playlistAPI } from '../utils/api';
import { Link } from 'react-router-dom';

const Library = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await playlistAPI.getPlaylists();
        setPlaylists(response.data);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async () => {
    const title = prompt('Enter playlist name:');
    if (!title) return;

    try {
      const response = await playlistAPI.createPlaylist(title, '', false);
      setPlaylists([...playlists, response.data]);
    } catch (error) {
      console.error('Error creating playlist:', error);
      alert('Failed to create playlist');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <h1 className="text-4xl font-bold">Your Library</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreatePlaylist}
          className="flex items-center gap-2 px-4 py-2 bg-sp-primary text-sp-dark rounded-full hover:bg-sp-accent transition font-semibold"
        >
          <Plus size={20} />
          Create Playlist
        </motion.button>
      </motion.div>

      {/* Playlists Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-sp-primary border-t-transparent rounded-full"
          />
        </div>
      ) : playlists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map((playlist, idx) => (
            <motion.div
              key={playlist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group"
            >
              <Link to={`/playlist/${playlist.id}`} className="block cursor-pointer">
                <div className="relative mb-4 overflow-hidden rounded-lg aspect-square bg-sp-gray flex items-center justify-center group-hover:bg-sp-primary/20 transition">
                  {playlist.image_url ? (
                    <img
                      src={playlist.image_url}
                      alt={playlist.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Music size={48} className="text-sp-primary opacity-50" />
                  )}
                </div>
                <h3 className="font-semibold truncate group-hover:text-sp-primary transition">
                  {playlist.title}
                </h3>
                <p className="text-sm text-sp-text-secondary">
                  {playlist.total_tracks} tracks
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Music size={64} className="mx-auto mb-4 text-sp-text-secondary opacity-50" />
          <p className="text-lg text-sp-text-secondary">No playlists yet</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreatePlaylist}
            className="mt-4 px-6 py-2 bg-sp-primary text-sp-dark rounded-full hover:bg-sp-accent transition font-semibold"
          >
            Create your first playlist
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default Library;
