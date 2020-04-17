import request from '@/utils/request'

const API_NAME = '/eduservice/course'

export default {

  /**
   * Save course
   * @param courseInfo
   */
  saveCourseInfo(courseInfo) {
    return request({
      url: `${API_NAME}`,
      method: 'post',
      data: courseInfo
    })
  },

  /**
   * get course basic info by id
   * @param id
   */
  getCourseInfoById(id) {
    return request({
      url: `${API_NAME}/${id}`,
      method: 'get'
    })
  },


  updateCourseById(courseInfo) {
    return request({
      url: API_NAME,
      method: 'put',
      data: courseInfo
    })
  },

  getCoursePublishInfoById(id) {
    return request({
      url: `${API_NAME}/course-publish-info/${id}`,
      method: 'get'
    })
  },

  publishCourse(id) {
    return request({
      url: `${API_NAME}/publish-course/${id}`,
      method: 'put'
    })
  },

  getCoursesByPageAndQuery(page, limit, courseQuery) {
    return request({
      url: `${API_NAME}/${page}/${limit}`,
      method: 'get',
      params: courseQuery
    })
  },

}
