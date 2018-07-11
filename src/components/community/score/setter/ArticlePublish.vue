<template>
  <el-dialog title="编辑发布原创文章奖励" :visible.sync="dialogTableVisible">
    <el-form ref="ruleForm" labelPosition="left" :model="form" labelWidth="80px">
      <el-form-item labelWidth="180" label="发布文章通过审核奖励">
      </el-form-item>
      <div :key="index" v-for="(star, index) in stars">
        <el-row>
          <el-form-item :label="star + '星级'" ref="addItem">
            <el-col :span="3">
              <el-input-number v-model="scores[index]" :step="10" @change="handleChange" :min="1" :max="99999999" label="描述文字"></el-input-number>
            </el-col>
            <el-button-group style="margin-left: 20%">
              <el-button @click="add(stars.length + 1)" size="small" round type="primary" icon="el-icon-plus"></el-button>
              <el-button @click="remove(stars.length)" size="small" round type="info" icon="el-icon-minus"></el-button>
            </el-button-group>
          </el-form-item>
        </el-row>
      </div>
      <el-row>
        <el-form-item label="发放上限">
          <el-alert
            title="无上限"
            type="info"
            :closable="false">
          </el-alert>
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
import Score, {TASK_DETAIL_URL, TASK_ARTICLE_PUBLISH_URL} from '@/api/platform/score/score'
const _score = new Score()
const TASK_ID = 3
export default {
  created () {
  },
  data () {
    return {
      dialogTableVisible: false,
      task: [],
      form: {
        status: 1,
        start_at: '',
        end_at: ''
      },
      stars: ['1星级'],
      scores: [1],
      dateValue: '',
      dateValue2: '',
      radioValue: '长期',
      radioValue2: '不限'
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$on('ArticlePublishStrategy', () => {
        console.log('监听')
        setTimeout(() => {
          this.articlePublish()
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
      this.form.status = this.task.status
      this.stars = this.task.awards.stars
      this.scores = this.task.awards.award_scores
      // this.form.frequency = this.task.frequency
      // console.log('出来啊', this.form.frequency)
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
      this.form.awards = this.scores
      return true
    },
    articlePublish () {
      this.taskDetail()
      this.dialogTableVisible = true
    },
    // 单选有效期变化
    radioChange () {
      this.dateValue = []
    },
    // 单选每日上限变化
    radioChange2 () {
      this.task.score_ceiling = ''
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
      _score.put(TASK_ARTICLE_PUBLISH_URL, this.form).then(res => {
        console.log(res)
        this.dialogTableVisible = false
        if (res.code === 1000) {
          this.$message({
            type: 'success',
            message: '设置成功'
          })
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }
        setTimeout(() => {
          this.$emit('refresh')
        }, 100)
      }).catch(error => {
        this.$message({
          type: 'error',
          message: error.msg
        })
      })
    },
    handleChange (value) {
      console.log(value)
    },
    add (index) {
      this.stars.push(index)
      this.scores.push(10)
    },
    remove (index) {
      if (index === 1) {
        this.$message({
          type: 'error',
          message: '最后一行不能删除'
        })
        return false
      }
      this.stars.pop()
      this.scores.pop()
    },
    test () {
      console.log(this.form, '日期', this.dateValue, this.radioValue)
    }
  }
}
</script>

<style>

</style>
