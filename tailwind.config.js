/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./landing/src/**/*.{js,ts,jsx,tsx}",
    "./miltiwebs/src/**/*.{js,ts,jsx,tsx}",
    "./PortalDeClientes/src/**/*.{js,ts,jsx,tsx}",
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
      }
    },
  },
  plugins: [],
};
