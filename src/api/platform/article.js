import http from '@/utils/http'
import string from '@/utils/string'

const ARTICLE_URL = ''

const ARTICLE_GET_URL = '/boss-api/communities/articles'
const ARTICLE_POST_URL = '/boss-api/communities/articles'
const ARTICLE_PUT_URL = '/boss-api/communities/articles/{id}'
const ARTICLE_ONLINE_URL = '/boss-api/communities/articles/{id}/online-ats'
const ARTICLE_OFFLINE_URL = '/boss-api/communities/articles/{id}/offline-ats'
const ARTICLE_PASS_URL = '/boss-api/communities/articles/{id}/approved-statuses'
const ARTICLE_REJECT_URL = '/boss-api/communities/articles/{id}/unapproved-statuses'
const ARTICLE_CHOSEN_URL = '/boss-api/communities/articles/choice'
const ARTICLE_UNCHOSEN_URL = '/boss-api/communities/articles/{id}/choice-statuses'

const ARTICLE_CATEGORY_GET_URL = '/boss-api/communities/articles/categories'
const ARTICLE_CATEGORY_ONLINE_URL = '/boss-api/communities/articles/categories/{id}/online'
const ARTICLE_CATEGORY_OFFLINE_URL = '/boss-api/communities/articles/categories/{id}/offline'
const ARTICLE_CATEGORY_ADD_URL = '/boss-api/communities/articles/categories'
const ARTICLE_CATEGORY_UP_URL = '/boss-api/communities/articles/categories/{id}/up'
const ARTICLE_CATEGORY_DOWN_URL = '/boss-api/communities/articles/categories/{id}/down'
const ARTICLE_CATEGORY_DELETE_URL = '/boss-api/communities/articles/categories/{id}'

const articleApi = {
  get (data, cb) {
    http.get(ARTICLE_GET_URL, {
      params: data
    }).then(response => {
      cb(response)
    })
  },
  putOnline ({id}, cb) {
    http.put(string.sprintf(ARTICLE_ONLINE_URL, {'id': id})).then(response => {
      cb(response)
    })
  },
  putOffline ({id}, cb) {
    http.put(string.sprintf(ARTICLE_OFFLINE_URL, {'id': id})).then(response => {
      cb(response)
    }).catch(trace => {
      cb(trace.response)
    })
  },
  putApprovedStatus ({id}, cb) {
    http.put(string.sprintf(ARTICLE_PASS_URL, {'id': id})).then(response => {
      cb(response)
    }).catch(trace => {
      cb(trace.response)
    })
  },
  putUnApprovedStatus ({id}, cb) {
    http.put(string.sprintf(ARTICLE_REJECT_URL, {'id': id})).then(response => {
      cb(response)
    }).catch(trace => {
      cb(trace.response)
    })
  },
  choice ({ids}, cb) {
    http.put(ARTICLE_CHOSEN_URL, {ids: ids}).then(response => {
      cb(response)
    }).catch(trace => {
      cb(trace.response)
    })
  },
  unchoice ({id}, cb) {
    http.put(string.sprintf(ARTICLE_UNCHOSEN_URL, {'id': id}), {action: 'remove'}).then(response => {
      cb(response)
    }).catch(trace => {
      cb(trace.response)
    })
  },
  create ({title, source, content, coverPic, articleCategoryId, onlineAt, nowOnline}) {
    return http.post(ARTICLE_POST_URL,
      {
        title: title,
        source: source,
        content: content,
        cover_pic: coverPic,
        article_category_id: articleCategoryId,
        online_at: onlineAt,
        now_online: nowOnline
      }
    )
  },
  edit ({id, title, source, content, coverPic, articleCategoryId, onlineAt, nowOnline}) {
    return http.put(string.sprintf(ARTICLE_PUT_URL, {'id': id}),
      {
        title: title,
        source: source,
        content: content,
        cover_pic: coverPic,
        article_category_id: articleCategoryId,
        online_at: onlineAt,
        now_online: nowOnline
      }
    )
  }
}

const articleCategoryApi = {
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

export { articleApi, articleCategoryApi }
