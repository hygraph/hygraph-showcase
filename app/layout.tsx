/**
 * Root Layout - Handles dynamic theme injection from Hygraph
 * Fetches SiteSettings.brandColor and generates CSS variables
 * for runtime theme updates without rebuilding
 */

import type { Metadata } from 'next';
import '@/styles/globals.css';
import { hygraphRequest } from '@/lib/hygraph/client';
import {
  GetSiteSettingsDocument,
  type GetSiteSettingsQuery,
  type GetSiteSettingsQueryVariables,
} from '@/types/hygraph-generated';
import { generateThemeVariables, themeVariablesToCSS } from '@/lib/utils/theme';
import ThemeProvider from '@/components/providers/ThemeProvider';

export const metadata: Metadata = {
  title: 'HyBike - Electric Bikes for Every Journey',
  description: 'Discover premium electric bikes designed for urban commuting, mountain trails, and comfortable rides.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch site settings to get brandColor
  let brandColor = '#0EA5E9'; // Default sky blue
  let siteName = 'HyBike';

  try {
    const data = await hygraphRequest<GetSiteSettingsQuery>(GetSiteSettingsDocument, {
      locale: 'en',
    } as GetSiteSettingsQueryVariables);

    if (data.allSiteSettings && data.allSiteSettings.length > 0) {
      const settings = data.allSiteSettings[0];
      brandColor = settings.brandColor || brandColor;
      siteName = settings.siteName || siteName;
    }
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    // Continue with defaults
  }

  // Generate theme CSS variables from brandColor
  const themeVars = generateThemeVariables(brandColor);
  const themeCSS = themeVariablesToCSS(themeVars);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inject dynamic theme CSS variables */}
        <style
          dangerouslySetInnerHTML={{
            __html: `:root { ${themeCSS} }`,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
