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
import axios from 'axios';

export default {
  name: 'recoverpass',
  data() {
    return {
      emailLocal: '',
      error: false,
      correct: false,
    };
  },

  methods: {
    async recovery() {
      try {
        const data = await axios({
          method: 'post',
          url: 'recovery',
          data: { email: this.emailLocal },
        });

        if (data.data.data === 'error') {
          this.error = true;
        } else {
          this.correct = true;
        }
      } catch (error) {
        return false;
      }
    },
  },
};
</script>

<style scoped></style>
