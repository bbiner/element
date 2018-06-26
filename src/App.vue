<template>
  <div id="app">
    <login v-if="!isLogin"></login>
    <transition v-else name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import Login from '@/components/common/Login'

export default {
  name: 'App',
  components: {Login},
  computed: {
    isLogin () {
      return this.$store.getters.isLogin
    }
  }
}
</script>

<style>
body{
  margin: 0;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
.fade-enter-active,
.fade-leave-active {
  transition: all .2s ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
