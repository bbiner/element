<template>
<el-upload
  class="file-uploader"
  action="/boss-api/file/simple-image"
  :headers="uploadHeaders"
  :show-file-list="false"
  :on-success="handleSuccess"
  :on-error="handleError"
  :before-upload="beforeAvatarUpload">
  <img v-if="imageUrl" :src="imageUrl" class="picture">
  <img v-else-if="defaultImage" :src="defaultImage" class="picture">
  <i class="el-icon-plus file-uploader-icon" v-else></i>
</el-upload>
</template>
<script>
import { LOGOUT } from '@/store/action-names'

export default {
  props: {
    defaultImage: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      imageUrl: ''
    }
  },
  computed: {
    uploadHeaders () {
      return {
        Authorization: this.$store.getters.authorization
      }
    }
  },
  methods: {
    handleSuccess (res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      // 将上传到服务器的路径派发出去
      this.$emit('uploadSuccess', res.path)
    },
    beforeAvatarUpload (file) {
      return true
    },
    handleError (err, file, fileList) {
      if (err.status === 401) {
        this.$store.dispatch(LOGOUT)
        return false
      }
      if (err.status === 400) {
        let response = JSON.parse(err.message)
        this.$message.error(response.error)
      }
    },
    clearPicture () {
      this.imageUrl = ''
    }
  }
}
</script>

<style lang="scss">
  .file-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .file-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .file-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .picture {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
