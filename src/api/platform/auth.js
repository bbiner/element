import http from '@/utils/http'
import Qs from 'qs'

const AUTHORIZATION_URL = '/boss-api/auth/tokens'

export default {
  token ({loginAccount, password}, cb) {
    // http login
    let postData = Qs.stringify({
      login_account: loginAccount,
      password: password
    })

    http.post(AUTHORIZATION_URL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response))
      .catch(trace => cb(trace.response))
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
