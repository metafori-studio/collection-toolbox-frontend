import { createWebHistory, createRouter, type RouteLocationNormalized } from 'vue-router';
import i18n, { SUPPORTED_LANGS } from '@/i18n';

import ExploreView from '@/views/ExploreView.vue';
import DetailView from '@/views/DetailView.vue';
import InfoView from '@/views/InfoView.vue';
import LoginView from '@/views/LoginView.vue';
import SignupView from '@/views/SignupView.vue';
import SetupAccountView from '@/views/SetupAccountView.vue';
import ForgotPassword from '@/views/ForgotPassword.vue';
import ResetPassword from '@/views/ResetPassword.vue';
import Error404View from '@/views/Error404View.vue';

const routes = [
  {
    path: '/:lang(sk|en)',
    children: [
      {
        name: 'Explore',
        path: '',
        component: ExploreView,
      },
      {
        name: 'Detail',
        path: 'items/:id/',
        component: DetailView,
        props: true,
      },
      {
        name: 'Info',
        path: 'info',
        component: InfoView,
      },
      {
        name: 'Login',
        path: 'login',
        component: LoginView,
      },
      {
        name: 'Signup',
        path: 'signup',
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
          email: route.query.email as string ?? '',
          token: route.query.token as string ?? '',
        }),
      },
      {
        name: 'SetupAccount',
        path: 'setup-account',
        component: SetupAccountView,
        props: (route: RouteLocationNormalized) => ({
          email: route.query.email as string ?? '',
          token: route.query.token as string ?? '',
        }),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: () => `/${i18n.global.locale.value}`,
  },
  {
    name: 'Error404',
    path: '/:lang(sk|en)/:pathMatch(.*)*',
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

router.beforeEach((to) => {
  const lang = to.params.lang as string;
  if (SUPPORTED_LANGS.includes(lang)) {
    i18n.global.locale.value = lang as 'sk' | 'en';
  }
});

export default router;
