<template>
  <el-dialog title="物流轨迹" :visible.sync="isShow">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="AcceptTime" label="日期" width="200"></el-table-column>
      <el-table-column prop="AcceptStation" label="轨迹" width="300"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import OrderListApi from '@/api/platform/order-list'
export default {
  data () {
    return {
      tableData: [],
      isShow: false
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$on('showBox', (orderId) => {
        this.show()
        this.getTrace(orderId)
      })
    })
  },
  methods: {
    show () {
      this.isShow = true
    },
    getTrace (orderId) {
      OrderListApi.trace(orderId, response => {
        const status = response.data.code
        const body = response.data.data.traces
        if (status === 1000) {
          this.tableData = JSON.parse(body)
        } else {
          this.tableData = []
        }
      })
    }
  }
}
</script>

<style>

</style>
