import type { LocationQueryValue } from 'vue-router';

export function queryString(value: LocationQueryValue | LocationQueryValue[] | undefined): string {
  return typeof value === 'string' ? value : '';
}
