<template>
  <div>
    <p>PROCESO DE RECUPERACION DE CONTRASEÑA</p>
    <form @submit.prevent="recovery">
      <b-field label="CORREO ELECTRÓNICO">
        <b-input type="email" maxlength="30" v-model="emailLocal" required>
        </b-input>
      </b-field>
      <div class="buttons">
        <b-button type="is-success is-fullwidth" native-type="submit"
          >ENTRAR</b-button
        >
      </div>
    </form>
    <article class="message is-danger" v-if="error">
      <div class="message-body">
        EMAIL INCORRECTO O NO EXISTE
      </div>
    </article>
    <article class="message is-success" v-if="correct">
      <div class="message-body">
        <p>REVISE SU CORREO ELECTRÓNICO.</p>
        <p>REVISE LA BANDEJA DE SPAM.</p>
        <p>Y SIGA LAS INSTRUCCIONES PARA</p>
        <p>RECUPERAR LA CONTRASEÑA.</p>
      </div>
    </article>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
export default {
  name: 'recoverpass',
  data() {
    return {
      emailLocal: '',
      error: false,
      correct: false,
    };
  },

  mounted() {
    this.emailLocal = this.email;
  },

  methods: {
    ...mapActions('userStore', ['checkEmailRecovery']),

    recovery() {
      this.checkEmailRecovery({
        email: this.emailLocal,
      }).then(result => {
        if (result.data == '') {
          this.error = true;
        } else {
          this.correct = true;
        }
      });
    },
  },

  computed: {
    ...mapState('userStore', ['email']),
  },
};
</script>

<style scoped></style>
