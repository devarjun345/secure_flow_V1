import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './.storybook/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: 'var(--color-canvas)',
        surface: {
          1: 'var(--color-surface-1)',
          2: 'var(--color-surface-2)',
          3: 'var(--color-surface-3)',
        },
        primary: {
          DEFAULT: 'var(--color-primary)',
          glow: 'var(--color-primary-glow)',
        },
        secondary: 'var(--color-secondary)',
        tertiary: 'var(--color-tertiary)',
        critical: 'var(--color-critical)',
        warning: 'var(--color-warning)',
        success: 'var(--color-success)',
        text: {
          primary: 'var(--color-text-primary)',
          muted: 'var(--color-text-muted)',
          code: 'var(--color-text-code)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        focus: {
          ring: 'var(--color-focus-ring)',
          glow: 'var(--color-focus-glow)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 5vw, 3.5rem)', { lineHeight: '1.14', letterSpacing: '-0.03em', fontWeight: '700' }],
        'headline-lg': ['clamp(1.75rem, 3vw, 2.25rem)', { lineHeight: '1.22', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-lg-mobile': ['clamp(1.5rem, 4vw, 1.75rem)', { lineHeight: '1.28', letterSpacing: '-0.015em', fontWeight: '600' }],
        'headline-md': ['1.5rem', { lineHeight: '1.33', letterSpacing: '-0.015em', fontWeight: '600' }],
        'headline-sm': ['1.125rem', { lineHeight: '1.44', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg': ['1rem', { lineHeight: '1.5', letterSpacing: '-0.005em', fontWeight: '400' }],
        'body-md': ['0.875rem', { lineHeight: '1.43', letterSpacing: '0', fontWeight: '400' }],
        'body-sm': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em', fontWeight: '400' }],
        'code-lg': ['0.875rem', { lineHeight: '1.43', letterSpacing: '-0.01em', fontWeight: '500' }],
        'code-md': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        'code-sm': ['0.6875rem', { lineHeight: '1.45', letterSpacing: '0.02em', fontWeight: '400' }],
        'label-md': ['0.75rem', { lineHeight: '1.33', letterSpacing: '0.04em', fontWeight: '600' }],
        'label-xs': ['0.625rem', { lineHeight: '1.4', letterSpacing: '0.08em', fontWeight: '700' }],
      },
      spacing: {
        'space-xs': 'var(--space-xs)',
        'space-sm': 'var(--space-sm)',
        'space-md': 'var(--space-md)',
        'space-lg': 'var(--space-lg)',
        'space-xl': 'var(--space-xl)',
        gutter: 'var(--gutter)',
        'gutter-mobile': 'var(--gutter-mobile)',
        margin: 'var(--margin)',
        'margin-mobile': 'var(--margin-mobile)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        DEFAULT: 'var(--radius)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        elevated: 'var(--shadow-elevated)',
        'glow-primary': 'var(--shadow-glow-primary)',
        'glow-critical': 'var(--shadow-glow-critical)',
      },
      transitionDuration: {
        fast: 'var(--duration-fast)',
        normal: 'var(--duration-normal)',
        slow: 'var(--duration-slow)',
      },
      transitionTimingFunction: {
        standard: 'var(--ease-standard)',
        emphasized: 'var(--ease-emphasized)',
      },
      backgroundImage: {
        'micro-grid': 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-24': '24px 24px',
      },
      keyframes: {
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'slide-up-fade': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down-fade': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'spin': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'radar-sweep': 'radar-sweep 2s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'slide-up-fade': 'slide-up-fade var(--duration-normal) var(--ease-standard)',
        'slide-down-fade': 'slide-down-fade var(--duration-normal) var(--ease-standard)',
        'scale-in': 'scale-in var(--duration-fast) var(--ease-standard)',
        'spin': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};

export default config;