import { AUTH_STATUS_CLEAR, AUTH_STATUS_SAVED, USER_PROFILE_CLEAR, USER_PROFILE_SAVED } from '@/store/mutation-types'
import { LOGIN, LOGOUT } from '@/store/action-names'
import UserApi from '@/api/platform/user'

// state
const state = {
  token: null,
  userProfile: null
}

// getters
const getters = {
  isLogin: state => state.token && state.token['expires_at'] && state.token['expires_at'] > new Date().getTime(),
  authorization: state => {
    if (state.token && state.token.hasOwnProperty('access_token')) {
      if (state.token['token_type'] && state.token['token_type'].toLowerCase() === 'bearer') {
        return `Bearer ${state.token['access_token']}`
      }
    }

    return null
  },
  getUser: state => state.userProfile
}

// actions
const actions = {
  [LOGIN] ({commit}, {token}) {
    commit(AUTH_STATUS_SAVED, {token: token})

    // 获取用户数据
    UserApi.profile(response => {
      const status = response.status || 0
      const body = response.data || {}
      if (status === 200) {
        commit(USER_PROFILE_SAVED, {user: body})
      } else {
        commit(USER_PROFILE_CLEAR)
      }
    })
  },
  [LOGOUT] ({commit}) {
    commit(AUTH_STATUS_CLEAR)
    commit(USER_PROFILE_CLEAR)
  }
}

// mutations
const mutations = {
  [AUTH_STATUS_SAVED] (state, {token}) {
    if (token !== undefined && token !== null && token.hasOwnProperty('access_token')) {
      state.token = token

      // 记录过期时间点
      const expiresIn = token['expires_in'] || 3600
      state.token['expires_at'] = new Date().getTime() + expiresIn * 1000
    }
  },
  [AUTH_STATUS_CLEAR] (state) {
    state.token = null
  },
  [USER_PROFILE_SAVED] (state, {user}) {
    state.userProfile = user && user.hasOwnProperty('id') ? user : null
  },
  [USER_PROFILE_CLEAR] (state) {
    state.userProfile = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
