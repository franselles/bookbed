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
     * @param {string} payload - string con el email
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
     * @param {Object} payload - Objeto con datos user (userID, phone, name, ...)
     */
    setUser(state, payload) {
      state.user = payload;
    },
    resetUser(state) {
      state.user = null;
    },
    /**
     * Mutation datos del carrito (reserva)
     * @param {Object} payload - Objeto con datos ticket(userID, date) y detail (sectorID, col, row, ...)
     */
    setCart(state, payload) {
      state.cart = payload;
    },
    resetCart(state) {
      state.cart = null;
    },
    /**
     * Mutation datos de los carritos del usuario
     * @param {Array} payload - Array de objetos de carritos tickets incluido detail
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
     * @param {Object} payload - UserID
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
     * @param {Object} payload - userID y date
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

    /**
     * Borra carrito pasado a server si hay error en tarjeta
     * @param {*} context
     * @param {Object} payload - _id del carrito
     */
    async deleteCartFinal(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'delete',
          url: 'cart',
          params: {
            id: payload._id,
          },
        });

        return data;
      } catch (error) {
        return error;
      }
    },

    /**
     * Post carrito sin comprobar duplicados
     * @param {*} context
     * @param {Object} payload - Se para el carrito con detail
     */
    async postCartFinal(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'post',
          url: '/cartfinal',
          data: payload,
        });

        return data.data;
      } catch (error) {
        console.log(error);
      }
    },

    /**
     * Post del carrito con comprobación previa de duplicados
     * @param {*} context
     * @param {Object} payload - Se pasa el carrito con detail
     */
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

    /**
     * Comprobación de duplicados sin post
     * @param {*} context
     * @param {Object} payload - Se pasa el Array del detail del carrito
     */
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

    /**
     * Se obtiene el user
     * @param {*} commit
     * @param {*} dispatch
     * @param {Object} payload - Email y password del user
     */
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

    /**
     * Se crea user
     * @param {*} commit
     * @param {Object} payload - name, email, password, etc..
     */
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

    /**
     * Comprueba la existencia del email, si está disponible
     * @param {*} context
     * @param {Object} payload - email del usuario
     */
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

    /**
     * En reuperar password comprueba la exitencia del token de recuperacion en user
     * @param {*} context
     * @param {Object} payload - Token para buscar si está almacenado en user
     */
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

    /**
     * Comprueba que exite el email / usuario para recuperar contraseña
     * @param {*} context
     * @param {Object} payload - email
     */
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

    /**
     * Post de las nueva contraseña - recuperación
     * @param {*} context
     * @param {Object} payload - Se pasa password
     */
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

    /**
     * Se obtiene siguiente nímero de ticket - count carts
     * @param {*} context
     * @param {Object} payload - date
     */
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

    /**
     * Handle para comprobar si el server está UP
     */
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

    /**
     * Post para obtener token intent de pago en Stripe
     * @param {*} context
     * @param {Object} payload - Se le pasa cart, en server se calcula amount (importe)
     */
    async postStripeIntent(context, payload) {
      try {
        const data = await Vue.axios({
          method: 'post',
          url: 'secret',
          data: payload,
        });

        return data;
      } catch (error) {
        return error;
      }
    },
  },
  getters: {},
};
