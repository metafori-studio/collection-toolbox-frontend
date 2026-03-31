import type { FilterSection } from './filterTypes';

export const filterSections: FilterSection[] = [
  {
    title: 'filter.sections.thematicAndAuthor',
    icon: 'tag',
    items: [
      {
        id: 'keyword.id',
        label: 'filter.items.keywords',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
      {
        id: 'research_collection.id',
        label: 'filter.items.researchCollection',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
      {
        id: 'author.person_id',
        label: 'filter.items.author',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
    ],
  },
  {
    title: 'filter.sections.geographic',
    icon: 'mapPin',
    items: [
      {
        id: 'municipality.id',
        label: 'filter.items.municipality',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
      {
        id: 'district.id',
        label: 'filter.items.district',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
      {
        id: 'region.id',
        label: 'filter.items.region',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
      {
        id: 'country.id',
        label: 'filter.items.country',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
    ],
  },
  {
    title: 'filter.sections.formalAndTechnical',
    icon: 'document',
    items: [
      {
        id: 'type',
        label: 'filter.items.documentType',
        type: 'checkbox',
        defaultValue: <string[]>[],
        enumNamespace: 'ItemType',
      },
      {
        id: 'collection_method',
        label: 'filter.items.collectionMethod',
        type: 'checkbox',
        defaultValue: <string[]>[],
        enumNamespace: 'CollectionMethod',
      },
      {
        id: 'language',
        label: 'filter.items.language',
        type: 'checkbox',
        defaultValue: <string[]>[],
        enumNamespace: 'Language',
      },
    ],
  },

];
