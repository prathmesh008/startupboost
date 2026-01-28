import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'obsidian': '#0a0a0a',
                'charcoal': '#121212',
                'graphite': '#232323',
                'ivory': '#fcfcfc',
                'ghost': '#e5e5e5',
                'accent': '#ffffff', // Stark white accent
                'glass': 'rgba(255, 255, 255, 0.05)',
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
export default config;
