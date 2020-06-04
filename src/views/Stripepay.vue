<template>
  <div class="columns is-centered is-vcentered is-mobile">
    <div class="column has-text-centered">
      <article class="message is-info">
        <div class="message-header">
          <p>PROCESO DE PAGO</p>
        </div>
        <div class="message-body">
          <p>
            INTRODUZCA NÚMERO DE TARJETA
          </p>
          <p>
            FECHA DE CADUCIDAD
          </p>
          <p>
            CÓDIGO CVV
          </p>
          <p>
            CÓDIGO POSTAL
          </p>
        </div>
      </article>
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
      <div class="box has-background-white-bis">
        <form @submit.prevent="submit($event)">
          <div class="stripe-form-input">
            <div ref="stripe"></div>
          </div>
          <br />
          <button class="button" type="submit" :disabled="pressed">
            PAGAR
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';

import { loadStripe } from '@stripe/stripe-js';

export default {
  data: () => ({
    stripe: null,
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

    this.stripe = await loadStripe(
      'pk_test_XrbrZ0BgnoHDPeqw4q1wI0aX007LWP77ZT'
    );

    let elements = this.stripe.elements();

    const style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };

    this._card = elements.create('card', { style: style });
    this._card.mount(this.$refs.stripe);

    this.secret = await this.postStripeIntent({ cart: this.cart }).then(res => {
      return res.data.secret;
    });
  },

  methods: {
    ...mapMutations('userStore', ['resetCart']),
    ...mapActions('userStore', [
      'postStripeIntent',
      'postCart',
      'deleteCartFinal',
    ]),

    async submit(ev) {
      ev.preventDefault();
      this.pressed = true;

      try {
        const result = await this.postCart(this.cartLocal);
        this.cartLocal = result;

        if (result._id) {
          const res = await this.stripe.confirmCardPayment(this.secret, {
            payment_method: { card: this._card },
          });

          if (res.paymentIntent.status == 'succeeded') {
            this.successMsg = true;

            setTimeout(() => {
              this.resetCart();
              this.$router.replace({ name: 'select' });
            }, 2000);
          }
        } else {
          this.errorItems = true;
          await this.deleteCartFinal(this.cartLocal);
          setTimeout(() => {
            this.$router.replace({ name: 'cart' });
          }, 2000);
        }
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
