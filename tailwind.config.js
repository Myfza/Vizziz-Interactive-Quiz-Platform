/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'primary': ['Poppins', 'Nunito Sans', 'sans-serif'],
        'game': ['Quicksand', 'Inter Tight', 'sans-serif'],
        'logo': ['Minnie Play', 'Poppins', 'sans-serif'],
      },
      colors: {
        'vizziz': {
          primary: '#f9a01b',
          secondary: '#ff8c00',
          accent: '#ffa500',
          light: '#ffb84d',
          dark: '#e6900f',
          gradient: {
            from: '#f9a01b',
            via: '#ff8c00',
            to: '#ffa500'
          }
        },
        'dark': {
          bg: '#0F172A',
          card: '#1E293B',
          border: '#334155',
        }
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.3)',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
};
