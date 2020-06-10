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
      AQUI ENLAZA CON LA PLATAFORMA DE PAGO CON TARJETA DEL SABADELL
    </p>

    <b-button type="is-success" @click="correct">VOLVER</b-button>
  </div>
</template>

<script>
export default {
  name: 'lopd',
  methods: {
    back() {
      this.$router.go(-1);
    },

    correct() {
      this.$router.replace({ name: 'select' });
    },
  },
};
</script>

<style scoped></style>
