import { createWebHistory, createRouter, type RouteLocationNormalized } from 'vue-router';

import ExploreView from '@/views/ExploreView.vue';
import DetailView from '@/views/DetailView.vue';
import InfoView from '@/views/InfoView.vue';
import LoginView from '@/views/LoginView.vue';
import SignupView from '@/views/SignupView.vue';
import SetupAccountView from '@/views/SetupAccountView.vue';
import ForgotPassword from '@/views/ForgotPassword.vue';
import ResetPassword from '@/views/ResetPassword.vue';

const routes = [
  {
    name: 'Explore',
    path: '/',
    component: ExploreView,
  },
  {
    name: 'Detail',
    path: '/items/:id/',
    component: DetailView,
    props: true,
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
  {
    name: 'ForgotPassword',
    path: '/forgot-password',
    component: ForgotPassword,
  },
  {
    name: 'ResetPassword',
    path: '/reset-password',
    component: ResetPassword,
    props: (route: RouteLocationNormalized) => ({
      email: route.query.email,
      token: route.query.token,
    }),
  },
  {
    name: 'SetupAccount',
    path: '/setup-account',
    component: SetupAccountView,
    props: (route: RouteLocationNormalized) => ({
      email: route.query.email,
      token: route.query.token,
    }),
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
