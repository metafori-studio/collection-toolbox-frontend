import axios from 'axios';
import type {
  Artwork,
  ArtworkDetail,
  ArtworkListResponse,
} from '@metafori/components';
import mockIndex from './mock/index.json';
import mockDetail from './mock/detail.json';

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

export {
  getList,
  getById,
};
