// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://e6904982ecd0a6d080afd223fb66fa90@o4508006286491648.ingest.de.sentry.io/4511098633977936",

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

function getClientCookie(name: string): string | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }

  return document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
    ?.split("=")
    .slice(1)
    .join("=");
}

Sentry.addEventProcessor((event) => {
  const endpointCookie = getClientCookie("hygraph-endpoint");
  const hasPreviewCookie = Boolean(getClientCookie("hygraph-preview-mode"));
  const isInIframe =
    typeof window !== "undefined" && window.self !== window.top;

  event.extra = {
    ...event.extra,
    hygraph_endpoint:
      endpointCookie ?? process.env.NEXT_PUBLIC_HYGRAPH_CONTENT_ENDPOINT ?? "",
    live_preview: hasPreviewCookie || isInIframe,
  };

  return event;
});
