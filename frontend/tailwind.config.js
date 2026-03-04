/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0f172a', // Slate 900
                secondary: '#1e293b', // Slate 800
                accent: '#3b82f6', // Blue 500
                glass: 'rgba(255, 255, 255, 0.1)',
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
