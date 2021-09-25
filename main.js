import Vue from 'vue'
//import App from './App.vue' //resolve: {//확장자생략
import App from './App'
// import {createApp} from 'vue'
import router from './router/index.js' //index.js는 생략가능

// export const eventBus = createApp(App)

// createApp(App).mount('#app')
//뷰인스턴스에 대한 설정
new Vue({
  el: '#app',
  router,
  //render (createElement) { //createElement 콜백함수
  //  return createElement(App)
  //}//아래두가지와 같다
  render: h => h(App) //에로우펑션에서 h는 createElement의 축약형
  //render:(h) => {
  //  return h(App)
  //}
})// main.js 진입 -> App.vue(최상위 컴포넌트) 로 한번만 연결 -> 나머지 컴포넌트들과 연결
