// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { headers } from "next/headers";
import {
  HYGRAPH_ENDPOINT_HEADER_NAME,
  parseAndValidateHygraphEndpoint,
} from "@/lib/hygraph/endpoint";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});

Sentry.addEventProcessor(async (event) => {
  let hygraphEndpoint = process.env.NEXT_PUBLIC_HYGRAPH_CONTENT_ENDPOINT ?? "";
  try {
    const headerStore = await headers();
    const override = parseAndValidateHygraphEndpoint(
      headerStore.get(HYGRAPH_ENDPOINT_HEADER_NAME)
    );
    if (override) {
      hygraphEndpoint = override;
    }
  } catch {
    // Build time or no request context — use env var fallback
  }

  event.extra = {
    ...event.extra,
    hygraph_endpoint: hygraphEndpoint,
  };
  return event;
});
