import { createWebHistory, createRouter } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import InfoView from '@/views/InfoView.vue';
import Error404View from '@/views/Error404View.vue';

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
  {
    name: 'Error404',
    path: '/:pathMatch(.*)*',
    component: Error404View,
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
