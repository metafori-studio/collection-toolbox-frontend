type Person = { display_name: string; family_name?: string; given_name?: string };
type Originator = { label?: string; person?: Person };
type PersonOrOriginator = Person | Originator;

const resolveDisplayName = (entry: PersonOrOriginator): string | undefined => {
  if ('display_name' in entry) return entry.display_name;
  if ('label' in entry) return entry.label;
  if ('person' in entry) return entry.person?.display_name;
  return undefined;
};

export const toNameReadable = (people: PersonOrOriginator[] | undefined): string | null => {
  if (!people) {
    return null;
  }
  return people.map(resolveDisplayName).filter(Boolean).join(' · ') || null;
};
