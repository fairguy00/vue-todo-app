<template>
<!-- 케밥케이스로 -->
  <todo-app/>
</template>
<script>
import TodoApp from './components/TodoApp'
export default {
  components:{
    //'todo-app': TodoApp 
    //TodoApp: TodoApp // 속성명하고 값이 같으면 생략가능
    TodoApp
  }
}
</script>