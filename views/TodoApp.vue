<template>

    <!-- 브라우저 local storage -- 쿠키삭제 같은게 아닌 반영구적인 저장소 
         - Lowdb 라이브러리로 활용 lodash lib(배열,객체, 문자열 다루는 lib) 딸려들어옴
         - npm i lodash@^4 lowdb@^1 
    -->
    <!-- 브라우저 session storage 브라우저 종료하면 날아가는 일시적인-->
    <!-- 템플릿태그안에는 자식요소가하나만 들어강 -->
    <div class="todo-app">
        <div class="todo-app__actions">
            <div class="filters">
                <button 
                    :class="{active:filter ==='all'}"
                    @click="changeFilter('all')">
                    모든 항목 ({{total}})
                </button>
                <button 
                    :class="{active:filter ==='active'}"
                    @click="changeFilter('active')">
                    해야 할 항목 ({{activeCount}})
                </button>
                <button 
                    :class="{active:filter ==='completed'}"
                    @click="changeFilter('completed')">
                    완료된 항목 ({{completedCount}})
                </button>
            </div>

            <div class="actions clearfix">
                <label class="float--left">
                    <input 
                        v-model="allDone"
                        type="checkbox"/>
                    <span class="icon">
                        <i class="material-icons">done_all</i>
                    </span>
                </label>
                <!-- 자식요소에 float 있으면 부모요소에 clearfix 있어야한다 -->
                <div class="float--right clearfix">
                    <button 
                        class="btn float--left"
                        @click="scrollToTop">
                        <i class="material-icons">expand_less</i>
                    </button>
                    <button 
                        class="btn float--left"
                        @click="scrollToBottom">
                        <i class="material-icons">expand_more</i>
                    </button>
                    <button 
                        class="btn btn--danger float--left"
                        @click="clearCompleted">
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
            @update-todo="updateTodo"
            @delete-todo="deleteTodo"   
            />
        </div>
        <!-- :todo="todo" :todo 란속성에 "todo" 란 데이터를 바인딩하여 props 로 전달 -->
        <todo-creator 
            class="todo-app__creator"
            @create-todo="createTodo"/>
        <!-- @create-todo란 자식객체의 이벤트가 발생할때 createTodo 메서드가 실행된다  -->
    </div>
</template>

<script>
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage' // lowdb 와 로컬스토리지 어댑터 필요
import cryptoRandomString from 'crypto-random-string'
import _cloneDeep from 'lodash/cloneDeep'
//import _ from 'lodash'
import _find from 'lodash/find'
import _findIndex from 'lodash/findIndex'
import _forEachRight from 'lodash/forEachRight'
import _assign from 'lodash/assign'
import _remove from 'lodash/remove'

import scrollTo from  'scroll-to'//위로/아래로 가기 기능

import TodoCreator from '~/components/TodoCreator'
import TodoItem from '~/components/TodoItem'
//import { filter } from 'vue/types/umd'

