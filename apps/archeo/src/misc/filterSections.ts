import type { FilterSection } from './filterTypes';

export const filterSections: FilterSection[] = [
  {
    title: 'filter.sections.geographic',
    icon: 'mapPin',
    items: [
      {
        id: 'municipality',
        label: 'filter.items.municipality',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
      {
        id: 'cadastral_area',
        label: 'filter.items.cadastralArea',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
      {
        id: 'district',
        label: 'filter.items.district',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
      {
        id: 'dating_site_type',
        label: 'filter.items.dating',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
    ],
  },
  {
    title: 'filter.sections.institutional',
    icon: 'city',
    items: [
      {
        id: 'author_ns',
        label: 'filter.items.authorNs',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
      {
        id: 'institution',
        label: 'filter.items.institution',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
      {
        id: 'research_leader',
        label: 'filter.items.researchLeader',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
      {
        id: 'activity_year_start',
        label: 'filter.items.researchYear',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
    ],
  },
];
