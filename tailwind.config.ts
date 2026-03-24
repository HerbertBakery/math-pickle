import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#fbfaf5",
        ink: "#16202a",
        muted: "#5d6a73",
        line: "#e6e2d6",
        pickle: {
          50: "#eff9e9",
          100: "#dff2d3",
          200: "#bee6a8",
          300: "#98d773",
          400: "#6fbd47",
          500: "#52992f",
          600: "#417924",
          700: "#335f1d",
          800: "#2b4c1a",
          900: "#263f19"
        },
        gold: "#f3c96b"
      },
      boxShadow: {
        soft: "0 14px 40px rgba(26, 38, 49, 0.08)"
      },
      borderRadius: {
        xl2: "1.35rem"
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(22,32,42,.08) 1px, transparent 0)"
      }
    }
  },
  plugins: []
};

export default config;
