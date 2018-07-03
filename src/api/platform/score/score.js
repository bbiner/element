import Http from '@/utils/http'
// import Qs from 'qs'

// 积分任务列表
export const TASK_URL = '/boss-api/communities/integral-store/tasks'
// 切换积分任务状态
export const TASK_MODIFY_STATUS_URL = '/boss-api/communities/integral-store/task-status/'
// 任务发放积分明细
export const TASK_LOG_URL = '/boss-api/communities/integral-store/logs'
// 全部积分列表
export const SCORE_URL = '/boss-api/communities/integral-store'
// 切换会员积分状态
export const SCORE_STATUS_URL = '/boss-api/communities/integral-store/score-status/'
// 单个积分用户
export const SCORE_USER_URL = '/boss-api/communities/integral-store/user-score/'
// 单个积分用户明细
export const SCORE_USER_LOGS_URL = '/boss-api/communities/integral-store/user-scores/'
// 修改用户积分
export const SCORE_MODIFY_URL = '/boss-api/communities/integral-store/score/'
// 单条任务详情
export const TASK_DETAIL_URL = '/boss-api/communities/integral-store/task/'
// 首次登陆积分方案
export const TASK_FIRST_LOGIN_URL = '/boss-api/communities/integral-store/scheme-login'
// 阅读文章积分方案
export const TASK_ARTICLE_READ_URL = '/boss-api/communities/integral-store/scheme-read'
// 点赞积分方案
export const TASK_ARTICLE_LIEK_URL = '/boss-api/communities/integral-store/scheme-like'
// 文章分享方案
export const TASK_ARTICLE_SHARE_URL = '/boss-api/communities/integral-store/scheme-share'
// 每日签到
export const TASK_USER_SIGN_URL = '/boss-api/communities/integral-store/scheme-sign'
// 发布原创文章
export const TASK_ARTICLE_PUBLISH_URL = '/boss-api/communities/integral-store/scheme-publish'
class Score {
  request (http) {
    return new Promise((resolve, reject) => {
      http.then(response => {
        if (response.status === 200 || response.status === 204) {
          resolve(response)
        }
        reject(response)
      })
        .catch(trace => {
          reject(trace.response)
        })
    })
  }

  /**
   * get获取数据
   *
   * @returns {*}
   */
  get (url, params = {}) {
    return this.request(Http.get(url, {params: params}))
  }

  /**
   * put修改数据
   *
   * @param url
   * @param params
   * @returns {*}
   */
  put (url, params = {}) {
    return this.request(Http.put(url, params), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  /**
   * 切换任务状态
   *
   * @param taskId
   * @param status
   * @returns {*}
   */
  modifyStatus (taskId, status) {
    return this.request(Http.put(TASK_MODIFY_STATUS_URL + taskId, {status: status}), {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

export default Score
