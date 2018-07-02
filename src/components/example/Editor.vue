<template>
  <div>
    <p>Editor</p>
    <ms-editor v-model="form.contentText" :toolBar="toolbar" upload-category="article"></ms-editor>
  </div>
</template>

<script>
import MsEditor from '@/components/common/Editor'

export default {
  name: 'Editor',
  components: {MsEditor},
  data () {
    return {
      toolbar: 'all',
      form: {
        contentText: 'Editor example'
      }
    }
  }
}
</script>

<style scoped>

</style>
