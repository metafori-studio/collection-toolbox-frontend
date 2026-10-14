import axios from 'axios';
import type {
  Artwork,
  ArtworkCollection,
  ArtworkCollectionDetail,
  ArtworkCollectionListResponse,
  ArtworkDetail,
  ArtworkListResponse,
} from '@metafori/components';
import mockIndex from './mock/index.json';
import mockDetail from './mock/detail.json';
import mockCollections from './mock/collections.json';
import mockCollectionDetail from './mock/collection-detail.json';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 10_000,
});

const PER_PAGE = 12;

const withMockImageDimensions = (artwork: Artwork): Artwork => {
  const match = artwork.image.match(/\/(\d+)\/(\d+)$/);
  if (!match) return artwork;
  return {
    ...artwork,
    imageWidth: Number(match[1]),
    imageHeight: Number(match[2]),
  };
};

const getList = async (
  orderBy: string = 'id',
  page: number = 1,
): Promise<ArtworkListResponse> => {
  if (USE_MOCK) {
    const all = (mockIndex.data as Artwork[]).map(withMockImageDimensions);
    const start = (page - 1) * PER_PAGE;
    const sliced = all.slice(start, start + PER_PAGE);
    return {
      data: sliced,
      meta: { total: all.length },
    };
  }
  const { data } = await api.get(`/artworks?sort=${orderBy}&per_page=${PER_PAGE}&page=${page}`);
  return {
    data: data.data as Artwork[],
    meta: {
      total: data.meta.total as number },
    };
};

const getById = async (id: string): Promise<ArtworkDetail> => {
  if (USE_MOCK) {
    return mockDetail as ArtworkDetail;
  }
  const { data } = await api.get(`/artworks/${id}`);
  return data.data as ArtworkDetail;
};

const sortCollections = (
  collections: ArtworkCollection[],
  orderBy: string,
): ArtworkCollection[] => {
  const desc = orderBy.startsWith('-');
  const key = (desc ? orderBy.slice(1) : orderBy) as keyof ArtworkCollection;
  return [...collections].sort((a, b) => {
    const result = String(a[key] ?? '').localeCompare(String(b[key] ?? ''), 'sk', { numeric: true });
    return desc ? -result : result;
  });
};

const getCollections = async (
  orderBy: string = '-date',
): Promise<ArtworkCollectionListResponse> => {
  const { highlighted, rest } = mockCollections as ArtworkCollectionListResponse;
  return {
    highlighted,
    rest: sortCollections(rest, orderBy),
  };
};

const getCollectionById = async (_id: string): Promise<ArtworkCollectionDetail> => {
  const detail = mockCollectionDetail;
  return detail as ArtworkCollectionDetail;
};

const getCollectionArtworks = async (
  _id: string,
  page: number = 1,
): Promise<ArtworkListResponse> => {
  const all = (mockCollectionDetail.artworks as Artwork[]).map(withMockImageDimensions);
  const start = (page - 1) * PER_PAGE;
  return {
    data: all.slice(start, start + PER_PAGE),
    meta: { total: all.length },
  };
};

export {
  getList,
  getById,
  getCollections,
  getCollectionById,
  getCollectionArtworks,
};
