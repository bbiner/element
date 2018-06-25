// 内部私有常量
const _DEFAULT_PAGE_SIZE = 10
const _DEFAULT_PAGE_SIZES = [30, 80, 150, 300]

/**
 * 分页信息
 */
class Pagination {
  constructor ({page = 1, totalRow = 0, totalPage = 1, pageSize = _DEFAULT_PAGE_SIZE}) {
    this.currentPage = page
    this.totalRow = totalRow
    this.totalPage = totalPage
    this.pageSize = pageSize
    this.pageSizes = _DEFAULT_PAGE_SIZES
    this.urls = null
  }

  setPageSize (pageSize) {
    this.pageSize = pageSize > 0 ? pageSize : _DEFAULT_PAGE_SIZE
  }

  setUrls (urls) {
    this.urls = urls
  }
}

class PaginationParam {
  constructor () {
    this.totalRow = 0
    this.totalPage = 0
  }

  setTotalRow (totalRow) {
    this.totalRow = totalRow > 0 ? totalRow : 0
  }

  setTotalPage (totalPage) {
    this.totalPage = totalPage > 0 ? totalPage : 0
  }
}

class PaginationUrl {
  constructor ({self = '', previous = '', next = '', first = '', last = ''}) {
    this.self = self
    this.previous = previous
    this.next = next
    this.first = first
    this.last = last
  }
}

/**
 * 从头部 x-pagination-info 解析基本的分页信息
 *
 * @param paginationInfo
 * @returns {PaginationParam}
 */
const parseParam = ({paginationInfo}) => {
  // 分割信息
  let params = paginationInfo.split(', ').filter(function (value) {
    return value !== '' && value.indexOf('="') && value.endsWith('"')
  })

  let ret = {}
  params.forEach(function (item) {
    // count="1" 解析成的 value 要去掉首尾的引号
    let idx = item.indexOf('=')
    let key = item.substring(0, idx)

    ret[key] = item.substring(idx + 2, item.length - 1)
  })

  let paginationParam = new PaginationParam()
  paginationParam.setTotalRow(ret.rows)
  paginationParam.setTotalPage(ret.count)

  return paginationParam
}

/**
 * 从头部 link 解析当前页、首页、上一页、下一页、尾页 的访问地址
 * @param link
 * @returns {PaginationUrl}
 */
const parseLink = ({link}) => {
  let links = link.split(',').filter(function (value) {
    return value !== '' && value.startsWith('<') &&
      value.indexOf('>; rel="') && value.endsWith('"')
  })

  let url = {}
  links.forEach(function (item) {
    let params = item.match(/^<(.*?)>; rel="(.*?)"$/)
    if (params.length === 3) {
      url[params[2]] = params[1]
    }
  })

  return new PaginationUrl(url)
}

const parsePageSize = (url) => {
  // http://xxxxx.com/customer/system/rest-example/persons/1/labels?page=1&pagesize=10
  let pageSize = 10
  let values = url.match(/^http:.*\?.*&pagesize=(\d+).*$/)
  if (values === 2) {
    pageSize = values[1]
  }

  return pageSize
}

/**
 * 解析分页参数
 * @param headers 响应头
 * @returns {Pagination}
 */
const pagination = (headers) => {
  // 解析分页参数
  const params = parseParam({paginationInfo: headers['x-pagination-info']})
  // 解析页码
  const urls = parseLink({link: headers['link']})
  // 解析 pageSize
  const pageSize = parsePageSize(urls.first)

  let pagination = new Pagination({
    totalRow: params.totalRow, totalPage: params.totalPage
  })
  pagination.setUrls(urls)
  pagination.setPageSize(pageSize)

  return pagination
}

export default {
  pagination
}
