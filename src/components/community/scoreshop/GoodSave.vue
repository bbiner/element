<template>
  <el-form ref="form" :rules="rules" :model="form" @keyup.enter.native="save" label-width="80px">

    <el-form-item label="商品标题" prop="title">
      <el-col :span="8">
        <el-input size="mini" v-model="form.title"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="详情说明" prop="intro">
      <el-col :span="15">
        <editor v-model="form.intro" :toolBar="toolbar" upload-category="score-shop" ref="ke"></editor>
      </el-col>
    </el-form-item>

    <el-form-item label="详情图" prop="detail_pic" >
      <el-col :span="8">
      <el-upload
        class="upload-demo"
        action="/boss-api/file/simple-image"
        :headers="uploadHeaders"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :onError="uploadError"
        :on-success="uploadSuccess "
        :file-list="files"
        :limit="3"
        :on-exceed="handleExceed"
        list-type="picture">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      </el-col>
      <el-input type="hidden" v-model="form.detail_pic"></el-input>
    </el-form-item>

    <el-form-item label="缩略图" prop="thumb_pic">
      <upload @uploadSuccess="uploadThumbPic" v-if="id" :defaultImage="form.thumb_pic"></upload>
      <upload @uploadSuccess="uploadThumbPic" v-else></upload>
      <el-input type="hidden" v-model="form.thumb_pic"></el-input>
    </el-form-item>

    <el-form-item label="图标" prop="icon_pic">
      <upload @uploadSuccess="uploadIconPic" v-if="id" :defaultImage="form.icon_pic"></upload>
      <upload @uploadSuccess="uploadIconPic" v-else ></upload>
      <el-input type="hidden" v-model="form.icon_pic"></el-input>
    </el-form-item>

    <el-form-item label="上架方式">
      <el-radio-group v-model="form.grounding_type">
        <el-radio :label="1">设置上架时间</el-radio>
        <el-radio :label="2">创建成功自动上架</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item v-show="form.grounding_type==1" label="选择上架时间" prop="grounding_at">
      <el-col :span="8">
        <el-date-picker
          v-model="form.grounding_at"
          type="datetime"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        >
        </el-date-picker>
      </el-col>
    </el-form-item>

    <el-form-item label="下架时间">
      <el-col :span="5">
        <el-input size="mini" value="售完自动下架" readonly></el-input>
      </el-col>
    </el-form-item>

    <el-form-item label="邮寄方式">
      <el-radio-group v-model="form.shipping">
        <el-radio :label="1">包邮</el-radio>
        <el-radio :label="2">到付</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="市面价值" prop="market_price">
      <el-col :span="8">
        <el-input size="mini" v-model="form.market_price"></el-input>
      </el-col>
    </el-form-item>

    <el-form-item label="兑换价格" prop="exchange_score">
      <el-col :span="8">
        <el-input size="mini" v-model="form.exchange_score"></el-input>
      </el-col>
    </el-form-item>

    <el-form-item label="剩余库存" prop="stock">
      <el-col :span="8">
        <el-input size="mini" v-model="form.stock"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="库存预警" prop="warning_stock">
      <el-col :span="8">
        <el-input size="mini" maxlength="20" v-model="form.warning_stock"></el-input>
      </el-col>
    </el-form-item>

    <el-form-item label="用户兑换限制" prop="exchange_limit">
      <el-col :span="8">
        <el-input size="mini" maxlength="20" v-model="form.exchange_limit"></el-input>
      </el-col>
    </el-form-item>

    <el-form-item label="自定义角标" prop="superscript">
      <el-col :span="8">
        <el-input size="mini" maxlength="20" v-model="form.superscript"></el-input>
      </el-col>
    </el-form-item>

    <el-form-item label="商品来源">
      <el-radio-group v-model="form.origin">
        <el-radio :label="1">合作方</el-radio>
        <el-radio :label="2">自营</el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item v-show="form.origin===1" label="合作方名称" prop="partner_name">
      <el-col :span="8">
        <el-input v-model="form.partner_name"></el-input>
      </el-col>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" v-if="id" @click="edit('form',id)">立即修改</el-button>
      <el-button type="primary" v-else @click="add('form')">立即创建</el-button>
      <el-button @click="resetForm('form')">重置</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import GoodSaveApi from '@/api/platform/good-save'
