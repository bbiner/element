<template>
  <el-row>
    <el-row>
      <el-button type="primary" @click="show('发表')">发表文章</el-button>
    </el-row>
    <el-row>
      <el-form :inline="true" ref="searchForm" :model="searchForm" class="demo-form-inline">
        <el-form-item label="状态" prop="status">
          <el-select v-model="searchForm.status" placeholder="状态" style="width: 100px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="已上线" value="1"></el-option>
            <el-option label="待上线" value="0"></el-option>
            <el-option label="已下线" value="-1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态" prop="check_status">
          <el-select v-model="searchForm.check_status" placeholder="审核状态" style="width: 100px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="通过" value="1"></el-option>
            <el-option label="待审核" value="0"></el-option>
            <el-option label="未通过" value="-1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章分类" prop="category_id">
          <el-select v-model="searchForm.article_category_id" placeholder="文章分类" style="width: 105px;">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item,index) in categoryList" :key="'category'+index" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="searchForm.title" placeholder="文章标题"></el-input>
        </el-form-item>
        <el-form-item label="提交时间" prop="created_at">
          <el-date-picker
            v-model="created_at"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
          <el-button type="primary" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%">
      <el-table-column
        type="index"
        label="排序"
        width="50"
      >
      </el-table-column>
      <el-table-column
        prop="title"
        label="文章标题"
      >
      </el-table-column>
      <el-table-column
        prop="cover_pic"
        label="封面图片"
      >
        <template slot-scope="scope">
          <img :src="scope.row.cover_pic" width="200" height="100"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="category_title"
        label="文章分类"
      >
      </el-table-column>
      <el-table-column
        prop="source"
        label="文章来源"
        :formatter="sourceFormatter"
      >
      </el-table-column>
      <el-table-column
        prop="author"
        label="文章发表人"
        :formatter="authorFormatter"
      >
      </el-table-column>
      <el-table-column
        prop="created_at"
        label="提交时间"
        :formatter="timeFormatter"
        min-width="100px"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status|typeFilter"
            disable-transitions>{{scope.row.status | statusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="check_status"
        label="审核状态"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.check_status|typeFilter"
            disable-transitions>{{scope.row.check_status | checkStatusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="chosen_status"
        label="精选状态"
      >
        <template slot-scope="scope">
          <i v-if='scope.row.chosen_status' class="el-icon-check"></i>
          <i class="el-icon-close" v-else></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="is_special"
        label="是否为玩转云社区"
      >
        <template slot-scope="scope">
          <i v-if='scope.row.is_special' class="el-icon-check"></i>
          <i class="el-icon-close" v-else></i>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="220">
        <template slot-scope="scope">
          <el-button @click.native.prevent="viewArticle(scope.row)"
                     type="text"
                     size="small">
            查看文章
          </el-button>
          <el-button v-if="scope.row.check_status === 0"
                     @click.native.prevent="putApprovedStatus(scope.row)"
                     type="text"
                     size="small">
            通过
          </el-button>
          <el-button v-if="scope.row.check_status === 0"
                     @click.native.prevent="putUnApprovedStatus(scope.row)"
                     type="text"
                     size="small">
            不通过
          </el-button>
          <template v-if="scope.row.check_status === 1">
            <el-button v-if="scope.row.check_status === 1 && scope.row.status !== 1"
                       @click.native.prevent="putOnline(scope.row)"
                       type="text"
                       size="small">
              上线
            </el-button>
            <el-button v-if="scope.row.check_status === 1 && scope.row.status === 1"
                       @click.native.prevent="putOffline(scope.row)"
                       type="text"
                       size="small">
              下线
            </el-button>
            <el-button @click.native.prevent="edit(scope.row,scope.$index)"
                       type="text"
                       size="small">
              修改
            </el-button>
            <template v-if="scope.row.status === 1">
              <el-button v-if="scope.row.chosen_status === 0"
                         @click.native.prevent="choice(scope.row)"
                         type="text"
                         size="small">
                设为精选
              </el-button>
              <el-button v-if="scope.row.chosen_status === 1"
                         @click.native.prevent="unchoice(scope.row)"
                         type="text"
                         size="small">
                取消精选
              </el-button>
            </template>
          </template>
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
        :total="pagination.totalRow">
    </el-pagination>
    </el-row>
    <el-dialog :title="dialogTitle+'文章'" :visible.sync="dialogFormVisible">
      <save-artcile @done="saveDone" :form="saveData" :categoryList="categoryList"></save-artcile>
    </el-dialog>
  </el-row>
</template>

<script>
import { articleApi, articleCategoryApi } from '@/api/platform/article'
import SaveArtcile from '@/components/community/article/article/SaveArticle'
import moment from 'moment'
import ResponseParse from '@/utils/response-parse'

export default {
  data () {
    return {
      page: 1,
      tableData: [],
      pagination: {},
      loading: true,
      dialogFormVisible: false,
      dialogTitle: '添加',
      categoryList: [],
      saveData: {
        url: 'http://www.www.ww'
      },
      selectID: 0,
      offline_at: [],
      online_at: [],
      created_at: [],
      searchForm: {
        status: null,
        check_status: null,
        article_category_id: null,
        title: null,
        created_at_start: null,
        created_at_end: null,
        online_at_start: null,
        online_at_end: null,
        offline_at_start: null,
        offline_at_end: null
      },
      currentEditRowIndex: null
    }
  },
  components: {SaveArtcile},
  mounted () {
    this.getList({})
    this.getCategoryList()
  },
  filters: {
    typeFilter (val) {
      let statusStr = ''
      switch (val) {
        case -1:
          statusStr = 'danger'
          break
        case 0:
          statusStr = 'info'
          break
        case 1:
          statusStr = 'success'
          break
      }
      return statusStr
    },
    statusFilter (val) {
      let statusStr = ''
      switch (val) {
        case -1:
          statusStr = '已下线'
          break
        case 0:
          statusStr = '待上线'
          break
        case 1:
          statusStr = '已上线'
          break
      }
      return statusStr
    },
    checkStatusFilter (val) {
      let statusStr = ''
      switch (val) {
        case -1:
          statusStr = '未通过'
          break
        case 0:
          statusStr = '待审核'
          break
        case 1:
          statusStr = '通过'
          break
      }
      return statusStr
    }
  },
  methods: {
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    getCategoryList () {
      articleCategoryApi.get({}, (response) => {
        this.categoryList = response.data
      })
    },
    handleSizeChange (pagesize) {
      this.pagination.pagesize = pagesize
      this.getList()
    },
    handleCurrentChange (currentPage) {
      this.pagination.page = currentPage
      this.getList()
    },
    getList () {
      this.loading = true
      let data = {
        page: this.pagination.page,
        pagesize: this.pagination.pagesize,
        ...this.searchForm
      }
      articleApi.get(
        data
        , response => {
          this.pagination = ResponseParse.pagination(response.headers)
          this.tableData = response.data
          this.loading = false
        })
    },
    onSearch () {
      if (!(this.created_at instanceof Array)) {
        this.online_at = []
      }
      if (!(this.online_at instanceof Array)) {
        this.online_at = []
      }
      if (!(this.offline_at instanceof Array)) {
        this.offline_at = []
      }
      this.searchForm.created_at_start = this.created_at[0]
      this.searchForm.created_at_end = this.created_at[1]
      this.searchForm.online_at_start = this.online_at[0]
      this.searchForm.online_at_end = this.online_at[1]
      this.searchForm.offline_at_start = this.offline_at[0]
      this.searchForm.offline_at_end = this.offline_at[1]
      this.resetPage()
      this.getList()
    },
    resetPage () {
      this.pagination.page = 1
    },
    viewArticle (row) {
      window.open('http://www.baidu.com')
    },
    putOnline (row) {
      articleApi.putOnline({id: row.id}, (response) => {
        if (response.status === 204) {
          row.status = 1
        }
      })
    },
    putOffline (row) {
      articleApi.putOffline({id: row.id}, (response) => {
        if (response.status === 204) {
          row.status = -1
        }
      })
    },
    putApprovedStatus (row) {
      articleApi.putApprovedStatus({id: row.id}, (response) => {
        if (response.status === 204) {
          row.check_status = 1
        }
      })
    },
    putUnApprovedStatus (row) {
      articleApi.putUnApprovedStatus({id: row.id}, (response) => {
        if (response.status === 204) {
          row.check_status = -1
        }
      })
    },
    choice (row) {
      articleApi.choice({ids: [row.id]}, (response) => {
        if (response.status === 204) {
          row.chosen_status = 1
        }
      })
    },
    unchoice (row) {
      articleApi.unchoice({id: row.id}, (response) => {
        if (response.status === 204) {
          row.chosen_status = 0
        }
      })
    },
    up (row, index) {
      articleApi.up({id: row.id}, (response) => {
        if (response.status === 204) {
          this.changePosition(index, 'up')
        } else {
          this.$message.error('无法移动')
        }
      })
    },
    down (row, index) {
      articleApi.down({id: row.id}, (response) => {
        if (response.status === 204) {
          this.changePosition(index, 'down')
        } else {
          this.$message.error('无法移动')
        }
      })
    },
    changePosition: function (index, action) {
      if (index < 0) {
        return false
      }
      const length = this.tableData.length
      const prevRow = this.tableData[index - 1] ? this.tableData[index - 1] : null
      const oldRow = this.tableData[index]
      const nextRow = index + 1 < length ? this.tableData[index + 1] : null
      if (action === 'up' && prevRow !== null) {
        this.tableData.splice(index, 1, prevRow)
        this.tableData.splice(index - 1, 1, oldRow)
      } else if (action === 'down' && nextRow !== null) {
        this.tableData.splice(index, 1, nextRow)
        this.tableData.splice(index + 1, 1, oldRow)
      }
      return false
    },
    show (action) {
      this.dialogTitle = action
      this.dialogFormVisible = true
    },
    hide () {
      this.dialogFormVisible = false
    },
    saveDone (data) {
      if (data) {
        this.getList()
        // this.resetForm('searchForm')
      }
      this.saveData = {content: ''}
      this.hide()
    },
    deleteRow (row, index) {
      articleApi.delete({id: row.id}, (response) => {
        if (response.status === 204) {
          this.tableData.splice(index, 1)
        } else {
          this.$message.error(response.data.error)
        }
      })
    },
    timeFormatter (row, column, cellValue, index) {
      return moment(cellValue).format('YYYY-MM-DD HH:mm')
    },
    authorFormatter (row, column, cellValue, index) {
      if (row.author_id === 0) {
        return row.creater
      }
      return cellValue
    },
    sourceFormatter (row, column, cellValue, index) {
      return cellValue || 'GDG云社区'
    },
    edit (row, index) {
      this.currentEditRowIndex = index
      let data = {
        id: row.id,
        articleCategoryId: row.article_category_id,
        source: row.source,
        title: row.title,
        coverPic: row.cover_pic,
        content: row.content,
        onlineAt: row.online_at
      }
      data.nowOnline = row.online_at === null
      this.saveData = data
      console.log(data)
      this.show('编辑')
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
