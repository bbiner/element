<template>
  <el-dialog title="编辑签到" :visible.sync="dialogTableVisible">
    <el-form ref="ruleForm" labelPosition="left" :model="form" labelWidth="80px">
      <el-row>
        <el-form-item labelWidth="180" label="签到类型">
          <el-col :span="20">
            <el-radio-group v-model="radioValue2" @change="radioChange2">
              <el-radio value="0" label="每日签到积分相同"></el-radio>
              <el-radio value="1" label="每日签到积分不同"></el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
      </el-row>
      <div v-if="consecutive" :key="index" v-for="(day, index) in signDays.days">
        <el-row>
          <el-form-item :label="'签到第 ' + (index + 1) + ' 天获得积分'" labelWidth="200px" ref="addItem">
            <el-col :span="3">
              <el-input-number v-model="signDays.award_scores[index]" :step="10" @change="handleChange" :min="1" :max="99999999" label="描述文字"></el-input-number>
            </el-col>
            <el-button-group style="margin-left: 20%">
              <el-button @click="add(signDays.days.length + 1)" size="small" round type="primary" icon="el-icon-plus"></el-button>
              <el-button @click="remove(signDays.days.length)" size="small" round type="info" icon="el-icon-minus"></el-button>
            </el-button-group>
          </el-form-item>
        </el-row>
      </div>
      <div v-if="simple">
        <el-form-item label="每日签到获得积分" labelWidth="130px">
          <el-col :span="3">
            <el-input v-model="form.score"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="每连续签到天数" labelWidth="130px">
          <el-col :span="3">
            <el-input v-model="form.days"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="额外奖励积分" labelWidth="130px">
          <el-col :span="3">
            <el-input v-model="form.extra_score"></el-input>
          </el-col>
        </el-form-item>
      </div>
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
      <el-row>
        <el-form-item label="每日上限">
          <el-alert
            title="一次"
            type="info"
            :closable="false">
          </el-alert>
        </el-form-item>
      </el-row>
      <el-form-item label="状态">
        <el-col :span="5">
          <el-tag :type="form.status == 1 ? 'success' : 'danger'">{{form.status == 1 ? '开启' : '关闭'}}</el-tag>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="dialogTableVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import Score, {TASK_DETAIL_URL, TASK_USER_SIGN_URL} from '@/api/platform/score/score'
const _score = new Score()
const TASK_ID = 6
export default {
  created () {
  },
  data () {
    return {
      dialogTableVisible: false,
      task: [],
      form: {
        score: 0,
        extra_score: 0,
        days: 0,
        status: 1,
        genre: 0,
        start_at: '',
        end_at: '',
        awards: []
      },
      signDays: {
        award_scores: [1],
        days: [1],
        award_score: 0,
        consecutive_day: 0,
        consecutive_award: 0
      },
      simple: false,
      consecutive: false,
      dateValue: '',
      dateValue2: '',
      radioValue: '长期',
      radioValue2: '每日签到积分不同'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$on('UserSignStrategy', () => {
        console.log('监听')
        setTimeout(() => {
          this.userSign()
        }, 200)
      })
    })
  },
  methods: {
    taskDetail () {
      _score.get(TASK_DETAIL_URL + TASK_ID, this.from).then(res => {
        console.log('任务详情', res)
        setTimeout(() => {
          this.task = res.data
          this.filterBack()
        }, 200)
        // 过滤回现参数
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.data.error
        })
      })
    },
    // 过滤回现数据
    filterBack () {
      if (this.task.awards.genre === 'consecutive') {
        this.consecutive = true
        this.radioValue2 = '每日签到积分不同'
        this.signDays = JSON.parse(this.task.awards.consecutive_awards)
        this.form.genre = 1
      }
      if (this.task.awards.genre === 'simple') {
        this.signDays = JSON.parse(this.task.awards.simple_awards)
        this.radioValue2 = '每日签到积分相同'
        this.form.genre = 0
        this.form.score = this.signDays.award_score
        this.form.extra_score = this.signDays.consecutive_award
        this.form.days = this.signDays.consecutive_day
        this.simple = true
      }
      this.form.status = this.task.status
      if (this.task.end_at === null) {
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
      if (this.form.genre === 1) {
        console.log('切换', this.signDays)
        this.form.awards = this.signDays.award_scores
      }
      if (this.form.genre === 0) {
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
            message: '每连续签到天数格式错误'
          })
          return false
        }
        if (this.form.extra_score === '' || this.form.extra_score === '0' || this.form.extra_score === 0) {
          this.$message({
            type: 'error',
            message: '每连续签到天数不能为0或空'
          })
          return false
        }
        if (this.form.extra_score < 0 || isNaN(this.form.extra_score)) {
          this.$message({
            type: 'error',
            message: '积分格式错误'
          })
          return false
        }
        if (this.form.days === '' || this.form.days === '0' || this.form.days === 0) {
          this.$message({
            type: 'error',
            message: '额外奖励积分不能为0或空'
          })
          return false
        }
        if (this.form.days < 0 || isNaN(this.form.days)) {
          this.$message({
            type: 'error',
            message: '额外奖励积分格式错误'
          })
          return false
        }
      }
      return true
    },
    userSign () {
      this.taskDetail()
      this.dialogTableVisible = true
    },
    // 单选有效期变化
    radioChange () {
      this.dateValue = []
    },
    // 单选每日上限变化
    radioChange2 () {
      if (this.radioValue2 === '每日签到积分不同') {
        this.signDays = JSON.parse(this.task.awards.consecutive_awards)
        this.form.genre = 1
        console.log('连续', this.signDays)
        if (this.signDays.length === 0) {
          this.signDays = {
            award_scores: [1],
            days: [1]
          }
        }
        this.consecutive = true
        this.simple = false
      } else {
        this.signDays = JSON.parse(this.task.awards.simple_awards)
        this.form.genre = 0
        if (this.signDays.length === 0) {
          this.signDays = {
            award_score: 0,
            consecutive_day: 0,
            consecutive_award: 0
          }
        }
        this.consecutive = false
        this.simple = true
      }
    },
    // 选择日期单选变化
    datePicker () {
      setTimeout(() => {
        this.radioValue = '自定义'
      }, 200)
    },
    inputPicker () {
      this.radioValue2 = '自定义'
    },
    submitForm () {
      // 过滤提交数据
      if (!this.filterSubmit()) {
        return
      }
      console.log('提交数据', this.form)
      _score.put(TASK_USER_SIGN_URL, this.form).then(res => {
        console.log(res)
        this.dialogTableVisible = false
        this.$message({
          type: 'success',
          message: '设置成功'
        })
        setTimeout(() => {
          this.$emit('refresh')
        }, 100)
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.data.error
        })
      })
    },
    handleChange (value) {
      console.log(value)
    },
    add (index) {
      this.signDays.days.push(index)
      this.signDays.award_scores.push(10)
    },
    remove (index) {
      if (index === 1) {
        this.$message({
          type: 'error',
          message: '最后一行不能删除'
        })
        return false
      }
      this.signDays.days.pop()
      this.signDays.award_scores.pop()
    },
    test () {
      console.log(this.form, '日期', this.dateValue, this.radioValue)
    }
  }
}
</script>

<style>

</style>
