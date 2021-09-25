import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '~/views/Home.vue'//.vue 확장자 생략가능
import About from '~/views/About.vue'
import TodoApp from '~/views/TodoApp.vue'

Vue.use(VueRouter)

const routes = [
    //페이지 config
    {
        path: '/',//최상위 페이지(루트 페이지)
        component:Home
    },
    {
        path: '/about',
        component:About
    },
    {
        path: '/todos',
        component:TodoApp
    }
]

export default new VueRouter({
    routes: routes
})