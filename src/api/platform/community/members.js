import Http from '@/utils/http'
const MEMBERS_URL = '/boss-api/communities/members'
class Community {
  members (params) {
    return new Promise((resolve, reject) => {
      Http.get(MEMBERS_URL, {params: params})
        .then(response => {
          console.log('response', response)
          if (response.status === 200 || response.status === 204) {
            resolve(response.data)
          }
        })
        .catch(error => {
          reject(error.statusText)
        })
    })
  }

  pagination (data) {
    if (typeof data !== 'object') return {}
    return {
      currentPage: data.current_page,
      pageSize: data.per_page,
      totalRow: data.total
    }
  }
}

export default Community
