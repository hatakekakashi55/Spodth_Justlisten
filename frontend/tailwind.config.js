/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SPODTH Brand Colors
        'sp-dark': '#121212',
        'sp-darker': '#0F0F0F',
        'sp-primary': '#1DB954',
        'sp-accent': '#1ed760',
        'sp-gray': '#282828',
        'sp-text': '#FFFFFF',
        'sp-text-secondary': '#B3B3B3',
      },
      backdropFilter: {
        'glass': 'blur(10px)',
      },
      backgroundColor: {
        'glass': 'rgba(18, 18, 18, 0.8)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(30, 215, 96, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(30, 215, 96, 0.3)' },
          '50%': { opacity: '0.7', boxShadow: '0 0 30px rgba(30, 215, 96, 0.6)' },
        },
        'slide-up': {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss/plugin')(function({ addUtilities }) {
      addUtilities({
        '.glass': {
          '@apply backdrop-blur-md bg-white/10 border border-white/20 rounded-lg': {},
        },
        '.glass-dark': {
          '@apply backdrop-blur-md bg-black/40 border border-white/10 rounded-lg': {},
        },
      })
    }),
  ],
}
