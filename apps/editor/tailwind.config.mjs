/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            height: {
                '128': '32rem',
                '160': '40rem'
            },
            maxHeight: {
                '128': '32rem',
                '160': '40rem'
            },

        },
        animation: {
            'spin-slow': 'spin 1.6s linear infinite',
        }
    },
    plugins: [],
};
