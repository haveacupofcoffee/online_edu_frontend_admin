<template>
  <div class="app-container">
    <h2 style="text-align: center;">Publish New Course</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom:
40px;">
      <el-step title="Course Basic Information"/>
      <el-step title="Course Chapter"/>
      <el-step title="Publish"/>
    </el-steps>

    <el-button type="text" @click="dialogChapterFormVisible = true">Add Chapter</el-button>

    <!-- Chapter -->
    <ul class="chapterList">
      <li
        v-for="chapter in chapterNestedList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
          <el-button type="text" @click="openSectionDialog(chapter.id)">Add Section</el-button>
          <el-button type="text" @click="editChapter(chapter.id)">Edit</el-button>
          <el-button type="text" @click="removeChapter(chapter.id)">Delete</el-button>
          </span>
        </p>
        <!-- Section -->
        <ul class="chapterList sectionList">
          <li
            v-for="section in chapter.children"
            :key="section.id">
            <p>{{ section.title }}
              <span class="acts">
              <el-button type="text" @click="editSection(section.id)">Edit</el-button>
              <el-button type="text" @click="removeSectionById(section.id)">Delete</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">Previous</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">Next
        </el-button>
      </el-form-item>
    </el-form>

    <!-- Add and Update Chapter dialog -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="Add Chapter">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="Chapter Title">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="Chapter Sort">
          <el-input-number v-model="chapter.sort" :min="0" controlsposition="
right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveOrUpdate">Ok</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogSectionFormVisible" title="Add Section">
      <el-form :model="section" label-width="120px">
        <el-form-item label="Section Title">
          <el-input v-model="section.title"/>
        </el-form-item>
        <el-form-item label="Sort">
          <el-input-number v-model="section.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="Free?">
          <el-radio-group v-model="section.free">
            <el-radio :label="true">Free</el-radio>
            <el-radio :label="false">Default</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Upload Video">
          <!-- TODO -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSectionFormVisible = false">Cancel</el-button>
        <el-button :disabled="saveSectionBtnDisabled" type="primary"
                   @click="saveOrUpdateSection">Ok</el-button>
      </div>
    </el-dialog>

  </div>


</template>
<script>
  import chapter from '@/api/chapter'
  import section from '@/api/section'

  export default {
    data() {
      return {
        saveBtnDisabled: false, // if disable save button, default don't
        courseId: '', // Course ID
        chapterNestedList: [], //
        dialogChapterFormVisible: false, //show chapter form
        chapter: { //Chapter
          title: '',
          sort: 0
        },
        saveSectionBtnDisabled: false, //
        dialogSectionFormVisible: false, //
        chapterId: '', //
        section: { //
          title: '',
          sort: 0,
          free: 0,
          videoSourceId: ''
        }
      }
    },

    created() {
      //console.log('chapter created')
      this.init()
    },
    methods: {

      init() {
        if (this.$route.params && this.$route.params.id) {
          this.courseId = this.$route.params.id
          // Get course information by ID
          this.fetchChapterNestedListByCourseId()
        }
      },

      fetchChapterNestedListByCourseId() {
        chapter.getNestedChaptersListByCourseId(this.courseId).then(response => {
          this.chapterNestedList = response.data.items
        })
      },

      saveOrUpdate() {
        this.saveBtnDisabled = true
        if (!this.chapter.id) {
          this.saveData()
        } else {
          this.updateData()
        }
      },

      saveData() {
        this.chapter.courseId = this.courseId
        chapter.saveChapter(this.chapter).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.helpSave()
        }).catch((response) => {
          this.$message({
            type: 'error',
            message: response.message
          })
        })
      },

      updateData() {
        chapter.updateChapterById(this.chapter).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.helpSave()
        }).catch((response) => {
          // console.log(response)
          this.$message({
            type: 'error',
            message: response.message
          })
        })
      },

      helpSave(){
        this.dialogChapterFormVisible = false // after save, close dialog
        this.fetchChapterNestedListByCourseId()// Get new data after save
        this.chapter.title = ''// reset chapter title
        this.chapter.sort = 0// reset chapter sort
        this.saveBtnDisabled = false
      },

      editChapter(chapterId) {
        this.dialogChapterFormVisible = true
        chapter.getChapterById(chapterId).then(response => {
          this.chapter = response.data.item
        })
      },

      removeChapter(chapterId) {
        this.$confirm('This will permanently delete the record. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          return chapter.removeChapterById(chapterId)
        }).then((response) => {
          this.fetchChapterNestedListByCourseId()// refresh list
          this.$message({
            type: 'success',
            message: response.message
          })
        }).catch((response) => { // failure
          if (response === 'cancel') {
            this.$message({
              type: 'info',
              message: 'Cancel delete'
            })
          } else {
            this.$message({
              type: 'error',
              message: response.message
            })
          }
        })
      },

     //------------------Section Operations----------------------------
      openSectionDialog(id) {
        this.dialogSectionFormVisible = true
        this.chapterId = id
      },

      saveOrUpdateSection() {
        this.saveSectionBtnDisabled = true
        if (!this.section.id) {
          this.saveSection()
        } else {
          this.updateSection()
        }
      },

      saveSection() {
        this.section.courseId = this.courseId
        this.section.chapterId = this.chapterId
        section.saveSection(this.section).then(response => {
          this.$message({
            type: 'success',
            message: response.message
          })
          this.helpSaveSection()
        }).catch(error => {
          this.$message({
            type: 'error',
            message: error.message
          })
        })
      },

      updateSection() {
        section.updateSectionInfoById(this.section).then(response => {
          this.$message({
              type: 'success',
              message: response.data.message
          })
          this.helpSaveSection()
        })
      },

      helpSaveSection() {
        this.dialogSectionFormVisible = false
        this.fetchChapterNestedListByCourseId()
        this.section.title = ''
        this.section.sort = 0
        this.section.videoSourceId = ''
        this.saveSectionBtnDisabled = false
      },

      editSection(id) {
        this.dialogSectionFormVisible = true
        section.getSectionInfoById(id).then(response => {
          this.section = response.data.item
        })
      },

      removeSectionById(id) {
        this.$confirm('This will permanently delete the record. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          return section.removeSectionById(id)
        }).then((response) => {
          this.fetchChapterNestedListByCourseId()// 刷新列表
          this.$message({
            type: 'success',
            message: response.message
          })
        }).catch((response) => { // 失败
          if (response === 'cancel') {
            this.$message({
              type: 'info',
              message: 'Cancel Deletion'
            })
          }
        })
      },

      previous() {
        console.log('previous')
        this.$router.push({ path: '/edu/course/info/' + this.courseId })
      },
      next() {
        console.log('next')
        this.$router.push({ path: '/edu/course/publish/' + this.courseId })
      }
    }
  }
</script>

<!--
<style scoped>

  .chapterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .chapterList li{
    position: relative;
  }
  .chapterList p{
    float: left;
    font-size: 20px;
    margin: 10px 0;
    padding: 10px;
    height: 70px;
    line-height: 50px;
    width: 100%;
    border: 1px solid #DDD;
  }
  .chapterList .acts {
    float: right;
    font-size: 14px;
  }
  .sectionList{
    padding-left: 50px;
  }
  .sectionList p{
    float: left;
    font-size: 14px;
    margin: 10px 0;
    padding: 10px;
    height: 50px;
    line-height: 30px;
    width: 100%;
    border: 1px dotted #DDD;
  }
  </style>
-->
