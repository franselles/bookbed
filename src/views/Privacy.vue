<template>
  <div>
    <header class="site-header">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 text-center">
            <h1 class="white-color">{{ title }}</h1>
            <ul class="breadcrumb">
              <li><a href="https://playasbenidorm.app/">Home</a></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
    <div class="section-padding">
      <div class="container">
        <div class="row">
          <div class="col-xs-12">
            <article class="main">
              <div id="app">
                <div data-v-b7193556="">
                  <div data-v-b7193556="">
                    <p data-v-b7193556="">{{ title }}</p>
                  </div>
                  <div data-v-b7193556="">
                    <p data-v-b7193556="" v-html="privacy"></p>
                  </div>
                </div>
              </div>
            </article>
            <div class="space-100"></div>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer-Area -->
    <!-- Footer-Bootom -->
    <div class="footer-bottom">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-12 text-center">
            <span>Copyright &copy; Playas Benidorm</span>
            <div class="space-30 hidden visible-xs"></div>
            <br /><br />
            <a href="https://playasbenidorm.app/#/privacy">{{ title }}</a>
          </div>
        </div>
      </div>
    </div>
    <!-- Footer-Area-End -->
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'privacy',
  data() {
    return {
      privacy: '',
      title: '',
    };
  },

  mounted() {
    this.getPrivacy();
  },

  methods: {
    async getPrivacy() {
      try {
        const data = await axios({
          method: 'get',
          url: '/getSection/privacy',
        });

        this.privacy = data.data.content;
        this.title = data.data.title;
      } catch (error) {
        return false;
      }
    },
  },
};
</script>

<style scoped></style>
