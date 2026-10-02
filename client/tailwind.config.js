/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        // Extra-small: 480px+
        'xs': '480px',
        // Landscape-small: landscape phones (height ≤ 500px)
        'ls': { 'raw': '(orientation: landscape) and (max-height: 500px)' },
        // Landscape-medium: landscape tablets / large phones (height ≤ 700px)
        'lm': { 'raw': '(orientation: landscape) and (max-height: 700px)' },
      },
      colors: {
        command: {
          bg: '#070B12',
          card: '#0D1525',
          border: '#1E2D4A',
          hover: '#16233B',
          accent: '#00F0FF',
          accentGlow: 'rgba(0, 240, 255, 0.25)',
          warning: '#FFB800',
          danger: '#FF3366',
          success: '#00E699',
          muted: '#64748B',
          text: '#F1F5F9'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(0, 240, 255, 0.35)',
        'glow-danger': '0 0 20px -3px rgba(255, 51, 102, 0.4)',
        'glow-warning': '0 0 20px -3px rgba(255, 184, 0, 0.35)',
        'glow-success': '0 0 20px -3px rgba(0, 230, 153, 0.35)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
