// Frontend: Spotify OAuth Callback Page
// src/pages/auth/SpotifyCallbackPage.jsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music, AlertCircle, CheckCircle } from 'lucide-react';
import { authAPI } from '../../utils/api';

const SpotifyCallbackPage = ({ setUser }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('Logging you in...');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        setStatus('error');
        setMessage(`Authentication failed: ${error}`);
        setTimeout(() => navigate('/auth/login'), 3000);
        return;
      }

      if (!code) {
        setStatus('error');
        setMessage('No authorization code received');
        setTimeout(() => navigate('/auth/login'), 3000);
        return;
      }

      try {
        setMessage('Authenticating with Spotify...');
        const response = await authAPI.spotifyCallback(code);

        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('spotifyAccessToken', response.data.spotifyTokens.accessToken);

        setUser(response.data.user);
        setStatus('success');
        setMessage('Successfully logged in! Redirecting...');

        setTimeout(() => navigate('/'), 1500);
      } catch (error) {
        console.error('Spotify callback error:', error);
        setStatus('error');
        setMessage(error.response?.data?.error || 'Authentication failed. Please try again.');
        setTimeout(() => navigate('/auth/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sp-dark via-sp-darker to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: status === 'loading' ? 360 : 0 }}
          transition={{
            duration: 2,
            repeat: status === 'loading' ? Infinity : 0,
            ease: 'linear',
          }}
          className="w-24 h-24 mx-auto mb-6"
        >
          {status === 'loading' && (
            <div className="w-24 h-24 border-4 border-sp-primary border-t-transparent rounded-full mx-auto" />
          )}
          {status === 'success' && (
            <CheckCircle size={96} className="text-sp-primary mx-auto" />
          )}
          {status === 'error' && (
            <AlertCircle size={96} className="text-red-500 mx-auto" />
          )}
        </motion.div>

        <h1 className="text-3xl font-bold mb-4">
          {status === 'loading' && 'Logging you in...'}
          {status === 'success' && 'Welcome to SPODTH!'}
          {status === 'error' && 'Authentication Error'}
        </h1>

        <p className="text-sp-text-secondary text-lg mb-2">{message}</p>

        {status === 'error' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/auth/login')}
            className="mt-6 px-6 py-3 bg-sp-primary text-sp-dark rounded-full hover:bg-sp-accent transition font-semibold"
          >
            Back to Login
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default SpotifyCallbackPage;
