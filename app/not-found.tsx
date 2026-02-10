/**
 * 404 Not Found Page
 */

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/en"
          className="inline-flex items-center justify-center rounded-lg bg-brand px-6 py-3 text-white font-semibold hover:bg-brand-hover transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
