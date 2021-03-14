import Vue from 'vue'

import App from './App.vue'
import router from './router'
import axios from 'axios'
import com from './api/Com'

axios.defaults.baseURL="http://192.168.11.75:8013" 
//192.168.11.75  http://192.168.22.2:8013  http://192.168.11.75:8013
axios.defaults.headers["Authorization"]=com.getToken();
Vue.config.productionTip = false
Vue.prototype.$http=axios
Vue.prototype.$com=com

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

