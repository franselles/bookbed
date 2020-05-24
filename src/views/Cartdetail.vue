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

    <article class="message is-primary">
      <div class="message-header">
        <p>RESERVA DE HAMACAS</p>
      </div>
      <div class="message-body">
        <b-field>
          <div>
            USUARIO:<span class="has-text-weight-bold"> {{ user.name }}</span>
          </div>
        </b-field>
        <b-field>
          <div>
            TELEFONO:<span class="has-text-weight-bold"> {{ user.phone }}</span>
          </div>
        </b-field>
      </div>
    </article>

    <!-- :class=" items.date == date ? 'message is-primary' : ' message is-warning' " -->

    <div v-for="items in ticketsDay" :key="items.index" class="card-custom">
      <article :class="stateTicket(items)">
        <div class="message-body">
          <b-field v-if="items.used">
            <div>
              ESTADO DEL TICKET:
              <span class="tag is-danger is-medium has-text-weight-bold"
                >USADO</span
              >
            </div>
          </b-field>
          <b-field>
            <div>
              FECHA TICKET:
              <span class="tag is-black is-medium has-text-weight-bold">{{
                formatDate(items.date)
              }}</span>
            </div>
          </b-field>
          <b-field>
            <div>
              ID:
              <span class="has-text-weight-bold">{{ items.itemID }} </span>
            </div>
          </b-field>
          <b-field>
            <div>
              CIUDAD:<span class="has-text-weight-bold">
                {{ items.cityID }} - {{ items.city }}</span
              >
            </div>
          </b-field>
          <b-field>
            <div>
              PLAYA:<span class="has-text-weight-bold">
                {{ items.beachID }} - {{ items.beach }}</span
              >
            </div>
          </b-field>
          <b-field>
            <div>
              SECTOR:<span class="has-text-weight-bold">
                {{ items.sectorID }} - {{ items.sector }}</span
              >
            </div>
          </b-field>
          <b-field>
            <div>
              NÚMERO:<span class="has-text-weight-bold">
                {{ items.numberItem }}</span
              >
            </div>
          </b-field>
          <div>
            <qrcode-vue :value="items._id" :size="size" level="H"></qrcode-vue>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import QrcodeVue from 'qrcode.vue';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'cartdetail',
  components: {
    QrcodeVue,
  },
  data() {
    return {
      ticketsDay: [],
      size: 250,
      date: dayjs(new Date()).format('YYYY-MM-DD'),
    };
  },

  mounted() {
    const userID = this.user.userID;
    this.getCartsDetail({ userID, date: this.date }).then(result => {
      this.ticketsDay = result;
    });
  },

  methods: {
    ...mapActions('userStore', ['getCartsDetail']),

    back() {
      this.$router.go(-1);
    },

    formatDate(date) {
      return dayjs(date).format('DD-MM-YYYY');
    },

    stateTicket(item) {
      if (item.used == true) {
        return 'message is-danger';
      }

      if (item.date == this.date) {
        return 'message is-primary';
      }

      return 'message is-warning';
    },
  },

  computed: {
    ...mapState('userStore', ['user']),
  },
};
</script>

<style scoped>
.card-custom {
  padding-bottom: 30px;
}
</style>
