<template>
  <div class="app-container">
    <h2 style="text-align: center;">Publish New Course</h2>
    <el-steps :active="3" process-status="wait" align-center style="margin-bottom:
40px;">
      <el-step title="Course Basic Information"/>
      <el-step title="Course Chapter"/>
      <el-step title="Publish"/>
    </el-steps>

    <div class="ccInfo">
      <img :src="coursePublish.cover">
      <div class="main">
        <h2>{{ coursePublish.title }}</h2>
        <p class="gray"><span>Total Lesson Number: {{ coursePublish.lessonNum }}</span></p>
        <p><span>Subject：{{ coursePublish.levelOneSubject }} —{{coursePublish.levelTwoSubject}}</span></p>
        <p>Lecturer：{{ coursePublish.lecturerName }}</p>
        <h3 class="red">${{ coursePublish.price }}</h3>
      </div>
    </div>


    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">Previous</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="publish">Publish</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import course from '@/api/course'
  export default {
    data() {
      return {
        saveBtnDisabled: false, // if disable save button, default don't
        courseId: '', // Course ID
        coursePublish: {}
      }
    },
    created() {
      //console.log('publish created')
      this.init()
    },
    methods: {

      init() {
        if (this.$route.params && this.$route.params.id) {
          this.courseId = this.$route.params.id
          // get course Information by ID
          this.fetchCoursePublishInfoById()
        }
      },
      fetchCoursePublishInfoById() {
        course.getCoursePublishInfoById(this.courseId).then(response => {
          this.coursePublish = response.data.item
        })
      },

      previous() {
        //console.log('previous')
        this.$router.push({ path: '/edu/course/chapter/' + this.courseId })
      },
      publish() {
        console.log('publish')
        course.publishCourse(this.courseId).then(response => {
          this.$message({
            type:"success",
            message:response.message
          })
          this.$router.push({ path: '/edu/course/list' })
        }).catch(error => {
          this.$message({
            type:"error",
            message:response.message
          })
        })
      }
    }
  }
</script>

<style scoped>
  .ccInfo {
    background: #f5f5f5;
    padding: 20px;
    overflow: hidden;
    border: 1px dashed #DDD;
    margin-bottom: 40px;
    position: relative;
  }
  .ccInfo img {
    background: #d6d6d6;
    width: 500px;
    height: 278px;
    display: block;
    float: left;
    border: none;
  }
  .ccInfo .main {
    margin-left: 520px;
  }
  .ccInfo .main h2 {
    font-size: 28px;
    margin-bottom: 30px;
    line-height: 1;
    font-weight: normal;
  }
  .ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
  }
  .ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
  }
  .ccInfo .main h3 {
    left: 540px;
    bottom: 20px;
    line-height: 1;
    font-size: 28px;
    color: #d32f24;
    font-weight: normal;
    position: absolute;
  }
</style>
