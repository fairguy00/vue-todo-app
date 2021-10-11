import cryptoRandomString from "crypto-random-string";
import lowdb from "lowdb";
import LocalStorage from "lowdb/adapters/LocalStorage"; // lowdb 와 로컬스토리지 어댑터 필요
import _find from "lodash/find";
import _assign from "lodash/assign";
export default {
    namespaced: true, // 독립적으로 사용하기
    // Data 
    //Data 는 함수여야 한다 - 특정객체를 리터럴방식으로 return 해야한다 - 그래야 참조관계가 발생하지않는다
    state: ()=>({ //state 는 객체 데이터를 반환한다
        db:null,//로컬 DB 선언
        todos:[]
    }),
    // Computed
    getters: {
        total(state){
            return state.todos.length
        },
        activeCount(state){
            return state.todos.filter(todo => !todo.done).length
        },
        completedCount(state, getters){
            return getters.total - getters.activeCount
        },
    },

    //Methods
    // 실제 값을 변경할 때(비동기처리 불가,Data 변경 O)
    mutations: {//mutations 에서는 state 에 바로 접근
        assingDB(state,db) {
            state.db= db
        },
        createDB(state, newTodo) {
            // Create DB
            state.db
                .get('todos')//lodash
                .push(newTodo) //lodash
                .write()//lowdb
            
        },
        updateDB(state, { todo, value}) {
            state.db
                .get("todos")
                .find({ id: todo.id })
                .assign(value) //갱신
                .write(); //로대시에서 실제로 갱신할때 write로 마무리
        },
        assignTodos(state, todos) {
            state.todos = todos
        },
        pushTodo(state, newTodo) {
            state.todos.push(newTodo)
        },
        assignTodo(state, { foundTodo, value }) {
            _assign(foundTodo, value)
        }

    },
    //Methods
    //일반 로직(비동기가능)
    //데이터 변경 X
    actions: {
        //메서드만 생성하고 실행을 안함 > create 훅으로 실행
        //첫번째 인수 {state} == context는 state,getters,mutations,다른모듈의 actions 접근할수있는 참조관계에 있는 객체들이 들어있다
        // commit 을 통해 mutation에 접근
        initDB({ state, commit }) {
            //const {state} = context
            const adaptor = new LocalStorage('todo-app')
            //state.db = lowdb(adaptor) //actions에서는 data할당 불가
            commit('assignDB') //commit을 통해 mutation의 assignDB 메서드실행
            console.log(state.db, lowdb(adaptor))

            const hasTodos = state.db.has('todos').value() //기존 lowdb 에 데이터있는지

            if(hasTodos){
                //state.todos= _cloneDeep(state.db.getState().todos)//todos 안에 있는 참조관계 제거한 deep clone 깊은 복사
                commit('assignTodos', _cloneDeep(state.db.getState().todos))
            } else {
                //로컬 DB 초기화
                state.db
                    .defaults({
                        todos:[]// DB 의 Collection
                    })
                    .write()//lowdb 특징 작성하면 .write() 해줘야한다 - 메서드 체인으로
            }
            
        },
        //createTodo (context, title){
        createTodo ({state ,commit}, title){ //context 에서 특정한것들만 가져옴    
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
            commit('createDB',newTodo)
            
            // Create Client
            commit('pushTodo', newTodo)
        },
        //updateTodo(context, todo, value) { 세번째 인수는 무시된다
        // updateTodo(context, payload) {
        //     const { todo, value} = payload
        updateTodo({state,commit}, {todo, value }) {// 위코드와같다
            //updateDB
            commit('updateDB', {todo, value})
            //실제 어플리캐이션의 todos도 갱신
            const foundTodo = _find(state.todos, { id: todo.id });
            //Object.assign(foundTodo, value); //자바스크립트 네이티브 메서드 Object.assign 로 병합
            commit('assignTodo', {foundTodo, value})
        },
    },
    //Modules 는 저장소의 특정 네임스페이스들(TodoApp, Users, Ranks 등등) 을 분기처리하는 개념
}