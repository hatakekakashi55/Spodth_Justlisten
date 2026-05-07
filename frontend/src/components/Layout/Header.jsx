// Frontend: Header/Navbar Component
// src/components/Layout/Header.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, User, Bell } from 'lucide-react';

const Header = ({ onMenuClick, user }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-sp-darker/90 backdrop-blur-md border-b border-sp-gray">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg hover:bg-sp-gray transition"
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>

        {/* Center: Search (can be implemented) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <input
            type="text"
            placeholder="Search tracks, artists..."
            className="w-full px-4 py-2 rounded-full bg-sp-gray text-sp-text placeholder-sp-text-secondary focus:outline-none focus:bg-sp-gray focus:ring-2 focus:ring-sp-primary"
          />
        </div>

        {/* Right: User & Notifications */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-sp-gray transition">
            <Bell size={20} />
          </button>

          {user && (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-sp-gray transition"
              >
                {user.profile_image_url ? (
                  <img
                    src={user.profile_image_url}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-sp-primary flex items-center justify-center">
                    <User size={16} className="text-sp-dark" />
                  </div>
                )}
                <span className="hidden sm:inline text-sm font-medium">{user.username}</span>
              </motion.button>

              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-sp-gray rounded-lg shadow-lg overflow-hidden"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-sp-primary hover:text-sp-dark transition"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm hover:bg-sp-primary hover:text-sp-dark transition"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('accessToken');
                      localStorage.removeItem('user');
                      window.location.href = '/auth/login';
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
