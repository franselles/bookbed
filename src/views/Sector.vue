<template>
  <div>
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li>
          <a href="#" @click="back"
            ><b-icon icon="arrow-left-thick"></b-icon> VOLVER</a
          >
        </li>
        <li>{{ localUser.name }}</li>
        <li>
          <a href="#" @click="logout"
            ><b-icon icon="home-circle"></b-icon> SALIR DE LA APP</a
          >
        </li>
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
      <a href="#" @click="back" class="button">
        <b-icon icon="arrow-left-thick"></b-icon>
        <span>VOLVER SELECCIONAR ZONA</span></a
      >
    </b-field>

    <b-field>
      <b-icon icon="arrow-bottom-left-thick"></b-icon>PRIMERA LINEA DE PLAYA
    </b-field>

    <div>
      <div class="columns is-mobile">
        <div class="column is-narrow" style="width: 30px;" id="beach"></div>

        <div class="column">
          <b-field>
            <table>
              <tr v-for="line in statusSector" :key="line.index">
                <td v-for="cell in line" :key="cell.index">
                  <div class="cell">
                    <b-button
                      v-if="cell.filled == 1"
                      size="is-small"
                      type="is-danger"
                      disabled
                      >X</b-button
                    >
                    <b-button
                      v-else-if="cell.filled == 2"
                      size="is-small"
                      type="is-primary"
                      @click="pushed(cell)"
                      >R</b-button
                    >
                    <b-button
                      v-show="!cell.empty == 1"
                      v-else-if="cell.empty == 1"
                      size="is-small"
                      disabled
                    >
                    </b-button>
                    <b-button
                      v-else-if="cell.empty == 0 && cell.typeID == 9"
                      size="is-small"
                      type="is-success"
                      @click="pushed(cell)"
                      >{{ cell.col }}-{{ cell.row }}</b-button
                    >
                    <b-button
                      v-else
                      size="is-small"
                      type="is-warning"
                      @click="pushed(cell)"
                      >{{ cell.col }}-{{ cell.row }}</b-button
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
        <h6 class="is-size-7">TODOS LOS PRECIOS CON EL I.V.A. INCLUIDO</h6>
      </div>
    </article>

    <article class="message is-danger" v-if="detailDuplicated.length > 0">
      <div class="message-header">
        <p>ELEMENTOS NO DISPONIBLES</p>
      </div>
      <div class="message-body">
        <p>SE RETIRAN DE LAS RESERVAS</p>
        <table class="table is-striped">
          <thead>
            <tr>
              <th class="is-size-7">#</th>
              <th class="is-size-7">FECHA</th>
              <th class="is-size-7">SECT</th>
              <th class="is-size-7">C/F</th>
              <th class="is-size-7">PRECIO</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in detailDuplicated" :key="item.index">
              <td class="is-size-7">{{ index + 1 }}</td>
              <td class="is-size-7">{{ formatDate(item.date) }}</td>
              <td class="is-size-7">{{ item.sectorID }}</td>
              <td class="is-size-7">{{ item.col }}-{{ item.row }}</td>
              <td class="is-size-7">{{ item.price }} €</td>
            </tr>
          </tbody>
        </table>
      </div>
    </article>

    <b-field>
      <b-button
        size="is-large"
        icon-left="basket-fill"
        :disabled="enableButtonCart"
        expanded
        @click="addCart"
      >
        AÑADIR RESERVA
      </b-button>
    </b-field>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import dayjs from 'dayjs';

