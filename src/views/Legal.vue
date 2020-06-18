<template>
  <div>
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li>
          <a href="#" @click="back"
            ><b-icon icon="arrow-left-thick"></b-icon> VOLVER</a
          >
        </li>
        <li>
          <a href="#" @click="logout"
            ><b-icon icon="home-circle"></b-icon>SALIR DE LA APP</a
          >
        </li>
      </ul>
    </nav>
    <p>
      CONDICIONES LEGALES DE LA VENTA
    </p>

    <b-button type="is-success" @click="back">VOLVER</b-button>
  </div>
</template>

<script>
export default {
  name: 'lopd',
  methods: {
    back() {
      this.$router.go(-1);
    },

    logout() {
      this.$router.replace({ name: 'login' });
    },
  },
};
</script>

<style scoped></style>
