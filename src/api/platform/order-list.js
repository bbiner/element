import http from '@/utils/http'
import Qs from 'qs'
// 订单列表
const ORDER_LIST_URL = '/boss-api/communities/shops/orders'

export default {
  // 获取订单列表
  list (form, cb) {
    http.get(ORDER_LIST_URL, {params: form}, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  // 发货
  deliver (orderId, form, cb) {
    // http login
    let postData = Qs.stringify(form)
    http.put(ORDER_LIST_URL + '/' + orderId, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response))
      .catch(trace => cb(trace.response))
  },
  // 获取订单物流轨迹
  trace (orderId, cb) {
    http.get(ORDER_LIST_URL + '/' + orderId + '/expresses', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response))
      .catch(trace => cb(trace.response))
  }
}
