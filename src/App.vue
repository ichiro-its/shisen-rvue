<template>
  <div id="app">
    <v-app>
      <Header :app="app"/>
      <SnackBar :app="app"/>
      <v-main>
        <router-view :app="app"/>
      </v-main>
      <Footer :app="app"/>
    </v-app>
  </div>
</template>

<script>
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import SnackBar from '@/components/SnackBar'

export default {
  name: 'shisen-app',
  components: {
    Footer,
    Header,
    SnackBar,
  },
  data() {
    return {
      app: {
        title: 'Shisen RVue',
        project: 'Shisen RVue',
        version: '0.2.1',
        log(message) {
          console.log(message);
        }
      },
      snackbar: true,
    };
  },
  mounted() {
    this.$router.push('/');
  },
}
</script>