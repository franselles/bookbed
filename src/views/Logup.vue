<template>
  <div>
    <form @submit.prevent="logup">
      <b-field label="NOMBRE">
        <b-input v-model="name" required></b-input>
      </b-field>

      <b-field
        label="CORREO ELECTRÓNICO"
        :type="checkEmailFormat.type"
        :message="checkEmailFormat.message"
      >
        <b-input
          type="email"
          value="john@"
          maxlength="30"
          v-model="email"
          required
        >
        </b-input>
      </b-field>

      <article class="message is-danger" v-if="emailWrong">
        <div class="message-header">
          <p>ESTE CORREO YA ESTA EN USO</p>
          <button class="delete" aria-label="delete"></button>
        </div>
        <div class="message-body">
          UTILICE OTRO CORREO
        </div>
      </article>

      <b-field label="TELEFONO MOVIL">
        <b-input
          type="number"
          min="0"
          placeholder="123456789"
          oninput="if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
          maxlength="9"
          v-model="phone"
          required
        ></b-input>
      </b-field>

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
          :disabled="disabledButton"
          >REGISTRAR</b-button
        >
        <b-button type="is-danger" @click="cancelReg">CANCELAR</b-button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
export default {
  name: 'logup',
  data() {
    return {
      name: null,
      email: null,
      phone: null,
      password: null,
      password2: null,
      emailWrong: false,
      disabledButton: false,
    };
  },
  methods: {
    ...mapActions('userStore', ['checkEmail', 'postUser']),
    ...mapMutations('userStore', ['setEmail']),

    cancelReg() {
      this.$router.go(-1);
    },

    logup() {
      if (!this.checkPassword) return;

      this.disabledButton = true;

      this.checkEmail({ email: this.email }).then(result => {
        if (result) {
          this.emailWrong = true;
          this.disabledButton = false;
        } else {
          this.emailWorng = false;
          this.postUser({
            name: this.name,
            email: this.email,
            phone: this.phone,
            password: this.password,
            auxID: '',
          }).then(() => {
            this.setEmail(this.email);
            this.$router.replace({ name: 'select' });
          });
        }
      });
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

    checkPassword: function () {
      return this.password == this.password2;
    },
  },
};
</script>

<style scoped></style>
