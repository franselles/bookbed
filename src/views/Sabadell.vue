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

    <form
      name="from"
      action="https://sis-t.redsys.es:25443/sis/realizarPago"
      method="POST"
      target="_blank"
    >
      <input type="hidden" name="Ds_SignatureVersion" value="HMAC_SHA256_V1" />
      <input
        type="hidden"
        name="Ds_MerchantParame­ters"
        v-model="Ds_MerchantParameters"
      />
      <input type="hidden" name="Ds_Signature" v-model="Ds_Signature" />
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
      Ds_MerchantParameters: '',
      Ds_Signature: '',
    };
  },

  methods: {
    ...mapActions('userStore', ['postMakeRedsys']),

    back() {
      this.$router.go(-1);
    },

    correct() {
      this.$router.replace({ name: 'select' });
    },

    make() {
      this.postMakeRedsys({ order: '12121', amount: 100 }).then(result => {
        console.log(result);
      });
      // this.$router.replace({ name: 'select' });
    },
  },

  computed: {},
};
</script>

<style scoped></style>
