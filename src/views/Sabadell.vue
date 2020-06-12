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

    <b-button type="is-success" @click="correct">VOLVER</b-button>
    <b-button type="is-success" @click="pruebapug">PRUEBA PAGO</b-button>
  </div>
</template>

<script>
export default {
  name: 'sabadell',
  data() {
    return {};
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
