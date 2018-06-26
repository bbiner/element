import http from '@/utils/http'
import string from '@/utils/string'

const ARTICLE_URL = ''

const ARTICLE_CATEGORY_GET_URL = '/boss-api/communities/articles/categories'
const ARTICLE_CATEGORY_ONLINE_URL = '/boss-api/communities/articles/categories/{id}/online'
const ARTICLE_CATEGORY_OFFLINE_URL = '/boss-api/communities/articles/categories/{id}/offline'

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
    })
  }
}

export { articleApi }
