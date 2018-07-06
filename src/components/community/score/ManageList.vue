<template>
  <div class="management">
    <!--搜索-->
    <el-form ref="form" inline :model="form" labelWidth="80px">
      <el-form-item labelWidth="100" label="积分状态">
        <el-col :span="15">
          <el-select v-model="form.status" placeholder="积分状态">
            <el-option label="全部" value="0"></el-option>
            <el-option label="有效" value="1"></el-option>
            <el-option label="冻结" value="-1"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item labelWidth="100" label="手机号码/昵称">
        <el-col :span="15">
          <el-input v-model="form.keywords"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item labelWidth="100" label="已使用积分">
        <el-col :span="6">
          <el-input v-model="form.used_min"></el-input>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="6">
          <el-input v-model="form.used_max"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item labelWidth="100" label="剩余积分">
        <el-col :span="6">
          <el-input v-model="form.unused_min"></el-input>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="6">
          <el-input v-model="form.unused_max"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getScores">搜索</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
    <!--全部用户积分列表-->
    <el-table
      v-loading="loading"
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
        prop="used_amount"
        label="已使用积分"
        width="260">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="剩余积分"
        width="260">
      </el-table-column>
      <el-table-column
        prop="status"
        label="积分状态"
        width="260">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status ? 'success' : 'danger'">{{scope.row.status ? '有效' : '无效'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="userScoreInfo(scope.row.id)" type="text" size="small">查看详情</el-button>
          <el-button @click="handleMessage(scope.$index, scope.row)" type="text" size="small">{{scope.row.status ? '冻结积分' : '解除冻结'}}</el-button>
          <el-button @click="modifyScore(scope.row)" type="text" size="small">修改积分</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--修改积分-->
    <modify-user-score ref="modifyuserscore" v-on:refresh="refreshList"></modify-user-score>
    <!--会员积分详情-->
    <user-score ref="userscore"></user-score>
    <!--消息弹出框-->
    <Message ref="child" :messages="messageBox.current" v-on:childMessage="childMessage"></Message>
    <!--分页信息-->
    <Pagination v-if="pageInfo.length != 0" :page="pageInfo" :info="form" v-on:childValues="childPages"></Pagination>
  </div>
</template>
<script type="text/ecmascript-6">
import Score, {SCORE_URL, SCORE_STATUS_URL} from '@/api/platform/score/score'
import Pagination from '@/components/community/common/Pagination'
import Page from '@/utils/response-parse'
import Message from '@/components/community/common/MessageBox'
import UserScore from '@/components/community/score/UserScore'
import ModifyUserScore from '@/components/community/score/ModifyScore'
const _score = new Score()
export default {
  components: {
    Pagination,
    Message,
    UserScore,
    ModifyUserScore
  },
  props: {
    list: Boolean
  },
  created () {
    if (this.list) {
      console.log('积分管理加载')
    }
  },
  data () {
    return {
      tableData: [],
      currentIndex: 0,
      loading: true,
      pageInfo: {},
      form: {
        status: null,
        keywords: null,
        used_min: null,
        used_max: null,
        unused_min: null,
        unused_max: null
      },
      score: {
        check: 1,
        int: 0,
        minus: 0,
        textarea: ''
      },
      rules: {
        textarea: [
          { required: true, message: '请输入修改原因', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在100个字以内', trigger: 'blur' }
        ]
      },
      messageBox: {
        freeze: {
          title: '冻结',
          msg: '冻结后，会员将不可使用积分，是否继续？'
        },
        unfreeze: {
          title: '解除冻结',
          msg: '解除后，会员积分恢复正常，是否继续？'
        },
        current: {}
      },
      userId: 0
    }
  },
  watch: {
    list () {
      if (this.list) {
        setTimeout(() => {
          this.getScores()
        }, 200)
      }
    }
  },
  methods: {
    modifyScore (row) {
      this.$refs.modifyuserscore.$emit('modifyScoreBox', row)
    },
    handleMessage (index, row) {
      console.log('line', index, row)
      this.messageBox.current = row.status ? this.messageBox.freeze : this.messageBox.unfreeze
      this.userId = row.id
      this.currentIndex = index
      setTimeout(() => {
        this.$refs.child.$emit('messageBox')
      }, 200)
    },
    // 全部积分列表
    getScores (params = {}) {
      this.loading = true
      _score.get(SCORE_URL, Object.assign({}, params, this.form)).then(res => {
        console.log(res)
        this.tableData = res.data.map(item => {
          item.status = item.status === 1
          return item
        })
        this.loading = false
        this.pageInfo = Page.pagination(res.headers)
      }).catch(error => {
        console.log(error)
      })
    },
    modifyScoreStatus () {
      console.log('状态', this.tableData[this.currentIndex].status)
      let status = this.tableData[this.currentIndex].status ? -1 : 1
      _score.put(SCORE_STATUS_URL + this.userId, {status: status}).then(res => {
        // 更新当前行状态
        this.tableData[this.currentIndex].status = status === 1
        this.$message({
          type: 'success',
          message: '操作成功!'
        })
      }).catch(error => {
        console.log(error)
      })
    },
    // 接收子组件分页数据
    childPages (childValues) {
      this.getScores(childValues)
    },
    // 接收子组件消息确认信息
    childMessage (boolean) {
      console.log('点击：', boolean)
      if (boolean) {
        this.modifyScoreStatus(boolean)
      } else {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      }
    },
    // 刷新当前页
    refreshList () {
      this.getScores()
    },
    userScoreInfo (uid) {
      this.$refs.userscore.$emit('showBox', uid)
    },
    resetForm () {
      this.form.status = null
      this.form.keywords = null
      this.form.used_min = null
      this.form.used_max = null
      this.form.unused_min = null
      this.form.unused_max = null
      this.getScores()
    }
  }
}

</script>

<style>
  .management .el-form-item__content {
    width: 220px;
  }
</style>
