import Vue from 'vue'
import Vuex from 'vuex'

import todoApp from './todoApp'

Vue.use(Vuex)

export default new Vuex.Store({
  //strict: true //스트릭트모드-Vuex.Store의 엄격한문법사용 - 운영에서는 성능이슈발생할수 있다
  strict: process.env.NODE_ENV !== 'production',
  actions: {
    testFunction () {
      //index 에 있는 펑션은 네임스페이스가필요없다
    }
  },
  modules: {
    todoApp
  }
})
