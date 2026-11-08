/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        oled: '#000000',
        emerald: {
          500: '#10B981',
          600: '#059669',
        },
        ruby: {
          500: '#EF4444',
          600: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['var(--font-cairo)', 'Tajawal', 'Cairo', 'system-ui', 'sans-serif'],
        quran: ['var(--font-amiri)', 'Amiri', 'serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 0.6s ease-out',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(1.25)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
