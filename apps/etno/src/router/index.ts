import { createWebHistory, createRouter } from 'vue-router';

import ExploreView from '@/views/ExploreView.vue';
import DetailView from '@/views/DetailView.vue';
import InfoView from '@/views/InfoView.vue';

const routes = [
  {
    name: 'Explore',
    path: '/',
    component: ExploreView,
  },
  {
    name: 'Detail',
    path: '/detail/:id/',
    component: DetailView,
    props: true,
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
