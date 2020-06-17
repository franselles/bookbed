import Vue from 'vue';
import VueRouter from 'vue-router';

// import store from '@/store';

import routes from './routes';

Vue.use(VueRouter);

const router = new VueRouter({
  //  mode: 'history',
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  // const urlLevel = to.matched.some(record => record.meta.level)
  // const level = store.state.login.login.level
  const logged = sessionStorage.getItem('user-token');

  if (logged === null && requiresAuth) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
