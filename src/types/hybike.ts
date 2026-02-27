/**
 * Shared UI types for hybikes view components.
 * These are hand-written types that mirror the Hygraph schema fields
 * queried in src/graphql/queries/. After running codegen (Phase 3),
 * these can be replaced with generated types from hygraph-generated.ts.
 */

export interface Bike {
  id: string;
  slug: string;
  name: string;
  tagline?: string | null;
  bikeCategory?: string | null; // BikeCategory enum: ROAD | URBAN | ELECTRIC | GRAVEL
  imageUrl?: string | null;
  productFeatures?: string[] | null;
  specifications?: {
    frame?: string | null;
    weight?: string | null;
    groupset?: string | null;
    wheels?: string | null;
  } | null;
  externalProduct?: {
    data?: {
      calculated_price?: number | null;
      sale_price?: number | null;
      inventory_level?: number | null;
      availability?: string | null;
    } | null;
  } | null;
  featured?: boolean | null;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  category: string;
  publishedDate: string;
  readTime?: string | null;
  summary: string;
  imageUrl?: string | null;
  body?: { html: string } | null;
}

export interface Job {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  jobType: string;
  summary: string;
  description?: { html: string } | null;
  responsibilities?: string[] | null;
  requirements?: string[] | null;
  niceToHave?: string[] | null;
}

/** Maps Hygraph BikeCategory enum values to display labels. */
export function formatBikeCategory(category: string | null | undefined): string {
  if (!category) return '';
  const map: Record<string, string> = {
    ROAD: 'Road',
    URBAN: 'Urban',
    ELECTRIC: 'Electric',
    GRAVEL: 'Gravel',
  };
  return map[category] ?? category;
}

/** Formats a price number as a Euro string. Returns '—' if price is null/undefined. */
export function formatPrice(price: number | null | undefined): string {
  if (price == null) return '—';
  return `€${Number(price).toLocaleString('en-EU')}`;
}
