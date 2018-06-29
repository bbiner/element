import http from '@/utils/http'
import string from '@/utils/string'

const BANNER_GET_URL = '/boss-api/common/banners'
const BANNER_ONLINE_URL = '/boss-api/common/banners/{id}/online'
const BANNER_OFFLINE_URL = '/boss-api/common/banners/{id}/offline'

const BANNER_ADD_URL = '/boss-api/common/banners'
const BANNER_EDIT_URL = '/boss-api/common/banners/'
const BANNER_UPLOAD_COMFIRM_URL = '/boss-api/file/images'

const BANNER_UP_URL = '/boss-api/common/banners/{id}/up'
const BANNER_DOWN_URL = '/boss-api/common/banners/{id}/down'
const BANNER_DELETE_URL = '/boss-api/common/banners/{id}'

const bannerApi = {
  get ({title, status, onlineAtStart, onlineAtEnd, offlineAtStart, offlineAtEnd}, cb) {
    http.get(BANNER_GET_URL, {
      params:
        {
          title: title,
          status: status,
          online_at_start: onlineAtStart,
          online_at_end: onlineAtEnd,
          offline_at_start: offlineAtStart,
          offline_at_end: offlineAtEnd
        }
    }).then(response => {
      cb(response)
    })
  },
  putOnline ({id}, cb) {
    http.put(string.sprintf(BANNER_ONLINE_URL, {'id': id})).then(response => {
      cb(response)
    })
  },
  putOffline ({id}, cb) {
    http.put(string.sprintf(BANNER_OFFLINE_URL, {'id': id})).then(response => {
      cb(response)
    }).catch(trace => {
      cb(trace.response)
    })
  },
  up ({id}, cb) {
    http.put(string.sprintf(BANNER_UP_URL, {'id': id})).then(response => {
      cb(response)
    }).catch(trace => {
      cb(trace.response)
    })
  },
  down ({id}, cb) {
    http.put(string.sprintf(BANNER_DOWN_URL, {'id': id})).then(response => {
      cb(response)
    }).catch(trace => {
      cb(trace.response)
    })
  },
  create ({title, imageUrl, url, onlineAt, nowOnline, offlineAt, neverOffline}) {
    return http.post(BANNER_ADD_URL, {
      'title': title,
      'image_url': imageUrl,
      'url': url,
      'online_at': onlineAt,
      'now_online': nowOnline,
      'offline_at': offlineAt,
      'never_offline': neverOffline
    })
  },
  edit ({id, title, imageUrl, url, onlineAt, nowOnline, offlineAt, neverOffline}) {
    return http.put(BANNER_EDIT_URL + id, {
      'title': title,
      'image_url': imageUrl,
      'url': url,
      'online_at': onlineAt,
      'now_online': nowOnline,
      'offline_at': offlineAt,
      'never_offline': neverOffline
    })
  },
  confirmUpload ({files}) {
    return http.put(BANNER_UPLOAD_COMFIRM_URL, {'files': files})
  },
  delete ({id}, cb) {
    http.delete(string.sprintf(BANNER_DELETE_URL, {'id': id})).then(response => {
      cb(response)
    }).catch(trace => {
      cb(trace.response)
    })
  }
}

export { bannerApi }
