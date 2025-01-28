import type { Config } from "tailwindcss";

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
      },
    },
  },
  plugins: [],
} satisfies Config;
