<template>
  <div>
    <router-link
      to="/"
       class="to-home">
      <i class="material-icons">home</i>
    </router-link>

    <router-view/>
  </div>
</template>
<script>
export default {
  created () {
    console.log('router :' + this.$router)//우리가 세팅해놓은 라우트정보들
    console.log('route :' + this.$route)//주소의 쿼리스트링을 쿼리객체로 참조함
  }
  // import TodoApp from './components/TodoApp'
// export default {
//   components:{
//     //'todo-app': TodoApp
//     //TodoApp: TodoApp // 속성명하고 값이 같으면 생략가능
//     TodoApp
//   }
// }
}
</script>
<style lang="scss">
 .to-home.router-link-exact-active{//router-link 에서현재페이지 아닌지 확인
   display: none;
 }
</style>
