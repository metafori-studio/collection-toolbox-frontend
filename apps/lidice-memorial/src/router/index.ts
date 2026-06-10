import { createWebHistory, createRouter } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import InfoView from '@/views/InfoView.vue';

export const routes = [
  {
    name: 'Home',
    path: '/',
    component: HomeView,
  },
  {
    name: 'Info',
    path: '/info',
    component: InfoView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
