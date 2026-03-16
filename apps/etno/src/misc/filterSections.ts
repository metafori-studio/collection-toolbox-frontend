import type { FilterSection } from './filterTypes';

export const filterSections: FilterSection[] = [
  {
    title: 'Tematické a autorské údaje',
    icon: 'tag',
    items: [
      {
        id: 'keywords',
        label: 'Kľúčové údaje',
        type: 'checkbox',
        defaultValue: <string[]>[],
        options: [
          { value: 'tradicia', label: 'Tradícia' },
          { value: 'obrad', label: 'Obrad' },
          { value: 'hudba', label: 'Hudba' },
          { value: 'tanec', label: 'Tanec' },
          { value: 'remeslo', label: 'Remeslo' },
        ],
      },
      {
        id: 'collection',
        label: 'Výskumná zbierka',
        type: 'checkbox',
        defaultValue: <string[]>[],
        options: [
          { value: 'zbierka-a', label: 'Zbierka A' },
          { value: 'zbierka-b', label: 'Zbierka B' },
          { value: 'zbierka-c', label: 'Zbierka C' },
          { value: 'zbierka-d', label: 'Zbierka D' },
          { value: 'zbierka-e', label: 'Zbierka E' },
        ],
      },
      {
        id: 'author',
        label: 'Autor',
        type: 'checkbox',
        defaultValue: <string[]>[],
        options: [
          { value: 'jan-novak', label: 'Ján Novák' },
          { value: 'maria-kovacova', label: 'Mária Kováčová' },
          { value: 'peter-horvath', label: 'Peter Horváth' },
          { value: 'anna-vargova', label: 'Anna Vargová' },
          { value: 'stefan-malik', label: 'Štefan Malík' },
        ],
      },
    ],
  },
  {
    title: 'Geografické údaje',
    icon: 'mapPin',
    items: [
      {
        id: 'municipality',
        label: 'Obec',
        type: 'checkbox',
        defaultValue: <string[]>[],
        options: [
          { value: 'bratislava', label: 'Bratislava' },
          { value: 'kosice', label: 'Košice' },
          { value: 'nitra', label: 'Nitra' },
          { value: 'zilina', label: 'Žilina' },
          { value: 'banska-bystrica', label: 'Banská Bystrica' },
        ],
      },
      {
        id: 'district',
        label: 'Okres',
        type: 'checkbox',
        defaultValue: <string[]>[],
        options: [
          { value: 'okres-bratislava-i', label: 'Bratislava I' },
          { value: 'okres-kosice-i', label: 'Košice I' },
          { value: 'okres-nitra', label: 'Nitra' },
          { value: 'okres-zilina', label: 'Žilina' },
          { value: 'okres-banska-bystrica', label: 'Banská Bystrica' },
        ],
      },
      {
        id: 'region',
        label: 'Kraj',
        type: 'checkbox',
        defaultValue: <string[]>[],
        options: [
          { value: 'bratislavsky', label: 'Bratislavský kraj' },
          { value: 'trnavsky', label: 'Trnavský kraj' },
          { value: 'nitriansky', label: 'Nitriansky kraj' },
          { value: 'zilinsky', label: 'Žilinský kraj' },
          { value: 'kosicky', label: 'Košický kraj' },
        ],
      },
      {
        id: 'country',
        label: 'Štát',
        type: 'checkbox',
        defaultValue: <string[]>[],
        options: [
          { value: 'slovensko', label: 'Slovensko' },
          { value: 'cesko', label: 'Česko' },
          { value: 'madarsko', label: 'Maďarsko' },
          { value: 'rakusko', label: 'Rakúsko' },
          { value: 'polsko', label: 'Poľsko' },
        ],
      },
    ],
  },
  {
    title: 'Formálne a technické údaje',
    icon: 'document',
    items: [
      {
        id: 'doctype',
        label: 'Typ dokumentu',
        type: 'checkbox',
        defaultValue: <string[]>[],
        options: [
          { value: 'audio', label: 'Audio nahrávka' },
          { value: 'video', label: 'Video nahrávka' },
          { value: 'fotografia', label: 'Fotografia' },
          { value: 'rukopis', label: 'Rukopis' },
          { value: 'tlac', label: 'Tlačený dokument' },
        ],
      },
      {
        id: 'realization_time',
        label: 'Čas realizácie',
        type: 'checkbox',
        defaultValue: <string[]>[],
        options: [
          { value: 'pred-1950', label: 'Pred rokom 1950' },
          { value: '1950-1970', label: '1950 – 1970' },
          { value: '1971-1990', label: '1971 – 1990' },
          { value: '1991-2010', label: '1991 – 2010' },
          { value: 'po-2010', label: 'Po roku 2010' },
        ],
      },
      {
        id: 'collection_method',
        label: 'Spôsob zberu',
        type: 'checkbox',
        defaultValue: <string[]>[],
        options: [
          { value: 'terenny-vyskum', label: 'Terénny výskum' },
          { value: 'rozhovor', label: 'Rozhovor' },
          { value: 'dotaznik', label: 'Dotazník' },
          { value: 'pozorovanie', label: 'Pozorovanie' },
          { value: 'archivny-zber', label: 'Archívny zber' },
        ],
      },
      {
        id: 'language',
        label: 'Jazyk',
        type: 'checkbox',
        defaultValue: <string[]>[],
        options: [
          { value: 'slovensky', label: 'Slovenský' },
          { value: 'cesky', label: 'Český' },
          { value: 'madarsky', label: 'Maďarský' },
          { value: 'nemecky', label: 'Nemecký' },
          { value: 'romsky', label: 'Rómsky' },
        ],
      },
    ],
  },

];
