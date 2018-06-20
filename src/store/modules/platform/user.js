// import api from '../../../api/platform/user'
import { USER_STATUS_CLEAR, USER_STATUS_SAVED } from '../../mutation-types'

// state
const state = {
  error: null,
  isLogin: false,
  info: null
}

// getters
const getters = {
  // isLogin: state => state.isLogin,
  // info: state => state.info
}

// actions
const actions = {
  login ({commit}, {user}) {
    commit(USER_STATUS_SAVED, {user: user})
  },
  logout ({commit}) {
    commit(USER_STATUS_CLEAR)
    // api.logout((response) => commit(USER_STATUS_CLEAR))
  }
}

// mutations
const mutations = {
  [USER_STATUS_SAVED] (state, {user}) {
    if (user !== undefined && user !== null && user.hasOwnProperty('name')) {
      state.isLogin = true
      state.info = user
    }
  },
  [USER_STATUS_CLEAR] (state) {
    state.isLogin = false
    state.info = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
