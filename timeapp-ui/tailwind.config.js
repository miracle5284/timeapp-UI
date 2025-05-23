// tailwind.config.js
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            keyframes: {
                // 'smooth-appear': {
                //     '0%': { opacity: 0, transform: 'scale(0.95)' },
                //     '100%': { opacity: 1, transform: 'scale(1)' },
                // },
                // 'smooth-disappear': {
                //     '0%': { opacity: 1, transform: 'scale(1)' },
                //     '100%': { opacity: 0, transform: 'scale(0.95)' },
                // },
                fadeIn: {
                    from: { opacity: 0 },
                    to: { opacity: 1 }
                },
                scaleIn: {
                    '0%': { opacity: 0, transform: 'scale(0.95)' },
                    '100%': { opacity: 1, transform: 'scale(1)' }
                },
                fadeScaleIn: {
                    '0%': { opacity: 0, transform: 'scale(0.95)' },
                    '100%': { opacity: 1, transform: 'scale(1)' },
                },
            },
            // animation: {
            //     'smooth-appear': 'smooth-appear 200ms ease-out forwards',
            //     'smooth-disappear': 'smooth-disappear 200ms ease-in forwards',
            // },
            animation: {
                'fade': 'fadeIn 0.3s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'fade-scale-in': 'fadeScaleIn 0.4s ease-out forwards',
            },
            maxHeight: {
                screen: '100vh',
            }
        },
    },
    plugins: [],
};
