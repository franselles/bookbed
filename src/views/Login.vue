<template>
  <div>
    <div class="has-text-centered">
      <p>PLAYASBENIDORM.APP</p>

      <img src="@/assets/logo.png" alt="rabenidorm" />
    </div>

    <form @submit.prevent="login">
      <b-field label="CORREO ELECTRÓNICO">
        <b-input type="email" maxlength="30" v-model="email" required>
        </b-input>
      </b-field>

      <b-field label="CONTRASEÑA">
        <b-input type="password" v-model="password" password-reveal required>
        </b-input>
      </b-field>

      <article class="message is-danger" v-if="error">
        <div class="message-body">
          USUARIO O CONTRASEÑA INCORRECTOS
        </div>
      </article>

      <div class="buttons">
        <b-button
          type="is-success is-fullwidth"
          native-type="submit"
          :disabled="offline"
          >ENTRAR</b-button
        >
        <b-button type="is-info is-outlined" @click="logup" :disabled="offline"
          >REGISTRARSE</b-button
        >
        <b-button
          type="is-danger is-outlined"
          @click="recover"
          :disabled="offline"
          >HE OLVIDADO MI CONTRASEÑA</b-button
        >
      </div>
      <div class="control">
        <b-taglist attached>
          <b-tag type="is-dark">version</b-tag>
          <b-tag type="is-info">0.3.9</b-tag>
        </b-taglist>
      </div>
    </form>

    <article class="message is-danger" v-if="offline">
      <div class="message-body">
        ESTABLECIENDO CONEXIÓN, ESPERE.
      </div>
    </article>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: '',
      offline: true,
      error: false,
    };
  },

  mounted() {
    this.checkServer().then(result => {
      if (result) {
        this.offline = false;
      }
    });
  },

  methods: {
    ...mapActions('userStore', ['getUser', 'checkServer']),
    ...mapMutations('userStore', ['setEmail']),

    logup() {
      this.$router.push({ name: 'logup' });
    },

    login() {
      this.getUser({
        email: this.email,
        password: this.password,
      }).then(response => {
        if (response) {
          this.setEmail(this.email);
          this.$router.push({ name: 'select' });
        } else {
          this.error = true;
        }
      });
    },

    recover() {
      this.setEmail(this.email);
      this.$router.push({ name: 'recoverpass' });
    },
  },
  computed: {
    checkEmailFormat: function () {
      let mailformat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

      if (mailformat.test(this.email)) {
        return {
          type: 'is-success',
          message: 'This email is valid',
          valid: true,
        };
      }
      return {
        type: 'is-danger',
        message: 'This email is invalid',
        valid: false,
      };
    },
  },
};
</script>

<style scoped></style>
