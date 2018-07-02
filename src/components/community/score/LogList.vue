<template>
<div>
  <el-form ref="form" inline :model="form" labelWidth="80px">
    <el-form-item  labelWidth="100" label="手机号码/昵称">
      <el-col :span="15">
        <el-input v-model="form.keywords"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item labelWidth="100" label="修改时间">
      <el-date-picker
        v-model="update_time"
        value-format="yyyy-MM-dd HH:mm:ss"
        type="datetimerange"
        :picker-options="pickerOptions2"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right">
      </el-date-picker>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">搜索</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
  <el-table
    :data="tableData"
    border
    style="width: 100%"
  >
    <el-table-column
      prop="nick_name"
      label="会员昵称"
      width="260">
    </el-table-column>
    <el-table-column
      prop="login_account"
      label="手机号码"
      width="260">
    </el-table-column>
    <el-table-column
      prop="updated_at"
      label="修改时间"
      width="260">
    </el-table-column>
    <el-table-column
      prop="operator"
      label="修改人"
      width="260">
    </el-table-column>
    <el-table-column
      prop="variational"
      label="积分变动"
      width="260">
    </el-table-column>
    <el-table-column
      prop="operation_reason"
      label="修改原因">
    </el-table-column>
  </el-table>
  <Pagination v-if="pageInfo.length != 0" :page="pageInfo" :info="form" v-on:childValues="childPages"></Pagination>
</div>
</template>

<script type="text/ecmascript-6">
import Score, {TASK_LOG_URL} from '@/api/platform/score/score'
import Pagination from '@/components/community/common/Pagination'
import Page from '@/utils/response-parse'
const _score = new Score()
export default {
  components: {
    Pagination
  },
  props: {
    list: Boolean
  },
  created () {
    if (this.list) {
      console.log('加载积分修改记录')
    }
  },
  data () {
    return {
      tableData: [],
      pageInfo: [],
      form: {
        keywords: ''
      },
      update_time: [],
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  watch: {
    list () {
      if (this.list) {
        this.scoreLogs()
      }
    }
  },
  methods: {
    handleClick (row) {
    },
    scoreLogs (params = {}) {
      this.getParams()
      _score.get(TASK_LOG_URL, Object.assign({}, params, this.form)).then(res => {
        console.log('积分明细', res)
        this.tableData = res.data
        this.pageInfo = Page.pagination(res.headers)
      })
    },
    // 接收子组件分页数据
    childPages (childValues) {
      this.scoreLogs(childValues)
    },
    getParams () {
      console.log('o', this.update_time)
      this.update_time = this.update_time === null ? [] : this.update_time
      if (typeof this.update_time === 'object' && this.update_time.length !== 0) {
        console.log('object')
        this.form.start_at = this.update_time[0]
        this.form.end_at = this.update_time[1]
      }
    },
    submitForm () {
      this.scoreLogs()
    },
    resetForm () {
      this.form.keywords = ''
      this.update_time = ''
      if (this.form.hasOwnProperty('start_at')) {
        delete this.form['start_at']
      }
      if (this.form.hasOwnProperty('end_at')) {
        delete this.form['end_at']
      }
      this.scoreLogs()
    }
  }
}
</script>

<style>

</style>
