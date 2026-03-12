import { createWebHistory, createRouter } from 'vue-router';

import ExploreView from '@/views/ExploreView.vue';
import DetailView from '@/views/DetailView.vue';
import DetailMapView from '@/views/DetailMapView.vue';
import DetailGalleryView from '@/views/DetailGalleryView.vue';
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
    children: [
      {
        path: '',
        name: 'DetailMap',
        component: DetailMapView,
      },
      {
        path: 'gallery',
        name: 'DetailGallery',
        component: DetailGalleryView,
      },
    ],
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
