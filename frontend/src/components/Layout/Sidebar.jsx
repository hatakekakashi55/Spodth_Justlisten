// Frontend: Sidebar Navigation Component
// src/components/Layout/Sidebar.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Search,
  Library,
  Plus,
  Heart,
  LogOut,
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Library', path: '/library' },
  ];

  const secondaryItems = [
    { icon: Plus, label: 'Create Playlist', path: '/create-playlist' },
    { icon: Heart, label: 'Liked Songs', path: '/liked-songs' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        animate={{ x: isOpen ? 0 : -100 }}
        className="sidebar fixed left-0 top-0 bottom-20 w-64 bg-sp-darker border-r border-sp-gray overflow-y-auto z-40 md:static md:z-10"
      >
        {/* Logo */}
        <div className="p-6 border-b border-sp-gray">
          <h1 className="text-2xl font-bold gradient-text">SPODTH</h1>
          <p className="text-xs text-sp-text-secondary mt-1">Music Streaming</p>
        </div>

        {/* Main Menu */}
        <nav className="p-6 space-y-4">
          <h2 className="text-xs font-semibold text-sp-text-secondary uppercase tracking-wider">Menu</h2>
          <ul className="space-y-2">
            {menuItems.map(item => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => onClose?.()}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-sp-primary text-sp-dark font-semibold'
                      : 'text-sp-text-secondary hover:text-sp-text hover:bg-sp-gray'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Divider */}
        <div className="my-4 border-t border-sp-gray" />

        {/* Secondary Menu */}
        <nav className="px-6 space-y-4">
          <h2 className="text-xs font-semibold text-sp-text-secondary uppercase tracking-wider">Library</h2>
          <ul className="space-y-2">
            {secondaryItems.map(item => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => onClose?.()}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-sp-primary text-sp-dark font-semibold'
                      : 'text-sp-text-secondary hover:text-sp-text hover:bg-sp-gray'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-sp-gray bg-sp-darker">
          <button
            onClick={() => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('user');
              window.location.href = '/auth/login';
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-sp-gray text-sp-text-secondary hover:text-sp-text hover:bg-red-900/20 transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
