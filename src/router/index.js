import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/newpass',
    name: 'Newpass',
    component: () => import('@/views/Newpass.vue'),
  },
  {
    path: '/payOrder',
    name: 'Payorder',
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
];

const router = new VueRouter({
  routes,
});

export default router;
