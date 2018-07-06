<template>
  <div>
    <div class="search-box">
      <el-input placeholder="请输入内容" v-model="params.keywords" class="input-with-select">
        <el-select v-model="select" slot="prepend" placeholder="手机号码">
          <el-option label="云社区编码" value="code"></el-option>
          <el-option label="手机号码" value="mobile"></el-option>
        </el-select>
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
import Page from '@/utils/response-parse'
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
        this.tableData = res.data
        this.pageInfo = Page.pagination(res.headers)
        this.loading = false
      }).catch(error => {
        console.log(error)
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
