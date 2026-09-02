import { createWebHistory, createRouter, type RouteLocationNormalizedLoaded } from 'vue-router';
import { routerScrollBehavior } from '@metafori/shared';
import { getById, getList } from '@/api';

import InfoView from '@/views/InfoView.vue';
import {
  ExploreView,
  ArtworkDetailView,
  Error404View,
} from '@metafori/components';

export const routes = [
  {
    name: 'Explore',
    path: '/',
    props: () => ({
      getList,
      highlight: 'filter',
    }),
    component: ExploreView,
  },
  {
    name: 'ArtworkDetail',
    path: '/artwork/:id',
    props: (route: RouteLocationNormalizedLoaded) => ({
      id: route.params.id,
      getById,
    }),
    component: ArtworkDetailView,
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
  scrollBehavior: routerScrollBehavior,
});

export default router;
