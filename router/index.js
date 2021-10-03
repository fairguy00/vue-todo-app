import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '~/views/Home.vue'//.vue 확장자 생략가능
import About from '~/views/About.vue'
import TodoApp from '~/views/TodoApp.vue'

Vue.use(VueRouter)

const routes = [
    //페이지 config
    {
        name:'index', //통상적으로 첫페이지는 이름을 index로함   
        path: '/',//최상위 페이지(루트 페이지)
        component:Home
    },
    {
        name:'about',
        path: '/about',
        component:About
    },
    {
        name:'todos',
        path: '/todos',
        component: TodoApp,
        children: [{
            name:'todos-filter', // 이름은 파라미터로 못받음
            path:':id'//: id라는 파라미터로 받을거임 - route 객체의 params의 id로 받음
        }]
    }
]

export default new VueRouter({
    routes: routes
})