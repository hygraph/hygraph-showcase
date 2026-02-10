'use client';

import { useState } from 'react';
import { useAudience, type Audience } from '@/lib/context/AudienceContext';

const AUDIENCE_LABELS: Record<Audience, string> = {
  DEFAULT: '👤 Default',
  COMMUTERS: '🚴 Commuters',
  SPORTS_ENTHUSIASTS: '🏆 Sports Enthusiasts',
};

export default function AudienceSwitcher() {
  const { audience, setAudience } = useAudience();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className="bg-white rounded-lg shadow-lg border border-gray-200"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
        >
          <span>🎭</span>
          <span className="hidden sm:inline">Demo Variant:</span>
          <span className="font-semibold text-brand">{AUDIENCE_LABELS[audience]}</span>
          <svg
            className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="border-t border-gray-200">
            {(Object.keys(AUDIENCE_LABELS) as Audience[]).map((aud) => (
              <button
                key={aud}
                onClick={() => {
                  setAudience(aud);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-none last:rounded-b-lg ${
                  aud === audience ? 'bg-brand-light text-brand font-semibold' : 'text-gray-700'
                }`}
              >
                {AUDIENCE_LABELS[aud]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
