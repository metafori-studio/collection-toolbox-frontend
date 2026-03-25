import { createWebHistory, createRouter } from 'vue-router';

import ExploreView from '@/views/ExploreView.vue';
import DetailView from '@/views/DetailView.vue';
import DetailMapView from '@/views/DetailMapView.vue';
import DetailGalleryView from '@/views/DetailGalleryView.vue';
import InfoView from '@/views/InfoView.vue';
import LoginView from '@/views/LoginView.vue';
import SignupView from '@/views/SignupView.vue';

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
  {
    name: 'Login',
    path: '/login',
    component: LoginView,
  },
  {
    name: 'Signup',
    path: '/signup',
    component: SignupView,
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
