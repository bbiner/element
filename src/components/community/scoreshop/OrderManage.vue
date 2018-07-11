<template>
  <div>
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="form.nick_name" placeholder="用户昵称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="form.good_title" placeholder="商品标题"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="form.express_status" placeholder="订单状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="待发货" value="0"></el-option>
          <el-option label="待收货" value="1"></el-option>
          <el-option label="交易完成" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-col :span="8">
          <el-date-picker
            v-model="form.start_time"
            type="datetime"
            placeholder="选择起始日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :span="8">
          <el-date-picker
            v-model="form.end_time"
            type="datetime"
            placeholder="选择结束日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          >
          </el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="nick_name"
        label="用户昵称"
        width="80">
      </el-table-column>
      <el-table-column
        prop="good_title"
        label="商品标题"
        width="180">
      </el-table-column>
      <el-table-column
        prop="exchange_score"
        label="消耗积分"
        width="80">
      </el-table-column>
      <el-table-column
        prop="good_type_name"
        label="奖品类型"
        width="180">
      </el-table-column>
      <el-table-column
        prop="exchange_at"
        label="兑换时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="shipping_name"
        label="物流方式"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="收货信息"
        width="180">
      </el-table-column>
      <el-table-column
        prop="express_code"
        label="物流单号"
        width="180">
        <template slot-scope="scope">
          <el-button type="text"  @click="trace(scope.row.id)">{{scope.row.express_code}}</el-button>
          <trace ref="trace"></trace>
        </template>
      </el-table-column>
      <el-table-column
        prop="express_status_name"
        label="订单状态"
        width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.express_status===0" @click="fahuo(scope.row)">发货</el-button>
          <child ref="child"></child>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" v-if="Math.round(pageInfo.totalRow) !== 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Math.round(pageInfo.currentPage)"
        :page-sizes="[20, 30, 40, 50]"
        :page-size="Math.round(pageInfo.pageSize)"
        layout="total, sizes, prev, pager, next, jumper"
        :total="Math.round(pageInfo.totalRow)">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import child from '@/components/community/scoreshop/Fahuo'
import trace from '@/components/community/scoreshop/Trace'
import OrderListApi from '@/api/platform/order-list'
export default {
  data () {
    return {
      form: {
        nick_name: '',
        express_status: '',
        good_title: '',
        start_time: '',
        end_time: ''
      },
      tableData: [],
      pageInfo: [],
      params: {}
    }
  },
  created () {
    this.getList()
  },
  methods: {
    onSubmit () {
      this.getList()
    },
    fahuo (order) {
      this.$refs.child.$emit('showBox', order)
    },
    trace (ordetId) {
      this.$refs.trace.$emit('showBox', ordetId)
    },
    reload () {
      location.reload()
    },
    getList () {
      OrderListApi.list(Object.assign({}, this.params, this.form), response => {
        const status = response.data.code
        const body = response.data.data.data
        if (status === 1000) {
          if (body) {
            body.map(item => {
              let arr = [item.consignee_name, item.consignee_phone, item.province, item.city, item.area, item.street]
              item.address = arr.join('')
              // 奖品类型
              if (item.good_type === 1) {
                item.good_type_name = '金币'
              } else {
                item.good_type_name = '实物奖品'
              }
              // 邮寄方式
              if (item.shipping === 1) {
                item.shipping_name = '包邮'
              } else if (item.shipping === 2) {
                item.shipping_name = '到付'
              } else {
                item.shipping_name = '自动发送'
              }
              // 订单状态
              if (item.express_status === 0) {
                item.express_status_name = '待发货'
              } else if (item.express_status === 1) {
                item.express_status_name = '待收货'
              } else {
                item.express_status_name = '交易完成'
              }
              return item
            })
          }
          this.tableData = body
          this.pageInfo.currentPage = response.data.data.current_page
          this.pageInfo.pageSize = response.data.data.per_page
          this.pageInfo.totalRow = response.data.data.total
        } else {
          this.$message.error(response.data.msg)
        }
      })
    },
    handleCurrentChange (val) {
      this.params.page = val
      this.getList()
    },
    handleSizeChange (val) {
      this.params.pageSize = val
      this.getList()
    }
  },
  components: {
    child: child,
    trace: trace
  }
}
</script>
<style>
</style>
