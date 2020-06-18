<template>
  <div>
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li>
          <a href="#" @click="logout"
            ><b-icon icon="home-circle"></b-icon>SALIR DE LA APP</a
          >
        </li>
      </ul>
    </nav>
    <article class="message is-danger">
      <div class="message-header">
        <p>ERROR NO SE HA COMPLETADO</p>
      </div>
      <div class="message-body">
        <div class="block">
          <b-icon icon="minus-circle-outline"></b-icon>
        </div>
        <p>NO SE HA PODIDO COMPLETAR LA COMPRA</p>
        <p>GRACIAS POR RESERVAR HAMACAS CON R.A. BENIDORM</p>
        <br />

        <b-button type="is-danger" expanded @click="cancel">ERROR</b-button>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'error',

  methods: {
    cancel() {
      this.$router.push({ name: 'select' });
    },

    logout() {
      this.$router.replace({ name: 'login' });
    },
  },
};
</script>

<style scoped></style>
