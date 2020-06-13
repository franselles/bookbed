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
        name="Ds_MerchantParameters"
        v-model="Ds_MerchantParameters"
      />
      <input type="hidden" name="Ds_Signature" v-model="Ds_Signature" />
      <!-- <button type="submit">PAGAR</button> -->
    </form>

    <b-button type="is-success" @click="correct">VOLVER</b-button>
    <!-- <b-button type="is-success" @click="pruebapug">PRUEBA PAGO</b-button> -->
  </div>
</template>

<script>
export default {
  name: 'sabadell',
  data() {
    return {
      Ds_MerchantParameters: '',
      Ds_Signature: '',
    };
  },

  methods: {
    back() {
      this.$router.go(-1);
    },

    correct() {
      this.$router.replace({ name: 'select' });
    },

    async pruebapug() {
      try {
        const data = await this.axios({
          method: 'get',
          url: 'pruebapug',
        });

        this.Ds_MerchantParameters = data.merchantParameters;
        this.Ds_Signature = data.signature;

        console.log(data);
      } catch (error) {
        console.log(error);
      }

      // this.$router.replace({ name: 'select' });
    },
  },

  computed: {},
};
</script>

<style scoped></style>
