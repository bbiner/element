import http from '@/utils/http'
import Qs from 'qs'

const SAVE_GOOD_URL = '/boss-api/communities/shops/goods'
const GET_GOOD_URL = '/boss-api/communities/shops/goods'

export default {
  // 添加商品
  add (form, cb) {
    // http login
    let postData = Qs.stringify(form)

    http.post(SAVE_GOOD_URL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  // 编辑商品
  edit (form, id, cb) {
    // http login
    let postData = Qs.stringify(form)
    http.put(SAVE_GOOD_URL + '/' + id, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  // 获取某个商品详情
  getDetail (id, cb) {
    http.get(GET_GOOD_URL + '/' + id, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response))
      .catch(trace => cb(trace.response))
  }
}
