<template>
  <el-dropdown @command="handleCommand">
    <span class="el-dropdown-link">
      <img class="avatar" src="@/assets/images/avatar.jpg"/>admin
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="message">我的消息</el-dropdown-item>
      <el-dropdown-item command="option">设置</el-dropdown-item>
      <el-dropdown-item divided command="a">退出</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script type="text/ecmascript-6">
export default {
  methods: {
    handleCommand (command) {
      this.$message('click on item ' + command)
    }
  }
}
</script>

<style lang="scss" scoped>
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }

  .el-dropdown-link {
    display: flex;
    cursor: pointer;
    color: #fff;
    align-items: center;
  }
</style>
