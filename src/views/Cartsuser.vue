<template>
  <div>
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li>
          <a href="#" @click="back"
            ><b-icon icon="arrow-left-thick"></b-icon> VOLVER</a
          >
        </li>
        <li>{{ user.name }}</li>
      </ul>
    </nav>
    <b-field>
      <div>
        <p class="title is-4">
          RESERVA DE HAMACAS
        </p>
      </div>
    </b-field>

    <div v-for="items in cartsLocal" :key="items.index">
      <b-field>
        <div>
          FECHA TICKET:
          <span class="has-text-weight-bold"
            >{{ formatDate(items.date) }}
          </span>
        </div>
      </b-field>
      <b-field>
        <div>
          TICKET:
          <span class="has-text-weight-bold">{{ items.ticketID }} </span>
        </div>
      </b-field>
      <b-field>
        <div>
          USUARIO:<span class="has-text-weight-bold"> {{ items.userID }}</span>
        </div>
      </b-field>
      <b-field>
        <div>
          TELEFONO:<span class="has-text-weight-bold"> {{ items.phone }}</span>
        </div>
      </b-field>

      <b-field>
        <table class="table is-striped">
          <thead>
            <tr>
              <th class="is-size-7">#</th>
              <th class="is-size-7">RESERVA</th>
              <th class="is-size-7">SECTOR</th>
              <th class="is-size-7">NÚMERO</th>
              <th class="is-size-7">PRECIO</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items.detail" :key="item.index">
              <td class="is-size-7">{{ index + 1 }}</td>
              <td class="is-size-7">{{ formatDate(item.date) }}</td>
              <td class="is-size-7">{{ item.sectorID }}</td>
              <td class="is-size-7">{{ item.numberItem }}</td>
              <td class="is-size-7">{{ item.price }} €</td>
            </tr>
          </tbody>
        </table>
      </b-field>
      <div class="is-divider">---------------------------</div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'cartsuser',
  data() {
    return {
      cartsLocal: [],
    };
  },

  mounted() {
    this.getCarts({ userID: this.user.userID }).then(result => {
      this.cartsLocal = result;
    });
  },

  methods: {
    ...mapActions('userStore', ['getCarts']),

    back() {
      this.$router.go(-1);
    },

    formatDate(date) {
      return dayjs(date).format('DD-MM-YY');
    },
  },

  computed: {
    ...mapState('userStore', ['user']),
  },
};
</script>

<style scoped></style>
