export type MediaItem = {
  id: number;
  name: string;
  file_name: string;
  mime_type: string;
  url: string;
  human_readable_size?: string;
  conversions?: Record<string, string>;
  transcript?: string;
};
