<template>
  <div class="app-container">
    <h2 style="text-align: center;">Publish New Course</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom:
40px;">
      <el-step title="Course Basic Information"/>
      <el-step title="Course Chapter"/>
      <el-step title="Publish"/>
    </el-steps>
    <el-form label-width="150px">
      <el-form-item label="Course Title">
        <el-input v-model="courseInfo.title" placeholder="Example: Java"/>
      </el-form-item>
      <!-- Level One Subject -->
      <el-form-item label="Course Subject">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="Choose"
          @change="levelOneSubjectChanged">
          <el-option
            v-for="subject in levelOneSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="Choose">
          <el-option
            v-for="subject in levelTwoSubjectList"
            :key="subject.value"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>

      </el-form-item>

      <!-- Lecturer-->
      <el-form-item label="Course Lecturer">
        <el-select
          v-model="courseInfo.lecturerId"
          placeholder="Choose">
          <el-option
            v-for="lecturer in lecturerList"
            :key="lecturer.id"
            :label="lecturer.name"
            :value="lecturer.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="Total Chapters">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="Example: 10"/>
      </el-form-item>

      <el-form-item label="Course Price">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="Example: 99"/>
      </el-form-item>
      <!-- Course Description -->
      <el-form-item label="Course Description">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>
      <!-- Course Cover -->

      <el-form-item label="Course Cover">
        <el-upload
          :show-file-list="false"
          :on-success="handleCoverSuccess"
          :before-upload="beforeCoverUpload"
          :action="BASE_API+'/eduaws/course/cover'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">Save&Next</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

  import course from '@/api/course'
  import subject from '@/api/subject'
  import lecturer from '@/api/lecturer'
  import Tinymce from '@/components/Tinymce'
  const defaultForm = {
    title: '',
    subjectId: '',
    lecturerId: '',
    lessonNum: 0,
    description: '',
    cover: process.env.S3_PATH + '/course/covers/default.jpg',
    price: 0
  }
  export default {
    components: { Tinymce },
    data() {
      return {
        courseInfo: defaultForm,
        saveBtnDisabled: false, // if disable save button, default don't
        levelOneSubjectList:[],
        levelTwoSubjectList:[],
        lecturerList:[],
        BASE_API: process.env.BASE_API // API
      }
    },
    watch: {
      $route(to, from) {
        console.log('watch $route')
        this.init()
      }
    },
    created() {
      //console.log('info created')
      this.init()
    },

    methods: {
      init() {
        if (this.$route.params && this.$route.params.id) {
          const id = this.$route.params.id
          this.getCourseInfoById(id)
        } else {
          this.courseInfo = { ...defaultForm }
          this.initSubjectList()
          this.initLecturerList()
        }
      },

      initSubjectList() {
        subject.getAllSubjects().then(response => {
          this.levelOneSubjectList = response.data.subjects
        })
      },

      initLecturerList() {
        lecturer.findAllLecturers().then(response => {
          this.lecturerList = response.data.lecturers
        })
      },

      levelOneSubjectChanged(value) {
        for (let i = 0; i < this.levelOneSubjectList.length; i++) {
          if (this.levelOneSubjectList[i].id === value) {
            this.levelTwoSubjectList = this.levelOneSubjectList[i].children
            this.courseInfo.subjectId = ''
          }
        }
      },

      getCourseInfoById(id) {
        course.getCourseInfoById(id).then(response => {
          this.courseInfo = response.data.courseInfo
          console.log("getCourseInfoById" +  this.courseInfo)
            // init level two subjects
            subject.getAllSubjects().then(response => {
              this.levelOneSubjectList = response.data.subjects
              for (let i = 0; i < this.levelOneSubjectList.length; i++) {
                if (this.levelOneSubjectList[i].id === this.courseInfo.subjectParentId) {
                  this.levelTwoSubjectList = this.levelOneSubjectList[i].children
                }
              }
            })
          this.initLecturerList()
        }).catch((response) => {
          this.$message({
            type: 'error',
            message: response.message
          })
        })
      },


      handleCoverSuccess(res, file) {
        //console.log(res)// 上传响应
        //console.log(URL.createObjectURL(file.raw))// base64编码
        this.courseInfo.cover = res.data.url
      },

      beforeCoverUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isPNG = file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG && !isPNG) {
          this.$message.error('Can only upload JPG or PNG image!')
        }
        if (!isLt2M) {
          this.$message.error("Can't over 2MB")
        }
        return (isJPG || isPNG) && isLt2M
      },

      next() {
        this.saveBtnDisabled = true
        if (!this.courseInfo.id) {

          this.saveCourse()
        } else {
          this.updateCourse()
        }
      },
      // save Course
      saveCourse() {
        course.saveCourseInfo(this.courseInfo).then(response => {
          this.$message({
            type: 'success',
            message: response.data.message
          })
          return response// 将响应结果传递给then
        }).then(response => {
          this.$router.push({ path: '/edu/course/chapter/' + response.data.courseId })
        }).catch((response) => {
          this.$message({
            type: 'error',
            message: response.message
          })
        })
      },

      //Update Course
      updateCourse() {
        this.saveBtnDisabled = true
        console.log(this.courseInfo)
        course.updateCourseById(this.courseInfo).then(response => {
          this.$message({
            type: 'success',
            message: "Update Complete"
          })
          return response// return response to then
        }).then(response => {
          this.$router.push({ path: '/edu/course/chapter/' + this.courseInfo.id})
        }).catch((response) => {
          // console.log(response)
          this.$message({
            type: 'error',
            message: 'Update Failed!'
          })
        })
      }

    }
  }
</script>

<style scoped>
  .tinymce-container {
    line-height: 29px;
  }
</style>
