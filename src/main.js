import Vue from 'vue'
import axios from './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import vant from './plugins/vant'
import global from './plugins/global'
import 'amfe-flexible'
import 'animate.css'
// import Router from 'vue-router'
// const router= new Router({
//   routes:[{

//   }]
// })
Vue.config.productionTip = false
Vue.use(axios)
Vue.use(vant)
Vue.use(global)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
