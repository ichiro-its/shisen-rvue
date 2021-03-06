import Vue from 'vue'
import App from './App'
import vuetify from './plugins/vuetify'
import router from './plugins/router'
import './plugins/register-sw'

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  render: h => h(App),
}).$mount('#app')
