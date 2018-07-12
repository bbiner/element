<template>
  <div>
    <div class="search-box">
      <el-input placeholder="手机号码/云社区编码" v-model="params.keywords" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
    </div>
    <el-table
      v-loading="loading"
      class="tab-top"
      :data="tableData"
      stripe
      style="width: 80%">
      <el-table-column
        prop="id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="nick_name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="login_account"
        label="手机号码"
        width="180">
      </el-table-column>
      <el-table-column
        prop="referrer"
        label="所谓云社区编号">
      </el-table-column>
    </el-table>
    <Pagination v-if="pageInfo.length != 0" :page="pageInfo" :info="params" v-on:childValues="childValues"></Pagination>
  </div>
</template>

<script type="text/ecmascript-6">
import Pagination from '@/components/community/common/Pagination'
import Community from '@/api/platform/community/members'
const _community = new Community()
export default {
  components: {
    Pagination
  },
  data () {
    return {
      tableData: [],
      params: {
        keywords: ''
      },
      select: 'mobile',
      pageInfo: [],
      loading: true
    }
  },
  created () {
    this.search()
  },
  methods: {
    search (params = {}) {
      this.loading = true
      _community.members(Object.assign({}, params, this.params)).then(res => {
        console.log('type', res)
        if (res.code === 1000) {
          this.tableData = res.data.data
          this.pageInfo = _community.pagination(res.data)
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
        this.loading = false
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.msg
        })
        this.loading = false
      })
    },
    // 接收子组件数据
    childValues (childValues) {
      console.log('child', childValues)
      this.search(childValues)
    }
  }
}
</script>

<style>
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .search-box {
    width: 400px;
    height: 120px;
  }
  .tab-top {
    line-height: 50px;
  }
</style>
