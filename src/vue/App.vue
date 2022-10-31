<template>
  <div>
    <h2>{{ message }}</h2>
  </div>
</template>

<script type="text/javascript">
export default {
  data() {
    return {
      message: "Hello vue"
    }
  }
}
</script>

<style lang="less" scoped>
h2 {
  color: #fff;
}
</style>
