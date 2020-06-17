<template>
  <div>
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li>
          <a href="#" @click="back"
            ><b-icon icon="arrow-left-thick"></b-icon> VOLVER</a
          >
        </li>
        <li>{{ localUser.name }}</li>
      </ul>
    </nav>

    <article class="message is-info">
      <div class="message-body">
        <b-button type="is-info" @click="checkIn" expanded>RESERVAR</b-button>
      </div>
    </article>

    <article class="message is-success">
      <div class="message-body">
        <b-button type="is-success" @click="booked" expanded
          >TICKETS DEL DIA</b-button
        >
      </div>
    </article>

    <article class="message is-warning">
      <div class="message-body">
        <b-button type="is-warning" @click="shopped" expanded
          >HISTORIAL COMPRAS REALIZADAS</b-button
        >
      </div>
    </article>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Select',
  data() {
    return { localUser: '' };
  },

  mounted() {
    this.getUserID().then(result => {
      this.localUser = result;
    });
  },

  methods: {
    ...mapActions('userStore', ['getUserID']),

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
