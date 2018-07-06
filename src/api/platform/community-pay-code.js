import http from '@/utils/http'
import Qs from 'qs'

const URL = '/boss-api/communities/pay-codes'

export default {
  list (search, cb) {
    http.get(URL, {
      params: search
    }).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  make ({level}, cb) {
    const postData = Qs.stringify({level: level})

    http.post(URL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response))
      .catch(trace => cb(trace.response))
  }
}
