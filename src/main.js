import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios);

// const baseURL = 'http://localhost:8080/api/v1';
const baseURL = '/api/v1';

axios.defaults.baseURL = baseURL;
axios.defaults.json = true;

import Buefy from 'buefy';
import 'buefy/dist/buefy.css';

Vue.use(Buefy);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
