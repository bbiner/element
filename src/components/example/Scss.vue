<template>
  <div class="scss">
    显示为红色字体则 SCSS 生效
  </div>
</template>

<script>
export default {
  name: 'Scss'
}
</script>

<style scoped lang="scss">
  $color: red;
  .scss {
    color: $color;
    font-size: 18px;
  }
</style>