import Upload from '@/components/common/Uploader/Uploader'
import Editor from '@/components/community/scoreshop/Editor'

export default {
  data () {
    return {
      form: {
        title: '',
        intro: '',
        detail_pic: '',
        thumb_pic: '',
        icon_pic: '',
        grounding_type: 2,
        grounding_at: '',
        shipping: 1,
        market_price: '',
        exchange_score: '',
        stock: '',
        warning_stock: '',
        exchange_limit: '',
        superscript: '',
        origin: 2,
        partner_name: '',
        type: 2
      },
      files: [],
      toolbar: 'all',
      id: '',
      rules: {
        title: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
          {min: 1, max: 8, message: '长度在 1 到 8 个字符'}
        ],
        intro: [
          {required: true, message: '请添加详情说明'}
        ],
        detail_pic: [
          {required: true, message: '请上传商品详情图'}
        ],
        thumb_pic: [
          {required: true, message: '请上传商品缩略图'}
        ],
        icon_pic: [
          {required: true, message: '请上传商品图标'}
        ],
        market_price: [
          {required: true, message: '请填写市场价'}
        ],
        exchange_score: [
          {required: true, message: '请填写所需兑换积分'}
        ],
        stock: [
          {required: true, message: '请填写商品库存'}
        ]
      },
      // 图片上传
      dialogImageUrl: '',
      dialogVisible: false,
      // // tab标签
      activeName: 'first',
      curText: ''
    }
  },
  computed: {
    uploadHeaders () {
      return {
        Authorization: this.$store.getters.authorization
      }
    }
  },
  created () {
    let goodId = this.$route.query.id
    if (goodId) {
      GoodSaveApi.getDetail(goodId, response => {
        const status = response.data.code
        const detail = response.data.data
        if (status === 1000) {
          this.id = detail.id
          this.form = detail
          this.$refs.ke.setContent(detail.intro)
          this.files = JSON.parse(detail.detail_pic)
        }
      })
    }
  },
  methods: {
    add (formName) {
      if (this.files.length > 0) {
        let index
        let arr = []
        for (index in this.files) {
          arr.push({url: this.files[index].url})
        }
        this.form.detail_pic = JSON.stringify(arr)
      } else {
        this.form.detail_pic = ''
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          GoodSaveApi.add(this.form, response => {
            const status = response.data.code
            if (status === 1000) {
              this.$message.success('保存成功')
              this.$router.push('/good_manage')
            } else {
              this.$message.error(response.data.msg)
            }
          })
        }
      })
    },
    edit (formName, id) {
      if (this.files.length > 0) {
        let index
        let arr = []
        for (index in this.files) {
          arr.push({url: this.files[index].url})
        }
        this.form.detail_pic = JSON.stringify(arr)
      } else {
        this.form.detail_pic = ''
      }
      this.form.intro = this.$refs.ke.getContent()
      this.$refs[formName].validate(valid => {
        if (valid) {
          GoodSaveApi.edit(this.form, id, response => {
            const status = response.data.code
            if (status === 1000) {
              this.$message.success('修改成功')
              this.$router.push('/good_manage')
            } else {
              this.$message.error(response.data.msg)
            }
          })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    uploadThumbPic (imgUrl) {
      this.form.thumb_pic = imgUrl
    },
    uploadIconPic (imgUrl) {
      this.form.icon_pic = imgUrl
    },
    handleRemove (file, fileList) {
      this.files = fileList
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed () {
      this.$message.error('详情图最多上传3张')
    },
    uploadError (response, file, fileList) {
      this.$message.error('上传失败，请重试！')
    },
    uploadSuccess (response, file, fileList) {
      this.files.push({url: response.path})
    }
  },
  components: {
    upload: Upload,
    editor: Editor
  }
}
</script>
<style>

</style>
