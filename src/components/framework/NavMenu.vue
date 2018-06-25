<template>
  <div id="navmenu">
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      router
    >
      <template v-for="(A,a) in $router.options.routes">
        <template v-if="!A.hidden">
          <el-submenu v-if="A.children && A.children.length>0 && !A.leaf" :index="'a_1_'+a" :key="a">
          <template slot="title">
            <i :class="A.iconCls"></i>
            <span>{{A.name}}</span>
          </template>
            <template v-for="(B,b) in A.children">
              <template v-if="!B.hidden">
                  <el-submenu v-if="B.children && B.children.length>0 && !B.leaf" :index="'b_1_'+b" :key="b">
                <template slot="title">
                  <i :class="B.iconCls"></i>
                  <span>{{B.name}}</span>
                </template>
                <el-menu-item v-if="!C.hidden":index="C.path" :key="c" v-for="(C,c) in B.children">
                  <template slot="title">
                    <i :class="C.iconCls"></i>
                    <span>{{C.name}}</span>
                  </template>
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="B.path" :key="b">
                <template slot="title">
                <i :class="B.iconCls"></i>
                <span>{{B.name}}</span>
                </template>
              </el-menu-item></template>
            </template>
        </el-submenu>
        <el-menu-item v-else :index="A.children[0].path" :key="a">
          <template slot="title">
            <i :class="A.children[0].iconCls"></i>
            <span>{{A.children[0].name}}</span>
          </template>
        </el-menu-item></template>
      </template>
    </el-menu>
  </div>

</template>

<script type="text/ecmascript-6">
export default {
  name: 'NavMenu',
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>

<style lang="scss" scoped>
#navmenu {
  height: 100%;
  overflow: hidden;
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    min-height: 400px;
  }
  .el-menu {
    height: 100%;
  }
}
</style>
