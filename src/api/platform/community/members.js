import Http from '@/utils/http'
const MEMBERS_URL = '/boss-api/communities/members'
class Community {
  members (params) {
    return new Promise((resolve, reject) => {
      Http.get(MEMBERS_URL, {params: params})
        .then(response => {
          if (response.status === 200) {
            resolve(response)
          }
        })
        .catch(error => {
          reject(error.statusText)
        })
    })
  }
}

export default Community
