<template>
    <div>
        <button @click="createTodo">
            <i class="material-icons">add</i>
        </button>
        <!-- 작성순서 1. 바인딩된속성 2.일반속성 3.이벤트 -->
        <input
            :value="title"
            type="text"
            :placeholder="placeholder"
            @input="title = $event.target.value"
            @keypress.enter="createTodo"
        />
    </div>
<!-- v-model 은 한글처리가 힘들다 > @input="title = $event.target.value" 로 우회-->
</template>

<script>
export default {
  data () {
    return {
      title: '',
      placeholder: '할 일을 추가하세요!'
    }
  },
  methods: {
    createTodo () {
      const validatedTitle = this.title && this.title.trim()
      if (!validatedTitle) {
        alert('유효하지않은 타이틀입니다')
        this.title = this.title.trim()
        return
      }

      console.log(this.title)
      //this.$emit('create-todo',this.title)//부모컴포넌트에 특정이벤트를 올려줌 케밥케이스
      this.$store.dispatch('todoApp/createTodo', this.title)
      this.title = ''
      this.$nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight)//scrollTo(x축,y축) 으로 이동 - 스크롤할수있는 높이로
      })//타이틀을 비워준상태에서 화면이 렌더링되고 실행(콜백- 애로우펑션으로)
    }
  }
}
</script>

<style>

</style>
