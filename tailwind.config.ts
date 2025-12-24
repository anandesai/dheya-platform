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
			sans: ['var(--font-body)', 'Georgia', 'serif'],
			headline: ['var(--font-display)', 'system-ui', 'sans-serif'],
			editorial: ['var(--font-body)', 'Georgia', 'serif'],
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
				'50': '#FFFFFF',
				'100': '#FDF8F0', // Base background
				'200': '#F7EFE5',
				'300': '#EFE4D6',
				'400': '#DFD3C0',
				'500': '#C9BDA4',
				'DEFAULT': '#FDF8F0'
			},
			purple: {
				'50': '#EEF2FF',
				'100': '#E0E7FF',
				'200': '#C7D2FE',
				'300': '#A5B4FC',
				'400': '#818CF8',
				'500': '#5D5FEF', // Primary Action
				'600': '#4F46E5',
				'700': '#4338CA',
				'800': '#3730A3',
				'900': '#312E81',
				'DEFAULT': '#5D5FEF'
			},
			sage: {
				'50': '#F4F7F4',
				'100': '#E9EFE9',
				'200': '#D8E2D8',
				'300': '#C8D1A3', // Accent Sage
				'400': '#A8B684',
				'500': '#8A9A65',
				'600': '#6D7C4C',
				'700': '#535F3A',
				'800': '#3D462B',
				'900': '#2A301E',
				'DEFAULT': '#C8D1A3'
			},
			charcoal: {
				'50': '#F6F6F6',
				'100': '#E7E7E7',
				'200': '#D1D1D1',
				'300': '#B0B0B0',
				'400': '#888888',
				'500': '#6D6d6d',
				'600': '#5D5D5D',
				'700': '#4F4F4F',
				'800': '#1F1F1F',
				'900': '#111111', // Primary Text
				'DEFAULT': '#111111'
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
			},
			'fade-in-up': {
				'0%': {
					opacity: '0',
					transform: 'translateY(20px)'
				},
				'100%': {
					opacity: '1',
					transform: 'translateY(0)'
				}
			},
			'fade-in': {
				'0%': { opacity: '0' },
				'100%': { opacity: '1' }
			},
			'scale-in': {
				'0%': {
					opacity: '0',
					transform: 'scale(0.95)'
				},
				'100%': {
					opacity: '1',
					transform: 'scale(1)'
				}
			}
		},
		animation: {
			'accordion-down': 'accordion-down 0.2s ease-out',
			'accordion-up': 'accordion-up 0.2s ease-out',
			'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
			'fade-in': 'fade-in 1s ease-out forwards',
			'scale-in': 'scale-in 0.6s ease-out forwards',
			'pulse-slow': 'pulse 3s infinite ease-in-out',
		}
	},
	plugins: [require("tailwindcss-animate")],
};
export default config;
