import http from 'axios'
import store from '@/store'
import { LOGOUT } from '@/store/action-names'
import { APP_ENV, BASE_API_URL } from '@/.env'

// 非本地环境的设置项
if (APP_ENV !== 'local') {
  // 设置 base_url
  http.defaults.baseURL = BASE_API_URL
}

// 默认超时时间
http.defaults.timeout = 5000
// 启用全局 cookie
http.defaults.withCredentials = true

// 通用头部信息设置

// http 请求拦截器
http.interceptors.request.use(
  config => {
    // console.log('authorization', store.getters.authorization)
    // 判断是否存在 token，如果存在的话，则每个 http header 都加上 token
    if (store.getters.authorization) {
      config.headers.Authorization = store.getters.authorization
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  response => {
    // console.log('http.interceptors: ', response)
    return response
  },
  error => {
    // console.log('http.interceptors: ', error, error.response)
    const response = error.response || {}
    if (response.status === 401) {
      // 未认证
      store.dispatch(LOGOUT)
    }
    return Promise.reject(error)
  }
)

export default http
