<template>
  <div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="title"
        label="任务名称"
        width="220">
      </el-table-column>
      <el-table-column
        prop="awards.award_score"
        label="获得积分数"
        width="220">
      </el-table-column>
      <el-table-column
        prop="frequency"
        label="每日上限(次)"
        width="220">
      </el-table-column>
      <el-table-column
        prop="updated_at"
        label="更新时间"
        width="220">
      </el-table-column>
      <el-table-column
        prop="cycle"
        label="任务有效期"
        width="220">
      </el-table-column>
      <el-table-column
        prop="id"
        label="状态"
        width="220">
        <template slot-scope="scope">
          <el-switch
            @change="modifyStatus(scope.row.id, scope.row.status)"
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small"
          >编辑</el-button>
          <el-button @click="showTaskLog(scope.row)" type="text" size="small">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--设置第一次登陆-->
    <first-login ref="FirstLoginStrategy" v-on:refresh="refreshList"></first-login>
    <!--阅读文章奖励设置-->
    <article-read ref="ArticleReadStrategy" v-on:refresh="refreshList"></article-read>
    <!--文章点赞-->
    <article-like ref="ArticleLikeStrategy" v-on:refresh="refreshList"></article-like>
    <!--文章分享-->
    <article-share ref="ArticleShareStrategy" v-on:refresh="refreshList"></article-share>
    <!--签到-->
    <user-sign ref="UserSignStrategy" v-on:refresh="refreshList"></user-sign>
    <!--发布原创文章-->
    <article-publish ref="ArticlePublishStrategy" v-on:refresh="refreshList"></article-publish>
    <!--任务详情-->
    <el-dialog width="60%" :title="title" :visible.sync="taskScoreLog">
      <div>
        <div class="search-box">
          <el-input placeholder="请输入内容会员昵称或手机号" v-model="params.keywords" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="searchTaskLog"></el-button>
          </el-input>
        </div>
        <el-table
          v-loading="loading"
          class="tab-top"
          :data="taskLogs"
          stripe
          style="width: 80%">
          <el-table-column
            prop="nick_name"
            label="会员昵称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="login_account"
            label="手机号码"
            width="180">
          </el-table-column>
          <el-table-column
            prop="updated_at"
            label="参与时间">
          </el-table-column>
          <el-table-column
            prop="variational"
            label="获得积分">
          </el-table-column>
        </el-table>
        <Pagination v-if="pageInfo.length != 0" :page="pageInfo" :info="params" v-on:childValues="childValues"></Pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import ElRow from 'element-ui/packages/row/src/row'
import Score, {TASK_URL, TASK_LOG_URL, TASK_MODIFY_STATUS_URL} from '@/api/platform/score/score'
import Pagination from '@/components/community/common/Pagination'
import Page from '@/utils/response-parse'
import FirstLogin from '@/components/community/score/setter/firstLogin'
import ArticleRead from '@/components/community/score/setter/articleRead'
import ArticleLike from '@/components/community/score/setter/ArticleLike'
import ArticleShare from '@/components/community/score/setter/ArticleShare'
import UserSign from '@/components/community/score/setter/UserSign'
import ArticlePublish from '@/components/community/score/setter/ArticlePublish'
const _score = new Score()
export default {
  components: {
    ElRow,
    Pagination,
    FirstLogin,
    ArticleRead,
    ArticleLike,
    ArticleShare,
    UserSign,
    ArticlePublish
  },
  created () {
    this.tasks()
  },
  data () {
    return {
      tableData: [],
      taskLogs: [],
      params: {
        keywords: ''
      },
      taskId: 0,
      select: 'mobile',
      pageInfo: [],
      loading: false,
      activeName2: 'first',
      dialogTableVisible: false,
      taskScoreLog: false,
      title: ''
    }
  },
  methods: {
    handleClick (row) {
      console.log('设置积分任务', row)
      setTimeout(() => {
        let res = row.handle_class_name
        this.$refs[res].$emit(res)
      }, 200)
    },
    // 任务发放明细
    showTaskLog (row) {
      this.title = row.title
      this.taskScoreLog = true
      this.taskId = row.id
      _score.get(TASK_LOG_URL, {task_id: row.id}).then(res => {
        this.taskLogs = res.data
        // 分页信息
        this.pageInfo = Page.pagination(res.headers)
        this.loading = false
      })
    },
    searchTaskLog (info = {}) {
      this.loading = true
      _score.get(TASK_LOG_URL, Object.assign({}, info, {task_id: this.taskId}, this.params)).then(res => {
        this.taskLogs = res.data
        this.pageInfo = Page.pagination(res.headers)
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    // 接收子组件数据
    childValues (childValues) {
      this.searchTaskLog(childValues)
    },
    // 任务列表
    tasks () {
      _score.get(TASK_URL).then(res => {
        this.tableData = res.data.map(item => {
          item.status = !!item.status
          item.frequency = item.frequency === 0 ? '不限' : item.frequency
          item.cycle = item.end_at === null ? '长期' : item.end_at
          if (item.awards.hasOwnProperty('award_scores')) {
            item.awards.award_score = item.awards.award_scores.join()
          }
          if (item.awards.hasOwnProperty('genre')) {
            item.awards.award_score = item.awards.genre === 'consecutive' ? JSON.parse(item.awards.consecutive_awards).award_scores.join() : JSON.parse(item.awards.simple_awards).award_score
          }
          return item
        })
        console.log(this.tableData)
      })
    },
    // 切换状态
    modifyStatus (taskId, bool) {
      let status = bool ? 1 : 0
      _score.put(TASK_MODIFY_STATUS_URL + taskId, {status: status}).then(res => {
        console.log(res)
      }).catch(error => {
        console.log(error)
      })
      console.log('id', taskId, status)
    },
    // 刷新当前页
    refreshList () {
      this.tasks()
    }
  }
}

</script>

<style>

</style>
