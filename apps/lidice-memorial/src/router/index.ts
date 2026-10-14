import { createWebHistory, createRouter, type RouteLocationNormalizedLoaded } from 'vue-router';
import { routerScrollBehavior } from '@metafori/shared';
import i18n from '@/i18n';
import {
  getById,
  getList,
  getCollections,
  getCollectionById,
  getCollectionArtworks,
} from '@/api';

import InfoView from '@/views/InfoView.vue';
import {
  ExploreView,
  ArtworkDetailView,
  Error404View,
  ArtworkCollectionListView,
  ArtworkCollectionDetailView,
} from '@metafori/components';

export const routes = [
  {
    name: 'Explore',
    path: '/',
    props: () => ({
      getList,
      highlight: 'search',
    }),
    component: ExploreView,
  },
  {
    name: 'ArtworkDetail',
    path: '/artwork/:id',
    props: (route: RouteLocationNormalizedLoaded) => ({
      id: route.params.id,
      getById,
      license: i18n.global.t('footer.copyright'),
    }),
    component: ArtworkDetailView,
  },
  {
    name: 'CollectionList',
    path: '/collections',
    props: () => ({
      getCollections,
    }),
    component: ArtworkCollectionListView,
  },
  {
    name: 'CollectionDetail',
    path: '/collections/:id',
    props: (route: RouteLocationNormalizedLoaded) => ({
      id: route.params.id,
      getCollectionById,
      getCollectionArtworks,
    }),
    component: ArtworkCollectionDetailView,
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
