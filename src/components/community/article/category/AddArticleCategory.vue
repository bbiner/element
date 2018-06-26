<template>
  <el-form ref="form" :model="form" label-width="100px">
    <el-form-item label="栏目分类名称">
      <el-input v-model="form.title" style="width: 180px"></el-input>
    </el-form-item>
    <el-form-item label="是否立即上架">
      <el-switch v-model="form.nowOnline"></el-switch>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { articleApi } from '@/api/platform/article'

export default {
  data () {
    return {
      form: {
        title: '',
        nowOnline: false
      }
    }
  },
  methods: {
    onSubmit () {
      articleApi.addCategory(this.form, (response) => {
        if (response.status === 200) {
          this.done(response.data)
        } else if (response.status === 400) {
          this.$message.error(response.data.error)
        }
      })
    },
    onCancel () {
      this.done()
    },
    done (data) {
      this.$emit('done', data)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
