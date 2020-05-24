<template>
  <div>
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li>
          <a href="#" @click="back"
            ><b-icon icon="arrow-left-thick"></b-icon> VOLVER</a
          >
        </li>
        <li>{{ user.name }}</li>
      </ul>
    </nav>

    <article class="message is-info">
      <div class="message-body">
        <b-button type="is-info" @click="checkIn" expanded>RESERVAR</b-button>
      </div>
    </article>

    <article class="message is-warning">
      <div class="message-body">
        <b-button type="is-warning" @click="booked" expanded
          >VER RESERVA DEL DIA</b-button
        >
      </div>
    </article>

    <article class="message is-primary">
      <div class="message-body">
        <b-button type="is-primary" @click="shopped" expanded
          >VER COMPRAS REALIZADAS</b-button
        >
      </div>
    </article>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Select',
  data() {
    return {};
  },

  methods: {
    checkIn() {
      this.$router.push({ name: 'citybeaches' });
    },

    booked() {
      this.$router.push({ name: 'cartdetail' });
    },

    shopped() {
      this.$router.push({ name: 'cartsuser' });
    },

    back() {
      this.$router.go(-1);
    },
  },

  computed: {
    ...mapState('userStore', ['user']),
  },
};
</script>

<style scoped></style>
