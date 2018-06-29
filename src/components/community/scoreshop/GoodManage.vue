<template>
  <div>
    <el-form :inline="true" :model="form" class="demo-form-inline">
      <el-form-item >
        <el-select v-model="form.type" placeholder="商品类型">
          <el-option label="全部" value=""></el-option>
          <el-option label="金币" value="1"></el-option>
          <el-option label="实物奖品" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item >
        <el-select v-model="form.status" placeholder="商品状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="上架中" value="1"></el-option>
          <el-option label="下架中" value="-1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item >
        <el-input v-model="form.title" placeholder="商品标题"></el-input>
      </el-form-item>
      <el-form-item >
        <el-select v-model="form.stock_status" placeholder="库存状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="有货" value="1"></el-option>
          <el-option label="缺货" value="-1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
        <router-link to="/good_add"><el-button type="primary"  @click="onSubmit">添加商品</el-button></router-link>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="thumb_pic"
        label="商品缩略图"
        width="180">
      </el-table-column>
      <el-table-column
        prop="title"
        label="商品标题"
        width="180">
      </el-table-column>
      <el-table-column
        prop="status_name"
        label="状态"
        width="180">
      </el-table-column>
      <el-table-column
        prop="exchange_score"
        label="所需积分"
        width="180">
      </el-table-column>
      <el-table-column
        prop="stock"
        label="库存"
        width="180">
      </el-table-column>
      <el-table-column
        prop="stock_status"
        label="库存状态"
        width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="edit(scope.row.id)">编辑</el-button>
          <el-button type="text" v-if="scope.row.status===1" @click="grounding(scope.row.id,-1)">下架</el-button>
          <el-button type="text" v-if="scope.row.status===(-1||0)" @click="grounding(scope.row.id,1)">上架</el-button>
          <el-button type="text">手机预览</el-button>
          <el-button type="text" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import GoodListApi from '@/api/platform/good-list'
export default {
  data () {
    return {
      form: {
        type: '',
        status: '',
        title: '',
        stock_status: ''
      },
      tableData: []
    }
  },
  created () {
    GoodListApi.list(this.form, response => {
      const status = response.status || 0
      const body = response.data || {}
      if (status === 200) {
        if (body) {
          body.map(item => {
            if (item.status === 1) {
              item.status_name = '上架中'
            } else if (item.status === -1) {
              item.status_name = '下架中'
            } else {
              item.status_name = '待定'
            }
            if (item.stock <= item.warning_stock) {
              item.stock_status = '缺货'
            } else {
              item.stock_status = '有货'
            }
            return item
          })
        }
        this.tableData = body
      } else {
        this.$message.error(body.error || '获取列表失败')
      }
    })
  },
  methods: {
    onSubmit () {
      GoodListApi.list(this.form, response => {
        const status = response.status || 0
        const body = response.data || {}
        if (status === 200) {
          if (body) {
            body.map(item => {
              if (item.status === 1) {
                item.status = '上架中'
              } else if (item.status === -1) {
                item.status = '下架中'
              } else {
                item.status = '待定'
              }
              if (item.stock <= item.warning_stock) {
                item.stock_status = '缺货'
              } else {
                item.stock_status = '有货'
              }
              return item
            })
          }
          this.tableData = body
        } else {
          this.$message.error(body.error || '获取列表失败')
        }
      })
    },
    // 编辑商品
    edit (id) {
      this.$router.push({path: '/good_add', query: {id: id}})
    },
    // 上下架商品
    grounding (id, state) {
      GoodListApi.grounding(id, state, response => {
        const status = response.status || 0
        if (status === 200) {
          this.$message.success(response.data.message)
          location.reload()
        } else {
          this.$message.error(response.data.message)
        }
      })
    },
    // 删除商品
    del (id) {
      this.$confirm('你确认删除该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        GoodListApi.del(id, response => {
          const status = response.status || 0
          if (status === 204) {
            this.$message.success('删除成功')
            location.reload()
          } else {
            this.$message.error(response.data.error)
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style>
</style>
