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
  const { data } = await api.get('/activities/map-points');
  return data.data as MapPoint[];
};

const getList = async (): Promise<Record<string, unknown>[]> => {
  if (USE_MOCK) {
    return mockIndex.data as Record<string, unknown>[];
  }
  const { data } = await api.get('/activities?per_page=1000');
  return data.data as Record<string, unknown>[];
};

const getDetail = async (id: string): Promise<Record<string, unknown>> => {
  if (USE_MOCK) {
    return mockDetail.data as Record<string, unknown>;
  }
  const { data } = await api.get(`/activities/${id}`);
  return data.data;
};

export {
  getMapPoints,
  getList,
  getDetail,
};
