import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import service from './Utils/https'            // 引入http拦截器
import './assets/download/font/iconfont.css'  // 引入阿里的图标
import Loading from './Utils/load'      // 引入http请求加载动画
import registerToast from './Utils/toast'
Vue.use(Loading)
Vue.use(registerToast)
Vue.config.productionTip = false
Vue.prototype.$https = service
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
