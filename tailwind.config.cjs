/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/routes/**/*.{svelte,js,ts}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["luxury"],
  },
};