export default {
  name: 'sector',
  data() {
    return {
      statusSector: [],
      tempoSector: [],
      date: null,
      enableButtonCart: true,
      cartLocal: {
        date: null,
        userID: null,
        phone: null,
        ticketID: null,
        canceled: false,
        payed: false,
        detail: [],
      },
      statusCart: {
        qty: 0,
        import: 0,
      },
      detailDuplicated: [],
      localUser: '',
    };
  },
  mounted() {
    // this.date = dayjs(this.dateActual).toDate();
    // this.localUser = JSON.parse(sessionStorage.getItem('user-id'));
    this.getUserID().then(result => {
      this.localUser = result;
    });
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
    ]),
    ...mapMutations('userStore', ['setCart']),
    ...mapActions('userStore', ['checkCart', 'getUserID']),

    getSectorLocal() {
      this.statusSector = [];
      this.tempoSector = [];

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
            this.tempoSector.push(line);
            line = [];
          }
        }

        this.renderGroup();
        // this.updateState();
      });
    },

    renderGroup() {
      const cn = this.group.col;
      const rn = this.group.row;

      for (let c = cn * 10; c < cn * 10 + this.group.numberCols; c++) {
        let line = [];
        for (let r = rn * 5; r < rn * 5 + this.group.numberRows; r++) {
          line.push(this.tempoSector[c][r]);
        }
        this.statusSector.push(line);
      }
      this.updateState();
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
            this.tempoSector[col - 1][row - 1].filled = 2;
          }
        }
      }

      this.setEnableButtonCart();
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

    setEnableButtonCart() {
      if (this.cartLocal.detail.length == 0) {
        this.enableButtonCart = true;
      } else {
        this.enableButtonCart = false;
      }
    },

    generateUUID(s) {
      let d = new Date().getTime();
      const uuid = s.replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });
      return uuid;
    },

    pushed(e) {
      if (e.filled == 2) {
        this.tempoSector[e.col - 1][e.row - 1].filled = 0;

        for (let i = this.cartLocal.detail.length - 1; i >= 0; i--) {
          if (
            this.cartLocal.detail[i].col === e.col &&
            this.cartLocal.detail[i].row === e.row
          ) {
            this.cartLocal.detail.splice(i, 1);
          }
        }
      } else {
        this.tempoSector[e.col - 1][e.row - 1].filled = 2;

        if (this.cartLocal.date == null) {
          this.cartLocal.date = dayjs(new Date()).format('YYYY-MM-DD');
          this.cartLocal.userID = this.localUser.userID;
          this.cartLocal.phone = this.localUser.phone;

          this.cartLocal.ticketID = null;

          this.cartLocal.canceled = false;
          this.cartLocal.payed = false;
          this.cartLocal.detail.push({
            date: this.dateActual,
            cityID: e.cityID,
            city: e.city,
            beachID: e.beachID,
            beach: e.beach,
            sectorID: e.sectorID,
            sector: e.sector,
            typeID: e.typeID,
            type: e.type,
            itemID: e.itemID + this.generateUUID('xxxxx'),
            col: e.col,
            row: e.row,
            price: e.price,
            codeID: null,
            used: false,
            dateTimeUsed: '',
            numberItem: e.numberItem,
          });
        } else {
          this.cartLocal.detail.push({
            date: this.dateActual,
            cityID: e.cityID,
            city: e.city,
            beachID: e.beachID,
            beach: e.beach,
            sectorID: e.sectorID,
            sector: e.sector,
            typeID: e.typeID,
            type: e.type,
            itemID: e.itemID + this.generateUUID('xxxxx'),
            col: e.col,
            row: e.row,
            price: e.price,
            codeID: null,
            used: false,
            dateTimeUsed: '',
            numberItem: e.numberItem,
          });
        }
      }

      this.setEnableButtonCart();
      this.calcStatusCart();
      this.setCart(this.cartLocal);
    },

    addDay(n) {
      let checkDay = dayjs(this.date).add(n, 'days').format('YYYY-MM-DD');

      if (checkDay < dayjs(new Date()).format('YYYY-MM-DD')) return;

      this.date = checkDay;
      this.setDateActual(this.date);
      this.getSectorLocal();
    },

    async check() {
      this.detailDuplicated = [];
      try {
        await this.checkCart({ cart: this.cartLocal.detail }).then(result => {
          this.detailDuplicated = result;

          result.forEach(element => {
            const index = this.cartLocal.detail.findIndex(
              (p => p.citiID === element.cityID) &&
                (p => p.beachID === element.beachID) &&
                (p => p.sectorID === element.sectorID) &&
                (p => p.typeID === element.typeID) &&
                (p => p.col === element.col) &&
                (p => p.row === element.row)
            );

            this.cartLocal.detail.splice(index, 1);
          });

          if (this.detailDuplicated.length > 0) {
            this.setCart(this.cartLocal);
          }
        });
      } catch (error) {
        console.log(error);
      }
    },

    async addCart() {
      await this.check();

      if (this.detailDuplicated.length > 0) {
        this.getSectorLocal();
        return;
      }

      this.setCart(this.cartLocal);
      this.$router.replace({ name: 'cart' });
    },

    back() {
      this.$router.go(-1);
    },

    logout() {
      this.$router.replace({ name: 'login' });
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
      'group',
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
