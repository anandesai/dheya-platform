import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['var(--font-display)', 'system-ui', 'sans-serif'],
  			display: ['var(--font-display)', 'system-ui', 'sans-serif'],
  			body: ['var(--font-body)', 'Georgia', 'serif'],
  			serif: ['var(--font-body)', 'Georgia', 'serif'],
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			cream: {
  				'50': '#fdfcfb',
  				'100': '#f9f6f1',
  				'200': '#f5f0e7',
  				'300': '#e8e2d4',
  				'400': '#d9d0bc',
  				'500': '#c9bda4',
  				DEFAULT: '#f5f0e7'
  			},
  			purple: {
  				'50': '#f5f3ff',
  				'100': '#ede9fe',
  				'200': '#ddd6fe',
  				'300': '#c4b5fd',
  				'400': '#a78bfa',
  				'500': '#8b5cf6',
  				'600': '#7c3aed',
  				'700': '#6d28d9',
  				'800': '#5b21b6',
  				'900': '#4c1d95',
  				DEFAULT: '#8b5cf6'
  			},
  			forest: {
  				'50': '#f0fdf4',
  				'100': '#dcfce7',
  				'200': '#bbf7d0',
  				'300': '#86efac',
  				'400': '#4ade80',
  				'500': '#22c55e',
  				'600': '#16a34a',
  				'700': '#15803d',
  				'800': '#1a472a',
  				'900': '#0f2d1a',
  				DEFAULT: '#1a472a'
  			},
  			gold: {
  				'50': '#fffbeb',
  				'100': '#fef3c7',
  				'200': '#fde68a',
  				'300': '#fcd34d',
  				'400': '#d4af37',
  				'500': '#c9a227',
  				'600': '#b8860b',
  				'700': '#a16207',
  				'800': '#854d0e',
  				'900': '#713f12',
  				DEFAULT: '#d4af37'
  			},
  			// Uplift Design System - Sage (muted green for philosophy sections)
  			sage: {
  				'50': '#f6f7f6',
  				'100': '#e8ebe9',
  				'200': '#d4dbd6',
  				'300': '#b5c1b8',
  				'400': '#8fa294',
  				'500': '#6f8574',
  				'600': '#596b5d',
  				'700': '#48574c',
  				'800': '#3c4840',
  				'900': '#2d3830',
  				DEFAULT: '#e8ebe9'
  			},
  			// Uplift Design System - Charcoal (dark cards and near-black text)
  			charcoal: {
  				'50': '#f6f6f6',
  				'100': '#e7e7e7',
  				'200': '#d1d1d1',
  				'300': '#b0b0b0',
  				'400': '#888888',
  				'500': '#6d6d6d',
  				'600': '#5d5d5d',
  				'700': '#4f4f4f',
  				'800': '#1f2937',
  				'900': '#111827',
  				DEFAULT: '#1f2937'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
