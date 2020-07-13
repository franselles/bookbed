<template>
  <div>
    <div v-if="correct">
      <form @submit.prevent="recovery">
        <b-field label="CONTRASEÑA">
          <b-input type="password" v-model="password" password-reveal required>
          </b-input>
        </b-field>
        <b-field label="REPITA LA CONTRASEÑA">
          <b-input type="password" v-model="password2" password-reveal required>
          </b-input>
        </b-field>

        <article class="message is-danger" v-if="!checkPassword">
          <div class="message-body">
            LAS CONTRASEÑAS NO COINCIDEN.
          </div>
        </article>

        <div class="buttons">
          <b-button
            type="is-success"
            native-type="submit"
            :disabled="!checkPassword"
            >ACTUALIZAR</b-button
          >
        </div>
      </form>
    </div>

    <div v-if="error">
      <article class="message is-danger">
        <div class="message-body">
          PROCESO CADUCADO.
        </div>
      </article>
    </div>

    <div v-if="completed">
      <article class="message is-success">
        <div class="message-body">
          CONTRASEÑA ACTUALIZADA.
          <p>VUELVA A ENTRAR A LA APLICACIÓN.</p>
        </div>
      </article>
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
    async updatePassword(context, payload) {
      try {
        const data = await axios({
          method: 'post',
          url: '/api/v1/updated',
          data: payload,
        });

        return data.data;
      } catch (error) {
        return false;
      }
    },

    async checkTokenPass(context, payload) {
      try {
        const data = await axios({
          method: 'get',
          url: '/api/v1/recovery',
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
