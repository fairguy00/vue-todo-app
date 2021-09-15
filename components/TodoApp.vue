<template>
    <!-- 브라우저 local storage -- 쿠키삭제 같은게 아닌 반영구적인 저장소 
         - Lowdb 라이브러리로 활용 lodash lib(배열,객체, 문자열 다루는 lib) 딸려들어옴
         - npm i lodash@^4 lowdb@^1 
    -->
    <!-- 브라우저 session storage 브라우저 종료하면 날아가는 일시적인-->
    <!-- 템플릿태그안에는 자식요소가하나만 들어강 -->
    <div>
        <todo-item
            v-for="todo in todos"
            :key="todo.id"
            :todo="todo"
            @update-todo="updateTodo"
            @delete-todo="deleteTodo"   
        />
        <hr/>
        <!-- :todo="todo" :todo 란속성에 "todo" 란 데이터를 바인딩하여 props 로 전달 -->
        <todo-creator @create-todo="createTodo"/>
        <!-- @create-todo란 자식객체의 이벤트가 발생할때 createTodo 메서드가 실행된다  -->
    </div>
</template>

<script>
import lowdb from 'lowdb'
import LocalStorage from 'lowdb/adapters/LocalStorage' // lowdb 와 로컬스토리지 어댑터 필요
import cryptoRandomString from 'crypto-random-string'
import _cloneDeep from 'lodash/cloneDeep'
//import _ from 'lodash'
import TodoCreator from './TodoCreator'
import TodoItem from './TodoItem'

export default {
    props:{
        todo: Object
    },
    data(){
        return{
            isEditMode: false
        }
    },
    components:{
        TodoCreator,
        TodoItem
    },
    data (){//로컬 DB 선언
        return {
            db:null,
            todos:[]
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
            this.db
                .get('todos')//lodash
                .push(newTodo) //lodash
                .write()//lowdb
        },
        updateTodo(){
            console.log('updateTodo!')
        },
        deleteTodo(){
            console.log('deleteTodo!') 
        }
    }
}
</script>