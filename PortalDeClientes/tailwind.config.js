/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#030303",
        surface: {
          DEFAULT: "#09090b",
          elevated: "#121215",
          border: "rgba(255, 255, 255, 0.08)",
          hover: "rgba(255, 255, 255, 0.12)"
        },
        cinema: {
          black: "#000000",
          abyss: "#050507",
          subtle: "#0e0e11",
          bone: "#f4f4f5",
          silver: "#a1a1aa",
          muted: "#71717a",
          highlight: "#ffffff"
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
        mono: [
          '"Geist Mono"',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ]
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.03em',
        normal: '-0.01em',
        widest: '0.2em'
      },
      backgroundImage: {
        'cinema-radial': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.1), transparent 100%)',
        'subtle-glow': 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03) 0%, transparent 70%)',
        'radial-spotlight': 'radial-gradient(circle, rgba(52, 211, 153, 0.08) 0%, rgba(56, 189, 248, 0.05) 30%, transparent 70%)',
        'radial-vignette': 'radial-gradient(circle at center, transparent 35%, rgba(0, 0, 0, 0.8) 100%)',
      }
    },
  },
  plugins: [],
}
