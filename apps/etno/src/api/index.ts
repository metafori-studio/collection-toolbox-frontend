import axios from 'axios';
import mockMapPoints from './mock/map-points.json';
import mockIndex from './mock/index.json';
import mockDetail from './mock/detail.json';
import { type MapPoint } from '@/components/EtnoMap/EtnoMap.vue';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 10_000,
});

const getMapPoints = async (): Promise<MapPoint[]> => {
  if (USE_MOCK) {
    return mockMapPoints.data as MapPoint[];
  }
  const { data } = await api.get('/items/map-points');
  return data.data as MapPoint[];
};

const getList = async (): Promise<Record<string, unknown>[]> => {
  if (USE_MOCK) {
    return mockIndex.data as Record<string, unknown>[];
  }
  const { data } = await api.get('/items?per_page=50');
  return data.data.map((record) => ({
    ...record,
    image: 'https://fastly.picsum.photos/id/4/800/800.jpg?hmac=ji2no8lxJV7_xjfY7ajNOri7_dDclKhOxxQ0gy0Svfc',
  })) as Record<string, unknown>[];
};

const getDetail = async (id: string): Promise<Record<string, unknown>> => {
  if (USE_MOCK) {
    return mockDetail.data as Record<string, unknown>;
  }
  const { data } = await api.get(`/items/${id}`);
  return data.data;
};

export {
  getMapPoints,
  getList,
  getDetail,
};
