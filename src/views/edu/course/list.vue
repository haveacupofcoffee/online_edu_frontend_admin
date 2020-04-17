<template>
  <div class="app-container">
  <!--Query Form -->
  <el-form :inline="true" class="demo-form-inline">
    <!-- Subject -->
    <!-- Level One Subject -->
    <el-form-item label="Course Search">
      <el-select
        v-model="courseQuery.subjectParentId"
        placeholder="Subject "
        @change="subjectLevelOneChanged">
        <el-option
          v-for="subject in subjectNestedList"
          :key="subject.id"
          :label="subject.title"
          :value="subject.id"/>
      </el-select>
      <!-- Level Two Subject -->
      <el-select v-model="courseQuery.subjectId" placeholder="Subject">
        <el-option
          v-for="subject in subSubjectList"
          :key="subject.id"
          :label="subject.title"
          :value="subject.id"/>
      </el-select>
    </el-form-item>
    <!-- Title -->
    <el-form-item>
      <el-input v-model="courseQuery.title" placeholder="Course Title"/>
    </el-form-item>
    <!-- Lecutrer -->
    <el-form-item>
      <el-select
        v-model="courseQuery.lecturerId"
        placeholder="Lecture">
        <el-option
          v-for="lecturer in lecturerList"
          :key="lecturer.id"
          :label="lecturer.name"
          :value="lecturer.id"/>
      </el-select>
    </el-form-item>
    <el-button type="primary" icon="el-icon-search" @click="fetchData()">Search</el-button>
      <el-button type="default" @click="resetData()">Reset</el-button>
  </el-form>

  <!-- Table -->
  <el-table
    v-loading="listLoading"
    :data="list"
    element-loading-text="Data Loading"
    border
    fit
    highlight-current-row
    row-class-name="myClassList">
    <el-table-column
      label="No."
      width="70"
      align="center">
      <template slot-scope="scope">
        {{ (page - 1) * limit + scope.$index + 1 }}
      </template>
    </el-table-column>
    <el-table-column label="CourseInfo" width="470" align="center">
      <template slot-scope="scope">
        <div class="info">
          <div class="pic">
            <img :src="scope.row.cover" alt="scope.row.title" width="150px">
          </div>
          <div class="title">
            <a href="">{{ scope.row.title }}</a>
            <p>{{ scope.row.lessonNum }} Chapters</p>
          </div>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="CreatTime" align="center">
      <template slot-scope="scope">
        {{ scope.row.gmtCreate.substr(0, 10) }}
      </template>
    </el-table-column>
    <el-table-column label="Publish Time" align="center">
      <template slot-scope="scope">
        {{ scope.row.gmtModified.substr(0, 10) }}
      </template>
    </el-table-column>
    <el-table-column label="Price" width="100" align="center" >
      <template slot-scope="scope">
        {{ Number(scope.row.price) === 0 ? 'Free' :
        '¥' + scope.row.price.toFixed(2) }}
      </template>
    </el-table-column>
    <el-table-column prop="buyCount" label="Pay Member" width="120" align="center" >
      <template slot-scope="scope">
        {{ scope.row.buyCount }}
      </template>
    </el-table-column>
    <el-table-column label="Operations" width="150" align="center">
      <template slot-scope="scope">
        <router-link :to="'/edu/course/info/'+scope.row.id">
          <el-button type="text" size="mini" icon="el-icon-edit">Edit Course</el-button>
        </router-link>
        <router-link :to="'/edu/course/chapter/'+scope.row.id">
          <el-button type="text" size="mini" icon="el-icon-edit">Edit Subject</el-button>
        </router-link>
        <el-button type="text" size="mini" icon="el-icon-delete">Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- pagination -->
  <el-pagination
    :current-page="page"
    :page-size="limit"
    :total="total"
    style="padding: 30px 0; text-align: center;"
    layout="total, prev, pager, next, jumper"
    @current-change="fetchData"
  />
  </div>
</template>

<script>

  import course from '@/api/course'
  import lecturer from '@/api/lecturer'
  import subject from '@/api/subject'
  export default {
    data() {
      return {
        listLoading: true, // loding style
        list: null, // data list
        total: 0, // total records number
        page: 1, // page number
        limit: 10, // page size
        courseQuery: {
          subjectParentId: '',
          subjectId: '',
          title: '',
          lecturerId: ''
        }, // query conditions
        lectureList: [], // Lectures list
        subjectNestedList: [], // Level one subject list
        subSubjectList: [] // level two subject list
      }
    },

    created() {
      this.fetchData()
      // init subject list
      this.initSubjectList()
      // init lectures list
      this.initLecturerList()
    },

    methods: {
      fetchData(page = 1) {
        console.log('Loading...')
        this.page = page
        this.listLoading = true
        course.getCoursesByPageAndQuery(this.page, this.limit, this.courseQuery).then(response => {
          if (response.success === true) {
            this.list = response.data.rows
            this.total = response.data.total
          }
          this.listLoading = false
        })
      },

      initLecturerList() {
        lecturer.findAllLecturers().then(response => {
          this.lecturerList = response.data.lecturers
        })
      },

      initSubjectList() {
        subject.getAllSubjects().then(response => {
          console.log()
          this.subjectNestedList = response.data.subjects
        })
      },

      subjectLevelOneChanged(value) {
        for (let i = 0; i < this.subjectNestedList.length; i++) {
          if (this.subjectNestedList[i].id === value) {
            this.subSubjectList = this.subjectNestedList[i].children
            this.courseQuery.subjectId = ''
          }
        }
      },
      resetData() {
        this.courseQuery = {}
        this.subSubjectList = []
        this.fetchData()
      }
    }

  }
</script>

<style scoped>
  .myClassList .info {
    width: 450px;
    overflow: hidden;
  }
  .myClassList .info .pic {
    width: 150px;
    height: 90px;
    overflow: hidden;
    float: left;
  }
  .myClassList .info .pic a {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
  .myClassList .info .pic img {
    display: block;
    width: 100%;
  }
  .myClassList td .info .title {
    width: 280px;
    float: right;
    height: 90px;
  }
  .myClassList td .info .title a {
    display: block;
    height: 48px;
    line-height: 24px;
    overflow: hidden;
    color: #00baf2;
    margin-bottom: 12px;
  }
  .myClassList td .info .title p {
    line-height: 20px;
    margin-top: 5px;
    color: #818181;
  }
</style>
