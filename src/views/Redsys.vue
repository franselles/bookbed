<template>
  <div>
    <div class="columns is-centered is-vcentered is-mobile">
      <div class="column has-text-centered">
        <article class="message is-danger" v-if="errorMsg">
          <div class="message-header">
            <p>RESERVA DE HAMACAS</p>
          </div>
          <div class="message-body">
            ERROR EN EL PROCESO DE COMPRA
          </div>
        </article>
        <article class="message is-danger" v-if="errorItems">
          <div class="message-header">
            <p>RESERVA DE HAMACAS</p>
          </div>
          <div class="message-body">
            ERROR EN LA SELECCIÓN DE ELEMENTOS
          </div>
        </article>
        <article class="message is-success" v-if="successMsg">
          <div class="message-header">
            <p>RESERVA DE HAMACAS</p>
          </div>
          <div class="message-body">
            COMPRA REALIZADA CORRECTAMENTE
          </div>
        </article>
        <p>EN CONSTRUCCION</p>
        <p>FALTA AVISOS LEGALES</p>
        <p>LOPD, etc...</p>
      </div>
    </div>

    <div class="columns is-centered is-vcentered is-mobile">
      <div class="column has-text-centered">
        <b-button type="is-success" @click="submit">COMPRAR</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

export default {
  data: () => ({
    name: '',
    cardNumber: '',
    expiration: '',
    security: '',
    secret: null,
    amount: null,
    errorMsg: false,
    successMsg: false,
    errorItems: false,
    cartLocal: {
      _id: null,
      date: null,
      userID: null,
      phone: null,
      ticketID: null,
      canceled: false,
      detail: [],
    },
    detailDuplicated: [],
    pressed: false,
  }),

  async mounted() {
    this.amount = 1000;
    this.cartLocal = this.cart;
  },

  methods: {
    ...mapMutations('userStore', ['resetCart']),
    ...mapActions('userStore', [
      'postStripeIntent',
      'postCart',
      'deleteCartFinal',
    ]),

    creditInfoChanged(values) {
      for (const key in values) {
        this[key] = values[key];
      }
    },

    async submit() {
      this.pressed = true;

      try {
        const result = await this.postCart(this.cartLocal);
        this.cartLocal = result;

        this.successMsg = true;

        setTimeout(() => {
          this.resetCart();
          this.$router.replace({ name: 'select' });
        }, 2000);
      } catch (error) {
        this.errorMsg = true;
        await this.deleteCartFinal(this.cartLocal);
        setTimeout(() => {
          this.$router.replace({ name: 'cart' });
        }, 2000);
      }
    },
  },

  computed: {
    ...mapState('userStore', ['cart']),
  },
};
</script>

<style scoped></style>
