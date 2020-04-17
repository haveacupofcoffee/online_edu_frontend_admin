import request from '@/utils/request'
const API_NAME = '/eduservice/chapter'

export default {

  getNestedChaptersListByCourseId(courseId) {
    return request({
      url: `${API_NAME}/nestedlist/${courseId}`,
      method: 'get'
    })
  },

  saveChapter(chapter) {
    return request({
      url: API_NAME,
      method: 'post',
      data: chapter
    })
  },

  getChapterById(id) {
    return request({
      url: `${API_NAME}/${id}`,
      method: 'get'
    })
  },

  updateChapterById(chapter) {
    return request({
      url: `${API_NAME}/${chapter.id}`,
      method: 'put',
      data: chapter
    })
  },
  removeChapterById(id) {
    return request({
      url: `${API_NAME}/${id}`,
      method: 'delete'
    })
  },
}
