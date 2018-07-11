<template>
  <transition name="fade">
    <el-row class="login" type="flex" justify="center">
      <el-col class="login-box" :lg="6" :md="8" :sm="12" :xs="20">
        <h1 class="login-box-title">
          GDGYun
          <sub>—— xxx</sub>
        </h1>

        <el-form :model="form" class="login-form" size="large" @keyup.enter.native="login" ref="form">
          <el-form-item
            prop="loginAccount"
            :rules="[
                  { required: true, message: '请输入账号' },
                  { min: 3, max: 15, message: '长度在 3 到 15 个字符' }
                ]">
            <el-input v-model="form.loginAccount" placeholder="用户名、Email，或绑定手机">
              <icon slot="prefix" name="user"/>
            </el-input>
          </el-form-item>
          <el-form-item
            prop="password"
            :rules="[
                  { required: true, message: '请输入密码' }
                ]">
            <el-input v-model="form.password" type="password" placeholder="密码">
              <icon slot="prefix" name="key"/>
            </el-input>
          </el-form-item>
          <el-form-item size="mini">
            <el-checkbox v-model="rememberMe" label="记住账号"/>
            <!--<a href="#">忘记密码?</a>-->
          </el-form-item>
          <el-form-item>
            <el-button v-if="logining" class="btn-login" type="info" disabled>正在登陆...</el-button>
            <el-button v-else class="btn-login" type="primary" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
        <p class="copyright">
          &copy; 2016 - {{year}} <a href="//www.hhzl.com/" target="_blank">恒合智联</a>
        </p>
      </el-col>
    </el-row>
  </transition>
</template>

<script>
import AuthApi from '@/api/platform/auth'
import { LOGIN } from '@/store/action-names'
import moment from 'moment'

const _CK_LOGIN_ACCOUNT = '_gdgyun.b_u'

export default {
  name: 'Login',
  data () {
    return {
      logining: false,
      year: moment().format('Y'),
      form: {
        loginAccount: '',
        password: ''
      },
      rememberMe: true
    }
  },
  created () {
    // 获取已记住的账号
    let loginAccount = this.$cookie.get(_CK_LOGIN_ACCOUNT)
    if (loginAccount !== undefined && loginAccount !== null && loginAccount.length > 0) {
      this.form.loginAccount = loginAccount
    }
  },
  methods: {
    login () {
      if (this.logining) {
        return
      }

      this.$refs['form'].validate(valid => {
        if (valid) {
          // 记住账号
          if (this.rememberMe) {
            this.$cookie.set(_CK_LOGIN_ACCOUNT, this.form.loginAccount)
          } else {
            this.$cookie.delete(_CK_LOGIN_ACCOUNT)
          }

          this.logining = true
          AuthApi.token(this.form, response => {
            const status = response.status || 0
            const body = response.data || {}
            if (status === 200 && body.hasOwnProperty('code') && body['code'] === 1000 && body.hasOwnProperty('data')) {
              this.$store.dispatch(LOGIN, {token: body['data']})
              this.$message.success('登陆成功')
            } else {
              this.$message.error(body.error || '登陆失败')
            }
            this.logining = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/env";

  .login {
    width: 100%;
    height: 100%;
    background-color: $color-secondary;
    .login-box {
      height: 360px;
      padding: 20px;
      position: relative;
      top: calc(50% - 180px);
      border-radius:15px;
      box-shadow: 2px 2px 50px $color-gray;
      background-color: $color-white;
      &-title {
        width: 100%;
        text-align: center;
        padding-bottom: 5px;
        margin: 0;
        color: $color-secondary;
        border-bottom: 2px solid $color-tint;
        sub {
          display: block;
          @extend %font-size-small;
          font-weight: normal;
          text-align: right;
        }
      }
      .seo {
        margin: 0;
      }
      .login-form {
        padding-top: 20px;
        .btn-login {
          width: 100%;
        }
      }
      .copyright {
        text-align: right;
        @extend %font-size-small;
      }
    }
  }
</style>
