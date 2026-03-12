import type { RangeValue } from '@metafori/components';
import type { FilterSection } from './filterTypes';

export const filterSections: FilterSection[] = [
  {
    title: 'Geografické filtre',
    icon: 'mapPin',
    items: [
      {
        id: 'municipality',
        label: 'Obce',
        type: 'checkbox',
        defaultValue: <string[]>[],
        options: [
          { value: 'bratislava', label: 'Bratislava' },
          { value: 'kosice', label: 'Košice' },
          { value: 'nitra', label: 'Nitra' },
          { value: 'presov', label: 'Prešov' },
          { value: 'trencin', label: 'Trenčín' },
        ],
      },
      {
        id: 'cadastral_area',
        label: 'Kataster',
        type: 'checkbox',
        defaultValue: <string[]>[],
        options: [
          { value: 'stare_mesto', label: 'Staré Mesto' },
          { value: 'ruzinov', label: 'Ružinov' },
          { value: 'petrzalka', label: 'Petržalka' },
          { value: 'dubravka', label: 'Dúbravka' },
          { value: 'karlova_ves', label: 'Karlova Ves' },
        ],
      },
      {
        id: 'district',
        label: 'Okres',
        type: 'checkbox',
        defaultValue: <string[]>[],
        options: [
          { value: 'ba1', label: 'Bratislava I' },
          { value: 'ba2', label: 'Bratislava II' },
          { value: 'ba3', label: 'Bratislava III' },
          { value: 'trnava', label: 'Trnava' },
          { value: 'nitra', label: 'Nitra' },
        ],
      },
      {
        id: 'date',
        label: 'Datovanie',
        type: 'range',
        defaultValue: <RangeValue>{
          min: 1920,
          max: 2025,
        },
        options: [
          { value: 'paleolit', label: 'Paleolit' },
          { value: 'neolit', label: 'Neolit' },
          { value: 'doba_bronzova', label: 'Doba bronzová' },
          { value: 'doba_zelezna', label: 'Doba železná' },
          { value: 'stredovek', label: 'Stredovek' },
        ],
      },
    ],
  },
  {
    title: 'Inštitucionálne filtre',
    icon: 'city',
    items: [
      {
        id: 'author_vs',
        label: 'Autor VS',
        type: 'checkbox',
        defaultValue: <string[]>[],
        options: [
          { value: 'novak', label: 'Novák Ján' },
          { value: 'horvath', label: 'Horváth Peter' },
          { value: 'kovac', label: 'Kováč Martin' },
          { value: 'varga', label: 'Varga Štefan' },
        ],
      },
      {
        id: 'institution',
        label: 'Inštitúcia',
        type: 'checkbox',
        defaultValue: <string[]>[],
        options: [
          { value: 'sau', label: 'Slovenská akadémia vied' },
          { value: 'mus_ba', label: 'Mestské múzeum Bratislava' },
          { value: 'pu', label: 'Pamiatkový úrad SR' },
          { value: 'uk', label: 'Univerzita Komenského' },
          { value: 'tuke', label: 'Technická univerzita Košice' },
        ],
      },
      {
        id: 'research_leader',
        label: 'Vedúci výskumu',
        type: 'checkbox',
        defaultValue: <string[]>[],
        options: [
          { value: 'malik', label: 'Malík Róbert' },
          { value: 'blaho', label: 'Blaho Michal' },
          { value: 'sedlak', label: 'Sedlák Tomáš' },
          { value: 'urban', label: 'Urban Lukáš' },
        ],
      },
      {
        id: 'research_year',
        label: 'Rok výskumu',
        type: 'checkbox',
        defaultValue: <string[]>[],
        options: [
          { value: '2020', label: '2020' },
          { value: '2021', label: '2021' },
          { value: '2022', label: '2022' },
          { value: '2023', label: '2023' },
          { value: '2024', label: '2024' },
        ],
      },
    ],
  },
];
