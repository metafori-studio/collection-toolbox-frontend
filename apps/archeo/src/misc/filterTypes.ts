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
}

export interface FilterSection {
  title: string
  icon: IconName
  items: FilterItem[]
}
