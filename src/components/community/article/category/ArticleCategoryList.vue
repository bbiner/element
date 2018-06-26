<template>
  <el-row>
    <el-row>
      <el-button type="primary" @click="show">添加分类</el-button>
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
        label="栏目标题"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="220">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status !== 1"
                     @click.native.prevent="putOnline(scope.row)"
                     type="text"
                     size="small">
            上架
          </el-button>
          <el-button v-if="scope.row.status === 1"
                     @click.native.prevent="putOffline(scope.row)"
                     type="text"
                     size="small">
            下架
          </el-button>
          <el-button @click.native.prevent="up(scope.row,scope.$index)"
                     type="text"
                     size="small">
            上移
          </el-button>
          <el-button @click.native.prevent="down(scope.row,scope.$index)"
                     type="text"
                     size="small">
            下移
          </el-button>
          <el-button @click.native.prevent="deleteRow(scope.row,scope.$index)"
                     type="text"
                     size="small">
            删除
          </el-button>
        </template>
      </el-table-column>
      </el-table>
    </el-row>
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
      <add-article-category @done="addDone"></add-article-category>
    </el-dialog>
  </el-row>
</template>

<script>
import { articleApi } from '@/api/platform/article'
import AddArticleCategory from '@/components/community/article/category/AddArticleCategory'

export default {
  data () {
    return {
      tableData: [],
      loading: true,
      dialogFormVisible: false
    }
  },
  components: {AddArticleCategory},
  mounted () {
    this.getList()
  },
  methods: {
    getList () {
      articleApi.get({title: '6666'}, (response) => {
        this.tableData = response.data
        this.loading = false
      })
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
    show () {
      this.dialogFormVisible = true
    },
    hide () {
      this.dialogFormVisible = false
    },
    addDone (data) {
      if (data) {
        this.tableData.push(data)
      }
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
