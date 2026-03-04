"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const HygraphPreview = dynamic(
  () =>
    import("@hygraph/preview-sdk/react").then((mod) => ({
      default: mod.HygraphPreview,
    })),
  { ssr: false }
);

export function LivePreview({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <HygraphPreview
      endpoint={process.env.NEXT_PUBLIC_HYGRAPH_CONTENT_ENDPOINT as string}
      onSave={() => router.refresh()}
      studioUrl="https://studio-eu-central-1-staging.hygraph.com"
      debug={process.env.NODE_ENV === "development"}
      sync={{
        fieldFocus: true,
        fieldUpdate: true,
      }}
    >
      {children}
    </HygraphPreview>
  );
}
