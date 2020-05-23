import Vue from 'vue';

export default {
  namespaced: true,
  state: {
    logged: false,
    cart: null,
    carts: [],
    user: null,
    email: null,
  },
  mutations: {
    /**
     * Mutation datos del email usuario que introduce el
     * @param {string} payload string con el email
     */
    setEmail(state, payload) {
      state.email = payload;
    },
    /** Mutation si estamos logeados */
    setLogged(state) {
      state.logged = true;
    },
    setLogout(state) {
      sessionStorage.removeItem('user-token');
      state.logged = false;
    },
    /**
     * Mutation datos del usuario
     * @param {Object} payload Objeto con datos user (userID, phone, name, ...)
     */
    setUser(state, payload) {
      state.user = payload;
    },
    resetUser(state) {
      state.user = null;
    },
    /**
     * Mutation datos del carrito (reserva)
     * @param {Object} payload Objeto con datos ticket(userID, date) y detail (sectorID, col, row, ...)
     */
    setCart(state, payload) {
      state.cart = payload;
    },
    resetCart(state) {
      state.cart = null;
    },
    /**
     * Mutation datos de los carritos del usuario
     * @param {Array} payload Array de objetos de carritos tickets incluido detail
     */
    setCarts(state, payload) {
      state.carts = payload;
    },
    resetCarts(state) {
      state.cart = [];
    },
  },
  actions: {
    /**
     * Obtiene todos los carts (reservas) de un usuario
     * @param {Object} payload
     */
    async getCarts({ commit }, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: '/carts',
          params: {
            userID: payload.userID,
          },
        });

        if (data.data) {
          commit('setCarts', data.data);
          return data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Obtiene detalle de las reservas de un usuario
     * desde una fecha para QR. Dia actual
     * @param {Object} payload userID y date
     */
    async getCartsDetail(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: '/detailday',
          params: {
            userID: payload.userID,
            date: payload.date,
          },
        });
        if (data.data) {
          return data.data;
        }
      } catch (error) {
        console.log(error);
      }
    },

    async postCart(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'post',
          url: '/cart',
          data: payload,
        });

        return data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async checkCart(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'post',
          url: '/checkcart',
          data: payload,
        });

        return data.data;
      } catch (error) {
        console.log(error);
      }
    },

    async getUser({ commit, dispatch }, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'user',
          params: {
            email: payload.email,
            password: payload.password,
          },
        });
        if (data.data) {
          sessionStorage.setItem('user-token', data.data.token);
          Vue.axios.defaults.headers.common['authorization'] =
            'Bearer ' + data.data.token;
          await commit('setLogged');
          await commit('setUser', data.data);
          await dispatch('getCarts', { userID: data.data.userID });
          return true;
        }
      } catch (error) {
        return false;
      }
    },

    async postUser({ commit }, payload) {
      try {
        const data = await Vue.axios({
          method: 'post',
          url: 'user',
          data: payload,
        });

        if (data.data) {
          sessionStorage.setItem('user-token', data.data.token);
          Vue.axios.defaults.headers.common['authorization'] =
            'Bearer ' + data.data.token;
          await commit('setLogged');
          await commit('setUser', data.data);
          return true;
        }
      } catch (error) {
        return false;
      }
    },

    async checkEmail(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'user/email',
          params: {
            email: payload.email,
          },
        });

        return data;
      } catch (error) {
        return false;
      }
    },

    async checkTokenPass(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'recovery',
          params: {
            tokenRecovery: payload.token,
          },
        });

        return data.data;
      } catch (error) {
        return false;
      }
    },

    async checkEmailRecovery(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'post',
          url: 'recovery',
          data: payload,
        });

        return data;
      } catch (error) {
        return false;
      }
    },

    async updatePassword(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'post',
          url: 'updated',
          data: payload,
        });

        return data.data;
      } catch (error) {
        return false;
      }
    },

    async getTicketNumber(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'tickets',
          params: {
            date: payload.date,
          },
        });

        return data.data[0].tickets + 1 || 1;
      } catch (error) {
        return 1;
      }
    },

    async checkServer() {
      try {
        const data = await Vue.axios({
          method: 'get',
          url: 'cities',
        });

        if (data.data) {
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
  },
  getters: {},
};
