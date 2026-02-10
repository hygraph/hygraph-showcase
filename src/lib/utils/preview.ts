/**
 * Preview mode utilities for Hygraph Live Preview
 */

import { cookies } from 'next/headers';

export const PREVIEW_COOKIE_NAME = 'hygraph-preview-mode';

/**
 * Checks if the request is in preview mode
 * Looks for preview cookie set by preview API route
 * Returns false during build time to allow static generation
 */
export async function isPreviewMode(): Promise<boolean> {
  // During build time, cookies() throws, so we catch and return false
  try {
    const cookieStore = await cookies();
    return cookieStore.has(PREVIEW_COOKIE_NAME);
  } catch {
    // Build time - no preview mode
    return false;
  }
}

/**
 * Gets preview data from cookie if in preview mode
 */
export async function getPreviewData(): Promise<{
  locale?: string;
  slug?: string;
} | null> {
  try {
    const cookieStore = await cookies();
    const previewCookie = cookieStore.get(PREVIEW_COOKIE_NAME);

    if (!previewCookie) return null;

    try {
      return JSON.parse(previewCookie.value);
    } catch {
      return null;
    }
  } catch {
    // Build time - no preview data
    return null;
  }
}
