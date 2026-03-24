/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: '#0B0B0B',
                surface: '#121212',
                'surface-light': '#1a1a1a',
                'surface-lighter': '#222222',
                accent: {
                    DEFAULT: '#7C3AED',
                    light: '#9333EA',
                    dark: '#6D28D9',
                },
                muted: '#9CA3AF',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'slide-down': 'slideDown 0.5s ease-out forwards',
                'scale-in': 'scaleIn 0.3s ease-out forwards',
                'scroll-up': 'scrollUp 25s linear infinite',
                'scroll-down': 'scrollDown 25s linear infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                scrollUp: {
                    '0%': { transform: 'translateY(0)' },
                    '100%': { transform: 'translateY(-50%)' },
                },
                scrollDown: {
                    '0%': { transform: 'translateY(-50%)' },
                    '100%': { transform: 'translateY(0)' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)' },
                    '50%': { boxShadow: '0 0 40px rgba(124, 58, 237, 0.6)' },
                },
            },
            backgroundImage: {
                'gradient-accent': 'linear-gradient(135deg, #7C3AED, #9333EA)',
                'gradient-dark': 'linear-gradient(180deg, rgba(11,11,11,0) 0%, #0B0B0B 100%)',
            },
        },
    },
    plugins: [],
}
