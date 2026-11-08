# SecureFlow Frontend

Automated DevSecOps platform for continuous vulnerability detection - Frontend application built with Next.js 14, React 18, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.4
- **Styling**: Tailwind CSS 3.4
- **State Management**: Zustand (client) + TanStack Query (server)
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Testing**: Vitest + Playwright
- **Documentation**: Storybook
- **Mocking**: MSW (Mock Service Worker)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Auth route group (login, register, forgot-password)
│   ├── (dashboard)/       # Protected dashboard route group
│   │   ├── dashboard/     # Security Operations Center
│   │   ├── repositories/  # Repository management
│   │   ├── scan-center/   # Real-time scan orchestration
│   │   ├── scans/         # Scan history
│   │   ├── findings/      # Vulnerability management
│   │   ├── reports/       # Executive reports
│   │   ├── settings/      # Settings & configuration
│   │   ├── team/          # Team management
│   │   └── account/       # User account
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles & design tokens
├── components/
│   ├── ui/                # Atomic design system components
│   ├── layout/            # Layout components (Sidebar, TopNav, PageHeader)
│   ├── domain/            # Business logic components (organisms)
│   └── feedback/          # Feedback components (Toast, Skeleton, etc.)
├── hooks/                 # Custom React hooks
├── lib/
│   ├── api/               # Axios client, endpoints, API utilities
│   ├── auth/              # Auth utilities, token management
│   ├── utils/             # Utility functions (cn, format, validation, etc.)
│   ├── constants/         # Application constants (routes, roles, etc.)
│   └── query/             # TanStack Query provider
├── store/                 # Zustand stores (auth, workspace, ui, scan)
├── types/                 # TypeScript type definitions
├── styles/                # Global styles & design tokens
└── mocks/                 # MSW handlers & mock data
```

## Design System

The design system implements the **"Cyber Command Glass"** visual language:

- **Colors**: Dark tactical theme with Electric Blue (#3B82F6), Cyber Violet (#8B5CF6), Crimson (#EF4444), Amber (#F59E0B), Emerald (#10B981)
- **Typography**: Geist (display), Inter (body), JetBrains Mono (code/technical data)
- **Spacing**: 4px base unit with responsive scaling
- **Border Radius**: Compact semi-sharp corners (4px base, 8px containers, 12px surfaces, full pills for status)
- **Elevation**: Glass morphism layers with backdrop blur
- **Animations**: Purposeful, performant, respects `prefers-reduced-motion`

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run type checking
npm run typecheck

# Run linting
npm run lint

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run E2E tests
npm run e2e

# Start Storybook
npm run storybook

# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:coverage` | Run tests with coverage |
| `npm run e2e` | Run Playwright E2E tests |
| `npm run e2e:ui` | Run Playwright with UI |
| `npm run storybook` | Start Storybook |
| `npm run storybook:build` | Build Storybook |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check Prettier formatting |

## Design Tokens

Design tokens are defined as CSS custom properties in `src/styles/globals.css`:

```css
:root {
  --color-canvas: #080B14;
  --color-surface-1: #0D1220;
  --color-surface-2: #111827;
  --color-primary: #3B82F6;
  --color-primary-glow: rgba(59, 130, 246, 0.4);
  --color-secondary: #8B5CF6;
  --color-critical: #EF4444;
  --color-warning: #F59E0B;
  --color-success: #10B981;
  /* ... more tokens */
}
```

## Component Development

### Creating New Components

1. Create component in appropriate folder (`src/components/ui/`, `src/components/domain/`, etc.)
2. Follow the existing patterns:
   - Use `forwardRef` for DOM elements
   - Export TypeScript interfaces
   - Use `cn()` utility for class composition
   - Follow Radix UI patterns for accessibility
3. Create Storybook stories in `*.stories.tsx`
4. Write tests in `*.test.tsx`

### Example Component Structure

```tsx
'use client';

import { forwardRef, type HTMLButtonAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends HTMLButtonAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn('base-styles', variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

## Testing

### Unit Tests (Vitest)

- Located alongside components as `*.test.tsx`
- Use React Testing Library
- Run with `npm run test`

### E2E Tests (Playwright)

- Located in `e2e/` directory
- Test critical user flows
- Run with `npm run e2e`

## Storybook

- Component documentation and visual testing
- Stories in `*.stories.tsx` alongside components
- Run with `npm run storybook`
- Build static site with `npm run storybook:build`

## Mock API (MSW)

- Handlers in `src/mocks/handlers.ts`
- Mock data in `src/mocks/data/`
- Browser worker in `src/mocks/browser.ts`
- Enabled via `NEXT_PUBLIC_ENABLE_MOCK_API=true`

## Deployment

### Vercel (Recommended)

1. Connect repository to Vercel
2. Configure environment variables
3. Deploy

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

## Contributing

1. Follow the existing code style
2. Run `npm run lint` and `npm run typecheck` before committing
3. Write tests for new components
4. Update documentation as needed
5. Create Storybook stories for UI components

## License

MIT License - see LICENSE file for details.