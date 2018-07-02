<template>
  <el-button type="text" ></el-button>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    messages: Object
  },
  data () {
    return {
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.$on('messageBox', () => {
        this.messageBox()
      })
    })
  },
  methods: {
    messageBox () {
      this.$confirm(this.messages.msg, this.messages.title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit('childMessage', true)
      }).catch(() => {
        this.$emit('childMessage', false)
      })
    }
  }
}
</script>

<style>

</style>
