/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        admin: '#ef4444',
        manager: '#3b82f6',
        hr: '#22c55e',
        employee: '#64748b'
      },
      animation: {
        'gradient-shift': 'gradientShift 8s ease-in-out infinite',
        'grid-drift': 'gridDrift 20s linear infinite',
        'ring-pulse': 'ringPulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'floatParticle 15s ease-in-out infinite',
        'float-reverse': 'floatParticleReverse 20s ease-in-out infinite',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% center' },
          '50%': { backgroundPosition: '100% center' },
        },
        gridDrift: {
          '0%': { transform: 'translate(0, 0)' },
          '100%': { transform: 'translate(40px, 40px)' },
        },
        ringPulse: {
          '0%, 100%': { transform: 'scale(0.8)', opacity: '0.1' },
          '50%': { transform: 'scale(1.2)', opacity: '0.4' },
        },
        floatParticle: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)', opacity: '0.5' },
          '25%': { transform: 'translate(30px, -50px) rotate(90deg)', opacity: '0.8' },
          '50%': { transform: 'translate(-20px, 40px) rotate(180deg)', opacity: '0.4' },
          '75%': { transform: 'translate(50px, 20px) rotate(270deg)', opacity: '0.7' },
        },
        floatParticleReverse: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)', opacity: '0.5' },
          '25%': { transform: 'translate(-30px, 50px) rotate(-90deg)', opacity: '0.8' },
          '50%': { transform: 'translate(20px, -40px) rotate(-180deg)', opacity: '0.4' },
          '75%': { transform: 'translate(-50px, -20px) rotate(-270deg)', opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
}
