/**
 * Hygraph GraphQL client with preview mode support
 * Uses graphql-request for efficient GraphQL queries
 */

import { GraphQLClient } from 'graphql-request';
import { type DocumentNode, print } from 'graphql';
import { isPreviewMode } from '@/lib/utils/preview';

const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_CONTENT_ENDPOINT;
const previewToken = process.env.HYGRAPH_PREVIEW_TOKEN;
// For demo/showcase: Always show DRAFT content (set to 'false' for production)
const alwaysUseDraft = process.env.NEXT_PUBLIC_HYGRAPH_ALWAYS_DRAFT === 'true';

if (!endpoint) {
  throw new Error('NEXT_PUBLIC_HYGRAPH_CONTENT_ENDPOINT is not defined');
}

/**
 * Creates a GraphQL client with appropriate configuration
 * @param preview - Whether to use preview mode (bypasses cache, uses auth token)
 */
export function createHygraphClient(preview: boolean = false): GraphQLClient {
  const headers: Record<string, string> = {};

  // Add authorization header for preview mode OR when always using draft
  const useDraft = preview || alwaysUseDraft;
  if (useDraft && previewToken) {
    headers.Authorization = `Bearer ${previewToken}`;
  }

  return new GraphQLClient(endpoint!, {
    headers,
    // In preview/draft mode, bypass cache to get latest unpublished content
    next: useDraft ? { revalidate: 0 } : { revalidate: 300 }, // 5 minutes cache for production
  });
}

/**
 * Gets the appropriate Hygraph client based on current mode
 * Automatically detects preview mode from cookies
 */
export async function getHygraphClient(): Promise<GraphQLClient> {
  const preview = await isPreviewMode();
  return createHygraphClient(preview);
}

/**
 * Type-safe request wrapper that automatically handles preview mode
 * @param query - GraphQL query string or DocumentNode from codegen
 * @param variables - Query variables
 * @param preview - Optional override for preview mode (defaults to auto-detect)
 */
export async function hygraphRequest<T>(
  query: string | DocumentNode,
  variables?: Record<string, unknown>,
  preview?: boolean
): Promise<T> {
  const isPreview = preview ?? (await isPreviewMode());
  const client = createHygraphClient(isPreview);

  // Convert DocumentNode to string if needed
  const queryString = typeof query === 'string' ? query : print(query);

  return client.request<T>(queryString, variables);
}
