/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        muted: "#f5f5f5",
        primary: "#171717",
        "primary-foreground": "#fafafa"
      },
    },
  },
  plugins: [],
}

