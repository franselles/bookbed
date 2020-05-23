import Vue from 'vue';
import Vuex from 'vuex';

/**
 * Importamos Stores
 */
import worksStore from './works.store.js';
import userStore from './user.store.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    worksStore,
    userStore,
  },
});
