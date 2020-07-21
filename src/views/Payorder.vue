<template>
  <form
    ref="form"
    name="form"
    action="https://sis-t.redsys.es:25443/sis/realizarPago"
    method="POST"
  >
    <!-- target="_blank" -->
    <input
      type="hidden"
      name="Ds_SignatureVersion"
      :value="Ds_SignatureVersion"
    />
    <input
      type="hidden"
      name="Ds_MerchantParameters"
      :value="Ds_MerchantParameters"
    />
    <input type="hidden" name="Ds_Signature" :value="Ds_Signature" />
  </form>
</template>

<script>
import axios from 'axios';

export default {
  name: 'payorder',
  data() {
    return {
      Ds_SignatureVersion: 'HMAC_SHA256_V1',
      Ds_MerchantParameters: '',
      Ds_Signature: '',
      id: '',
      total: 0,
    };
  },

  mounted() {
    this.id = this.$route.query.id;
    console.log(this.id);
    this.sendPay();
  },

  methods: {
    async sendPay() {
      await this.getTicket();
      await this.makeRedsys();
    },

    async getTicket() {
      try {
        const data = await axios({
          method: 'get',
          url: 'ticket',
          params: {
            id: this.id,
          },
        });
        if (data.data) {
          data.data.detail.forEach(element => {
            this.total += element.price * element.quantity;
          });
        }
      } catch (error) {
        console.log(error);
      }
    },

    async makeRedsys() {
      const Ds_pay = await axios({
        method: 'post',
        url: 'make',
        data: {
          order: this.id,
          amount: this.total,
        },
      });

      this.Ds_MerchantParameters = Ds_pay.data.Ds_MerchantParameters;
      this.Ds_Signature = Ds_pay.data.Ds_Signature;

      setTimeout(() => {
        this.$refs.form.submit();
      }, 9000);
    },
  },
};
</script>

<style scoped></style>
