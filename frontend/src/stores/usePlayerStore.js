// Frontend: Zustand Player Store
// src/stores/usePlayerStore.js

import { create } from 'zustand';
import { Howl } from 'howler';

const usePlayerStore = create((set, get) => ({
  // Track State
  currentTrack: null,
  queue: [],
  queueIndex: 0,
  
  // Playback State
  isPlaying: false,
  isPaused: false,
  duration: 0,
  currentTime: 0,
  volume: 0.7,
  shuffle: false,
  repeat: 'off', // 'off', 'all', 'one'
  
  // Audio Instance
  howlInstance: null,
  
  // UI State
  isPlayerOpen: false,
  showQueue: false,
  showLyrics: false,
  
  // Initialize Howler
  initHowler: () => {
    const howl = new Howl({
      onplay: () => set({ isPlaying: true, isPaused: false }),
      onpause: () => set({ isPaused: true, isPlaying: false }),
      onstop: () => set({ isPlaying: false, isPaused: false }),
      onend: () => get().next(),
      onload: () => {
        set({ duration: howl.duration() * 1000 }); // Convert to ms
      },
    });
    set({ howlInstance: howl });
  },

  // Load and play track
  loadTrack: (track, streamUrl) => {
    const howl = get().howlInstance;
    if (!howl) get().initHowler();

    set({ currentTrack: track, currentTime: 0 });
    
    const newHowl = new Howl({
      src: [streamUrl],
      html5: true,
      volume: get().volume,
      onplay: () => set({ isPlaying: true, isPaused: false }),
      onpause: () => set({ isPaused: true, isPlaying: false }),
      onstop: () => set({ isPlaying: false, isPaused: false }),
      onend: () => get().next(),
      onload: function() {
        set({ duration: this.duration() * 1000 });
      },
      onseek: function() {
        set({ currentTime: this.seek() * 1000 });
      },
    });

    set({ howlInstance: newHowl });
  },

  // Play/Pause controls
  play: () => {
    const howl = get().howlInstance;
    if (howl) {
      howl.play();
      set({ isPlaying: true, isPaused: false });
    }
  },

  pause: () => {
    const howl = get().howlInstance;
    if (howl) {
      howl.pause();
      set({ isPaused: true, isPlaying: false });
    }
  },

  togglePlayPause: () => {
    const { isPlaying, play, pause } = get();
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  },

  // Seek to position (time in ms)
  seek: (time) => {
    const howl = get().howlInstance;
    if (howl) {
      howl.seek(time / 1000);
      set({ currentTime: time });
    }
  },

  // Update current time during playback
  updateCurrentTime: () => {
    const howl = get().howlInstance;
    if (howl && get().isPlaying) {
      set({ currentTime: howl.seek() * 1000 });
    }
  },

  // Volume control
  setVolume: (volume) => {
    const howl = get().howlInstance;
    const vol = Math.max(0, Math.min(1, volume));
    if (howl) {
      howl.volume(vol);
    }
    set({ volume: vol });
  },

  // Queue management
  setQueue: (tracks) => {
    set({ queue: tracks, queueIndex: 0 });
  },

  addToQueue: (track) => {
    set(state => ({ queue: [...state.queue, track] }));
  },

  removeFromQueue: (index) => {
    set(state => ({
      queue: state.queue.filter((_, i) => i !== index),
    }));
  },

  clearQueue: () => {
    set({ queue: [], queueIndex: 0 });
  },

  // Navigation
  next: () => {
    const { queue, queueIndex, repeat, shuffle } = get();
    let nextIndex = queueIndex + 1;

    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (nextIndex >= queue.length) {
      if (repeat === 'all') {
        nextIndex = 0;
      } else {
        nextIndex = queueIndex;
      }
    }

    if (queue[nextIndex]) {
      set({ queueIndex: nextIndex });
      // Trigger play of next track
      const nextTrack = queue[nextIndex];
      get().playTrack(nextTrack);
    }
  },

  previous: () => {
    const { queue, queueIndex, currentTime } = get();
    
    // If more than 3 seconds in, restart current track
    if (currentTime > 3000) {
      get().seek(0);
      return;
    }

    const prevIndex = Math.max(0, queueIndex - 1);
    if (queue[prevIndex]) {
      set({ queueIndex: prevIndex });
      const prevTrack = queue[prevIndex];
      get().playTrack(prevTrack);
    }
  },

  // Toggle shuffle
  toggleShuffle: () => {
    set(state => ({ shuffle: !state.shuffle }));
  },

  // Cycle repeat mode
  cycleRepeat: () => {
    set(state => {
      const modes = ['off', 'all', 'one'];
      const currentIndex = modes.indexOf(state.repeat);
      const nextIndex = (currentIndex + 1) % modes.length;
      return { repeat: modes[nextIndex] };
    });
  },

  // Play specific track
  playTrack: async (track) => {
    try {
      // Get stream URL from backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stream/url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId: track.id,
          previewUrl: track.preview_url,
        }),
      });

      if (!response.ok) throw new Error('Failed to get stream URL');

      const { url } = await response.json();
      get().loadTrack(track, url);
      get().play();
    } catch (error) {
      console.error('Error playing track:', error);
    }
  },

  // UI Controls
  togglePlayer: () => {
    set(state => ({ isPlayerOpen: !state.isPlayerOpen }));
  },

  toggleQueue: () => {
    set(state => ({ showQueue: !state.showQueue }));
  },

  toggleLyrics: () => {
    set(state => ({ showLyrics: !state.showLyrics }));
  },

  // Cleanup
  destroy: () => {
    const howl = get().howlInstance;
    if (howl) {
      howl.unload();
    }
  },
}));

export default usePlayerStore;
