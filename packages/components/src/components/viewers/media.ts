export type ViewerMediaKind = 'audios' | 'documents' | 'images' | 'videos';

export type ViewerMediaResource = {
  id?: number;
  name?: string;
  file_name?: string;
  human_readable_size?: string;
  mime_type?: string | null;
  url: string;
  conversions?: Record<string, string>;
  transcript?: string | null;
};

export type ViewerDetail = {
  title?: string;
  media?: Partial<Record<ViewerMediaKind, ViewerMediaResource[]>>;
};

export const getFirstMedia = (
  detail: ViewerDetail,
  kind: ViewerMediaKind,
): ViewerMediaResource | null => detail.media?.[kind]?.[0] ?? null;

export const getMediaPoster = (media: ViewerMediaResource | null): string | undefined => {
  const conversions = media?.conversions;
  if (!conversions) {
    return undefined;
  }

  return conversions.poster
    ?? conversions.preview
    ?? conversions.thumbnail
    ?? conversions.thumb
    ?? Object.values(conversions)[0];
};

export const getFirstTranscript = (detail: ViewerDetail): string | null => (
  getFirstMedia(detail, 'videos')?.transcript
  ?? getFirstMedia(detail, 'audios')?.transcript
  ?? null
);
