import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    stateSector: [],
    sectors: [],
    cities: [],
    beaches: [],
    dateActual: null,
    cityActual: null,
    beachActual: null,
    sectorActual: null,
    sectorIDActual: 1,
    typeIDActual: null,
    group: null,
  },
  mutations: {
    /**
     * Setea los items del sector actual - current
     * @param {Array} payload - Objects de Items col, row,...
     */
    setStateSector(state, payload) {
      state.stateSector = payload;
    },
    /** Reset items del sector actual */
    resetStateSector(state) {
      state.stateSector = [];
    },
    /**
     * Setea los sectores de una play
     * @param {Array} payload - Objects de los sectores cols, rows, beach,...
     */
    setSectors(state, payload) {
      state.sectors = payload;
    },
    resetSectors(state) {
      state.sectors = [];
    },
    setBeaches(state, payload) {
      state.beaches = payload;
    },
    resetBeaches(state) {
      state.beaches = [];
    },
    setBeachActual(state, payload) {
      state.beachActual = payload;
    },
    resetBeachActual(state) {
      state.beachActual = null;
    },
    setSectorActual(state, payload) {
      state.sectorActual = payload;
    },
    resetSectorActual(state) {
      state.sectorActual = null;
    },
    setSectorIDActual(state, payload) {
      state.sectorIDActual = payload;
    },
    resetSectorIDActual(state) {
      state.sectorIDActual = null;
    },
    setDateActual(state, payload) {
      state.dateActual = payload;
    },
    resetDateActual(state) {
      state.dateActual = null;
    },
    getCities(state, payload) {
      state.cities = payload;
    },
    setCityActual(state, payload) {
      state.cityActual = payload;
    },
    resetCityActual(state) {
      state.cityActual = null;
    },
    setTypeIDActual(state, payload) {
      state.typeIDActual = payload;
    },
    resetTypeIDActual(state) {
      state.typeIDActual = null;
    },
    setGroup(state, payload) {
      state.group = payload;
    },
    resetGroup(state) {
      state.group = null;
    },
  },
  actions: {
    async postItems(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'post',
          url: 'items',
          data: payload,
        });
        if (data) {
          return true;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getCities({ commit }) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'cities',
        });

        if (data.data) {
          await commit('getCities', data.data);
          return data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getSectors({ commit }, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'sectors',
          params: {
            cityID: payload.cityID,
            beachID: payload.beachID,
          },
        });
        if (data.data) {
          commit('setSectors', data.data);
          return data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getBeaches({ commit }, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'beaches',
          params: {
            cityID: payload,
          },
        });
        if (data.data) {
          commit('setBeaches', data.data);
          return data.data;
        }
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },

    async getSector({ commit }, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'sector',
          params: {
            cityID: payload.cityID,
            beachID: payload.beachID,
            sectorID: payload.sectorID,
          },
        });
        if (data) {
          await commit('setSectorActual', data.data);
          return true;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async getStateSector({ commit }, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'state',
          params: {
            cityID: payload.cityID,
            beachID: payload.beachID,
            sectorID: payload.sectorID,
            typeID: payload.typeID,
            date: payload.date,
          },
        });
        if (data.data) {
          await commit('setStateSector', data.data);
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  getters: {},
};
