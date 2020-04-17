<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="Description">
        <el-tag type="info">Excel Template</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="OSS_PATH +
'/excel/%E8%AF%BE%E7%A8%8B%E5%88%86%E7%B1%BB%E5%88%97%E8%A1%A8%E6%A8%A1%E6%9D%BF.xls'">Dowload Template</a>
        </el-tag>
      </el-form-item>
      <el-form-item label="Choose Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :disabled="importBtnDisabled"
          :limit="1"
          :action="BASE_API+'/eduservice/subject'"
          name="file"
          accept="application/vnd.ms-excel">
          <el-button slot="trigger" size="small" type="primary">Choose</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">{{ fileUploadBtnText }}</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        BASE_API: process.env.BASE_API, // back end API URL
        OSS_PATH: process.env.OSS_PATH, // AWS S3 path
        fileUploadBtnText: 'Upload', // button text
        importBtnDisabled: false,
        loading: false
      }
    },


    methods:{
      submitUpload() {
        this.fileUploadBtnText = 'Uploading'
        this.importBtnDisabled = true
        this.loading = true
        this.$refs.upload.submit()
      },

      fileUploadSuccess(response) {
        if (response.success === true) {
          this.fileUploadBtnText = 'Upload'
          this.loading = false
          this.$message({
            type: 'success',
            message: response.message
          })
        }
      },
      fileUploadError(response) {
        this.fileUploadBtnText = 'Upload'
        this.loading = false
        this.$message({
          type: 'error',
          message: 'Upload Failed'
        })
      }
    }


  }
</script>

<style scoped>

</style>
