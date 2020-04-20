<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <el-card class="box-card" v-for="(item, index) in projects" :key="index">
        <div slot="header" class="clearfix">
          <span>{{item.name}} </span>
<!--
          <el-button style="float: right; padding: 3px 0" type="text">Operation button</el-button>
-->
        </div>
        <div v-for="(content,subindex) in item.contents" :key="subindex" class="text item">
          {{ content }}
        </div>
      </el-card>
    </div>
   <!-- <div class="dashboard-text">roles:<span v-for="role in roles" :key="role">{{ role }}</span></div>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  data() {
    return {
      projects:[
        {
          name: "Introduction",
          contents: [
            "- Online Education Web Application for Admins",
            "- Microservice Architecture, 2 microservices so far, one microservice is responsible for uploading images " +
            "to AWS S3. Will add more microservices later"
          ]
        },

        {
          name: "Features",
          contents: [
            "- Lecturer Management: List Lecturer(Query), Add Lecturer, Update Lecturer, Delete Lecturer",
            "- Course Subject Management: List Subject(Query), Add Subject(Import with Excel), Delete Subject(In progress)",
            "- Course Management: List Course, Publish Course(upload video is in progress, thinking use AWS service)",
            "- Authorization Management: (In Progress)",
            "- Data Analysis: (In Progress)"
          ]
        },

        {
          name: "Tech Stacks",
          contents: [
            "- Frontend: Vue, Element-UI (Similar as Bootstrap), Babel, NPM, ECharts, JavaScript, HTML, CSS ",
            "- Backend: Java, Spring Boot, MyBatis-Plus, EasyExcel, MySQL",
            "- Others: Shell, XML, JSON, AWS, Microsoft Azure, Jenkins, Git, Docker, Nginx, Swagger2, Maven",
          ]
        },

        {
          name: "Deployment",
          contents: [
            "- Frontend: Deployed on Microsoft Azure Virtual Machine -- Jenkins + Node + Nginx",
            "- Backend: 2 microservices deployed on 1 AWS EC2(free trial) with Docker, Git, Jenkins and Maven",

          ]
        },

        {
          name: "Next Step(Problems)",
          contents: [
            "- No validation",
            "- Fix bugs",
            "- Finish features",
            "- Optimize details",
            "- Optimize deployment pipeline"
          ]
        }
      ]

    }
  }

}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    //float:left;
    font-size: 30px;
    line-height: 46px;
  }
}
.text {
  font-size: 16px;
}

.item {
  margin-bottom: 10px;
}

/*.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}*/
.clearfix span {
  font-size: 20px;
  font-weight: bold;

}
.box-card {
  width: inherit;
}
</style>
