<template>
  <div>
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
        <p>POR SEGURIDAD VUELVA A ENTRAR EN LA APP</p>
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
      this.$router.push({ name: 'login' });
    },
  },
};
</script>

<style scoped></style>
