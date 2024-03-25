import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "flipbook": "url('/journal-book/flipbook_background.svg')",
      },
      colors: {
        "primary-yellow": "#E9BB18",
        "secondary-yellow": "#F8D867",
        "primary-orange": "#E98427",
        "secondary-orange": "#F6AD69",
        "light-orange": "#FF912C",
        "primary-green": "#438342",
        "secondary-green": "#75C973",
        "primary-purple": "#6F219E",
        "secondary-purple": "#D8BCFD",
        "primary-brown": "#59371D",
        "secondary-brown": "#714B2D",
        "primary-black": "#1C1A1A",
        "primary-skin": "#FFF2E5",
        "primary-blue-accent": "#E7F2E7",
      },
      screens: {
        sm: "640px",
        md: "768px",
        md2: "900px",
        lg: "1024px",
        lg2: "1100px",
        xl: "1280px",
        xl2: "1440px", // "2xl" is the default breakpoint in Tailwind
        "2xl": "1536px",
      },
    },
    plugins: [],
    screens: {
      tablet: "1024px",
      // => @media (min-width: 640px) { ... }

      laptop: "1440px",
      // => @media (min-width: 1366px) { ... }

      desktop: "1920px",
      // => @media (min-width: 1440px) { ... }
    },
  },
};
export default config;
