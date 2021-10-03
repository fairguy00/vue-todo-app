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
  created(){
    console.log('router :'+this.$router)//우리가 세팅해놓은 라우트정보들
    console.log('route :'+this.$route)//주소의 쿼리스트링을 쿼리객체로 참조함
  }
}
</script>
<style lang="scss">
 .to-home.router-link-exact-active{//router-link 에서현재페이지 아닌지 확인
   display: none;
 }
</style>
<!-- 케밥케이스로 
  <!--todo-app>
</template>
<script>
// import TodoApp from './components/TodoApp'
// export default {
//   components:{
//     //'todo-app': TodoApp 
//     //TodoApp: TodoApp // 속성명하고 값이 같으면 생략가능
//     TodoApp
//   }
// }
</script>
 <!--TodoApp 파일을 가져와서 컴포넌트로 연결하고 <template>에 작성하여 활용해서 사용했다  
 view - 페이지단위 디렉터리로 옮겼기때문에 다른건 다 필요없다
 대신 main.js 에서 App.vue 파일을 가져와서 렌더링하기때문에 페이지로 만든것들이 출력될수있도록 작성되어야함
 <template> 여기엔 각각 출력될 영역들을 기입
  <template> 에선 최상위 엘리먼트하나만 사용가능 
 -->