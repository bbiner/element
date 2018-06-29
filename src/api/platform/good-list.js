import http from '@/utils/http'
import Qs from 'qs'
// 商品列表
const GOOD_LIST_URL = '/boss-api/communities/shops/goods'

export default {
  // 获取商品列表
  list (form, cb) {
    http.get(GOOD_LIST_URL, {params: form}, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  // 上下架商品
  grounding (id, state, cb) {
    let postData = Qs.stringify({status: state})
    http.put(GOOD_LIST_URL + '/' + id + '/statuses', postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  // 删除商品
  del (id, cb) {
    http.delete(GOOD_LIST_URL + '/' + id, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response))
      .catch(trace => cb(trace.response))
  }
}
