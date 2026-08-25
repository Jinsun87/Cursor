import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        pine: {
          950: "#07140e",
          900: "#0c1f16",
          800: "#143226",
          700: "#1c4736",
          600: "#2d6a4f",
          500: "#40916c",
          400: "#74c69d",
        },
        gold: {
          400: "#e8c547",
          500: "#d4af37",
        },
        parchment: "#f6f1e6",
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        sans: ["Segoe UI", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
