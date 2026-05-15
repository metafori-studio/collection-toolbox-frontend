import { type IconName, type MediaImageTheme, type ViewerMediaKind } from '@metafori/components';

export function getIconForMediaType(mediaType?: ViewerMediaKind | null): IconName {
  switch (mediaType) {
    case 'audios':
      return 'musicNotes';
    case 'videos':
      return 'play';
    case 'documents':
      return 'document';
    case 'images':
      return 'image';
    default:
      return 'stack';
  }
}

export function getThemeForMediaType(mediaType?: ViewerMediaKind | null): MediaImageTheme {
  switch (mediaType) {
    case 'audios':
      return 'green';
    case 'documents':
      return 'amber';
    case 'videos':
      return 'red';
    case 'images':
      return 'purple';
    default:
      return 'neutral';
  }
}
