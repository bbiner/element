<template>
  <el-container>
    <el-header>
      <el-col :span="4">
        GDG-后台管理
      </el-col>
      <el-col :span="2" :offset="18">
        <user-info></user-info>
      </el-col>
    </el-header>
    <el-container>
      <el-aside>
        <nav-menu></nav-menu>
      </el-aside>
      <el-container>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
              {{ item.name }}
            </el-breadcrumb-item>
          </el-breadcrumb>
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import NavMenu from '@/components/framework/NavMenu'
import UserInfo from '@/components/framework/UserInfo'
import ElCol from 'element-ui/packages/col/src/col'

export default {
  name: 'Home',
  components: {
    ElCol,
    NavMenu,
    UserInfo
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .el-header, .el-footer {
    height: 60px;
    line-height: 60px;
    background: #20a0ff;
    color: #fff;

    .userinfo {
      text-align: right;
      padding-right: 35px;
      float: right;
    }

    .userinfo-inner {
      cursor: pointer;
      color: #fff;
    }
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    line-height: 200px;
    overflow: hidden;
    width: 200px !important;
  }

  .el-breadcrumb {
    margin-bottom: 20px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>
