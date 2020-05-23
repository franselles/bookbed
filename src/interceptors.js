import axios from 'axios';

export default function setup() {
  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (401 === error.response.status) {
        //Vue.store.commit('usersStore', 'setLogout');
        console.log('expired');

        this.$router.push({ name: 'login' });
      } else {
        return Promise.reject(error);
      }
    }
  );

  //   axios.interceptors.response.use(undefined, function (err) {
  //     console.log('axios');

  //     return new Promise(function () {
  //       console.log(err);

  //       if (err.status === 401) {
  //         // if you ever get an unauthorized, logout the user
  //         this.$store.commit('usersStore', 'setLogout');
  //         this.$router.replace({ name: 'login' });
  //         // you can also redirect to /login if needed !
  //       }
  //       throw err;
  //     });
  //   });
}
