export default {
    namespaced: true,
    //data
    state: {
        a: 123,
        b:[]
    },
    // Computed
    getters: {
        someGetter1(state, getters) {
            return state.a +1
        },
        someGetter2(state, getters) {
            return state.a +getters.someGetter1
        }

    },
    mutation: {
        someMutation(state, payload) {//특정 뮤테이션이 실행될때 전달된값 ==payload
            state.a = 867 //실제 데이터 할당
            state.b.push(payload)
        }
    },
    actions: {
        someAction1({state, getters, commit, dispatch },payload) { // 첫번째 인수 == context == state ,getters,commit,dispatch를 아우르는 다양한 객체가 들어있음
            ////state는 state객체, getters는 getters, mutation 은 commit함수, actions는 dispatch함수로접근 
            //state.a = 789 //수정은 뮤테이션만 error
            //state.b.push(payload) //수정은 뮤테이션만
            commit('someMutation', payload)//뮤테이션을 실행하게 도와주는 commit('뮤테이션이름',payload(전달할값) ) 가능
        },
        someACtion2(context, payload) {
            context.commit('someMutation', payload)
            context.dispatch('someAction1', payload) // action 실행은 dispatch함수
        }
    }
}