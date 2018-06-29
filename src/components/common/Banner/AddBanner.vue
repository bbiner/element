<template>
  <el-form ref="forms" :model="form" :rules="rules" label-width="130px">
    <el-form-item label="BANNER名称" prop="title">
      <el-input v-model="form.title" style="width: 480px"></el-input>
    </el-form-item>
    <el-form-item label="BANNER图片" prop="imageUrl">
      <uploader @uploadSuccess="handleUpload" ref="uploader" :defaultImage="form.imageUrl"></uploader>
      <el-input v-show="false" v-model="form.imageUrl"></el-input>
    </el-form-item>
    <el-form-item label="跳转链接">
      <el-input v-model="form.url" style="width: 480px"></el-input>
    </el-form-item>
    <el-form-item label="上线时间" prop="online">
      <el-col :span="4">
        <el-checkbox label="立即上线" name="type" :checked="form.nowOnline" v-model="form.nowOnline"></el-checkbox>
      </el-col>
      <el-col :span="6" v-show="!form.nowOnline">
        <el-date-picker type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择日期" v-model="form.onlineAt" style="width: 100%"></el-date-picker>
      </el-col>
    </el-form-item>
    <el-form-item label="下线时间" prop="onffine">
      <el-col :span="4">
        <el-checkbox label="永不下线" name="type" :checked="form.neverOffline" v-model="form.neverOffline"></el-checkbox>
      </el-col>
      <el-col :span="6" v-show="!form.neverOffline">
        <el-date-picker type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" placeholder="选择日期" v-model="form.offlineAt" style="width: 100%"></el-date-picker>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">提交</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { bannerApi } from '@/api/platform/banner'
import Uploader from '@/components/common/Uploader/Uploader'
import moment from 'moment'

export default {
  components: {Uploader},
  props: {
    form: Object
  },
  data () {
    return {
      files: [],
      rules: {
        title: [
          {required: true, message: '请输入BANNER名称', trigger: 'change'},
          {max: 40, message: '长度不能超过40个字符', trigger: 'change'}
        ],
        imageUrl: [
          {required: true, message: '请上传BANNER', trigger: 'change'}
        ],
        online: [{
          validator: (rule, value, callback) => {
            if (!this.form.nowOnline && !this.form.onlineAt) {
              callback(new Error('请填写上线时间'))
            }
            if (!this.form.nowOnline && moment(this.form.onlineAt).valueOf() < moment().add(1, 'h').valueOf()) {
              callback(new Error('上线时间应在1小时之后'))
            }
            if (!(this.form.neverOffline || this.form.nowOnline) && this.form.onlineAt && this.form.offlineAt && this.form.onlineAt >= this.form.offlineAt) {
              callback(new Error('上线时间不能超过下线时间'))
            }
            callback()
          },
          trigger: 'change'
        }],
        onffine: [{
          validator: (rule, value, callback) => {
            if (!this.form.neverOffline && !this.form.offlineAt) {
              callback(new Error('请填写下线时间'))
            }
            if (!(this.form.neverOffline || this.form.nowOnline) && this.form.onlineAt && this.form.offlineAt && this.form.onlineAt >= this.form.offlineAt) {
              callback(new Error('上线时间不能超过下线时间'))
            }
            callback()
          },
          trigger: 'change'
        }]
      }
    }
  },
  computed: {
    offlineAt: {
      get: function () {
        return this.offlineAt
      },
      set: function (value) {
        this.offlineAt = moment(value).format('YYYY-MM-DD HH:mm')
      }
    }
  },
  methods: {
    onSubmit () {
      console.log(this.form.nowOnline)
      this.$refs['forms'].validate((valid) => {
        if (valid) {
          // 开始请求
          bannerApi.confirmUpload({'files': this.files}).then(response => {
            if (response.status === 200 || response.status === 204) {
              console.log(this.form.imageUrl)
              if (this.files.length > 0) {
                this.form.imageUrl = response.data[0]
              }
              let formData = this.form
              // 如果选择立即上线删除上线时间属性
              if (formData.nowOnline) {
                delete formData.onlineAt
              }
              if (formData.neverOffline) {
                delete formData.offlineAt
              }
              // 有id则为编辑
              if (formData.id) {
                return bannerApi.edit(formData)
              }
              return bannerApi.create(formData)
            }
          }).then((response) => {
            if (response.status === 200) {
              this.done(response.data)
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
      this.form.imageUrl = path
      this.files.push(path)
    },
    resetForm () {
      this.$refs['forms'].resetFields()
    },
    clearTimeSelect () {
      this.form.nowOnline = false
      this.form.neverOffline = false
      this.form.onlineAt = null
      this.form.offlineAt = null
    }
  }
}
</script>

<style scoped lang="scss">

</style>
