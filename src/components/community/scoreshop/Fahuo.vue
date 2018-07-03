<template>
  <el-dialog title="邮寄商品" :visible.sync="isShow">
    <el-form :model="form" ref="form" >
      <el-form-item label="收货人" :label-width="formLabelWidth">
        <el-col :span="8">
        <el-input v-model="form.consigneeName" auto-complete="off" disabled></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="联系电话" :label-width="formLabelWidth">
        <el-col :span="8">
        <el-input v-model="form.consigneePhone" auto-complete="off" disabled></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="收货地址" :label-width="formLabelWidth">
        <el-input v-model="form.consigneeAddress" auto-complete="off" disabled></el-input>
      </el-form-item>
      <el-form-item label="快递公司编码" :label-width="formLabelWidth" prop="expressCompanyCode"
                    :rules="[
                  { required: true, message: '请输入快递公司编码' }
                ]">
        <el-col :span="8">
        <el-input v-model="form.expressCompanyCode" auto-complete="off"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="物流单号" :label-width="formLabelWidth" prop="expressCode"
                    :rules="[
                  { required: true, message: '请输入物流单号' }
                ]" >
        <el-col :span="8">
        <el-input v-model="form.expressCode" auto-complete="off"></el-input>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShow = false">取 消</el-button>
      <el-button type="primary" @click="deliver">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import OrderListApi from '@/api/platform/order-list'
export default {
  data () {
    return {
      form: {
        consigneeName: '',
        consigneePhone: '',
        consigneeAddress: '',
        expressCompanyCode: '',
        expressCode: ''
      },
      isShow: false,
      order: {},
      formLabelWidth: '120px'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$on('showBox', (order) => {
        this.order = order
        this.form.consigneeName = order.consignee_name
        this.form.consigneePhone = order.consignee_phone
        this.form.consigneeAddress = order.province + '' + order.city + '' + order.area + '' + order.street
        this.show()
      })
    })
  },
  methods: {
    show () {
      this.isShow = true
    },
    deliver () {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let orderId = this.order.id
          let express = {
            express_company_code: this.form.expressCompanyCode,
            express_code: this.form.expressCode
          }
          OrderListApi.deliver(orderId, express, response => {
            const status = response.status || 0
            if (status === 200) {
              this.isShow = false
              this.$message.success('发货成功')
              location.reload()
            } else {
              this.$message.error(response.data.error)
            }
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
