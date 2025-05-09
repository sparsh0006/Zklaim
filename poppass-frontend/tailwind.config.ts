import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Greenish-Purple Solana Theme (Primary)
        'gp-deep-blue-purple': '#2C1E5A', // Dark blueish-purple base
        'gp-mid-violet': '#7B42F6',     // A vibrant violet for transition/accents
        'gp-bright-green': '#00F2A9',   // The bright Solana-like green/teal

        // Supporting Colors for this Theme
        'gp-text-light': '#FFFFFF',         // White for primary text for max contrast
        'gp-text-secondary': '#D0D0E0',    // Light gray for secondary text
        'gp-border': 'rgba(255, 255, 255, 0.15)', // Subtle light, semi-transparent border
        'gp-card-bg': 'rgba(10, 5, 30, 0.4)',      // Dark, semi-transparent for cards (more purple tint)
                                                    // Alt: 'rgba(44, 30, 90, 0.3)' for more visible purple
        'gp-card-bg-hover': 'rgba(10, 5, 30, 0.55)', // Slightly more opaque on hover
        'gp-input-bg': 'rgba(0, 0, 0, 0.2)',          // Darker, very subtle for inputs within cards
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        // The main Greenish-Purple Solana-themed gradient
        "gp-gradient": "linear-gradient(to bottom right, var(--gp-deep-blue-purple, #2C1E5A), var(--gp-mid-violet, #7B42F6), var(--gp-bright-green, #00F2A9))",
        // Direct version:
        // "gp-gradient": "linear-gradient(to bottom right, #2C1E5A, #7B42F6, #00F2A9)",
      },
      boxShadow: {
        'gp-glow-sm': '0 0 15px 0px rgba(0, 242, 169, 0.3)', // Greenish glow
        'gp-glow-md': '0 0 25px 5px rgba(0, 242, 169, 0.4)',
      },
      minHeight: {
        'screen': '100vh',
      }
    },
  },
  plugins: [],
};
export default config;