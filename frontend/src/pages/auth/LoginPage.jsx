// Frontend: Login Page
// src/pages/auth/LoginPage.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Mail, Lock, LogIn } from 'lucide-react';
import { authAPI } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSpotifyLogin = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getSpotifyUrl();
      window.location.href = response.data.authUrl;
    } catch (err) {
      setError('Failed to initiate Spotify login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.register(email, username, password, '', '');
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sp-dark via-sp-darker to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-4"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-sp-primary to-sp-accent rounded-full flex items-center justify-center">
              <Music size={32} className="text-sp-dark" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-bold gradient-text mb-2">SPODTH</h1>
          <p className="text-sp-text-secondary">Music Streaming Platform</p>
        </div>

        {/* Form Card */}
        <motion.div
          className="bg-sp-gray/50 backdrop-blur-md border border-sp-gray rounded-2xl p-8"
          whileHover={{ boxShadow: '0 0 30px rgba(30, 215, 96, 0.2)' }}
        >
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-900/20 border border-red-500/50 text-red-400 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Tab Selection */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                !isSignUp
                  ? 'bg-sp-primary text-sp-dark'
                  : 'bg-sp-gray text-sp-text-secondary hover:text-sp-text'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                isSignUp
                  ? 'bg-sp-primary text-sp-dark'
                  : 'bg-sp-gray text-sp-text-secondary hover:text-sp-text'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={isSignUp ? handleSignUp : handleEmailLogin} className="space-y-4 mb-6">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="your_username"
                    className="w-full pl-4 pr-4 py-3 bg-sp-darker rounded-lg border border-sp-gray focus:border-sp-primary focus:outline-none text-sp-text placeholder-sp-text-secondary"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-sp-text-secondary" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-sp-darker rounded-lg border border-sp-gray focus:border-sp-primary focus:outline-none text-sp-text placeholder-sp-text-secondary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-sp-text-secondary" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-sp-darker rounded-lg border border-sp-gray focus:border-sp-primary focus:outline-none text-sp-text placeholder-sp-text-secondary"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-sp-primary hover:bg-sp-accent text-sp-dark font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Login'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-sp-gray" />
            <span className="text-sp-text-secondary text-sm">OR</span>
            <div className="flex-1 h-px bg-sp-gray" />
          </div>

          {/* Spotify Login */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSpotifyLogin}
            disabled={loading}
            className="w-full py-3 bg-[#1DB954] hover:bg-[#1ed760] text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Music size={20} />
            {loading ? 'Loading...' : 'Login with Spotify'}
          </motion.button>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-sp-text-secondary text-sm mt-6">
          By continuing, you agree to SPODTH's Terms of Service
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
