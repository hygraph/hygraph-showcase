/**
 * Section type adapters that convert GraphQL generated types (with | null)
 * to component prop types (with | undefined)
 *
 * GraphQL uses null for nullable fields, but TypeScript components prefer undefined
 */

import type { GetPageQuery } from './hygraph-generated';

// Extract section union from generated query
export type PageSection = NonNullable<GetPageQuery['pages'][0]>['sections'][0];

// Convert null to undefined for component props
export type NullToUndefined<T> = T extends null
  ? undefined
  : T extends object
  ? { [K in keyof T]: NullToUndefined<T[K]> }
  : T;

// Helper to convert generated types to component-friendly types
export function nullToUndefined<T>(value: T): NullToUndefined<T> {
  if (value === null) return undefined as NullToUndefined<T>;
  if (typeof value !== 'object') return value as NullToUndefined<T>;
  if (Array.isArray(value)) {
    return value.map(nullToUndefined) as NullToUndefined<T>;
  }
  const result: any = {};
  for (const key in value) {
    result[key] = nullToUndefined(value[key]);
  }
  return result as NullToUndefined<T>;
}
