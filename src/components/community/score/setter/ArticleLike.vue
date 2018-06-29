<template>
  <el-dialog title="编辑点赞送积分" :visible.sync="dialogTableVisible">
    <el-form ref="ruleForm" labelPosition="left" :model="form" labelWidth="80px">
      <el-row>
        <el-form-item labelWidth="180" label="1篇文章点赞1次,奖励积分">
          <el-col :span="3">
            <el-input v-model="form.score"></el-input>
          </el-col>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item labelWidth="180" label="每日发放上限">
          <el-col :span="20">
            <el-radio-group style="float:left; line-height:50px;margin-left: 60px" v-model="radioValue2" @change="radioChange2">
              <el-radio value="0" label="不限"></el-radio>
              <el-radio value="1" label="自定义"></el-radio>
            </el-radio-group>
            <el-col :span="5" style="float:left; margin-left: 10px">
              <el-input @focus="inputPicker" v-model="task.score_ceiling"></el-input>
            </el-col>
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
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="dialogTableVisible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import Score, {TASK_DETAIL_URL, TASK_ARTICLE_LIEK_URL} from '@/api/platform/score/score'
const _score = new Score()
const TASK_ID = 4
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
        frequency: 0,
        start_at: '',
        end_at: ''
      },
      dateValue: '',
      dateValue2: '',
      radioValue: '长期',
      radioValue2: '不限'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$on('ArticleLikeStrategy', () => {
        console.log('监听')
        setTimeout(() => {
          this.articleRead()
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
        console.log(error)
      })
    },
    // 过滤回现数据
    filterBack () {
      this.form.score = this.task.awards.award_score
      this.form.status = this.task.status
      this.form.frequency = this.task.frequency
      console.log('出来啊', this.form.frequency)
      if (this.task.score_ceiling === 0) {
        this.radioValue2 = '不限'
      } else {
        this.radioValue2 = '自定义'
      }
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
      if (this.form.score === '' || this.form.score === '0' || this.form.score === 0) {
        this.$message({
          type: 'error',
          message: '积分不能为空'
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
      if (this.task.score_ceiling < 0 || isNaN(this.task.score_ceiling)) {
        this.$message({
          type: 'error',
          message: '自定义分数错误'
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
      if (this.radioValue2 === '自定义' && (this.task.score_ceiling === '' || this.task.score_ceiling === 0 || this.task.score_ceiling === '0')) {
        this.$message({
          type: 'error',
          message: '自定义分数不能为0或空'
        })
        return false
      }
      if (this.radioValue2 === '自定义') {
        this.form.score_max = this.task.score_ceiling
      }
      return true
    },
    articleRead () {
      this.taskDetail()
      this.dialogTableVisible = true
    },
    // 单选有效期变化
    radioChange () {
      this.dateValue = []
    },
    // 单选每日上限变化
    radioChange2 () {
      this.task.score_ceiling = 0
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
      _score.put(TASK_ARTICLE_LIEK_URL, this.form).then(res => {
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
