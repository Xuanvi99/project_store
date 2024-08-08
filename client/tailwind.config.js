/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: "#007bff",
        indigo: "#6610f2",
        purple: "#6f42c1",
        pink: "#e83e8c",
        orange: "#fd7e14",
        orangeFe: "#fe9727",
        yellow: "#fdfd00;",
        green: "#28a745",
        green66: "#66cc00",
        teal: "#20c997",
        cyan: "#17a2b8",
        gray: "#6c757d",
        grayDark: "#222222",
        grayCa: "#cacaca",
        grayF5: "#f5f5f7",
        grayF30: "#ffffff30",
        primary: "#007bff",
        secondary: "#6c757d",
        grayE5: "#E5E5E5",
        success: "#28a745",
        info: "#17a2b8",
        warning: "#ffc107",
        danger: "#dc3545",
        light: "#f4f4f4",
        dark: "#343a40",
        gray98: "#98a6ab",
        grayFa: "#fafdff",
      },
      fontFamily: {
        poppins: "Poppins, sans-serif",
      },
      backgroundImage: {
        orangeLinear: "linear-gradient(90deg, #ffba00 0%, #ff6c00 100%)",

        orangeLinearReverse: "linear-gradient(90deg,#ee2d14 30%,#ff6c00 70%)",

        redLinear: "linear-gradient(100deg,rgb(146 0 9),rgb(212 6 6))",
        whiteLinear:
          "linear-gradient(to bottom,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%)",
      },
      boxShadow: {
        shadowButton: "0 5px 5px rgba(0,0,0,0.5)",
        shadow1: " 0px 2px 8px rgba(0, 0, 0, 0.15)",
        shadow2: " 0px 2px 8px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        textScale: "textScale 0.5s linear  infinite",
      },
      keyframes: {
        textScale: {
          "0%, 100%": { transform: "scale(0.9)" },
          "50%": { transform: "scale(1)" },
        },
      },
      borderWidth: {
        1: "1px",
      },
    },
  },
  plugins: [],
};
