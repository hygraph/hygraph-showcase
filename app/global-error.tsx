"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, RotateCcw } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            backgroundColor: "#F5F4F0",
            color: "#1A1A1A",
          }}
        >
          <div
            style={{
              maxWidth: "32rem",
              width: "100%",
              border: "1px solid #1A1A1A",
            }}
          >
            {/* Headline */}
            <div
              style={{
                padding: "2rem",
                borderBottom: "1px solid #1A1A1A",
              }}
            >
              <p
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  color: "#6B6B6B",
                  marginBottom: "0.75rem",
                }}
              >
                Error
              </p>
              <h1
                style={{
                  fontSize: "1.875rem",
                  fontWeight: 700,
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                Something went wrong
                <span style={{ color: "#CC4400" }}>.</span>
              </h1>
            </div>

            {/* Message */}
            <div
              style={{
                padding: "2rem",
                borderBottom: "1px solid #1A1A1A",
              }}
            >
              <p
                style={{
                  color: "#6B6B6B",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                We couldn&apos;t load the page. This might be a temporary issue
                with our content service.
              </p>
            </div>

            {/* Actions */}
            <div
              style={{
                padding: "2rem",
                borderBottom: "1px solid #1A1A1A",
                display: "flex",
                gap: "1rem",
              }}
            >
              <button
                onClick={reset}
                style={{
                  flex: 1,
                  backgroundColor: "#1A1A1A",
                  color: "#F5F4F0",
                  padding: "1rem 1.5rem",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                }}
              >
                <RotateCcw size={16} />
                Try again
              </button>
              <a
                href="/"
                style={{
                  flex: 1,
                  backgroundColor: "#CC4400",
                  color: "white",
                  padding: "1rem 1.5rem",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.75rem",
                }}
              >
                Go home
                <ArrowRight size={16} />
              </a>
            </div>

            {/* Collapsible error details */}
            <div style={{ padding: "2rem" }}>
              <button
                onClick={() => setShowDetails((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#6B6B6B",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Error details
                <ChevronDown
                  size={14}
                  style={{
                    transition: "transform 0.2s",
                    transform: showDetails ? "rotate(180deg)" : "rotate(0)",
                  }}
                />
              </button>
              {showDetails && (
                <pre
                  style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    backgroundColor: "rgba(26, 26, 26, 0.05)",
                    border: "1px solid rgba(26, 26, 26, 0.2)",
                    overflow: "auto",
                    color: "#6B6B6B",
                    fontSize: "0.75rem",
                    lineHeight: 1.6,
                  }}
                >
                  {error.message}
                  {error.digest && `\n\nDigest: ${error.digest}`}
                </pre>
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
