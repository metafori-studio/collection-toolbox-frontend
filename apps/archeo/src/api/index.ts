import axios from 'axios';
import mockMapPoints from './mock/map-points.json';
import mockIndex from './mock/index.json';
import mockDetail from './mock/detail.json';
import { type MapPoint } from '@/components/ArcheoMap/ArcheoMap.vue';
import { isLoggedIn } from '@/store';

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

const getMapPoints = async (): Promise<MapPoint[]> => {
  if (USE_MOCK) {
    return mockMapPoints.data as MapPoint[];
  }
  const { data } = await api.get('/archeo/activities/map-points');
  return data.data as MapPoint[];
};

export type ListMeta = {
  total?: number;
  from?: number;
  to?: number;
  current_page?: number;
  last_page?: number;
  [key: string]: unknown;
};

const getList = async (
  orderBy: string = 'municipality',
  orderAsc: boolean = true,
  page: number = 1,
): Promise<{ data: Record<string, unknown>[]; meta: ListMeta }> => {
  if (USE_MOCK) {
    return mockIndex as unknown as { data: Record<string, unknown>[]; meta: ListMeta };
  }

  const params = new URLSearchParams();
  params.append('per_page', '20');
  params.append('page', page.toString());
  params.append('sort', orderAsc ? orderBy : `-${orderBy}`);

  const { data } = await api.get(`/archeo/activities?${params.toString()}`);
  return data;
};

const getDetail = async (id: string): Promise<Record<string, unknown>> => {
  if (USE_MOCK) {
    return mockDetail.data as Record<string, unknown>;
  }
  const { data } = await api.get(`/archeo/activities/${id}`);
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
  getDetail,

  getCsrfCookie,
  login,
  logout,
  setPassword,
  forgotPassword,
  resetPassword,
};
