import request from '@/utils/request'

const API_NAME = '/eduservice/lecturer'

export default {

  /**
   * find lecturer by id
   * @param id: lecturer id
   */
  findLecturerById(id) {
    return request({
      url: `${API_NAME}/${id}`,
      method:'get'
    })
  },

  /**
   * find all lecturers
   */
  findAllLecturers() {
    return request({
      url: `${API_NAME}`,
      method:'get'
    })
  },

  /**
   * update lecturer according to lecturer id
   * @param lecturer, lecturer object
   */
  updateLecturerById(lecturer) {
    return request({
      url: `${API_NAME}`,
      method:'post',
      data:lecturer
    })
  },

  /**
   * find lectures by page and query conditions
   * @param pageId ： current page ID
   * @param pageSize: count of lecturers in one page
   * @param eduLecturerQuery : query conditions
   */
  findLecturerByPageAndQueryCondition(pageId, pageSize, eduLecturerQuery) {
    return request({
      url: `${API_NAME}/page/${pageId}/${pageSize}`,
      method:'post',
      //parse eduLecturerQuery to JSON to interact with backend service
      data: eduLecturerQuery
    })
  },

  /**
   * remove lecturer by id
   * @param id, lecturer id
   */
  removeLecturerById(id) {
    return request({
      url:`${API_NAME}/${id}`,
      method:'delete'
    })
  },

  /**
   * save lecturer
   * @param lecturer, lecture object
   */
  saveLecturer(lecturer) {
    return request({
      url:`${API_NAME}`,
      method:'post',
      data:lecturer

    })
  }



}
