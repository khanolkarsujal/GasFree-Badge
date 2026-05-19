/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'SF Mono', 'monospace'],
      },
      colors: {
        brand: {
          bg:        '#05031F',
          primary:   '#6D18FF',
          secondary: '#43256E',
          glow:      '#D9B6FF',
        },
        /* Semantic shorthands */
        purple:  '#6D18FF',
        violet:  '#43256E',
        lavender:'#D9B6FF',
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #D9B6FF 0%, #6D18FF 100%)',
        'gradient-card':   'linear-gradient(155deg, rgba(15,8,40,0.95) 0%, rgba(5,3,31,0.98) 100%)',
        'dot-grid':        'radial-gradient(rgba(217,182,255,0.04) 1px, transparent 1px)',
      },
      boxShadow: {
        'glow-purple': '0 0 30px rgba(109,24,255,0.4), 0 0 60px rgba(109,24,255,0.15)',
        'glow-accent': '0 0 24px rgba(217,182,255,0.3)',
        'glow-sm':     '0 0 16px rgba(109,24,255,0.35)',
        'glow-lg':     '0 0 60px rgba(109,24,255,0.25)',
        'card':        '0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.5)',
      },
      borderRadius: {
        card:    '16px',
        'card-lg': '24px',
      },
      animation: {
        'float':       'float 5s ease-in-out infinite',
        'float-slow':  'float 7s ease-in-out infinite',
        'pulse-ring':  'pulse-ring 3s ease-out infinite',
        'spin-slow':   'spin 18s linear infinite',
        'shimmer':     'shimmer 2.5s ease-in-out infinite',
        'glow-pulse':  'glow-pulse 3s ease-in-out infinite',
        'scan':        'scan 3.5s ease-in-out infinite',
        'slide-up':    'slide-up-fade 0.5s ease-out',
        'fade-in':     'fade-in 0.4s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'pulse-ring': {
          '0%':   { transform: 'scale(1)', opacity: '1' },
          '70%':  { transform: 'scale(1.1)', opacity: '0.35' },
          '100%': { transform: 'scale(1.18)', opacity: '0' },
        },
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(109,24,255,0.3)' },
          '50%':      { boxShadow: '0 0 50px rgba(109,24,255,0.6), 0 0 80px rgba(217,182,255,0.2)' },
        },
        scan: {
          '0%':   { top: '0%' },
          '50%':  { top: '100%' },
          '100%': { top: '0%' },
        },
        'slide-up-fade': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
