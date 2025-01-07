import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Login.vue'),
      },
      {
        path: 'home',
        component: () => import('pages/Home.vue'),
      },
      // {
      //   path: 'login',
      //   component: () => import('pages/Login.vue'),
      // },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
