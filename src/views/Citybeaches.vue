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

    <b-field label="SELLECIONA FECHA DE RESERVA">
      <div>
        <b-datepicker
          v-model="dateLocal"
          inline
          :day-names="calendar.days"
          :month-names="calendar.months"
          :first-day-of-week="1"
          :nearby-month-days="false"
          :min-date="minDate"
          :focused-date="dateLocal"
          trap-focus
        >
        </b-datepicker>
      </div>
    </b-field>
    <h6 class="title is-6">SELECIONA CIUDAD</h6>
    <b-field>
      <div class="buttons">
        <b-radio-button
          v-for="item in citiesLocal"
          :key="item.index"
          :native-value="item.cityID"
          type="is-success"
          v-model="cityID"
          @click.native="changeCity(item)"
        >
          {{ item.city }}
        </b-radio-button>
      </div>
    </b-field>

    <b-field>
      <div v-if="cityLocal">
        <h6 class="title is-6">SELECIONA PLAYA</h6>

        <div class="buttons">
          <b-radio-button
            v-for="item in beachesLocal"
            :key="item.index"
            :native-value="item.beachID"
            type="is-warning"
            v-model="beachID"
            @click.native="changeBeach(item)"
          >
            {{ item.beach }}
          </b-radio-button>
        </div>
      </div>
    </b-field>

    <b-field>
      <div v-if="beachLocal">
        <img :src="beachLocal.image1" />
      </div>
    </b-field>

    <b-field>
      <div v-if="beachLocal">
        <h6 class="title is-6">SECTORES DE LA PLAYA {{ beachLocal.beach }}</h6>
        <div class="buttons">
          <b-radio-button
            v-for="item in sectorsLocal"
            :key="item.index"
            :native-value="item.sectorID"
            v-model="sectorID"
            @click.native="selectSector(item)"
          >
            {{ item.sectorID }}
          </b-radio-button>
        </div>
      </div>
    </b-field>

    <b-field>
      <div class="buttons">
        <b-button
          type="is-primary"
          expanded
          @click="sectorSelected"
          :disabled="buttonSelect"
          >{{ sectorSelectedMsg }}</b-button
        >
      </div>
    </b-field>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { mapActions, mapMutations, mapState } from 'vuex';
export default {
  name: 'citybeaches',

  data() {
    return {
      calendar: {
        months: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre',
        ],
        days: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
      },
      cityID: null,
      beachID: null,
      sectorID: null,
      cityLocal: null,
      beachLocal: null,
      sectorLocal: null,
      dateLocal: null,
      citiesLocal: [],
      beachesLocal: [],
      sectorsLocal: [],
      sectorSelectedMsg: '',
      buttonSelect: true,
      minDate: null,
    };
  },
  mounted() {
    this.dateLocal = new Date();
    this.minDate = dayjs(new Date()).add(-1, 'days').$d;
    this.getCities().then(response => {
      this.citiesLocal = response;
    });
  },
  methods: {
    ...mapActions('worksStore', ['getCities', 'getBeaches', 'getSectors']),
    ...mapMutations('worksStore', [
      'setDateActual',
      'setCityActual',
      'setBeachActual',
      'setSectorActual',
    ]),

    changeCity(event) {
      this.getBeaches(event.cityID).then(response => {
        this.cityLocal = event;
        this.beachesLocal = response;
      });
    },

    changeBeach(event) {
      this.getSectors({ cityID: event.cityID, beachID: event.beachID }).then(
        response => {
          this.beachLocal = event;
          this.sectorsLocal = response;
        }
      );
    },

    selectSector(event) {
      this.sectorLocal = event;
      this.sectorSelectedMsg = event.sector;
      this.buttonSelect = false;
    },

    sectorSelected() {
      this.setDateActual(dayjs(this.dateLocal).format('YYYY-MM-DD'));
      this.setCityActual(this.cityLocal);
      this.setBeachActual(this.beachLocal);
      this.setSectorActual(this.sectorLocal);

      this.$router.push({ name: 'groupsector' });
    },

    back() {
      this.$router.go(-1);
    },
  },

  computed: {
    ...mapState('userStore', ['user']),
  },
};
</script>

<style scoped></style>
