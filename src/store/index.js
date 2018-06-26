import Vue from 'vue'
import Vuex from 'vuex'
// import * as actions from './actions'
// import * as getters from './getters'
import actions from './actions'
import getters from './getters'
import user from './modules/platform/user'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    user
  },
  strict: debug,
  plugins: [createPersistedState()]
})
