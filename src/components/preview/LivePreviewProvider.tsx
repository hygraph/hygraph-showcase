/**
 * Live Preview Provider - Wraps content with Hygraph Live Preview SDK
 * Enables real-time content updates and click-to-edit functionality
 */

'use client';

import { useEffect } from 'react';

interface LivePreviewProviderProps {
  children: React.ReactNode;
  isPreview: boolean;
}

/**
 * Wraps page content to enable Live Preview when in preview mode
 * The Hygraph Live Preview SDK will be initialized here
 */
export default function LivePreviewProvider({ children, isPreview }: LivePreviewProviderProps) {
  useEffect(() => {
    if (!isPreview) return;

    // TODO: Initialize Hygraph Live Preview SDK
    // import { HygraphLivePreview } from '@hygraph/live-preview-sdk';
    //
    // const preview = new HygraphLivePreview({
    //   endpoint: process.env.NEXT_PUBLIC_HYGRAPH_CONTENT_ENDPOINT,
    //   token: process.env.HYGRAPH_PREVIEW_TOKEN,
    // });
    //
    // preview.init();

    console.log('Live Preview mode enabled');

    // Cleanup
    return () => {
      console.log('Live Preview mode disabled');
    };
  }, [isPreview]);

  // Show preview indicator when in preview mode
  if (isPreview) {
    return (
      <>
        <div className="fixed top-0 left-0 right-0 z-50 bg-brand text-white text-center py-2 text-sm font-medium">
          🔴 Live Preview Mode - Content updates in real-time
          <a
            href="/api/exit-preview"
            className="ml-4 underline hover:no-underline"
          >
            Exit Preview
          </a>
        </div>
        <div className="pt-10">{children}</div>
      </>
    );
  }

  return <>{children}</>;
}
