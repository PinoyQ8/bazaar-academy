import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // MESH-SYNC: Scans the app folder
  ],
  theme: {
    extend: {
      colors: {
        'bazaar-yellow': '#eab308',
      },
    },
  },
  plugins: [],
};
export default config;