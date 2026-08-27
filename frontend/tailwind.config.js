/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{jsx,js}'],
    theme: {
        extend: {
            colors: {
                primary: '#FF6B9A',
                'primary-dark': '#E85588',
                secondary: '#7C5CFC',
                'secondary-dark': '#6A4DE0',
                accent: '#FFD166',
                fresh: '#6DD6A0',
                background: '#FFF9F5',
                card: '#FFFFFF',
                'text-primary': '#252235',
                'text-secondary': '#6F6B7D',
                border: '#EDE7E3',
                error: '#FF6B6B',
                info: '#6EA8FE'
            },
            fontFamily: {
                title: ['Plus Jakarta Sans', 'sans-serif'],
                body: ['Inter', 'sans-serif']
            },
            borderRadius: {
                card: '16px',
                input: '12px',
                btn: '12px'
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-slow': 'float 8s ease-in-out infinite',
                'float-slower': 'float 10s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'slide-up': 'slide-up 0.6s ease-out',
                'slide-up-delay': 'slide-up 0.8s ease-out 0.2s both',
                'fade-in': 'fade-in 0.5s ease-out',
                'scale-in': 'scale-in 0.4s ease-out',
                'shimmer': 'shimmer 2s linear infinite',
                'gradient-x': 'gradient-x 3s ease infinite',
                'bounce-in': 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
                    '50%': { opacity: '0.8', transform: 'scale(1.05)' },
                },
                'slide-up': {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'scale-in': {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'gradient-x': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                'bounce-in': {
                    '0%': { opacity: '0', transform: 'scale(0.3)' },
                    '50%': { transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
            backgroundSize: {
                '200%': '200% 200%',
            }
        }
    },
    plugins: []
};
