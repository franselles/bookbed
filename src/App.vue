<template>
  <section id="app" class="section">
    <router-view />
  </section>
</template>

<script>
import axios from 'axios';

export default {
  mounted() {
    axios.interceptors.response.use(
      response => {
        return response;
      },
      error => {
        if (401 === error.response.status) {
          this.$store.commit('usersStore', 'setLogout');
          this.$router.push({ name: 'login' });
        } else {
          return Promise.reject(error);
        }
      }
    );
  },
};
</script>

<style></style>
