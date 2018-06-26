import http from '@/utils/http'
import string from '@/utils/string'

const ARTICLE_URL = ''

const ARTICLE_CATEGORY_GET_URL = '/boss-api/communities/articles/categories'
const ARTICLE_CATEGORY_ONLINE_URL = '/boss-api/communities/articles/categories/{id}/online'
const ARTICLE_CATEGORY_OFFLINE_URL = '/boss-api/communities/articles/categories/{id}/offline'
const ARTICLE_CATEGORY_ADD_URL = '/boss-api/communities/articles/categories'
const ARTICLE_CATEGORY_UP_URL = '/boss-api/communities/articles/categories/{id}/up'
const ARTICLE_CATEGORY_DOWN_URL = '/boss-api/communities/articles/categories/{id}/down'
const ARTICLE_CATEGORY_DELETE_URL = '/boss-api/communities/articles/categories/{id}'

const articleApi = {
  create ({title, content}, cb) {
    http.post(ARTICLE_URL, {title, content}).then(response => {
      cb(response)
    })
  },
  get ({title}, cb) {
    http.get(ARTICLE_CATEGORY_GET_URL).then(response => {
      cb(response)
    })
  },
  putOnline ({id}, cb) {
    http.put(string.sprintf(ARTICLE_CATEGORY_ONLINE_URL, {'id': id})).then(response => {
      cb(response)
    })
  },
  putOffline ({id}, cb) {
    http.put(string.sprintf(ARTICLE_CATEGORY_OFFLINE_URL, {'id': id})).then(response => {
      cb(response)
    }).catch(trace => {
      cb(trace.response)
    })
  },
  up ({id}, cb) {
    http.put(string.sprintf(ARTICLE_CATEGORY_UP_URL, {'id': id})).then(response => {
      cb(response)
    }).catch(trace => {
      cb(trace.response)
    })
  },
  down ({id}, cb) {
    http.put(string.sprintf(ARTICLE_CATEGORY_DOWN_URL, {'id': id})).then(response => {
      cb(response)
    }).catch(trace => {
      cb(trace.response)
    })
  },
  addCategory ({title, nowOnline}, cb) {
    http.post(ARTICLE_CATEGORY_ADD_URL, {'title': title, 'now_online': nowOnline}).then(response => {
      cb(response)
    }).catch(trace => {
      cb(trace.response)
    })
  },
  delete ({id}, cb) {
    http.delete(string.sprintf(ARTICLE_CATEGORY_DELETE_URL, {'id': id})).then(response => {
      cb(response)
    }).catch(trace => {
      cb(trace.response)
    })
  }
}

export { articleApi }
