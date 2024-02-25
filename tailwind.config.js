/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        overlay: "rgba(0,0,0,0.4)",
      },

      screens:{
        "-1024": { max: "1024px" },
        "-400": { max: "400px" },
      }
    },
  },
  plugins: [],
};
