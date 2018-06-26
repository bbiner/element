import http from '@/utils/http'

const PROFILE_URL = '/boss-api/own/profiles'

export default {
  profile (cb) {
    http.get(PROFILE_URL)
      .then(response => cb(response))
      .catch(trace => cb(trace.response))
  }
}
