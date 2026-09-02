/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF7",
        sunk: "#F1EEE3",
        ink: "#1B1F2A",
        muted: "#6E6858",
        border: "#E3DFD1",
        primary: {
          DEFAULT: "#2B4570",
          dark: "#1E3252",
          light: "#E7ECF3",
        },
        accent: {
          DEFAULT: "#E29A34",
          dark: "#B9791F",
          light: "#FCEFDA",
        },
        sage: {
          DEFAULT: "#4C7A5E",
          dark: "#375B45",
          light: "#E4EFE8",
        },
        brick: {
          DEFAULT: "#B3492E",
          light: "#F6E4DE",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        lg: "16px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(27,31,42,0.06), 0 1px 0 rgba(27,31,42,0.04)",
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};
