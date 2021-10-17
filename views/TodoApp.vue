<template>
  <!-- 브라우저 local storage -- 쿠키삭제 같은게 아닌 반영구적인 저장소 
         - Lowdb 라이브러리로 활용 lodash lib(배열,객체, 문자열 다루는 lib) 딸려들어옴
         - npm i lodash@^4 lowdb@^1 
    -->
  <!-- 브라우저 session storage 브라우저 종료하면 날아가는 일시적인-->
  <!-- 템플릿태그안에는 자식요소가하나만 들어가고 this 사용안한다 -->
  <!-- $store.getters.todoApp 스토어의 todoApp 라는 네임스페이스값을 가져온다 -->
  <div class="todo-app">
    <div class="todo-app__actions">
      <div class="filters">
        <router-link to="all" tag="button">
          <!-- 모든 항목 ({{ $store.getters.todoApp.total }}) -->
          모든 항목 ({{ total }})
        </router-link>
        <router-link to="active" tag="button">
          해야 할 항목 ({{ activeCount }})
        </router-link>
        <router-link to="completed" tag="button">
          완료된 항목 ({{ completedCount }})
        </router-link>
      </div>

      <div class="actions clearfix">
        <label class="float--left">
          <input v-model="allDone" type="checkbox" />
          <span class="icon">
            <i class="material-icons">done_all</i>
          </span>
        </label>
        <!-- 자식요소에 float 있으면 부모요소에 clearfix 있어야한다 -->
        <div class="float--right clearfix">
          <button class="btn float--left" @click="scrollToTop">
            <i class="material-icons">expand_less</i>
          </button>
          <button class="btn float--left" @click="scrollToBottom">
            <i class="material-icons">expand_more</i>
          </button>
          <button class="btn btn--danger float--left" @click="clearCompleted">
            <i class="material-icons">delete_sweep</i>
          </button>
        </div>
      </div>
    </div>
    <div class="todo-app__list">
      <todo-item
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
      />
    </div>
    <!-- :todo="todo" :todo 란속성에 "todo" 란 데이터를 바인딩하여 props 로 전달 -->
    <todo-creator class="todo-app__creator"/>
     <!-- @create-todo="createTodo"  -->
    <!-- @create-todo란 자식객체의 이벤트가 발생할때 createTodo 메서드가 실행된다  -->
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'
import _remove from "lodash/remove";

import scrollTo from "scroll-to"; //위로/아래로 가기 기능

import TodoCreator from "~/components/TodoCreator";
import TodoItem from "~/components/TodoItem";
//import { filter } from 'vue/types/umd'

export default {
  props: {
    todo: Object,
  },
  // data(){
  //     return{
  //         isEditMode: false
  //     }
  // },
  components: {
    TodoCreator,
    TodoItem,
  },

  computed: {
    //네이티브 자바스크립트 스프레드 문법 ..전개연산자
    ...mapState('todoApp',[//mapState('네임스페이스', [가지고오고싶은 데이터 이름들])
      'todos'
    ]),
    ...mapGetters('todoApp',[
      'total',
      'activeCount',
      'completedCount'
    ]),
    filteredTodos() {
      switch (this.$route.params.id) {
        case "all":
        default:
          return this.todos;//mapState 'todos'
        case "active": //해야 할 항목
          return this.todos.filter((todo) => !todo.done);
        case "completed": // 완료된 항목
          return this.todos.filter((todo) => todo.done);
      }
    },
    // total(){ // mapGetters로 처리해버림
    //   return this.$store.getters.todoApp.total
    // },
    // activeCount(){
    //   return this.$store.getters.todoApp.activeCount
    // },
    allDone: {
      get() {
        return this.total === this.completedCount && this.total > 0;
      },
      set(checked) {
        this.completeAll(checked);
      },
    },
  },
  created() {
    this.initDB();
    //this.$store.dispatch('todoApp/updateTodo', todo, value)// 세번째 인수는 무시되므로 2번째 인수를 객체리터럴로
    // this.$store.dispatch('todoApp/updateTodo', {
    //     todo,
    //     value
    // })//VueX 스토어객체 actions에 접근 - dispatch('네임스페이스/엑션스의 메서드')
  },
  methods: {
  
    scrollToTop() {
      scrollTo(0, 0, {
        ease: "linear", //없으면 올라가는속도가 점점 느려진다
        duration: 3000,
      });
    },
    scrollToBottom() {
      scrollTo(0, document.body.scrollHeight, {
        ease: "linear", //없으면 올라가는속도가 점점 느려진다 - linear -동일속도로
        duration: 3000,
      });
    },
  },
};
</script>

<style lang="scss">
@import "scss/style";
.filters button.router-link-active {
  background: royalblue;
  color: white;
}
</style>
