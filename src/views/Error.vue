<template>
  <div>
    <article class="message is-danger">
      <div class="message-header">
        <p>Success</p>
      </div>
      <div class="message-body">
        <p>NO SE HA PODIDO COMPLETAR LA COMPRA</p>

        <b-button type="is-danger" @click="cancel">CANCELAR</b-button>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  name: 'error',

  methods: {
    cancel() {
      this.$router.replace({ name: 'sector' });
    },
  },
};
</script>

<style scoped></style>
