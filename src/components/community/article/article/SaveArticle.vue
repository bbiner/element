<template>
  <el-form ref="forms" :model="form" :rules="rules" label-width="130px">
    <el-form-item label="文章分类" prop="articleCategoryId">
      <el-select v-if="categoryList" v-model="form.articleCategoryId" placeholder="文章分类" style="width: 130px;">
        <el-option v-for="(item,index) in categoryList" :key="'category'+index" :label="item.title" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="文章来源" prop="source">
      <el-input v-model="form.source" style="width: 480px"></el-input>
    </el-form-item>
    <el-form-item label="文章标题" prop="title">
      <el-input v-model="form.title" style="width: 480px"></el-input>
    </el-form-item>
    <el-form-item label="文章封面图" prop="coverPic">
      <uploader @uploadSuccess="handleUpload" ref="uploader" :defaultImage="form.coverPic"></uploader>
      <el-input v-show="false" v-model="form.coverPic"></el-input>
    </el-form-item>
    <el-form-item label="文章正文" prop="content">
      <ms-editor v-model="form.content" toolBar="all" upload-category="article"></ms-editor>
    </el-form-item>
    <el-form-item label="上线时间" prop="online">
      <el-col :span="4">
        <el-checkbox label="立即上线" name="type" :checked="form.nowOnline" v-model="form.nowOnline"></el-checkbox>
      </el-col>
      <el-col :span="6" v-show="!form.nowOnline">
        <el-date-picker type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" @change="pickerChange" placeholder="选择日期" v-model="form.onlineAt" style="width: 100%"></el-date-picker>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import moment from 'moment'
import { articleApi } from '@/api/platform/article'
import Uploader from '@/components/common/Uploader/Uploader'
import MsEditor from '@/components/common/Editor'

export default {
  components: {Uploader, MsEditor},
  props: {
    form: Object,
    categoryList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  filters: {
    timeFormatter (val) {
      return moment(val).format('YYYY-MM-DD HH:mm')
    }
  },
  data () {
    return {
      onlineAtChange: false, // 上线时间是否改变
      files: [],
      rules: {
        articleCategoryId: [
          {required: true, message: '请选择分类', trigger: 'change'}
        ],
        source: [
          {max: 12, message: '长度不能超过12个字符', trigger: 'change'}
        ],
        title: [
          {required: true, message: '请填写文章标题', trigger: 'change'},
          {max: 40, message: '长度不能超过40个字符', trigger: 'change'}
        ],
        coverPic: [
          {required: true, message: '请上传封面图', trigger: 'change'}
        ],
        content: [
          {required: true, message: '请填写文章内容', trigger: 'change'}
        ],
        online: [
          {
            validator: (rule, value, callback) => {
              if (!this.form.nowOnline && !this.form.onlineAt) {
                callback(new Error('请填写上线时间'))
              }
              if (this.onlineAtChange && !this.form.nowOnline && moment(this.form.onlineAt).valueOf() < moment().add(1, 'h').valueOf()) {
                callback(new Error('上线时间应在1小时之后'))
              }
              callback()
            },
            trigger: 'change'
          }]
      }
    }
  },
  methods: {
    pickerChange (val) {
      console.log(this.form.onlineAt, val)
      if (this.form.onlineAt !== val) {
        this.onlineAtChange = true
      }
    },
    onSubmit () {
      console.log(this.form.content)
      if (this.form.nowOnline) {
        delete this.form.onlineAt
      }
      this.$refs['forms'].validate((valid) => {
        if (valid) {
          // 开始请求
          let formData = this.form
          let promise
          if (formData.id) {
            promise = articleApi.edit(formData)
          } else {
            promise = articleApi.create(formData)
          }
          promise.then((response) => {
            if (response.status === 200 || response.status === 204) {
              this.done(formData)
            }
          }).catch(trace => {
            if (trace.response.data.error) {
              this.$message.error(trace.response.data.error)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onCancel () {
      this.done()
    },
    done (data) {
      this.$emit('done', data)
      this.$refs.uploader.clearPicture()
      this.clearTimeSelect()
      this.resetForm()
    },
    handleUpload (path) {
      this.form.coverPic = path
    },
    resetForm () {
      this.$refs['forms'].resetFields()
    },
    clearTimeSelect () {
      this.form.nowOnline = undefined
      this.form.onlineAt = null
    }
  }
}
</script>

<style scoped lang="scss">

</style>
