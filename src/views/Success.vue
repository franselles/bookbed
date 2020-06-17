<template>
  <div>
    <article class="message is-success">
      <div class="message-header">
        <p>Success</p>
      </div>
      <div class="message-body">
        <p>COMPRA REALIZADA CON EXITO</p>

        <b-button type="is-danger" @click="goOn">ACEPTAR</b-button>
      </div>
    </article>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'success',

  methods: {
    ...mapActions('userStore', ['getUserID']),

    goOn() {
      this.getUserID().then(() => {
        this.getUserID(), this.$router.replace({ name: 'select' });
      });
    },
  },
};
</script>

<style scoped></style>
