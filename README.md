# HyBike Frontend - Next.js 15 with Hygraph CMS

A modern, performant Next.js 15 frontend showcasing **dynamic theming from Hygraph CMS**. Content editors can change the entire site theme by updating a single color field in the CMS - no rebuild required.

## Key Features

✅ **Dynamic Theming** - Brand color from Hygraph drives entire site theme via CSS variables
✅ **Multi-locale** - 4 languages (en, de, fr, es) with path-based routing
✅ **Live Preview** - Real-time content updates with Hygraph SDK
✅ **Content Federation** - Product data from BigCommerce/PIM
✅ **Type-Safe** - Strict TypeScript with GraphQL codegen
✅ **Server Components** - Fast rendering with Next.js 15 App Router
✅ **ISR Caching** - 5-minute revalidation for optimal performance

## Dynamic Theming System

The **primary feature** of this frontend is runtime theme customization:

1. **Hygraph SiteSettings** → `brandColor` field (hex color)
2. **Root Layout** → Fetches brandColor on each request
3. **Theme Utils** → Converts hex to HSL, generates color variants
4. **CSS Variables** → Injected into `:root` via `<style>` tag
5. **Tailwind** → References CSS variables (`bg-brand`, `text-brand`)
6. **Components** → Use Tailwind classes, automatically themed

**Result**: Change `brandColor` in Hygraph → entire site theme updates instantly (no rebuild needed)

## Getting Started

### Prerequisites

- Node.js 18+
- Access to Hygraph project with seeded content
- Environment variables (see below)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your Hygraph credentials
```

### Environment Variables

Create `.env.local`:

```bash
# Hygraph CMS Configuration
NEXT_PUBLIC_HYGRAPH_CONTENT_ENDPOINT=https://eu-central-1-staging.cdn.hygraph.com/content/YOUR_PROJECT_ID/master
HYGRAPH_PREVIEW_TOKEN=your_preview_token_here
HYGRAPH_PREVIEW_SECRET=your_preview_secret_here

# Optional
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Get these values from your Hygraph project:
- **Endpoint**: Project Settings → API Access → Content API
- **Preview Token**: Project Settings → API Access → Permanent Auth Tokens (create one with "Read" permissions)
- **Preview Secret**: Any secure random string (for preview mode validation)

### Development

```bash
# Start dev server
npm run dev

# Open http://localhost:3000/en
```

### Build & Deploy

```bash
# Type check
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Locale-specific routes
│   │   ├── layout.tsx            # Locale layout with Nav/Footer
│   │   ├── page.tsx              # Homepage
│   │   ├── [slug]/page.tsx       # Dynamic pages
│   │   └── products/             # Product line pages
│   ├── api/                      # API routes
│   │   ├── preview/route.ts      # Enable preview mode
│   │   └── exit-preview/route.ts # Disable preview mode
│   ├── layout.tsx                # Root layout with theme injection ⭐
│   └── not-found.tsx             # 404 page
├── src/
│   ├── components/
│   │   ├── ui/                   # UI components (Button, Navigation, Footer)
│   │   ├── sections/             # Page sections (Hero, Features, etc.)
│   │   └── preview/              # Live Preview wrapper
│   ├── lib/
│   │   ├── hygraph/
│   │   │   ├── client.ts         # GraphQL client
│   │   │   └── queries/          # GraphQL queries
│   │   └── utils/
│   │       ├── theme.ts          # Theme utilities ⭐
│   │       ├── locale.ts         # Locale utilities
│   │       └── preview.ts        # Preview mode utilities
│   ├── types/                    # TypeScript types
│   └── styles/
│       └── globals.css           # Tailwind + global styles
├── middleware.ts                 # Locale routing
├── tailwind.config.ts            # Tailwind with CSS variables ⭐
└── codegen.yml                   # GraphQL Code Generator config
```

## How Dynamic Theming Works

### 1. Root Layout Fetches Brand Color

```typescript
// app/layout.tsx
export default async function RootLayout({ children }) {
  const data = await hygraphRequest(SITE_SETTINGS_QUERY, { locale: 'en' });
  const brandColor = data.siteSettings.brandColor; // e.g., "#0EA5E9"

  // Generate CSS variables
  const themeVars = generateThemeVariables(brandColor);
  // Result: { '--color-brand-primary': '199 89% 48%', ... }

  return (
    <html>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `:root { ${themeVariablesToCSS(themeVars)} }`
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 2. Tailwind References CSS Variables

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'hsl(var(--color-brand-primary))',
          hover: 'hsl(var(--color-brand-hover))',
          // ...
        },
      },
    },
  },
};
```

### 3. Components Use Tailwind Classes

```typescript
// src/components/ui/Button.tsx
<button className="bg-brand hover:bg-brand-hover text-white">
  {label}
</button>
```

**Result**: Update `SiteSettings.brandColor` in Hygraph → All buttons, links, and branded elements update to new color

## Testing Dynamic Theming

