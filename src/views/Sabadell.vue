<template>
  <div>
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li>
          <a href="#" @click="back"
            ><b-icon icon="arrow-left-thick"></b-icon> VOLVER</a
          >
        </li>
      </ul>
    </nav>
    <p>
      PARA RECOGER SUS TICKETS DE REVERVA DE HAMACAS
    </p>
    <p>
      PASE POR LOS PUNTOS DE INFORMACIÓN Y VENTA EN:
    </p>

    <p>
      AVDA. EUROPA. BIBLIOPLAYA, PLAYA DE LEVANTE Y
    </p>
    <p>
      PASEO DE COLON. PLAYA DE PONIENTE.
    </p>

    <!--     <form
      name="from"
      action="https://sis-t.redsys.es:25443/sis/realizarPago"
      method="POST"
    > -->

    <form @submit.prevent="submit">
      <!-- target="_blank" -->
      <input type="text" name="Ds_SignatureVersion" value="HMAC_SHA256_V1" />
      <input
        type="text"
        name="Ds_MerchantParame­ters"
        v-model="Ds_MerchantParameters"
      />
      <input type="text" name="Ds_Signature" v-model="Ds_Signature" />
      <button type="submit">PAGAR</button>
    </form>

    <b-button type="is-success" @click="correct">VOLVER</b-button>
    <b-button type="is-success" @click="make">PRUEBA PAGO</b-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'sabadell',
  data() {
    return {
      Ds_SignatureVersion: 'HMAC_SHA256_V1',
      Ds_MerchantParameters: '',
      Ds_Signature: '',
    };
  },

  methods: {
    ...mapActions('userStore', ['postMakeRedsys']),

    submit() {
      const headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Methods':
          'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
      };

      this.axios
        .post(
          'https://sis-t.redsys.es:25443/sis/realizarPago',
          {
            Ds_SignatureVersion: this.Ds_SignatureVersion,
            Ds_MerchantParameters: this.Ds_MerchantParameters,
            Ds_Signature: this.Ds_Signature,
          },
          { headers }
        )
        .then(function (response) {
          console.log(response);
          window.location = response.data.redirect;
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    back() {
      this.$router.go(-1);
    },

    correct() {
      this.$router.replace({ name: 'select' });
    },

    make() {
      this.postMakeRedsys({ order: '12121', amount: 100 }).then(result => {
        console.log(result);
        this.Ds_MerchantParameters = result.data.Ds_MerchantParameters;
        this.Ds_Signature = result.data.Ds_Signature;
      });
      // this.$router.replace({ name: 'select' });
    },
  },

  computed: {},
};
</script>

<style scoped></style>
