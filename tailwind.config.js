module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#007ac2",    // Blue from palette (Web #007ac2)
          "secondary": "#8c1d82",  // Purple from palette (Web #8c1d82)
          "accent": "#00a188",     // Green from palette (Web #00a188)
          "neutral": "#4a4a49",    // Dark gray from palette
          "base-100": "#ffffff",   // White
          "base-200": "#f3f4f6",   // Light gray
          "base-300": "#e5e7eb",   // Medium light gray
          "info": "#32abd0",       // Light blue from palette (Web #32abd0)
          "success": "#95c11f",    // Green from palette (Web #95c11f)
          "warning": "#ef7d00",    // Orange from palette (Web #ef7d00)
          "error": "#cf022b",      // Red from palette (Web #cf022b)
        },
      },
    ],
  },
}
