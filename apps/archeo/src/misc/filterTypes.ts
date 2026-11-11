import type { IconName, RangeValue } from '@metafori/components';

export interface FilterItem {
  id: string
  label: string
  type: string
  defaultValue: string[] | RangeValue
}

export interface FilterSection {
  title: string
  icon: IconName
  items: FilterItem[]
}

export interface AggregationOption {
  label: string
  value: string
  id?: string
  count?: number
}
