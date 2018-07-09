<template>
  <el-row>
    <el-row>
      <el-button type="primary" @click="showMakeDialog">新增付款码</el-button>
    </el-row>
    <!--<el-row>-->
      <!--<el-form :inline="true" ref="searchForm" :model="searchForm" class="demo-form-inline">-->
        <!--<el-form-item label="状态" prop="status">-->
          <!--<el-select v-model="searchForm.status" placeholder="状态" style="width: 100px;">-->
            <!--<el-option label="全部" value=""></el-option>-->
            <!--<el-option label="已上线" value="1"></el-option>-->
            <!--<el-option label="待上线" value="0"></el-option>-->
            <!--<el-option label="已下线" value="-1"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <!--<el-form-item>-->
          <!--<el-button type="primary" @click="onSearch">查询</el-button>-->
          <!--<el-button type="primary" @click="resetForm('searchForm')">重置</el-button>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
    <!--</el-row>-->
    <el-row>
      <el-table
        :data="table"
        style="width: 100%">
        <el-table-column prop="id" label="ID" width="180"/>
        <el-table-column prop="code" label="付款码" width="180"/>
        <el-table-column prop="community_level" label="可升级等级" width="180"/>
        <el-table-column prop="created_at" label="创建时间" />
        <el-table-column prop="creator" label="创建者" />
        <el-table-column prop="used" label="是否已使用">
          <template slot-scope="scope">
            <span v-if="scope.row === 1" class="red">已使用</span>
            <span v-else>未使用</span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.page"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.totalRow"/>
    </el-row>

    <el-dialog title="生成付款码" :visible.sync="dialogVisible">
      <el-form ref="makeCodeForm" :model="form" label-width="130px">
        <el-form-item label="可升级云社区等级" prop="articleCategoryId">
          <el-select v-model="form.level" placeholder="等级">
            <el-option v-for="(level, index) in levels" :key="'level'+index" :label="level" :value="level" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="makeCode">生成</el-button>
          <el-button @click="hideMakeDialog">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-row>
</template>

<script>
import PayCodeApi from '@/api/platform/community-pay-code'
import ResponseParse from '@/utils/response-parse'

export default {
  name: 'PayCode',
  data () {
    return {
      dialogVisible: false,
      searchForm: {},
      table: [],
      pagination: {},
      form: {
        level: ''
      },
      levels: [1, 2, 3, 4, 5]
    }
  },
  created () {
    this.pagination = {page: 1, pagesize: 10}
    this.requestList()
  },
  methods: {
    requestList () {
      PayCodeApi.list({page: this.pagination.page, pagesize: this.pagination.pagesize}, response => {
        const status = response.status || 0
        const body = response.data || {}
        if (status >= 200 && status < 300) {
          this.table = body
          this.pagination = ResponseParse.pagination(response.headers)
        } else {
          this.$message.error(body.error || '列表获取失败')
        }
      })
    },
    handleSizeChange (pageSize) {
      this.pagination.pagesize = pageSize
      this.requestList()
    },
    handleCurrentChange (currentPage) {
      this.pagination.page = currentPage
      this.requestList()
    },
    onSearch () {
      //
    },
    resetForm (ref) {
      this.$refs[ref].resetFields()
    },
    showMakeDialog () {
      this.dialogVisible = true
    },
    makeCode () {
      PayCodeApi.make({level: this.form.level}, response => {
        const status = response.status || 0
        const body = response.data || {}
        if (status >= 200 && status < 300) {
          this.table.unshift(body)
          this.dialogVisible = false
        } else {
          this.$message.error(body.error || '生成失败')
        }
      })
    },
    hideMakeDialog () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .red {
    color: #ff4236;
  }
</style>
