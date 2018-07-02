<template>
  <div class="score-tabs">
    <el-tabs v-model="activeName2" v-on:tab-click="handleClick" type="card">
      <el-tab-pane class="tab-top" label="积分基础设置" name="first">
        <Setter></Setter>
      </el-tab-pane>
      <el-tab-pane class="tab-top" label="积分管理" name="second">
        <ManageList :list="tab1"></ManageList>
      </el-tab-pane>
      <el-tab-pane class="tab-top" label="积分修改记录" name="third">
        <log-list :list="tab2" ></log-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import ManageList from '@/components/community/score/ManageList'
import LogList from '@/components/community/score/LogList'
import Setter from '@/components/community/score/setter/Setter'
export default {
  components: {
    ManageList,
    LogList,
    Setter
  },
  data () {
    return {
      tableData: [{
        title: '2016-05-02',
        score: '王小虎',
        cycle: '上海市普陀区金沙江路 1518 弄',
        updated_at: '2016-05-02',
        status: '长期',
        value2: true
      }, {
        title: '2016-05-02',
        score: '王小虎',
        cycle: '上海市普陀区金沙江路 1518 弄',
        updated_at: '2016-05-02',
        status: '长期',
        value2: true
      }, {
        title: '2016-05-02',
        score: '王小虎',
        cycle: '上海市普陀区金沙江路 1518 弄',
        updated_at: '2016-05-02',
        status: '长期',
        value2: 0
      }, {
        title: '2016-05-02',
        score: '王小虎',
        cycle: '上海市普陀区金沙江路 1518 弄',
        updated_at: '2016-05-02',
        status: '长期1',
        value2: 1
      }],
      activeName2: 'first',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
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
      },
      tab1: false,
      tab2: false
    }
  },
  methods: {
    handleClick (row) {
      console.log('切换卡片', row.label)
      if (row.label === '积分管理') {
        this.tab1 = true
      }
      if (row.label === '积分修改记录') {
        this.tab2 = true
      }
    }
  }
}
</script>

<style>
  .el-tabs--card > .el-tabs__header .el-tabs__nav {
    border: hidden;
  }
  .tab-top {
    line-height: 50px;
  }
  .select-status {
    height: 100px;
  }
</style>
