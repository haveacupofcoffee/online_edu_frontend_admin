<template>
  <div class="app-container">
    <!--Query Form -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="eduLecturerQuery.name" placeholder="Lecturer Name"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="eduLecturerQuery.level" clearable placeholder="Lecturer Title">
          <el-option :value="0" label="Junior Lecturer"/>
          <el-option :value="1" label="Senior Lecturer"/>
        </el-select>
      </el-form-item>
      <el-form-item label="Registered Time">
        <el-date-picker
          v-model="eduLecturerQuery.begin"
          type="datetime"
          placeholder="Start Time"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="eduLecturerQuery.end"
          type="datetime"
          placeholder="End Time"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="findLecturerByPageAndQueryCondition()">Search</el-button>
        <el-button type="default" @click="resetData()">Reset</el-button>
    </el-form>


    <!-- Table  -->
    <el-table
      v-loading="listLoading"
      :data="lecturersList"
      element-loading-text="Data Is Loading"
      border
      fit
      highlight-current-row>
      <el-table-column
        label="No."
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Name" width="80" />
      <el-table-column label="Title" width="80">
        <template slot-scope="scope">
          {{ scope.row.level===1?'Junior Lecturer':'Senior Lecturer' }}
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="Intro" />
      <el-table-column prop="gmtCreate" label="Registered Time" width="160"/>
      <el-table-column prop="sort" label="Sort" width="60" />
      <el-table-column label="Operations" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/edu/lecturer/update/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">Update</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete"
                     @click="removeLecturerById(scope.row.id)">Delete</el-button>
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
      @current-change="findLecturerByPageAndQueryCondition"
    />
  </div>

</template>



<script>
  import lecturer from "@/api/lecturer";

  export default {
    data() {
      return {
        listLoading: true,
        lecturersList: [],
        page: 1,   // current page number
        limit: 5,   //page size
        total: 0, //total records
        eduLecturerQuery: {}
      }
    },
    created() {
      this.findLecturerByPageAndQueryCondition();
    },
    methods: {
      findLecturerByPageAndQueryCondition(page = 1) {
        this.page = page
        this.listLoading = true
        lecturer.findLecturerByPageAndQueryCondition(this.page, this.limit, this.eduLecturerQuery)
          .then(response => {
            console.log(response)
            if (response.success === true) {
              this.lecturersList = response.data.rows
              this.total = response.data.total
            }
            this.listLoading = false
          })
      },

      resetData() {
        this.eduLecturerQuery = {}
        this.findLecturerByPageAndQueryCondition()
      },

      removeLecturerById(id) {
        this.$confirm('This will permanently delete the record. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        })
        .then(() => {
          lecturer.removeLecturerById(id)
            .then(response => {
              if (response.success === true) {
                this.$message({
                  type: 'success',
                  message: 'Delete completed!'
                })
                this.findLecturerByPageAndQueryCondition(this.page, this.limit, this.eduLecturerQuery)
              }
            })
            .catch(error => {
              this.$message({
                type: 'error',
                message: 'Delete failed!'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled'
          })
        })

      }
    }
  }
</script>

<style scoped>

</style>
