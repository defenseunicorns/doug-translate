/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/routes/**/*.{svelte,js,ts}", "./src/lib/components/**/*.{svelte,js,ts}"],
  theme: {
    extend: {}
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        dracula: {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          ...require("daisyui/src/theming/themes")["[data-theme=dracula]"],
          primary: "#2563eb",
          secondary: "#8b5cf6"
        }
      },
      "winter"
    ]
  }
};
