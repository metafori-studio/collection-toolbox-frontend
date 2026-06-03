import { createWebHistory, createRouter } from 'vue-router';

import HomeView from '@/views/HomeView.vue';

const routes = [
  {
    name: 'Home',
    path: '/',
    component: HomeView,
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
