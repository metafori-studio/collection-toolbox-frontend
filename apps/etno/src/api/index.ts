import axios from 'axios';
import mockMapPoints from './mock/map-points.json';
import mockIndex from './mock/index.json';
import mockAggregations from './mock/aggregations.json';
import mockDetail from './mock/detail.json';
import mockDocument from './mock/document.json';
import { type MapPoint } from '@/components/EtnoMap/EtnoMap.vue';
import type { ListItem, ListMeta, Detail } from './types';
import { isLoggedIn } from '@/store';
import i18n from '@/i18n';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 10_000,
});

api.interceptors.response.use(
  (response) => {
    const header = response.headers['x-is-authenticated'];
    isLoggedIn.value = !!header;
    return response;
  },
  (error) => {
    const header = error.response?.headers['x-is-authenticated'];
    isLoggedIn.value = !!header;
    return Promise.reject(error);
  },
);

api.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = i18n.global.locale.value;
  return config;
});

const getMapPoints = async (): Promise<MapPoint[]> => {
  if (USE_MOCK) {
    return mockMapPoints.data as MapPoint[];
  }
  const { data } = await api.get('/etno/items/map-points');
  return data.data as MapPoint[];
};

const getList = async (
  filter: Record<string, string[]> = {},
  orderBy: string = 'id',
  orderAsc: boolean = true,
  page: number = 1,
): Promise<{ data: ListItem[]; meta: ListMeta }> => {
  if (USE_MOCK) {
    return mockIndex as unknown as { data: ListItem[]; meta: ListMeta };
  }

  const params = new URLSearchParams();
  params.append('per_page', '24');
  params.append('page', page.toString());
  params.append('sort', orderAsc ? orderBy : `-${orderBy}`);
  // Filter params
  Object.entries(filter).forEach(([key, values]) => {
    values.forEach((value) => {
      params.append(`filter[${key}][]`, value);
    });
  });

  const { data } = await api.get(`/etno/items?${params.toString()}`);

  return data;
};

const getAggregations = async (
  filter: Record<string, string[]> = {},
): Promise<Record<string, unknown>> => {
  if (USE_MOCK) {
    return mockAggregations.data as Record<string, unknown>;
  }

  const params = new URLSearchParams();
  // Filter params
  Object.entries(filter).forEach(([key, values]) => {
    values.forEach((value) => {
      params.append(`filter[${key}][]`, value);
    });
  });

  const { data } = await api.get(`/etno/items/aggregations?${params.toString()}`);
  return data.data;
};

const getSearch = async (query: string) => {
  const MAX_RESULTS = 20;

  if (USE_MOCK) {
    const sliced = (mockIndex.data as Record<string, unknown>[])
      .slice(0, MAX_RESULTS);
    return sliced;
  }

  const params = new URLSearchParams();
  params.append('q', query);
  params.append('size', MAX_RESULTS.toString());

  const { data } = await api.get(`/etno/items/search?${params.toString()}`);
  return data.data;
};

const getDocument = async (id: string): Promise<Detail> => {
  if (USE_MOCK) {
    return mockDocument.data as unknown as Detail;
  }
  const { data } = await api.get(`/etno/documents/${id}`);
  return data.data;
};

const getDetail = async (id: string): Promise<Detail> => {
  if (USE_MOCK) {
    return mockDetail.data as unknown as Detail;
  }
  const { data } = await api.get(`/etno/items/${id}`);
  return data.data;
};

const getCsrfCookie = async () => {
  const response = await api.get('../sanctum/csrf-cookie');
  return response.data;
};

type LoginPayload = {
  email: string;
  password: string;
  remember?: boolean;
};

const login = async (payload: LoginPayload) => {
  await getCsrfCookie();
  const response = await api.post('/login', payload);
  return response;
};

const logout = async () => {
  await getCsrfCookie();
  const response = await api.post('/logout');
  return response;
};

type SetPasswordPayload = {
  token: string;
  email: string;
  password: string;
};

const setPassword = async (payload: SetPasswordPayload) => {
  await getCsrfCookie();
  const response = await api.post('/password/set', payload);
  return response;
};

type ForgotPasswordPayload = {
  email: string;
};

const forgotPassword = async (payload: ForgotPasswordPayload) => {
  await getCsrfCookie();
  const response = await api.post('/password/forgot', payload);
  return response;
};

type ResetPasswordPayload = {
  token: string;
  email: string;
  password: string;
};

const resetPassword = async (payload: ResetPasswordPayload) => {
  await getCsrfCookie();
  const response = await api.post('/password/reset', payload);
  return response;
};

export {
  getMapPoints,
  getList,
  getAggregations,
  getSearch,
  getDocument,
  getDetail,

  getCsrfCookie,
  login,
  logout,
  setPassword,
  forgotPassword,
  resetPassword,
};

export type {
  ListItem,
  ListMeta,
  Detail,
} from './types';
