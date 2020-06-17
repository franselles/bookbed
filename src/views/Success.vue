<template>
  <div>
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
        <p>POR SEGURIDAD VUELVA A ENTRAR EN LA APP</p>
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
      this.$router.push({ name: 'login' });
    },
  },
};
</script>

<style scoped></style>
