<template>
  <div>
    <article class="message is-success">
      <div class="message-header">
        <p>Success</p>
      </div>
      <div class="message-body">
        <p>COMPRA REALIZADA CON EXITO</p>

        <b-button type="is-danger" @click="cancel">ACEPTAR</b-button>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'success',

  methods: {
    cancel() {
      this.$router.replace({ name: 'sector' });
    },
  },
};
</script>

<style scoped></style>
