<template>
  <el-row>
    <el-row>
      <el-button type="primary" @click="show('添加')">添加BANNER</el-button>
    </el-row>
    <el-row>
      <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="状态" style="width: 100px;">
            <el-option label="全部" value=""></el-option>
            <el-option label="已上线" value="1"></el-option>
            <el-option label="待上线" value="0"></el-option>
            <el-option label="已下线" value="-1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="BANNER名称">
          <el-input v-model="searchForm.title" placeholder="BANNER名称"></el-input>
        </el-form-item>
        <el-form-item label="上线时间">
          <el-date-picker
            v-model="online_at"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="下线时间">
          <el-date-picker
            v-model="offline_at"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%">
      <el-table-column
        type="index"
        label="排序"
        width="50"
      >
      </el-table-column>
      <el-table-column
        prop="title"
        label="BANNER名称"
      >
      </el-table-column>
      <el-table-column
        prop="image_url"
        label="BANNER图片"
      >
        <template slot-scope="scope">
          <img :src="scope.row.image_url" width="200" height="100"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="url"
        label="跳转链接"
      >
        <template slot-scope="scope">
          <a class="el-button el-button--text el-button--small" :href="scope.row.url">查看链接</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="online_at"
        label="上线时间"
        :formatter="onlineAtFormatter"
      >
      </el-table-column>
      <el-table-column
        prop="offline_at"
        label="下线时间"
        :formatter="offlineAtFormatter"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status|typeFilter"
            disable-transitions>{{scope.row.status | statusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="click"
        label="点击量"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="220">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status !== 1"
                     @click.native.prevent="putOnline(scope.row)"
                     type="text"
                     size="small">
            上架
          </el-button>
          <el-button v-if="scope.row.status === 1"
                     @click.native.prevent="putOffline(scope.row)"
                     type="text"
                     size="small">
            下架
          </el-button>
          <el-button v-show="searchForm.status === ''" @click.native.prevent="up(scope.row,scope.$index)"
                     type="text"
                     size="small">
            上移
          </el-button>
          <el-button v-show="searchForm.status === ''"  @click.native.prevent="down(scope.row,scope.$index)"
                     type="text"
                     size="small">
            下移
          </el-button>
          <el-button @click.native.prevent="edit(scope.row,scope.$index)"
                     type="text"
                     size="small">
            修改
          </el-button>
        </template>
      </el-table-column>
      </el-table>
    </el-row>
    <el-dialog :title="dialogTitle+'BANNER'" :visible.sync="dialogFormVisible">
      <add-banner @done="addDone" :form="saveData"></add-banner>
    </el-dialog>
  </el-row>
</template>

<script>
import { bannerApi } from '@/api/platform/banner'
import addBanner from '@/components/common/Banner/AddBanner'
import moment from 'moment'

export default {
  data () {
    return {
      tableData: [],
      loading: true,
      dialogFormVisible: false,
      dialogTitle: '添加',
      saveData: {
        url: 'http://www.www.ww'
      },
      selectID: 0,
      offline_at: [],
      online_at: [],
      searchForm: {
        status: '',
        title: '',
        onlineAtStart: '',
        onlineAtEnd: '',
        offlineAtStart: '',
        offlineAtEnd: ''
      },
      currentEditRowIndex: null
    }
  },
  components: {
    addBanner
  },
  mounted () {
    this.getList({})
  },
  filters: {
    typeFilter (val) {
      let statusStr = ''
      switch (val) {
        case -1:
          statusStr = 'danger'
          break
        case 0:
          statusStr = 'info'
          break
        case 1:
          statusStr = 'success'
          break
      }
      return statusStr
    },
    statusFilter (val) {
      let statusStr = ''
      switch (val) {
        case -1:
          statusStr = '已下线'
          break
        case 0:
          statusStr = '待上线'
          break
        case 1:
          statusStr = '已上线'
          break
      }
      return statusStr
    }
  },
  methods: {
    getList ({title, status, onlineAtStart, onlineAtEnd, offlineAtStart, offlineAtEnd}) {
      bannerApi.get(
        {
          title: title,
          status: status,
          onlineAtStart: onlineAtStart,
          onlineAtEnd: onlineAtEnd,
          offlineAtStart: offlineAtStart,
          offlineAtEnd: offlineAtEnd
        }
        , (response) => {
          this.tableData = response.data
          this.loading = false
        })
    },
    onSubmit () {
      if (!(this.online_at instanceof Array)) {
        this.online_at = []
      }
      if (!(this.offline_at instanceof Array)) {
        this.offline_at = []
      }
      this.searchForm.onlineAtStart = this.online_at[0]
      this.searchForm.onlineAtEnd = this.online_at[1]
      this.searchForm.offlineAtStart = this.offline_at[0]
      this.searchForm.offlineAtEnd = this.offline_at[1]
      this.getList(this.searchForm)
    },
    putOnline (row) {
      bannerApi.putOnline({id: row.id}, (response) => {
        if (response.status === 204) {
          row.status = 1
        }
      })
    },
    putOffline (row) {
      bannerApi.putOffline({id: row.id}, (response) => {
        if (response.status === 204) {
          row.status = -1
        }
      })
    },
    up (row, index) {
      bannerApi.up({id: row.id}, (response) => {
        if (response.status === 204) {
          this.changePosition(index, 'up')
        } else {
          this.$message.error('无法移动')
        }
      })
    },
    down (row, index) {
      bannerApi.down({id: row.id}, (response) => {
        if (response.status === 204) {
          this.changePosition(index, 'down')
        } else {
          this.$message.error('无法移动')
        }
      })
    },
    changePosition: function (index, action) {
      if (index < 0) {
        return false
      }
      const length = this.tableData.length
      const prevRow = this.tableData[index - 1] ? this.tableData[index - 1] : null
      const oldRow = this.tableData[index]
      const nextRow = index + 1 < length ? this.tableData[index + 1] : null
      if (action === 'up' && prevRow !== null) {
        this.tableData.splice(index, 1, prevRow)
        this.tableData.splice(index - 1, 1, oldRow)
      } else if (action === 'down' && nextRow !== null) {
        this.tableData.splice(index, 1, nextRow)
        this.tableData.splice(index + 1, 1, oldRow)
      }
      return false
    },
    show (action) {
      this.dialogTitle = action
      this.dialogFormVisible = true
    },
    hide () {
      this.dialogFormVisible = false
    },
    addDone (data) {
      if (data) {
        console.log(this.currentEditRowIndex, data.id)
        if (this.currentEditRowIndex !== null && data.id) {
          this.tableData.splice(this.currentEditRowIndex, 1, data)
        } else {
          this.tableData.push(data)
        }
      }
      this.saveData = {}
      this.hide()
    },
    deleteRow (row, index) {
      bannerApi.delete({id: row.id}, (response) => {
        if (response.status === 204) {
          this.tableData.splice(index, 1)
        } else {
          this.$message.error(response.data.error)
        }
      })
    },
    onlineAtFormatter (row, column, cellValue, index) {
      if (cellValue === null) {
        return moment(row.created_at).format('YYYY-MM-DD HH:mm')
      }
      return moment(cellValue).format('YYYY-MM-DD HH:mm')
    },
    offlineAtFormatter (row, column, cellValue, index) {
      if (cellValue === null) {
        return '长期不下线'
      }
      return moment(cellValue).format('YYYY-MM-DD HH:mm')
    },
    edit (row, index) {
      this.currentEditRowIndex = index
      let data = {
        id: row.id,
        title: row.title,
        imageUrl: row.image_url,
        url: row.url,
        onlineAt: row.online_at,
        offlineAt: row.offline_at
      }
      data.nowOnline = row.online_at === null
      data.neverOffline = row.offline_at === null
      this.saveData = data
      this.show('编辑')
    }
  }
}
</script>
<style scoped lang="scss">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
