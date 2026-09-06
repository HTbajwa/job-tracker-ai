import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
    extend: {
        fontFamily: {
            sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            serif: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
        },
        colors: {
            teal: {
                950: '#0a1f1e',
                900: '#0f2e2e',
                800: '#153d3c',
                700: '#1d4d4b',
            },
            brand: {
                DEFAULT: '#eab308',
                light: '#fde047',
                dark: '#ca8a04',
            },
            cream: '#faf9f6',
        },
    },
},

    plugins: [forms],
};
