import axios from 'axios';
import mockIndex from './mock/index.json';
import mockDetail from './mock/detail.json';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 10_000,
});

export type Artwork = {
  id: number;
  image: string;
  imageWidth?: number;
  imageHeight?: number;
  title: string;
  author: string;
  year: string;
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
};

const PER_PAGE = 12;

type ListResponse = {
  data: Artwork[];
  meta: {
    total: number,
  };
};

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
): Promise<ListResponse> => {
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