export default {
    props:{
        todo: Object
    },
    // data(){
    //     return{
    //         isEditMode: false
    //     }
    // },
    components:{
        TodoCreator,
        TodoItem
    },
    data (){//로컬 DB 선언
        return {
            db:null,
            todos:[],
            filter:'all'
        }
    },
    computed:{
        filteredTodos(){
            switch(this.filter){
                case 'all':
                    return this.todos
                case 'active': //해야 할 항목
                    return  this.todos.filter(todo => !todo.done)
                case 'completed': // 완료된 항목
                    return  this.todos.filter(todo => todo.done)
                default:
                    return this.todos
            }
        },
        total(){
            return this.todos.length
        },
        activeCount(){
            return this.todos.filter(todo => !todo.done).length
        },
        completedCount(){
            return this.total - this.activeCount
        },
        allDone:{
            get(){
                return this.total === this.completedCount && this.total > 0
            },
            set(checked){
                this.completeAll(checked)
            }
        }
    },
    created(){
        this.initDB()
    },
    methods:{
        initDB (){ //메서드만 생성하고 실행을 안함 > create 훅으로 실행
            const adaptor = new LocalStorage('todo-app')
            this.db = lowdb(adaptor)
            console.log(this.db)

            const hasTodos = this.db.has('todos').value() //기존 lowdb 에 데이터있는지

            if(hasTodos){
                this.todos= _cloneDeep(this.db.getState().todos)//todos 안에 있는 참조관계 제거한 deep clone 깊은 복사
            } else{
                //로컬 DB 초기화
                this.db
                    .defaults({
                        todos:[]// DB 의 Collection
                    })
                    .write()//lowdb 특징 작성하면 .write() 해줘야한다 - 메서드 체인으로
            }
            
        },
        createTodo (title){
            //받아야할 데이터 정의
            const newTodo = {
                id: cryptoRandomString({length:10}), //crypto random string lib 설치해서 고유한 아이디 생성 npm install crypto-random-string
                //title:title, 아래와 같다
                title,//title: title
                createdAt:new Date(),
                updatedAt:new Date(),
                done: false
            }

            // Create DB
            this.db
                .get('todos')//lodash
                .push(newTodo) //lodash
                .write()//lowdb
            
            // Create Client
            this.todos.push(newTodo)
        },
        updateTodo(todo, value){
            this.db
                .get('todos')
                .find({id:todo.id})
                .assign(value)//갱신
                .write()//로대시에서 실제로 갱신할때 write로 마무리
            //실제 어플리캐이션의 todos도 갱신
            const foundTodo = _find(this.todos, {id:todo.id})
            Object.assign(foundTodo, value)//자바스크립트 네이티브 메서드 Object.assign 로 병합
            _assign(foundTodo, value)
        },
        deleteTodo(todo){
            this.db
                .get('todos')
                .remove({id:todo.id})
                .write()
            
            //_remove(this.todos, {id:todo.id})//이코드만 있으면 반응성이 없어 화면엔 갱신이 안된다
            //삭제하기위해 Vue.delete(지울객체, 인덱스)사용
            const foundIndex = _findIndex(this.todos,{id:todo.id})
            this.$delete(this.todos,foundIndex)
        },
        changeFilter (filter){
            this.filter = filter
        },
        completeAll(checked){
            //디비 갱신
            const newTodos = this.db
                .get('todos')
                .forEach(todo => {
                    todo.done = checked
                })
                .write()
            //Local todos 갱신
            // this.todos.forEach(todo =>{
            //     todo.done = checked
            // })
            this.todos = _cloneDeep(newTodos) //브라우저DB 사용하므로 참조문제 발생

        },
        clearCompleted(){
            // this.todos.forEach(todo =>{
            //     if(todo.done){
            //         this.deleteTodo(todo)
            //     }
            // }) //배열삭제시 차례대로 삭제하면 배열의 인덱스때문에 정상적인 삭제가 안될수도 있다 - 1. 인덱스 끝부터 삭제 or 2. 라이브러리사용 
            // 1. 배열 뒤에서부터 삭제
            // this.todos
            //     .reduce((list,todo,index)=>{
            //         if(todo.done){//체크표시된 아이템들만
            //             list.push(_findIndex)
            //         }
            //         return list
            //     },[])
            //     .reverse()
            //     .forEach(index =>{
            //         this.deleteTodo(this.todos[index])
            //     })
            // 2.로데시 라이브러리 사용
            _forEachRight(this.todos, todo =>{
                if(todo.done){
                    this.deleteTodo(todo)
                }
            })

        },
        scrollToTop(){
            scrollTo(0,0, {
                ease:'linear',//없으면 올라가는속도가 점점 느려진다
                duration:3000
            })
        },
        scrollToBottom(){
            scrollTo(0,document.body.scrollHeight, {
                ease:'linear',//없으면 올라가는속도가 점점 느려진다 - linear -동일속도로
                duration:3000
            })
        }
    }
}
</script>

<style lang='scss'>
    @import "scss/style";
</style>