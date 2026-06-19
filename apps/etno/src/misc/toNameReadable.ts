import type { PersonOrOriginator } from '@/api';

const resolveDisplayName = (entry: PersonOrOriginator): string | undefined => {
  if ('display_name' in entry && entry.display_name) return entry.display_name;
  if ('label' in entry && entry.label) return entry.label;
  if ('person' in entry) return entry.person?.display_name;
  return undefined;
};

export const toNameReadable = (people: PersonOrOriginator[] | undefined): string | null => {
  if (!people) {
    return null;
  }
  return people.map(resolveDisplayName).filter(Boolean).join(' · ') || null;
};
