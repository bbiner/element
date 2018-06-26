<template>
  <el-row>
    <el-row>
      <el-button type="primary" @click="addCategory">添加分类</el-button>
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
      width="120">
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
      </template>
    </el-table-column>
  </el-table>
    </el-row>
  </el-row>
</template>

<script>
import { articleApi } from '@/api/platform/article'

export default {
  data () {
    return {
      tableData: [],
      loading: true
    }
  },
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
    addCategory () {
      console.log(1)
      this.$router.push('/category-add')
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
