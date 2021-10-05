export default {
    namespaced: true, // 독립적으로 사용하기
    // Data 
    //Data 는 함수여야 한다 - 특정객체를 리터럴방식으로 return 해야한다 - 그래야 참조관계가 발생하지않는다
    state: ()=>({
        
    }),
    // Computed
    getters: {
        
    },

    //Methods
    // 실제 값을 변경할 때(비동기처리 불가)
    mutations: {
        
    },
    //Methods
    //일반 로직(비동기가능)
    actions: {
        
    },
    //Modules 는 저장소의 특정 네임스페이스들(TodoApp, Users, Ranks 등등) 을 분기처리하는 개념
}