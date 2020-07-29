<template>
  <div>
    <div>
      <p>{{ title }}</p>
    </div>
    <div>
      <p v-html="privacy"></p>
    </div>
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
