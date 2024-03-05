import type { Config } from "tailwindcss"

const config = {
   darkMode: ["class"],
   content: [
      './pages/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
      './app/**/*.{ts,tsx}',
      './src/**/*.{ts,tsx}',
   ],
   prefix: "",
   theme: {
      container: {
         center: true,
         padding: "2rem",
         screens: {
            "2xl": "1400px",
         },
      },
      extend: {
         colors: {
            gray: {
               0: '#fff',
               100: '#fafafa',
               200: '#eaeaea',
               300: '#999999',
               400: '#888888',
               500: '#666666',
               600: '#444444',
               700: '#333333',
               800: '#222222',
               900: '#111111',
               950: '#0B0B0C',
            },
         },
         keyframes: {
            "accordion-down": {
               from: { height: "0" },
               to: { height: "var(--radix-accordion-content-height)" },
            },
            "accordion-up": {
               from: { height: "var(--radix-accordion-content-height)" },
               to: { height: "0" },
            },
         },
         animation: {
            "accordion-down": "accordion-down 0.2s ease-out",
            "accordion-up": "accordion-up 0.2s ease-out",
         },
      },
   },
   plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config