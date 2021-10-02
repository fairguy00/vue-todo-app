<template>
    <section class="home">
        <div>
            <h1>
                fairguy's Home page!
            </h1>
            <!-- <h2 @click="toAbout"> 에 아래 메서드를 추가하는 방식-->
            <h2 @click="$router.push('/about')">    <!--클릭이벤트에 직접 라우터삽입 -템플릿안에선 this는 바인딩되있는 상태 -->
                About
            </h2>
            <!--ROUTE 방법1 <h2 @click="toTodoApp"> -->
            <!--ROUTE 방법1 <h2 @click="$router.push('/todos')">                
                Todo App
            </h2> -->
            <!-- ROUTE 방법3 -->
            <router-link to="todos" tag="h2">
                Todo App
            </router-link> 
        </div>
    </section>
</template>

<script>
// export default {
//     methods:{
//         toAbout(){
//             //뷰 라우터설치후 this.$router - 뷰라우터 제어하기위한 속성과 메서드가 있는 객체
//             this.$router.push('/about')//주소제어(routing)-특정페이지로 밀어서 보내겠다
//         },
//         toTodoApp(){
//             $router.push('todos')
//         }
//     },
    
// }
</script>