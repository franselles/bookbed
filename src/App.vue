<template>
  <section id="app" class="section">
    <router-view />
  </section>
</template>

<script>
import axios from 'axios';

export default {
  mounted() {
    axios.interceptors.request.use(
      config => {
        axios.defaults.headers.common['authorization'] =
          'Bearer ' + sessionStorage.getItem('user-token');
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

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
