<template>
  <div class="container">
    <div v-if="correct">
      <form @submit.prevent="recovery">
        <b-form-group
          id="password"
          label="CONTRASEÑA"
          label-for="password"
          description="Introduzca la nueva contraseña."
        >
          <b-form-input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Contraseña"
          ></b-form-input>
        </b-form-group>

        <b-form-group
          id="password2"
          label="CONTRASEÑA"
          label-for="password2"
          description="Repita la nueva contraseña."
        >
          <b-form-input
            id="password2"
            v-model="password2"
            type="password"
            required
            placeholder="Contraseña"
          ></b-form-input>
        </b-form-group>

        <div class="alert alert-danger" role="alert" v-if="!checkPassword">
          LAS CONTRASEÑAS NO COINCIDEN.
        </div>

        <b-button
          block
          type="submit"
          variant="primary"
          :disabled="!checkPassword"
          >ACTUALIZAR</b-button
        >
      </form>
    </div>

    <div class="alert alert-danger" role="alert" v-if="error">
      PROCESO CADUCADO.
    </div>

    <div class="alert alert-success" role="alert" v-if="completed">
      CONTRASEÑA ACTUALIZADA. VUELVA A ENTRAR A LA APLICACIÓN.
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'newpass',
  data() {
    return {
      password: null,
      password2: null,
      token: '',
      correct: false,
      error: true,
      completed: false,
    };
  },

  mounted() {
    this.token = this.$route.params.token;
    if (!this.token || this.token == '') {
      return;
    }

    this.checkTokenPass({
      token: this.token,
    }).then(result => {
      if (result.data == 'ok') {
        this.correct = true;
        this.error = false;
      }
    });
  },

  methods: {
    async updatePassword(payload) {
      try {
        const data = await axios({
          method: 'post',
          url: 'updated',
          data: payload,
        });

        return data.data;
      } catch (error) {
        return false;
      }
    },

    async checkTokenPass(payload) {
      try {
        const data = await axios({
          method: 'get',
          url: 'recovery',
          params: {
            tokenRecovery: payload.token,
          },
        });

        return data.data;
      } catch (error) {
        return false;
      }
    },

    recovery() {
      this.updatePassword({
        tokenRecovery: this.token,
        password: this.password,
      }).then(result => {
        if (result.data == 'ok') {
          this.correct = false;
          this.error = false;
          this.completed = true;
        } else {
          this.correct = true;
          this.error = true;
        }
      });
    },
  },

  computed: {
    checkPassword: function () {
      return this.password == this.password2;
    },
  },
};
</script>

<style scoped></style>
