/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        luxury: ['"Playfair Display"', 'serif'],
        modern: ['Outfit', 'sans-serif'],
        mono: ['"Geist Mono"', 'monospace'],
      },
      colors: {
        dark: {
          950: '#060608',
          900: '#0d0d12',
          850: '#13131a',
          800: '#1a1a24',
        }
      },
      backgroundImage: {
        'radial-spotlight': 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, rgba(56,189,248,0.05) 30%, transparent 70%)',
        'radial-vignette': 'radial-gradient(circle at center, transparent 35%, rgba(0,0,0,0.85) 100%)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(52,211,153,0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(52,211,153,0.5)' },
        }
      }
    },
  },
  plugins: [],
};
