<template>
  <el-form ref="form" :rules="rules" :model="form" @keyup.enter.native="save" label-width="80px">

    <el-form-item label="商品标题" prop="title">
      <el-col :span="8">
        <el-input size="mini" v-model="form.title"></el-input>
      </el-col>
    </el-form-item>

    <el-form-item label="详情说明" prop="intro">
      <el-col :span="15">
        <el-input type="textarea" v-model="form.intro"></el-input>
      </el-col>
    </el-form-item>

    <el-form-item label="商品图片">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="商品详情图" name="first">
          注：详情图为必填选项
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="缩略图" name="second">
          注：缩略图为必填选项
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="图标" name="third">
          注：图标为必填选项
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-tab-pane>
      </el-tabs>
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
export default {
  data () {
    return {
      form: {
        title: '',
        intro: '',
        detail_pic: 'detail_11.jpg',
        thumb_pic: 'detail_22.jpg',
        icon_pic: 'detail_33.jpg',
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
      activeName: 'first'
    }
  },
  created () {
    let goodId = this.$route.query.id
    if (goodId) {
      GoodSaveApi.getDetail(goodId, response => {
        const status = response.status || 0
        const detail = response.data || {}
        if (status === 200) {
          this.id = detail.id
          this.form = detail
        }
      })
    }
  },
  methods: {
    // 上传图片
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // tab标签
    handleClick (tab, event) {
      console.log(tab, event)
    },
    add (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          GoodSaveApi.add(this.form, response => {
            const status = response.status || 0
            const body = response.data || {}
            if (status === 200) {
              this.$message.success('保存成功')
              this.$router.push('/good_manage')
            } else {
              this.$message.error(body.error || '保存失败')
            }
          })
        }
      })
    },
    edit (formName, id) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          GoodSaveApi.edit(this.form, id, response => {
            const status = response.status || 0
            const body = response.data || {}
            if (status === 200) {
              this.$message.success('修改成功')
              this.$router.push('/good_manage')
            } else {
              this.$message.error(body.error || '修改失败')
            }
          })
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style>

</style>
