/** @type {import('tailwindcss').Config} */
module.exports = {
    purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./Components/**/*.{js,ts,jsx,tsx}"],
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './Components/**/*.{js,ts,jsx,tsx}',
        './app/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
}
