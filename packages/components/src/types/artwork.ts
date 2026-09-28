export type Artwork = {
  id: number;
  image: string;
  imageWidth?: number;
  imageHeight?: number;
  title: string;
  author: string;
  year: string;
};

export type ArtworkListResponse = {
  data: Artwork[];
  meta: {
    total: number;
  };
};

export type ArtworkCollection = {
  id: number;
  name: string;
  about: string;
  images: string[];
  date: string;
  author?: string;
  category?: string;
  artwork_count: number;
};

export type ArtworkCollectionDetail = ArtworkCollection & {
  summary: string;
};

export type ArtworkCollectionListResponse = {
  highlighted: ArtworkCollection[];
  rest: ArtworkCollection[];
};

export type ArtworkDetail = {
  id: number;
  title: string;
  author: string;
  dating: string;
  dimensions: {
    width: string;
    height: string;
  };
  artistic_types: string[];
  material: string;
  technique: string;
  acquisition: {
    method: string;
    year: string;
  };
  location_origin: string;
  inventory_number: string;
  copyright: string;
  collections: ArtworkCollection[];
};
