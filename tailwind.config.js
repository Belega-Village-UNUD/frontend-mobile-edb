/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            height: {
                'h-cust-100': '100px',
            },
            fontSize: {
                'f-cust-30': '30px',
            },
        },
    },
    plugins: [],
};
