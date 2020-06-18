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
    <article class="message is-success">
      <div class="message-header">
        <p>COMPLETADO CON EXITO</p>
      </div>
      <div class="message-body">
        <div class="block">
          <b-icon icon="check-bold"></b-icon>
        </div>
        <p>GRACIAS POR RESERVAR HAMACAS CON R.A. BENIDORM</p>
        <p>COMPRA REALIZADA CON EXITO</p>
        <br />

        <b-button type="is-success" expanded @click="goOn">ACEPTAR</b-button>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'success',

  methods: {
    goOn() {
      this.$router.push({ name: 'select' });
    },

    logout() {
      this.$router.replace({ name: 'login' });
    },
  },
};
</script>

<style scoped></style>
