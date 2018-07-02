<template>
  <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="[15, 30, 45, 60]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="Math.round(this.page.totalRow)">
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    page: Object,
    info: Object
  },
  created () {
    // console.log(this.page)
    // console.log(this.info)
  },
  methods: {
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.params.size = val
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.params.page = val
      this.$emit('childValues', Object.assign({}, this.info, this.params))
    }
  },
  data () {
    return {
      params: {
        size: 15,
        page: 1
      }
    }
  }
}
</script>

<style>
  .block {
    margin-top: 50px;
  }
</style>
