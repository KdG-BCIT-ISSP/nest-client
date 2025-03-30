import type { Config } from "tailwindcss";
import flowbite from "flowbite/plugin";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",

        // 🎨 Brand colour palette
        primary: "#FFE2E2", // Custom Pink
        secondary: "#547756", // Custom Green
        tertiary: "#CD6A6A", // Custom Red
        accent: "#FDF8D0", // Custom Yellow
        muted: "#FFCFCF", // Custom Pink
        container: "#F2FBF3", // Custom Yellow
        black: "#101010", // Custom Black
        darkGray: "#2A2A2A",
        lightGray: "#F2F2F2",
        report: "#EEEEEE", // Custom report 
        primaryPressed: "#FFCFCF",
        secondaryPressed: "#447346",
        tertiaryPressed: "#BA5656",
        accentPressed: "#FFF7B8",
        mutedPressed: "#FFCFCF",
        containerPressed: "#FFBFBF",
      },
    },
  },
  plugins: [flowbite],
} satisfies Config;
