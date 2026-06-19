export type ListItem = Record<string, unknown>
export type ListMeta = Record<string, unknown>

export type Person = {
  id: number
  given_name: string | null
  family_name: string | null
  display_name: string
  orcid: string | null
}

export type Originator = {
  id: number
  label: string | null
  person: Person | null
}

export type PersonOrOriginator = Person | Originator;

type DetailDistrict = {
  id: number
  name: string
  region?: {
    id: number
    name: string
    country?: { id: number; name: string }
  }
}

type DetailLocality = {
  id: number
  name: string
  district?: DetailDistrict
  parent?: DetailDistrict
}

type DetailMedia = {
  id: number
  name: string
  file_name: string
  human_readable_size: string
  mime_type: string
  url: string
  conversions: Record<string, string>
  transcript?: string | null
}

export type Detail = {
  id: string
  doi: string | null
  title: string
  subtitle: string | null
  abstract: string | null
  general_note: string | null
  content_note: string | null
  technical_note: string | null
  terms_of_use: string | null
  location_note: string | null
  type: string | null
  language: string | null
  accrual_method: string | null
  collection_method: string | null
  access_rights: string | null
  license: string | null
  production_methods: string[]
  extents: { value: string; unit: string }[]
  time_period_start: string | null
  time_period_end: string | null
  time_period_settings: Record<string, unknown> | null
  submission_date_start: string | null
  submission_date_end: string | null
  submission_date_settings: Record<string, unknown> | null
  publication_date_start: string | null
  publication_date_end: string | null
  publication_date_settings: Record<string, unknown> | null
  institution: { id: number; name: string; ror_id: string | null } | null
  project: { id: number; title: string } | null
  locality: DetailLocality | null
  authors: PersonOrOriginator[]
  researchers: PersonOrOriginator[]
  originators: PersonOrOriginator[]
  keywords: { id: number; name: string }[]
  research_collections: { id: number; title: string }[]
  document_id?: string | null
  media_type?: string | null
  first_media?: DetailMedia | null
  media?: Partial<Record<'audios' | 'documents' | 'images' | 'videos', DetailMedia[]>>
}