1. Start dev server: `npm run dev`
2. Visit http://localhost:3000/en
3. Observe current theme (default: cyan #0EA5E9)
4. In Hygraph UI:
   - Go to Content → Site Settings
   - Change `brandColor` to `#FF6B35` (orange)
   - Publish changes
5. Refresh browser
6. ✅ Entire site is now orange-themed (buttons, links, etc.)

## Multi-locale Support

Supports 4 locales with fallback chain:

- **English (en)** - Primary locale
- **German (de)**
- **French (fr)**
- **Spanish (es)**

### URL Structure

- `/` → Redirects to `/en` (middleware)
- `/en/home` → English homepage
- `/de/startseite` → German homepage
- `/fr/accueil` → French homepage
- `/es/inicio` → Spanish homepage

### Query Pattern

All Hygraph queries use locale fallback:

```graphql
query GetPage($slug: String!, $locale: Locale!) {
  page(where: { slug: $slug }, locales: [$locale, en]) {
    # Falls back to English if translation missing
  }
}
```

## Live Preview Mode

Enable real-time content editing from Hygraph:

1. **In Hygraph**: Click "Preview" on any content entry
2. **Opens**: `http://localhost:3000/api/preview?secret=XXX&slug=home&locale=en`
3. **Sets**: Preview cookie with locale/slug data
4. **Result**: Content updates in real-time as you edit in Hygraph

### Preview Banner

When in preview mode, a red banner appears:

```
🔴 Live Preview Mode - Content updates in real-time [Exit Preview]
```

### Exit Preview

Visit `/api/exit-preview` or click "Exit Preview" banner link

## Content Federation (BigCommerce)

The `ProductShowcase` section demonstrates Content Federation:

- Product SKUs stored in Hygraph (`ProductLine.productSkus`)
- Product details (price, images, stock) fetched from BigCommerce Remote Source
- Updates in BigCommerce appear on site (subject to cache TTL)

**Note**: Mock data used in initial implementation. Full Remote Source integration requires Hygraph Remote Source configuration.

## Page Sections

All pages use flexible section composition:

### Available Sections

- **HeroSection** - Full-width banner with background image, headline, CTAs
- **FeatureGrid** - 2/3/4 column grid of features with icons
- **TestimonialCarousel** - Auto-rotating customer testimonials
- **CTABlock** - Conversion-focused section with headline + buttons
- **ProductShowcase** - Product grid with federated data

### Section Rendering

Pages fetch sections as union field:

```typescript
// app/[locale]/page.tsx
{data.page.sections.map((section) => {
  if (isHeroSection(section)) return <HeroSection {...section} />;
  if (isFeatureGrid(section)) return <FeatureGrid {...section} />;
  // ...
})}
```

Type-safe with custom type guards

## GraphQL Queries

All queries in `src/lib/hygraph/queries/`:

- `site-settings.ts` - Global settings (brandColor, logo, social links)
- `navigation.ts` - Site navigation (main nav, footer nav)
- `pages.ts` - Page content with sections
- `product-lines.ts` - Product line landing pages

### GraphQL Code Generation

Generate TypeScript types from schema:

```bash
npm run codegen
```

Outputs to `src/types/hygraph-generated.ts`

## Performance

- **Server Components** - All data fetching on server
- **ISR Caching** - 5-minute revalidation (`revalidate: 300`)
- **Image Optimization** - Next.js Image component with Hygraph CDN
- **Selective Hydration** - Client components only where needed (carousel, locale switcher)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Build output uses standalone mode:

```bash
npm run build
npm start
```

Requires Node.js 18+ runtime

## Type Safety

- **Strict TypeScript** - `strict: true`, no `any` types
- **GraphQL Codegen** - Generated types for all queries
- **Interface Extensions** - All query variables extend `Record<string, unknown>`
- **Type Guards** - Custom guards for union types (PageSection)

Run type check:

```bash
npm run type-check
```

## Development Tips

### Hot Reload

Next.js 15 Fast Refresh works for:
- Component changes
- Page route changes
- Tailwind class changes

**Does NOT hot reload**:
- Root layout changes (requires restart)
- Middleware changes (requires restart)
- CSS variable changes (requires full page refresh)

### Preview Mode Cookies

If preview mode gets stuck:
1. Open DevTools → Application → Cookies
2. Delete `hygraph-preview-mode` cookie
3. Or visit `/api/exit-preview`

### Tailwind IntelliSense

Install "Tailwind CSS IntelliSense" VS Code extension for autocomplete of `bg-brand`, `text-brand`, etc.

## Troubleshooting

### Theme Not Updating

**Problem**: Changed `brandColor` in Hygraph but site theme unchanged

**Solutions**:
- In dev mode: Hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)
- In production: Wait 5 minutes for cache revalidation
- In preview mode: Should update immediately

### Type Errors After Schema Changes

**Problem**: TypeScript errors after updating Hygraph schema

**Solution**:
```bash
npm run codegen  # Regenerate types
npm run type-check  # Verify
```

### Preview Mode Not Working

**Problem**: Preview link shows published content, not draft

**Solutions**:
- Verify `HYGRAPH_PREVIEW_SECRET` matches query param `?secret=XXX`
- Check preview cookie is set (DevTools → Application → Cookies)
- Ensure `HYGRAPH_PREVIEW_TOKEN` has read permissions

### Build Errors

**Problem**: Build fails with GraphQL errors

**Solution**:
- Verify `.env.local` has correct `NEXT_PUBLIC_HYGRAPH_CONTENT_ENDPOINT`
- Check Hygraph API is accessible
- Ensure all content is published (or use preview token)

## Contributing

This is a demo/starter project. Key areas for enhancement:

1. **Full Live Preview SDK** - Complete Hygraph SDK integration for click-to-edit
2. **Content Federation** - Real BigCommerce Remote Source integration
3. **Animations** - Framer Motion for section transitions
4. **SEO** - Enhanced metadata, structured data, sitemap
5. **Analytics** - Google Analytics/Plausible integration
6. **Error Boundaries** - React Error Boundaries for resilience
7. **Loading States** - Skeleton screens for better UX

## License

MIT

## Resources

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Hygraph Docs](https://hygraph.com/docs)
- [Hygraph Live Preview SDK](https://hygraph.com/docs/guides/content/preview)
- [Tailwind CSS](https://tailwindcss.com)
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen)
