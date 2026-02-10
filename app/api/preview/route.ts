/**
 * Preview API Route - Enables Hygraph Live Preview
 * Sets preview cookie and redirects to the page being previewed
 */

import { NextRequest, NextResponse } from 'next/server';
import { PREVIEW_COOKIE_NAME } from '@/lib/utils/preview';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  // Validate secret to prevent unauthorized preview access
  const secret = searchParams.get('secret');
  const expectedSecret = process.env.HYGRAPH_PREVIEW_SECRET;

  if (!secret || secret !== expectedSecret) {
    return NextResponse.json(
      { error: 'Invalid preview secret' },
      { status: 401 }
    );
  }

  // Get preview parameters
  const slug = searchParams.get('slug') || 'home';
  const locale = searchParams.get('locale') || 'en';

  // Construct preview URL
  const previewUrl = `/${locale}/${slug === 'home' ? '' : slug}`;

  // Create response with redirect
  const response = NextResponse.redirect(new URL(previewUrl, request.url));

  // Set preview cookie with preview data
  const previewData = JSON.stringify({ locale, slug });
  response.cookies.set(PREVIEW_COOKIE_NAME, previewData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none', // Required for Hygraph iframe
    maxAge: 60 * 60, // 1 hour
  });

  return response;
}
