export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050508",
        surface: "#0c0d12",
        "surface-card": "#12141c",
        "surface-border": "rgba(255, 255, 255, 0.08)",
        "surface-hover": "rgba(255, 255, 255, 0.04)",
        primary: "#ffffff",
        secondary: "#94a3b8",
        muted: "#64748b",
        accent: "#38bdf8",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
