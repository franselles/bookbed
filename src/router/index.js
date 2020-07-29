import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/newpass/:token',
    name: 'newpass',
    component: () => import('@/views/Newpass.vue'),
  },
  {
    path: '/recoverpass',
    name: 'recoverpass',
    component: () => import('@/views/Recoverpass.vue'),
  },
  {
    path: '/payOrder',
    name: 'payorder',
    component: () => import('@/views/Payorder.vue'),
  },
  {
    path: '/error',
    name: 'error',
    component: () => import('@/views/Error.vue'),
  },
  {
    path: '/success',
    name: 'success',
    component: () => import('@/views/Success.vue'),
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/views/Privacy.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
