<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="Lecturer Name">
        <el-input v-model="lecturer.name"/>
      </el-form-item>
      <el-form-item label="Lecturer Sort">
        <el-input-number v-model="lecturer.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="Lecturer Title">
        <el-select v-model="lecturer.level" clearable placeholder="Choose">

          <el-option :value="0" label="Junior Lecturer"/>
          <el-option :value="1" label="Senior Lecturer"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Lecturer Career">
        <el-input v-model="lecturer.career"/>
      </el-form-item>
      <el-form-item label="Lecturer Intro">
        <el-input v-model="lecturer.intro" :rows="10" type="textarea"/>
      </el-form-item>
      <!-- Lecturer Avatar  -->
      <el-form-item label="Lecturer Avatar">
        <!-- avatar-->
        <pan-thumb :image="lecturer.avatar"/>
        <!-- avatar button -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">Change
        </el-button>
        <!--
        v-show：if show component
        :key： id
        :url: back end service interface mapping url
        @close：close component
        @crop-upload-success：call back function after upload success -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduaws/user/avatar'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>
      </el-form-item>


      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">
        Save</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import lecturer from "@/api/lecturer";
  import ImageCropper from '@/components/ImageCropper'
  import PanThumb from '@/components/PanThumb'
  export default {
    components: { ImageCropper, PanThumb },

    data(){
      return {
        lecturer:{
          name: '',
          sort: 0,
          level: 1,
          career: '',
          intro: '',
          avatar: ''
        },
        saveBtnDisabled:false,
        imagecropperShow:false,
        imagecropperKey:0,
        BASE_API:process.env.BASE_API
      }
    },
    //invoke before render
    created() {
      this.init()
    },

    watch:{
      $route(to, from){
        this.init()
      }
    },

    methods:{
      //check if the router path has params and prama id, if it does, invoke the method to fecth data accordting to
      // the lecturer's id
      init() {
        if(this.$route.params && this.$route.params.id ) {
          const id = this.$route.params.id
          this.findLecturerById(id)
        }else {
          this.lecturer = {}
        }
      },

      saveOrUpdate() {
        this.saveBtnDisabled = true
        if(!this.lecturer.id) {
          this.saveLecturer()
        }else {
          this.updateLecturerById()
        }

      },

      findLecturerById(id) {
        lecturer.findLecturerById(id)
        .then(response => {
          this.lecturer = response.data.lecturer
        })
        .catch(error => {
          this.$message({
            type:'error',
            message:'Fetch Data Failed'
          })
        })
      },

      saveLecturer() {
        lecturer.saveLecturer(this.lecturer)
          .then(response => {
            return this.$message({
              type:'success',
              message:'Save Completed'
            })
          })
          .then(response => {
            this.$router.push({path:'/edu/lecturer'})
          })
          .catch(error =>{
            this.$message({
              type:'error',
              message:'Save Failed'
            })
            this.saveBtnDisabled = false
          })
      },

      updateLecturerById(){
        this.saveBtnDisabled = true
        lecturer.updateActiveIndex(this.lecturer)
        .then(response => {
          return this.$message({
            type: 'success',
            message: 'Update Complete!'
          })
        }).then(resposne => {
          this.$router.push({ path: '/edu/lecturer' })
        }).catch((response) => {
          // console.log(response)
          this.$message({
            type: 'error',
            message: 'Update Failed!'
          })

          this.saveBtnDisabled = false
        })

      },

      //close image cropper
      close() {
        this.imagecropperShow = false
      },

      cropSuccess(data) {
        this.lecturer.avatar = data.url
        this.imagecropperShow = false
        this.imagecropperKey = this.imagecropperKey + 1
      }

    }
  }
</script>

<style scoped>

</style>
