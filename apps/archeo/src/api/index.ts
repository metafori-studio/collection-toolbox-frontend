import axios from 'axios';
import mockMapPoints from './mock/map-points.json';
import mockIndex from './mock/index.json';
import mockDetail from './mock/detail.json';
import { type MapPoint } from '@/components/ArcheoMap/ArcheoMap.vue';

const USE_MOCK = import.meta.env.VITE_USE_MOCK;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 10_000,
});

const getMapPoints = async (): Promise<MapPoint[]> => {
  if (USE_MOCK) {
    return mockMapPoints.data as MapPoint[];
  }
  const { data } = await api.get('/archeo/activities/map-points');
  return data.data as MapPoint[];
};

const getList = async (): Promise<Record<string, unknown>[]> => {
  if (USE_MOCK) {
    return mockIndex.data as Record<string, unknown>[];
  }
  const { data } = await api.get('/archeo/activities?per_page=1000');
  return data.data as Record<string, unknown>[];
};

const getDetail = async (id: string): Promise<Record<string, unknown>> => {
  if (USE_MOCK) {
    return mockDetail.data as Record<string, unknown>;
  }
  const { data } = await api.get(`/archeo/activities/${id}`);
  return data.data;
};

const getCsrfCookie = async () => {
  const response = await api.get('/sanctum/csrf-cookie');
  return response.data;
};

type LoginPayload = { email: string; password: string; remember?: boolean };

const login = async (payload: LoginPayload) => {
  const response = await api.post('/api/login', payload);
  return response.data;
};

export {
  getMapPoints,
  getList,
  getDetail,

  getCsrfCookie,
  login,
};
