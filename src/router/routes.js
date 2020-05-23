export default [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/logup',
    name: 'logup',
    component: () => import('@/views/Logup.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/recoverpass',
    name: 'recoverpass',
    component: () => import('@/views/Recoverpass.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/newpass/:token',
    name: 'newpass',
    component: () => import('@/views/Newpass.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/select',
    name: 'select',
    component: () => import('@/views/Select.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/citybeaches',
    name: 'citybeaches',
    component: () => import('@/views/Citybeaches.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/sector',
    name: 'sector',
    component: () => import('@/views/Sector.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/Cart.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cartsuser',
    name: 'cartsuser',
    component: () => import('@/views/Cartsuser.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/cartdetail',
    name: 'cartdetail',
    component: () => import('@/views/Cartdetail.vue'),
    meta: { requiresAuth: true },
  },
];