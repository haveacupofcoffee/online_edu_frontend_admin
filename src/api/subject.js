import request from '@/utils/request'

const API_NAME = '/eduservice/subject'

export default {
  getAllSubjects() {
    return request({
      url: `${API_NAME}`,
      method: 'get'
    })
  }
}

