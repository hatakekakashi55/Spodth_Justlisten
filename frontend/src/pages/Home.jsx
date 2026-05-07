// Frontend: Home Page
// src/pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TrackCard from '../components/Track/TrackCard';
import { searchAPI } from '../utils/api';

const Home = () => {
  const [trending, setTrending] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, newReleasesRes] = await Promise.all([
          searchAPI.getTrending(),
          searchAPI.getNewReleases(10),
        ]);

        setTrending(trendingRes.data);
        setNewReleases(newReleasesRes.data);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-sp-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-5xl font-bold mb-2">Welcome back!</h1>
        <p className="text-sp-text-secondary text-lg">Discover your next favorite track</p>
      </motion.div>

      {/* Trending Section */}
      {trending.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Trending Now</h2>
          <div className="grid-auto">
            {trending.slice(0, 8).map((track, idx) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <TrackCard track={track} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* New Releases Section */}
      {newReleases.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">New Releases</h2>
          <div className="grid-auto">
            {newReleases.map((album, idx) => (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group cursor-pointer"
              >
                <div className="relative mb-4 overflow-hidden rounded-lg aspect-square">
                  {album.image && (
                    <img
                      src={album.image}
                      alt={album.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  )}
                </div>
                <h3 className="font-semibold truncate group-hover:text-sp-primary transition">
                  {album.name}
                </h3>
                <p className="text-sm text-sp-text-secondary truncate">
                  {album.artists.join(', ')}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
