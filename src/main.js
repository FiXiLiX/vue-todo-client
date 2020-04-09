import axios from 'axios'
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'

Vue.prototype.$serverUrl = 'http://localhost:3000'

new Vue({
  render: h => h(App),
}).$mount('#app')
