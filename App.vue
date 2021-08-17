<template>
  <h1>
    {{ msg }}
  </h1>
</template>

<script>
export default {
  data () {
    return {
      msg: 'hello vue!!'
    }
  }
}
</script>
<!--lang='scss' scss 문법사용 -->
<style scoped lang='scss'>
$color: blue;
h1 {
  //color: red;
  color:$color;
  display:flex;
}
</style>
