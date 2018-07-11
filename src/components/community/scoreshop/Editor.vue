<template>
  <textarea
    id="editor"
    class="ms-editor"
    :value="currentValue"
    :rows="rows"
    :cols="cols"></textarea>
</template>

<script>
import KindEditor from 'KindEditor'

const imageUpload = {
  enabled: true,
  url: '/boss-api/file/kind-editors',
  category: 'editor'
}

export default {
  name: 'ms-editor',
  props: {
    value: {
      required: true,
      type: String
    },
    width: {
      type: [Number, String],
      default: '80%'
    },
    height: {
      type: [Number, String],
      default: '300px'
    },
    type: {
      type: String,
      default: 'kind'
    },
    toolBar: [String, Array],
    rows: {
      type: Number,
      default: 8
    },
    cols: {
      type: Number,
      default: 80
    },
    upload: {
      type: Object,
      default () {
        return imageUpload
      }
    },
    uploadCategory: String
  },
  data () {
    return {
      currentValue: this.value
    }
  },
  mounted () {
    const upload = Object.assign({}, imageUpload, this.upload)
    if (this.uploadCategory !== undefined && this.uploadCategory.length > 0) {
      upload.category = this.uploadCategory
    }

    const width = typeof this.width === 'string' ? this.width : this.width + 'px'
    const height = typeof this.height === 'string' ? this.height : this.height + 'px'
    const editorType = this.type === 'kind' ? 'kind' : 'ck'
    const toolTypes = {
      kind: {
        simple: ['source', '|', 'forecolor', 'bold', 'italic', 'underline', '|', 'image']
      }
    }
    if (editorType === 'kind') {
      let kindConfig = {
        width: width,
        height: height,
        resizeType: 1,
        allowPreviewEmoticons: false,
        // items: this.tool,
        uploadJson: upload.url,
        allowImageUpload: upload.enabled,
        // allowFlashUpload: false,
        // allowMediaUpload: false,
        // allowFileUpload: false,
        // allowFileManager: false,
        extraFileUploadParams: {
          // 上传子目录
          category: upload.category,
          token: this.$store.getters.getAccessToken
        },
        afterBlur: () => {
          this.blur()
        }
      }
      if (Array.isArray(this.toolBar)) {
        kindConfig.items = this.toolBar
      } else if (typeof this.toolBar === 'string' && toolTypes.hasOwnProperty(editorType) &&
        toolTypes[editorType].hasOwnProperty(this.toolBar)) {
        kindConfig.items = toolTypes[editorType][this.toolBar]
      }
      this.editor = KindEditor.create('textarea#editor', kindConfig)
    }
  },
  methods: {
    uploadValue () {
      this.editorContent = this.editor.html()
      // 将变化传递给父组件
      this.$emit('input', this.editorContent)
    },
    blur () {
      this.uploadValue()
    },
    getContent () {
      return this.editor.html()
    },
    setContent (content) {
      this.editor.html(content)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
