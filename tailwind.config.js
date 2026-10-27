/** @type {import('tailwindcss').Config} */
// Freelance HQ brand tokens
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		opacity: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [i, `${i / 100}`])),
  		borderRadius: {
  			// Brand kit v3: buttons and inputs 8px, panels 14px, cards 16px, pills fully round.
  			none: '0',
  			xs: '4px',
  			sm: '8px',
  			DEFAULT: '8px',
  			md: '8px',
  			lg: '14px',
  			xl: '16px',
  			'2xl': '16px',
  			'3xl': '16px',
  			full: '9999px'
  		},
  		boxShadow: {
  			none: 'none',
  			sm: 'var(--a-panel-shadow)',
  			DEFAULT: 'var(--a-panel-shadow)',
  			md: 'var(--a-panel-shadow)',
  			lg: 'var(--a-hover)',
  			xl: 'var(--a-hover)',
  			'2xl': 'var(--a-hover)',
  			inner: 'none',
  			menu: 'var(--a-float)'
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
  			app: {
  				bg: 'var(--color-bg)',
  				surface: 'var(--color-surface)',
  				border: 'var(--color-border)',
  				text: 'var(--color-text)',
  				muted: 'var(--color-muted)',
  				primary: 'var(--color-primary)',
  				'on-primary': 'var(--color-on-primary)',
  				'primary-pressed': 'var(--color-primary-pressed)',
  				raised: 'var(--color-raised)',
  				'border-strong': 'var(--color-border-strong)',
  				navy: 'var(--navy)',
  				butter: 'var(--butter)',
  				'on-butter': 'var(--on-butter)',
  				lavender: 'var(--lavender)',
  				'lavender-soft': 'var(--lavender-soft)',
  				'brand-text': 'var(--brand-text)',
  				success: 'var(--color-success)',
  				warning: 'var(--color-warning)',
  				danger: 'var(--color-danger)'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		fontFamily: {
  			heading: ['var(--font-display)'],
  			body: ['var(--font-sans)'],
  			display: ['var(--font-display)'],
  			sans: ['var(--font-sans)'],
  			mono: ['var(--font-mono)']
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
}
