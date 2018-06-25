import http from 'axios'

// 默认超时时间
http.defaults.timeout = 5000
// 启用全局 cookie
http.defaults.withCredentials = true

// 通用头部信息设置

export default http
