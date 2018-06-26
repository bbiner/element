<template>
  <el-form ref="form" :model="form" label-width="80px">

    <el-form-item label="商品标题">
      <el-col :span="8">
      <el-input size="mini" maxlength="20" v-model="form.title"></el-input>
      </el-col>
    </el-form-item>

    <el-form-item label="详情说明">
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

    <el-form-item label="上架时间">
      <el-radio-group v-model="form.grounding_type">
        <el-radio label="" value="1">
            <el-date-picker
                    v-model="form.grounding_at"
                    type="datetime"
                    placeholder="选择日期时间">
            </el-date-picker>
        </el-radio>
        <el-radio label="创建成功自动上架" value="2"></el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="下架时间">
      <el-col :span="5">
        <el-input size="mini" value="售完自动下架" readonly></el-input>
      </el-col>
    </el-form-item>

    <el-form-item label="邮寄方式">
      <el-radio-group v-model="form.shipping">
        <el-radio label="包邮" value="1"></el-radio>
        <el-radio label="到付" value="2"></el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item label="市面价值">
      <el-col :span="8">
        <el-input size="mini" maxlength="20" v-model="form.market_price"></el-input>
      </el-col>
    </el-form-item>

    <el-form-item label="兑换价格">
      <el-col :span="8">
        <el-input size="mini" maxlength="20" v-model="form.exchange_score"></el-input>
      </el-col>
    </el-form-item>

    <el-form-item label="剩余库存">
      <el-col :span="8">
        <el-input size="mini" maxlength="20" v-model="form.stock"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="库存预警">
      <el-col :span="8">
        <el-input size="mini" maxlength="20" v-model="form.warning_stock"></el-input>
      </el-col>
    </el-form-item>

    <el-form-item label="用户兑换限制">
      <el-col :span="8">
        <el-input size="mini" maxlength="20" v-model="form.exchange_limit"></el-input>
      </el-col>
    </el-form-item>

    <el-form-item label="自定义角标">
      <el-col :span="8">
        <el-input size="mini" maxlength="20" v-model="form.superscript"></el-input>
      </el-col>
    </el-form-item>

    <el-form-item label="商品合作方信息">
      <el-radio-group v-model="form.origin">
        <el-radio value="1" ><el-input size="mini" placeholder="合作方名称" maxlength="20" v-model="form.partner_name" ></el-input></el-radio>
        <el-radio label="自营" value="2"></el-radio>
      </el-radio-group>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>

    export default {
        data() {
            return {
                form: {
                    title: '',
                    intro: '',
                    detail_pic: '',
                    thumb_pic: '',
                    icon_pic: '',
                    grounding_type: '',
                    grounding_at: '',
                    shipping: '',
                    market_price: '',
                    exchange_score: '',
                    stock: '',
                    warning_stock: '',
                    exchange_limit: '',
                    superscript: '',
                    origin: '',
                    partner_name: '',
                    type: ''
                },
                // 图片上传
                dialogImageUrl: '',
                dialogVisible: false,
                // tab标签
                activeName: 'first',


            }
        },
        methods: {

            //上传图片
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            // tab标签
            handleClick(tab, event) {
              console.log(tab, event);
          },
            // 提交表单
            onSubmit() {

                alert(this.form.title);
                console.log('submit!');
            },

        }
    }
</script>
<style>

</style>
