# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

APX is a car rental SaaS application built with **Next.js 14 (App Router)**, **Supabase** (PostgreSQL + Auth), and **TypeScript**. The application supports user authentication, car browsing with search/filters, booking management with calendar-based date selection, favorites, email notifications, and an admin dashboard for managing cars, bookings, and users.

---

## Development Commands

```bash
# Install dependencies
npm install

# Development server (http://localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

## Environment Setup

1. **Create `.env.local`** from `.env.local.example`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   RESEND_API_KEY=re_your_resend_api_key
   FROM_EMAIL=APX <noreply@yourdomain.com>
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

2. **Initialize Supabase Database**:
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL from `supabase-schema.sql` in the Supabase SQL Editor
   - This creates tables: `profiles`, `cars`, `bookings`, `favorites` with RLS policies

3. **Email Service (Optional for Development)**:
   - Create a free account at [resend.com](https://resend.com) (100 emails/day)
   - Add the API key to `.env.local`
   - See `docs/EMAILS_README.md` for full email system documentation

---

## Architecture

### Next.js App Router Structure

The application uses Next.js 14 App Router with a mix of Server and Client Components:

```
app/
├── actions/              # Server Actions (auth, bookings, favorites)
├── api/                  # API routes (admin operations)
├── admin/                # Admin dashboard and management pages
│   ├── page.tsx         # Dashboard with stats
│   ├── cars/            # Car management
│   ├── bookings/        # Booking management
│   └── users/           # User management
├── login/               # Authentication page
├── profile/             # User profile page
├── bookings/            # User bookings list
├── cars/[id]/           # Car detail with booking calendar
├── favorites/           # User favorites
├── layout.tsx           # Root layout with Navbar
└── page.tsx             # Home page (cars grid with search/filters)
```

**Key Routes**:
- `/` - Home page with car search/filters
- `/login` - Authentication (login/signup)
- `/cars/[id]` - Car detail with booking calendar
- `/bookings` - User's bookings list
- `/favorites` - User's favorite cars
- `/profile` - User profile management
- `/admin/*` - Admin dashboard (requires admin role)

### Authentication Pattern

The application uses **two Supabase clients** for proper SSR:

1. **Client-side** (`lib/supabase/client.ts`):
   ```typescript
   import { createBrowserClient } from '@supabase/ssr'
   // Used in client components ('use client')
   ```

2. **Server-side** (`lib/supabase/server.ts`):
   ```typescript
   import { createServerClient } from '@supabase/ssr'
   import { cookies } from 'next/headers'
   // Used in server components and server actions
   ```

**Authentication flow**:
- User signs up/in via `AuthForm` component
- Server actions `signUp` or `signIn` in `app/actions/auth.ts` handle authentication
- Session tokens stored in cookies via Supabase Auth
- Protected pages check `supabase.auth.getUser()` and redirect to `/login` if needed
- Admin pages additionally verify `profile.role === 'admin'`

### Database Schema

**Tables**:
- `profiles` - User profiles (id, email, full_name, phone, role, avatar_url)
- `cars` - Car inventory (id, name, brand, model, image_url, price_per_day, rating, category, specs)
- `bookings` - Reservations (id, user_id, car_id, start_date, end_date, status, total_price)
- `favorites` - User favorites (user_id, car_id)

**RLS Policies**:
- Users can only view/modify their own bookings and favorites
- All users can view cars (public)
- Only admins can modify cars

### Server Actions Pattern

All mutations use Server Actions located in `app/actions/`:

**Auth Actions** (`auth.ts`):
- `signUp(formData)` - Create account + send welcome email
- `signIn(formData)` - Login user
- `signOut()` - Logout user
- `updateProfile(formData)` - Update user profile
- `cancelBooking(bookingId)` - Cancel booking + send email
- `updateBooking(bookingId, newDates)` - Modify booking + send email

**Booking Actions** (`bookings.ts`):
- `createBooking(carId, dates, totalPrice)` - Create booking with overlap detection + send confirmation email

**Favorites Actions** (`favorites.ts`):
- `addFavorite(carId)` - Add to favorites
- `removeFavorite(carId)` - Remove from favorites
- `isFavorite(carId)` - Check favorite status
- `getUserFavorites()` - Fetch all user favorites

**Important**: Always call server actions from client components or forms. Server actions handle authentication checks, validation, and database operations.

### Email System

The application sends transactional emails using **Resend** with React Email templates:

**Email triggers**:
- **Welcome email** - On user signup (`sendWelcomeEmail()`)
- **Booking confirmation** - On booking creation (`sendBookingConfirmationEmail()`)
- **Booking modification** - On date change (`sendBookingModificationEmail()`)
- **Booking cancellation** - On cancellation (`sendBookingCancellationEmail()`)
- **Booking reminder** - 24h before rental (not yet implemented)

**Email templates** are in `lib/email.ts` with dark theme styling matching the app design.

**Note**: Email sending is non-blocking. If email fails, the primary action (booking, signup) still succeeds.

### Component Patterns

**Server Components** (default):
- Pages that fetch data (`app/page.tsx`, `app/cars/[id]/page.tsx`)
- Admin dashboard pages
- Use `createServerClient` from `lib/supabase/server.ts`

**Client Components** (`'use client'`):
- Interactive forms (`AuthForm`, `BookingCalendar`, `FilterPanel`)
- Components with state/hooks (`CarsGrid`, `SearchBar`)
- Components with animations (`AnimationProvider`)
- Use `createBrowserClient` from `lib/supabase/client.ts`

**Admin Components**:
- Located in `components/admin/`
- Include: `StatCard`, `QuickActions`, `CarForm`, `DeleteCarButton`, `UserRow`
- Always verify admin role before rendering admin-only actions

---

## Key Implementation Details

### Booking Availability Check

When creating or modifying bookings, the system checks for overlapping reservations:

```typescript
// In app/actions/bookings.ts or app/actions/auth.ts
const { data: existingBookings } = await supabase
  .from('bookings')
  .select('*')
  .eq('car_id', carId)
  .in('status', ['pending', 'confirmed'])
  .or(`start_date.lte.${endDate},end_date.gte.${startDate}`)

if (existingBookings && existingBookings.length > 0) {
  return { error: 'Ces dates ne sont pas disponibles...' }
}
```

### Car Filtering System

Search and filters are handled client-side in `CarsGrid` component using utilities from `lib/filters.ts`:

- `filterCars(cars, searchQuery, filterOptions)` - Filter by query and category/rating
- `sortCars(cars, sortBy)` - Sort by name, rating, or newest
- Filters are applied in real-time as user types/selects

### Admin Role Verification

Admin routes and API endpoints must verify user role:

```typescript
// In server components or API routes
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  redirect('/login')
}

const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single()

if (profile?.role !== 'admin') {
  redirect('/')
}
```

### TypeScript Path Alias

The project uses `@/*` as an alias for the root directory:

```typescript
import { createClient } from '@/lib/supabase/client'
import { Car } from '@/lib/types/database.types'
```

### Next.js Image Configuration

Remote images are allowed from:
- `images.unsplash.com` (car images)
- `*.supabase.co` (Supabase Storage)

Add new domains in `next.config.js` if needed.

---

## Common Development Workflows

### Adding a New Server Action

1. Create the function in appropriate file in `app/actions/`
2. Add `'use server'` directive at the top of the file
3. Verify authentication with `await supabase.auth.getUser()`
4. Perform database operation
5. Return `{ success: boolean, data?, error? }`
6. Call from client component with `action={serverAction}` or `await serverAction()`

### Creating a New Admin Page

1. Create page in `app/admin/[feature]/page.tsx`
2. Verify admin role at the top of the component
3. Fetch data using server-side Supabase client
4. Return JSX with admin layout
5. Use admin components from `components/admin/`

### Adding a New Car Category

1. Update `category` type in `lib/types/database.types.ts`
2. Add option in `FilterPanel` component
3. Update `getUniqueCategories()` and `countByCategory()` in `lib/filters.ts` if needed
4. Add category to car creation form in `components/admin/CarForm.tsx`

### Modifying Email Templates

1. Edit the HTML template in `lib/email.ts`
2. Maintain dark theme (#111111 background)
3. Test email locally by triggering the corresponding action
4. Check Resend dashboard for delivery status

---

## Important Notes

- **Database queries**: Always use the appropriate Supabase client (server vs client)
- **Authentication checks**: Never skip auth verification in server actions or protected routes
- **Booking dates**: Always check for overlapping bookings before creating/updating
- **Admin operations**: Always verify admin role before allowing modifications to cars/users/bookings
- **Email sending**: Wrapped in try-catch to prevent blocking main operations
- **Environment variables**: `NEXT_PUBLIC_*` variables are exposed to the browser
- **Date formatting**: Use `date-fns` for consistent French date formatting
- **Animations**: Framer Motion is used for page transitions and grid animations
- **Mobile navigation**: Bottom navigation bar appears on mobile devices
- **Dark theme**: Application uses dark mode throughout with custom Tailwind colors

---

## References

- **Next.js 14 Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Resend Docs**: [resend.com/docs](https://resend.com/docs)
- **React Email**: [react.email/docs](https://react.email/docs)
- **Email System**: See `docs/EMAILS_README.md` for detailed email documentation
- **Main README**: See `docs/README.md` for project overview and setup guide
