<template>
  <el-dialog title="首次注册" :visible.sync="dialogTableVisible">
    <el-form ref="ruleForm" :model="form" labelWidth="80px">
      <el-row>
        <el-form-item labelWidth="180" label="首次注册登陆获得积分">
          <el-col :span="5">
            <el-input v-model="form.score"></el-input>
          </el-col>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item labelWidth="180" label="任务有效期">
          <el-col :span="17">
            <el-radio-group v-model="radioValue" @change="radioChange">
              <el-radio value="0" label="长期"></el-radio>
              <el-radio value="1" label="自定义"></el-radio>
              <el-date-picker style="margin-left: 15px"
                              @focus="datePicker"
                              value-format="yyyy-MM-dd HH:mm:ss"
                              v-model="dateValue"
                              type="daterange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
            </el-radio-group>
          </el-col>
        </el-form-item>
      </el-row>
      <el-form-item label="状态">
        <el-col :span="5">
          <el-tag :type="form.status == 1 ? 'success' : 'danger'">{{form.status == 1 ? '开启' : '关闭'}}</el-tag>
        </el-col>
      </el-form-item>
      <el-row>
        <el-form-item label="发放上限">
          <el-alert
            title="一个账户仅发放一次"
            type="info"
            :closable="false">
          </el-alert>
        </el-form-item>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="dialogTableVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import Score, {TASK_FIRST_LOGIN_URL, TASK_DETAIL_URL} from '@/api/platform/score/score'
const _score = new Score()
const TASK_ID = 1
export default {
  created () {
  },
  data () {
    return {
      dialogTableVisible: false,
      task: [],
      form: {
        score: 0,
        status: 1,
        start_at: '',
        end_at: ''
      },
      dateValue: '',
      radioValue: '长期'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$on('FirstLoginStrategy', () => {
        console.log('监听')
        setTimeout(() => {
          this.firstLogin()
        }, 200)
      })
    })
  },
  methods: {
    taskDetail () {
      _score.get(TASK_DETAIL_URL + TASK_ID, this.from).then(res => {
        console.log('任务详情', res)
        this.task = res.data
        // 过滤回现参数
        this.filterBack()
      }).catch(error => {
        console.log(error)
      })
    },
    // 过滤回现数据
    filterBack () {
      this.form.score = this.task.awards.award_score
      this.form.status = this.task.status
      if (this.task.start_at === null) {
        this.radioValue = '长期'
      } else {
        this.radioValue = '自定义'
        this.dateValue = []
        this.dateValue.push(this.task.start_at)
        this.dateValue.push(this.task.end_at)
      }
    },
    // 过滤提交数据
    filterSubmit () {
      if (this.form.score === '' || this.form.score === '0' || this.form.score === 0) {
        this.$message({
          type: 'error',
          message: '积分不能为0或空'
        })
        return false
      }
      if (this.form.score < 0 || isNaN(this.form.score)) {
        this.$message({
          type: 'error',
          message: '积分格式错误'
        })
        return false
      }
      if (this.radioValue === '自定义' && this.dateValue.length === 0) {
        this.$message({
          type: 'error',
          message: '请选择自定义时间'
        })
        return false
      }
      if (this.radioValue === '自定义') {
        this.form.start_at = this.dateValue[0]
        this.form.end_at = this.dateValue[1]
      } else {
        this.form.start_at = ''
        this.form.end_at = ''
      }
      return true
    },
    firstLogin () {
      this.taskDetail()
      this.dialogTableVisible = true
    },
    // 单选变化
    radioChange () {
      this.dateValue = []
    },
    // 选择日期单选变化
    datePicker () {
      setTimeout(() => {
        this.radioValue = '自定义'
      }, 200)
    },
    submitForm () {
      // 过滤提交数据
      if (!this.filterSubmit()) {
        return
      }
      console.log('提交数据', this.form)
      _score.put(TASK_FIRST_LOGIN_URL, this.form).then(res => {
        this.dialogTableVisible = false
        this.$message({
          type: 'success',
          message: '设置成功'
        })
        setTimeout(() => {
          this.$emit('refresh')
        }, 100)
        console.log(res)
      }).catch(error => {
        console.log(error)
      })
    },
    test () {
      console.log(this.form, '日期', this.dateValue, this.radioValue)
    }
  }
}
</script>

<style>

</style>
