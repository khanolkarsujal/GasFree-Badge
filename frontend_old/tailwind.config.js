/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: {
          DEFAULT: '#06080f',
          2: '#0b0e18',
        },
        card: {
          DEFAULT: '#0f1420',
          2: '#141b2d',
        },
        line: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          2: 'rgba(255,255,255,0.10)',
        },
        brand: {
          purple: '#6366f1',
          'purple-lt': '#818cf8',
          'purple-xs': '#c7d2fe',
          blue: '#3b82f6',
          green: '#10b981',
          amber: '#f59e0b',
          red: '#ef4444',
        },
        content: {
          primary: '#f1f5f9',
          secondary: '#94a3b8',
          tertiary: '#475569',
          muted: '#2d3748',
        },
      },
      borderRadius: {
        card: '12px',
        'card-lg': '20px',
        sm: '8px',
      },
      boxShadow: {
        card: '0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.4)',
        glow: '0 0 32px rgba(99,102,241,0.4), 0 0 64px rgba(99,102,241,0.15)',
        'btn-primary': '0 4px 16px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
      },
      animation: {
        'pulse-ring': 'pulse-ring 3s ease-out infinite',
        float: 'float 4s ease-in-out infinite',
        drift: 'drift 24s ease-in-out infinite',
        spin: 'spin 0.65s linear infinite',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '70%': { transform: 'scale(1.1)', opacity: '0.4' },
          '100%': { transform: 'scale(1.18)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-7px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(25px, -35px)' },
        },
      },
    },
  },
  plugins: [],
};
