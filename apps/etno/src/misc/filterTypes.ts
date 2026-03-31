import type { IconName, RangeValue } from '@metafori/components';

export interface FilterOption {
  value: string
  label: string
}

export interface FilterItem {
  id: string
  label: string
  type: string
  defaultValue: string[] | RangeValue
  options?: FilterOption[]
  enumNamespace?: string
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
