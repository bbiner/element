// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// Element UI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// Cookie
import VueCookie from 'vue-cookie'
// Awesome Icon
import Icon from 'vue-awesome/components/Icon'
import 'vue-awesome/icons'
// Custom Css
import './assets/styles/element-reset.scss'
import './assets/styles/animation.scss'
import './assets/styles/transition.scss'

Vue.use(ElementUI)
Vue.use(VueCookie)

Vue.component('icon', Icon)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
