// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// Element UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

// Cookie
import VueCookie from 'vue-cookie'
Vue.use(VueCookie)

Vue.config.productionTip = false

// Custom Css
import './assets/styles/element-reset.scss'
import './assets/styles/animation.scss'
import './assets/styles/transition.scss'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
