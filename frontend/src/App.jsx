// Frontend: Main App Component
// src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Components
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import PlayerBar from './components/Player/PlayerBar';

// Pages (to be created)
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import LikedSongs from './pages/LikedSongs';
import LoginPage from './pages/auth/LoginPage';
import SpotifyCallbackPage from './pages/auth/SpotifyCallbackPage';

// Styles
import './styles/globals.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    setIsAuthChecked(true);
  }, []);

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!isAuthChecked) {
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

    return user ? children : <Navigate to="/auth/login" />;
  };

  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center h-screen bg-sp-dark">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-sp-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen bg-sp-dark text-sp-text">
        {user ? (
          <>
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

              {/* Main Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} user={user} />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto pb-24">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="/library" element={<Library />} />
                      <Route path="/liked-songs" element={<LikedSongs />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </motion.div>
                </main>
              </div>
            </div>

            {/* Player Bar */}
            <PlayerBar />
          </>
        ) : (
          <Routes>
            <Route path="/auth/login" element={<LoginPage setUser={setUser} />} />
            <Route path="/auth/spotify/callback" element={<SpotifyCallbackPage setUser={setUser} />} />
            <Route path="*" element={<Navigate to="/auth/login" />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
