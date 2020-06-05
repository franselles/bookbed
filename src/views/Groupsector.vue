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

    <article class="message is-warning">
      <div class="message-header">
        <p>{{ sectorActual.sector }} PLAYA {{ beachActual.beach }}</p>
      </div>
      <div class="message-body">
        <b-field>
          <div class="field is-grouped">
            <p class="control">
              <b-button type="button" class="button" @click="addDay(-1)">
                <b-icon icon="chevron-left" both />
              </b-button>
            </p>

            <p class="control">
              <span class="tag is-large">{{ dateFormated }}</span>
            </p>

            <p class="control">
              <b-button type="button" class="button" @click="addDay(1)">
                <b-icon icon="chevron-right" both />
              </b-button>
            </p>
          </div>
        </b-field>
      </div>
    </article>

    <b-field>
      <b-icon icon="arrow-bottom-left-thick"></b-icon>PRIMERA LINEA DE PLAYA
    </b-field>

    <div>
      <div class="columns is-mobile">
        <div class="column is-narrow" style="width: 30px;" id="beach"></div>

        <div class="column">
          <b-field>
            <table>
              <tr v-for="line in groupLocal" :key="line.index">
                <td v-for="cell in line" :key="cell.index">
                  <div class="cell">
                    <b-button
                      size="is-small"
                      type="is-warning"
                      @click="pushed(cell)"
                      >{{ cell.row }}-{{ cell.col }}</b-button
                    >
                  </div>
                </td>
              </tr>
            </table>
          </b-field>
        </div>
      </div>
    </div>

    <br />

    <article class="message is-info" v-if="statusCart.qty > 0">
      <div class="message-body">
        NÚMERO DE ELEMENTOS:
        <strong>{{ statusCart.qty }} <br /> </strong> IMPORTE:
        <strong>{{ statusCart.import }} € </strong>
      </div>
    </article>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import dayjs from 'dayjs';

export default {
  name: 'groupsector',
  data() {
    return {
      statusSector: [],
      date: null,
      cartLocal: {
        date: null,
        userID: null,
        phone: null,
        ticketID: null,
        canceled: false,
        detail: [],
      },
      statusCart: {
        qty: 0,
        import: 0,
      },
      groupLocal: [],
    };
  },
  mounted() {
    // this.date = dayjs(this.dateActual).toDate();
    this.date = this.dateActual;

    // this.sectorLocal = this.sectorActual;
    if (this.cart != null) {
      this.cartLocal = this.cart;
    }

    this.getSectorLocal();
  },
  methods: {
    ...mapActions('worksStore', ['getStateSector', 'getSector']),
    ...mapMutations('worksStore', [
      'setDateActual',
      'setSectorActual',
      'setCart',
      'setGroup',
    ]),
    ...mapMutations('userStore', ['setCart', 'checkCart']),
    ...mapActions('userStore', ['checkCart']),

    getSectorLocal() {
      this.statusSector = [];

      this.getSector({
        cityID: this.cityActual.cityID,
        beachID: this.beachActual.beachID,
        sectorID: this.sectorActual.sectorID,
      }).then(() => {
        this.getStateSectorItemsLocal(this.sectorActual.rows);
      });
    },

    getStateSectorItemsLocal(rows) {
      this.getStateSector({
        cityID: this.cityActual.cityID,
        beachID: this.beachActual.beachID,
        sectorID: this.sectorActual.sectorID,
        date: this.date,
        // typeID: this.typeIDActual,
      }).then(() => {
        let line = [];
        for (let c = 0; c < this.stateSector.length; c++) {
          line.push(this.stateSector[c]);

          if ((c + 1) % rows == 0) {
            this.statusSector.push(line);
            line = [];
          }
        }
        this.getStateGroupItemsLocal();
      });
    },

    getStateGroupItemsLocal() {
      let cn = Math.floor(this.statusSector.length / 10);
      const cnRemainder = this.statusSector.length % 10;
      if (cnRemainder > 0) cn++;
      let rn = Math.floor(this.statusSector[0].length / 5);
      const rnRemainder = this.statusSector[0].length % 5;
      if (rnRemainder > 0) rn++;

      for (let c = 0; c < cn; c++) {
        let line = [];
        for (let r = 0; r < rn; r++) {
          line.push({
            row: r,
            col: c,
            numberRows: r + 1 == rn && rnRemainder > 0 ? rnRemainder : 5,
            numberCols: c + 1 == cn && cnRemainder > 0 ? cnRemainder : 10,
            cityID: this.cityActual.cityID,
            beachID: this.beachActual.beachID,
            sectorID: this.sectorActual.sectorID,
          });
        }
        this.groupLocal.push(line);
      }
    },

    updateState() {
      if (this.cartLocal.date != null) {
        for (let i = this.cartLocal.detail.length - 1; i >= 0; i--) {
          let col = this.cartLocal.detail[i].col;
          let row = this.cartLocal.detail[i].row;

          if (
            this.cartLocal.detail[i].date == this.dateActual &&
            this.cartLocal.detail[i].cityID == this.cityActual.cityID &&
            this.cartLocal.detail[i].beachID == this.beachActual.beachID &&
            this.cartLocal.detail[i].sectorID == this.sectorActual.sectorID
          ) {
            this.statusSector[col - 1][row - 1].filled = 2;
          }
        }
      }

      this.calcStatusCart();
    },

    calcStatusCart() {
      let amountItems = 0;
      let amountPrice = 0;

      this.cartLocal.detail.forEach(element => {
        amountItems++;
        amountPrice += element.price;
      });

      this.statusCart.qty = amountItems;
      this.statusCart.import = amountPrice;
    },

    pushed(e) {
      this.setGroup(e);
      this.$router.push({ name: 'sector' });
    },

    addDay(n) {
      let checkDay = dayjs(this.date).add(n, 'days').format('YYYY-MM-DD');

      if (checkDay < dayjs(new Date()).format('YYYY-MM-DD')) return;

      this.date = checkDay;
      this.setDateActual(this.date);
      this.getSectorLocal();
    },

    back() {
      this.$router.go(-1);
    },

    formatDate(date) {
      return dayjs(date).format('DD-MM-YY');
    },
  },
  computed: {
    ...mapState('userStore', ['user', 'cart']),
    ...mapState('worksStore', [
      'dateActual',
      'cityActual',
      'beachActual',
      'typeIDActual',
      'sectorActual',
      'stateSector',
    ]),

    dateFormated: function () {
      return dayjs(this.date).format('DD-MM-YYYY');
    },
  },
};
</script>

<style scoped>
.cell {
  padding: 5px;
}

#beach {
  background-image: url('../assets/beach.png');
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
