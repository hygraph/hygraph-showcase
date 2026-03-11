"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, RotateCcw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-secondary text-primary">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-lg w-full border border-primary">
          {/* Headline */}
          <div className="p-8 md:p-12 border-b border-primary">
            <p
              className="uppercase tracking-[0.2em] text-muted mb-3"
              style={{ fontSize: "0.65rem", fontWeight: 700 }}
            >
              Error
            </p>
            <h2 className="mb-0">
              Something went wrong<span className="text-accent">.</span>
            </h2>
          </div>

          {/* Message */}
          <div className="p-8 md:p-12 border-b border-primary">
            <p className="text-muted" style={{ lineHeight: 1.7 }}>
              We couldn&apos;t load the page. This might be a temporary issue
              with our content service.
            </p>
          </div>

          {/* Actions */}
          <div className="p-8 md:p-12 border-b border-primary flex gap-4">
            <button
              onClick={reset}
              className="flex-1 bg-primary text-secondary py-4 px-6 uppercase tracking-[0.15em] hover:bg-primary/90 transition-colors flex items-center justify-center gap-3"
              style={{ fontSize: "0.8rem", fontWeight: 700 }}
            >
              <RotateCcw size={16} />
              Try again
            </button>
            <a
              href="/"
              className="flex-1 bg-accent text-white py-4 px-6 uppercase tracking-[0.15em] hover:bg-accent/90 transition-colors flex items-center justify-center gap-3"
              style={{ fontSize: "0.8rem", fontWeight: 700 }}
            >
              Go home
              <ArrowRight size={16} />
            </a>
          </div>

          {/* Collapsible error details */}
          <div className="p-8 md:p-12">
            <button
              onClick={() => setShowDetails((v) => !v)}
              className="flex items-center gap-2 text-muted hover:text-primary transition-colors uppercase tracking-[0.15em]"
              style={{ fontSize: "0.65rem", fontWeight: 700 }}
            >
              Error details
              <ChevronDown
                size={14}
                className={`transition-transform ${
                  showDetails ? "rotate-180" : ""
                }`}
              />
            </button>
            {showDetails && (
              <pre
                className="mt-4 p-4 bg-primary/5 border border-primary/20 overflow-auto text-muted"
                style={{ fontSize: "0.75rem", lineHeight: 1.6 }}
              >
                {error.message}
                {error.digest && `\n\nDigest: ${error.digest}`}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
