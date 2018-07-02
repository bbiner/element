<template>
  <el-dialog title="修改积分"  width="30%" :visible.sync="dialogScore">
    <el-form :model="score" :rules="rules" ref="ruleForm" style="margin-left: 20%">
      <el-form-item labelWidth="100" label="增加积分：">
        <el-col :span="6">
          <el-input-number @change="changeInt" v-model="score.int" :min="0" :max="999999999" label="增加积分"></el-input-number>
        </el-col>
      </el-form-item>
      <el-form-item labelWidth="100" label="扣减积分：">
        <el-col :span="6">
          <el-input-number @change="changeMinus" v-model="score.minus" :min="0" :max="row.amount" label="扣减积分"></el-input-number>
        </el-col>
      </el-form-item>
      <el-row>
        <el-form-item labelWidth="100" label="变更前积分：">
          <el-tag type="info">{{row.amount}}</el-tag>
        </el-form-item>
        <el-form-item labelWidth="100" label="变更后积分：">
          <el-tag type="info">{{score.after_amount}}</el-tag>
        </el-form-item>
      </el-row>
      <el-form-item prop="operation_reason" labelWidth="100" label="修改原因：">
        <el-input
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          v-model="score.operation_reason">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveScore('ruleForm')">保存</el-button>
        <el-button @click="dialogScore = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import Score, {SCORE_MODIFY_URL} from '@/api/platform/score/score'
const _score = new Score()
export default {
  data () {
    return {
      score: {
        int: 0,
        minus: 0,
        operation_reason: '',
        after_amount: 0,
        before_amount: 0
      },
      row: {
        amount: 0
      },
      params: {
        score: 0
      },
      dialogScore: false,
      rules: {
        operation_reason: [
          { required: true, message: '请输入修改原因', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在100个字以内', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$on('modifyScoreBox', (row) => {
        console.log('监听弹出框')
        this.dialogScore = true
        setTimeout(() => {
          this.row = row
          this.score.before_amount = row.amount
        }, 200)
        console.log(row)
      })
    })
  },
  methods: {
    saveScore (ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.getparmas()
          console.log('put参数', this.params)
          _score.put(SCORE_MODIFY_URL + this.row.id, this.params).then(res => {
            console.log('修改成功:', res)
            // 组件数据初始化
            this.dialogScore = false
            this.score.int = 0
            this.score.minus = 0
            this.score.operation_reason = ''
            setTimeout(() => {
              this.$emit('refresh')
            }, 200)
          }).catch(error => {
            console.log(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changeInt () {
      console.log('增加')
      this.score.minus = 0
      this.score.after_amount = this.row.amount + this.score.int
    },
    changeMinus () {
      console.log('减法')
      this.score.int = 0
      this.score.after_amount = this.row.amount - this.score.minus
      if (this.score.after_amount < 0) {
        this.score.after_amount = 0
      }
    },
    getparmas () {
      if (this.score.int === 0 && this.score.minus === 0) {
        this.$message({
          type: 'warning',
          message: '请选择修改一种积分'
        })
      }
      this.params.score = 0
      if (this.score.int > 0) {
        this.params.score = this.score.int
      }
      if (this.score.minus > 0) {
        this.params.score = -this.score.minus
      }
      this.params = Object.assign({}, this.params, this.score)
    }
  }
}
</script>

<style>

</style>
