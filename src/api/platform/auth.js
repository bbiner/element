import http from '@/utils/http'
import Qs from 'qs'

const SALT_URL = '/boss-api/auth/salts'
const AUTHORIZATION_URL = '/boss-api/auth/tokens'

export default {
  token ({loginAccount, password}, cb) {
    http.get(SALT_URL, {
      params: {
        login_account: loginAccount
      }
    }).then(response => {
      const status = response.status || 0
      const body = response.data || {}
      if (status === 200 && body.hasOwnProperty('code') && body['code'] === 1000 && body.hasOwnProperty('data')) {
        // http login
        let postData = Qs.stringify({
          login_account: loginAccount,
          password: password,
          salt: body['data']
        })

        http.post(AUTHORIZATION_URL, postData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(response => cb(response))
          .catch(trace => cb(trace.response))
      }
    }).catch(trace => cb(trace.response))
  },
  refresh (cb) {
    http.put(AUTHORIZATION_URL)
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  logout (cb) {
    http.delete(AUTHORIZATION_URL)
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  }
}
