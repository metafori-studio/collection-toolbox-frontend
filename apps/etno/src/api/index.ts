import axios from 'axios';
import mockMapPoints from './mock/map-points.json';
import mockIndex from './mock/index.json';
import mockAggregations from './mock/aggregations.json';
import mockDetail from './mock/detail.json';
import { type MapPoint } from '@/components/EtnoMap/EtnoMap.vue';
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
  const { data } = await api.get('/etno/items/map-points');
  return data.data as MapPoint[];
};

const getList = async (
  filter: Record<string, string[]> = {},
  orderBy: string = 'id',
  orderAsc: boolean = true,
  page: number = 1,
): Promise<{ data: Record<string, unknown>[]; [key: string]: unknown }> => {
  if (USE_MOCK) {
    return mockIndex as unknown as { data: Record<string, unknown>[]; [key: string]: unknown };
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

  return {
    ...data,
    data: data.data.map((record: Record<string, unknown>) => ({
      ...record,
      // TODO: Setting default image because images are not yet set in API
      image: 'https://fastly.picsum.photos/id/4/800/800.jpg?hmac=ji2no8lxJV7_xjfY7ajNOri7_dDclKhOxxQ0gy0Svfc',
    })) as Record<string, unknown>[],
  };
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

const getDetail = async (id: string): Promise<Record<string, unknown>> => {
  if (USE_MOCK) {
    return mockDetail.data as Record<string, unknown>;
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
  getDetail,

  getCsrfCookie,
  login,
  logout,
  setPassword,
  forgotPassword,
  resetPassword,
};
