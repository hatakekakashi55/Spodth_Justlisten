// Frontend: Search Page
// src/pages/Search.jsx

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';
import TrackCard from '../components/Track/TrackCard';
import { searchAPI, trackAPI } from '../utils/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('track');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await searchAPI.search(query, searchType);
      setResults(response.data.results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Search Bar */}
      <motion.form
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSearch}
        className="mb-8"
      >
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-sp-text-secondary" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tracks, artists, albums..."
            className="w-full pl-12 pr-4 py-4 rounded-full bg-sp-gray text-sp-text placeholder-sp-text-secondary focus:outline-none focus:ring-2 focus:ring-sp-primary text-lg"
          />
        </div>

        {/* Search Type Selector */}
        <div className="flex gap-2 mt-4">
          {['track', 'artist'].map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setSearchType(type)}
              className={`px-4 py-2 rounded-full transition ${
                searchType === type
                  ? 'bg-sp-primary text-sp-dark'
                  : 'bg-sp-gray text-sp-text-secondary hover:text-sp-text'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </motion.form>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-sp-primary border-t-transparent rounded-full"
          />
        </div>
      ) : results.length > 0 ? (
        <div>
          <p className="text-sp-text-secondary mb-6">
            Found {results.length} {searchType}s matching "{query}"
          </p>
          <div className="grid-auto">
            {results.map((result, idx) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                {searchType === 'track' ? (
                  <TrackCard track={result} />
                ) : (
                  <div className="text-center p-4 rounded-lg hover:bg-sp-gray transition cursor-pointer">
                    {result.image && (
                      <img
                        src={result.image}
                        alt={result.name}
                        className="w-full aspect-square rounded-lg object-cover mb-3"
                      />
                    )}
                    <h3 className="font-semibold truncate">{result.name}</h3>
                    <p className="text-sm text-sp-text-secondary mt-1">
                      {result.followers ? `${result.followers.toLocaleString()} followers` : ''}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      ) : query ? (
        <div className="text-center py-12">
          <p className="text-sp-text-secondary text-lg">No results found for "{query}"</p>
          <p className="text-sp-text-secondary mt-2">Try searching for something else</p>
        </div>
      ) : null}
    </div>
  );
};

export default Search;
