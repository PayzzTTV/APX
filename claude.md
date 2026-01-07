# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

APX is a car rental subscription application built as a mobile-first web app. The app follows an **unlimited subscription model** (no pricing displayed) where users book vehicles for specific periods. The design mimics iOS-style mobile navigation with a bottom navbar.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS (dark mode)
- **Backend**: Supabase (PostgreSQL + Auth)
- **UI Libraries**:
  - `sonner` for toast notifications
  - `framer-motion` for animations
  - `react-day-picker` for calendar
  - `date-fns` for date manipulation

## Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

## Architecture Overview

### Supabase Integration

The app uses **two different Supabase client patterns**:

1. **Server Components** (`lib/supabase/server.ts`):
   - Uses `@supabase/ssr` with `createServerClient`
   - Requires `await cookies()` from Next.js
   - Use for Server Components and Server Actions

2. **Client Components** (`lib/supabase/client.ts`):
   - Uses `@supabase/ssr` with `createBrowserClient`
   - Use for client-side components with React hooks

### Server Actions Pattern

All data mutations are handled through **Next.js Server Actions** in the `app/actions/` directory:

- `app/actions/auth.ts` - Authentication (login, signup, logout)
- `app/actions/favorites.ts` - Favorites management (add, remove, check, list)

Server actions follow this pattern:
```typescript
'use server'

export async function actionName(params) {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Database operation
  const { data, error } = await supabase
    .from('table')
    .operation()

  return { data, error }
}
```

### Database Schema

**Key Tables**:
- `profiles` - User profiles (linked to `auth.users`)
- `cars` - Vehicle catalog (12 vehicles, public access via RLS)
- `bookings` - User reservations (with date ranges and status)
- `favorites` - User favorite vehicles (many-to-many relationship)

**Important**: The database uses Row Level Security (RLS). Check `supabase-schema-v2.sql` and `supabase-favorites-schema.sql` for policies.

### Component Architecture

**Key Patterns**:

1. **Animation Wrapper**: All pages are wrapped in `AnimationProvider` (in `app/layout.tsx`) for page transitions
2. **Toast Notifications**: Use `toast` from `sonner` instead of `alert()` - configured globally in layout
3. **Motion Components**: Cards and interactive elements use `framer-motion` for animations
4. **Event Handling in Nested Clickables**: When placing clickable elements inside Links (e.g., FavoriteButton in CarCard), use:
   ```typescript
   const handleClick = (e: React.MouseEvent) => {
     e.preventDefault()
     e.stopPropagation()
     // your logic
   }
   ```

### Routing Structure

```
app/
├── page.tsx                    # Home - car listing with filters
├── layout.tsx                  # Root layout with Navbar, Toaster, AnimationProvider
├── cars/[id]/page.tsx          # Car details with booking calendar
├── bookings/page.tsx           # User's booking history
├── favorites/page.tsx          # User's favorite cars
├── login/page.tsx              # Authentication page
└── profile/page.tsx            # User profile management
```

**Protected Routes**: Use this pattern for authenticated pages:
```typescript
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  redirect('/login')
}
```

### Type Safety

TypeScript types are defined in `lib/types/database.types.ts`:
- `Car` - Vehicle type
- `Booking` - Reservation type
- `Profile` - User profile type
- `Database` - Full database schema interface

These types are automatically aligned with the Supabase schema.

## Key Implementation Details

### Booking System

The booking calendar (`components/BookingCalendar.tsx`) handles:
- Fetching existing bookings to disable booked dates
- Preventing overlapping reservations
- Server-side validation in the booking action

### Favorites System

- `favorites` table uses a unique constraint on `(user_id, car_id)` to prevent duplicates
- `FavoriteButton` component uses optimistic UI updates
- The favorites page uses a JOIN to fetch full car details

### Authentication Flow

- Sign up creates a profile automatically via database trigger
- Login/logout managed through `app/actions/auth.ts`
- `AuthForm` component handles both login and signup modes
- User session is managed via Supabase cookies (SSR-compatible)

### Mobile-First Design

- App uses iOS-style bottom navigation (see `components/Navbar.tsx`)
- Mobile viewport settings in `app/layout.tsx`:
  - `viewport-fit: cover` for notch support
  - `user-scalable: false` for native feel
  - Apple-specific meta tags for PWA-like behavior

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Development Notes

### Adding New Features

1. If modifying database schema, update SQL files and `lib/types/database.types.ts`
2. For new data operations, create Server Actions in `app/actions/`
3. Always check authentication in Server Actions before database operations
4. Use toast notifications instead of alerts for user feedback
5. Add Framer Motion animations to new interactive components

### Common Patterns

**Fetching with Joins**:
```typescript
const { data } = await supabase
  .from('favorites')
  .select(`
    id,
    created_at,
    cars (*)
  `)
  .eq('user_id', user.id)
```

**Protected API Routes**:
```typescript
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  return { error: 'Unauthorized' }
}
```

### Current Development State

The app is in V3 development according to `ROADMAP_V3.md`. Recent additions:
- ✅ Toast notification system (Sonner)
- ✅ Animations (Framer Motion)
- ✅ Favorites system
- 🚧 Filters and search (in progress)

See `ROADMAP_V3.md` for the full development plan and `CHECKLIST.md` for validation status.

## Important Conventions

- **No pricing displayed**: The app uses a subscription model without showing prices
- **French UI**: All user-facing text is in French
- **Dark mode only**: Tailwind config is set to dark mode
- **Mobile-first**: Design and test primarily for mobile viewports
- **Server Actions over API routes**: Use Server Actions for data mutations
- **RLS-first security**: Database security is enforced at the database level
