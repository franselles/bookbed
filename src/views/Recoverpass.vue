<template>
  <div class="container">
    <div class="alert alert-primary" role="alert">
      PROCESO DE RECUPERACION DE CONTRASEÑA
    </div>
    <form @submit.prevent="recovery">
      <b-form-group
        id="emailLocal"
        label="CORREO ELECTRÓNICO"
        label-for="emailLocal"
        description="Introduzca su correo electrónico."
      >
        <b-form-input
          id="emailLocal"
          v-model="emailLocal"
          type="email"
          required
          placeholder="Correo electrónico"
        ></b-form-input>
      </b-form-group>

      <b-button block type="submit" variant="primary">ENTRAR</b-button>
    </form>

    <div class="alert alert-danger" role="alert" v-if="error">
      EMAIL INCORRECTO O NO EXISTE
    </div>

    <div class="alert alert-success" role="alert" v-if="correct">
      REVISE SU CORREO ELECTRÓNICO. <br />
      REVISE LA BANDEJA DE SPAM. <br />
      Y SIGA LAS INSTRUCCIONES PARA RECUPERAR LA CONTRASEÑA.
    </div>
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
