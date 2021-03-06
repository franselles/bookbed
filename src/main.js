import Vue from 'vue';
import App from './App.vue';
import router from './router';

import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios);

// const baseURL = 'http://localhost:8080/api/v1';
const baseURL = '/api/v1';

axios.defaults.baseURL = baseURL;
axios.defaults.json = true;

Vue.config.productionTip = false;

import { BootstrapVue } from 'bootstrap-vue';
Vue.use(BootstrapVue);

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
