import type { FilterSection } from './filterTypes';

export const filterSections: FilterSection[] = [
  {
    title: 'Tematické a autorské údaje',
    icon: 'tag',
    items: [
      {
        id: 'keyword.id',
        label: 'Kľúčové údaje',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
      {
        id: 'research_collection.id',
        label: 'Výskumná zbierka',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
      {
        id: 'author.person_id',
        label: 'Autor',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
    ],
  },
  {
    title: 'Geografické údaje',
    icon: 'mapPin',
    items: [
      {
        id: 'municipality.id',
        label: 'Obec',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
      {
        id: 'district.id',
        label: 'Okres',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
      {
        id: 'region.id',
        label: 'Kraj',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
      {
        id: 'country.id',
        label: 'Štát',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
    ],
  },
  {
    title: 'Formálne a technické údaje',
    icon: 'document',
    items: [
      {
        id: 'type',
        label: 'Typ dokumentu',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
      {
        id: 'collection_method',
        label: 'Spôsob zberu',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
      {
        id: 'language',
        label: 'Jazyk',
        type: 'checkbox',
        defaultValue: <string[]>[],
      },
    ],
  },

];
