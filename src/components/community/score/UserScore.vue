<template>
  <el-dialog title="会员积分详情" :visible.sync="isShow" width="60%">
    <el-form inline :model="score">
      <el-form-item label="姓名">
        <el-col :span="5">
          <el-tag type="success">{{score.nick_name}}</el-tag>
        </el-col>
      </el-form-item>
      <el-form-item label="积分状态">
        <el-col :span="5">
          <el-tag :type="score.status == 1 ? 'success' : 'danger'">{{score.status == 1 ? '有效' : '已冻结'}}</el-tag>
        </el-col>
      </el-form-item>
      <el-form-item label="剩余积分">
        <el-col :span="5">
          <el-tag type="info">{{score.amount}}</el-tag>
        </el-col>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      class="tab-top"
      :data="scoreLos"
      stripe
      style="width: 80%">
      <el-table-column
        prop="created_at"
        label="时间"
        width="180">
      </el-table-column>
      <el-table-column
        prop="variational"
        label="积分变动"
        width="180">
      </el-table-column>
      <el-table-column
        prop="source"
        label="积分更变途径">
      </el-table-column>
      <el-table-column
        prop="operation_reason"
        label="积分变动原因">
      </el-table-column>
    </el-table>
    <pagination :page="pageInfo" v-on:childValues="childPages"></pagination>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import Score, {SCORE_USER_URL, SCORE_USER_LOGS_URL} from '@/api/platform/score/score'
import Page from '@/utils/response-parse'
import Pagination from '@/components/community/common/Pagination'
const _score = new Score()
export default {
  components: {
    Pagination
  },
  data () {
    return {
      loading: true,
      pageInfo: {},
      score: {},
      scoreLos: [],
      isShow: false,
      uid: 0
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$on('showBox', (uid) => {
        console.log('监听弹出框')
        this.loading = true
        this.uid = uid
        this.showBox()
        setTimeout(() => {
          this.scoreDetail(uid)
          this.scoreLogs(uid)
        }, 200)
      })
    })
  },
  methods: {
    showBox () {
      this.isShow = true
    },
    scoreDetail (uid) {
      _score.get(SCORE_USER_URL + uid).then(res => {
        this.score = res.data
      }).catch(error => {
        console.log(error)
      })
    },
    scoreLogs (uid, params = {}) {
      _score.get(SCORE_USER_LOGS_URL + uid, Object.assign({}, params)).then(res => {
        console.log('积分明细', res)
        this.loading = false
        this.scoreLos = res.data
        this.pageInfo = Page.pagination(res.headers)
      }).catch(error => {
        this.loading = false
        console.log(error)
      })
    },
    // 接收子组件分页数据
    childPages (childValues) {
      this.scoreLogs(this.uid, childValues)
    }
  }
}
</script>

<style>

</style>
