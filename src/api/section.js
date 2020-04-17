import request from '@/utils/request'
const API_NAME = '/eduservice/section'

export default {

  saveSection(section) {
    return request({
      url: `${API_NAME}`,
      method: 'post',
      data: section
    })
  },

  updateSectionInfoById(section) {
    return request({
      url: `${API_NAME}/${section.id}`,
      method: 'put',
      data: section
    })
  },

  getSectionInfoById(id) {
    return request({
      url: `${API_NAME}/${id}`,
      method: 'get'
    })
  },

  removeSectionById(id) {
    return request({
      url: `${API_NAME}/${id}`,
      method: 'delete'
    })
  }
}
