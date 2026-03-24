"use client";

import ErrorCard from "@/components/ErrorCard";
import { captureException } from "@sentry/nextjs";
import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-secondary text-primary">
      <div className="flex-1 flex items-center justify-center p-8">
        <ErrorCard error={error} reset={reset} />
      </div>
    </div>
  );
}
