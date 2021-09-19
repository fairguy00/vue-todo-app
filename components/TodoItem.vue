<template>
    <div 
        :class="{done:done}"
        class="todo-item">

        <div 
            v-if="isEditMode"
            class="item__inner item--edit"
        >   
            <!-- v-model 은 한글처리가 어려우므로 :value="" 에서 input 값을 받고 @input 이벤트에서 바인딩  -->
            <input
                ref="titleInput"
                :value="editedTitle"
                type="text"
                @input="editedTitle = $event.target.value"
                @keypress.enter="editedTodo"
                @keypress.esc="offEditMode"
            />
            <div class="item__actions">
                <button 
                    key="complete"
                    @click="editedTodo">완료</button>
                <button 
                    key="cancel"
                    @click="offEditMode">취소</button>
            </div>    
        </div>
        <div 
            v-else
            class="item__inner item--normal">

            <input
            v-model="done"
            type="checkbox"
            />
            <div class="item__title-wrap">
                <div class="item__title">
                    {{todo.title}}
                </div>
                <div class="item__date">
                    {{date}}
                </div>
            </div>
            <!--<button>같이 양식요소가 반복되면 dom 갱신에 리소스를 사용하는걸 방지하기 위해 vue에서 같은 요소로 보는경우가 있다. 
                예를 들어 <button @click="onEditMode">수정</button> 클릭했을때 <button @click="editedTodo">완료</button> 가 작동한다든지
                이를 방지하기위해 요소에 key속성을 추가한다 -->
            <div class="item__actions"> 
                <button 
                    key="update" 
                    @click="onEditMode">수정</button>
                <button
                    key="delete" 
                    @click="deleteTodo">삭제</button>
            </div>

        </div>

        
    </div>
</template>
<script>
import dayjs from 'dayjs' //moment.js 무거워서 문법유사한 day.js로 대체함 

export default {
    props:{
        todo: Object
    },
    data(){
        return{
            isEditMode: false,
            editedTitle: this.todo.title //수정하다가 취소하고 싶을경우 필요한 변수 todo.title 대신
        }
    },
    computed:{
        done:{ // done 이라는 컴퓨티드 데이터는 일반적으로 데이터를 가지고온 상태와 데이터가 수정되었을때 상태를 분기시켜줄수있다 
            get(){ //props에 있는 객체 todo를 가져온다
                return this.todo.done
            },
            set(done){ //done 이라는 매개변수로 변경된값을 받아옴
                this.updateTodo({
                    done
                })
            }
        },
        date(){
            const date = dayjs(this.todo.createdAt)
            const isSame = date.isSame(this.todo.updatedAt)

            if(isSame){
                return date.format('YYYY년 MM월 DD일')
            }else{
                return `${date.format('YYYY년 MM월 DD일')} (edited)` 
            }
            
        }
    },
    methods:{
        editedTodo(){
            if(this.todo.title !== this.editedTitle){ // 수정된대용이 없을때 분기 추가
                this.updateTodo({
                title: this.editedTitle,
                updatedAt: new Date()
                })
            }
            // 수정 모드 종료.
            this.offEditMode()
            
        },
        onEditMode(){
            this.isEditMode = true
            this.editedTitle = this.todo.title
            //위코드들이 갱신되고 나서 this.$nextTick 안에 있는 코드들이 실행된다
            this.$nextTick(() => {
                this.$refs.titleInput.focus()// 해당 코드만 있으면 refs 가 있는 dom 의 랜더링한후 참조할수 있는 보장이 안된다. 보장하기위해 $nextTick(콜백) 사용
            })
        },
        offEditMode(){
            this.isEditMode = false
        },
        updateTodo(value){ //특정값을 받아 부모컴포넌트인 todoapp로 넘겨준다- $emit 상위컴포넌트에 있는 메서드르리 실행하기위한('이벤트이름', 부모로 올라갈데이터, 갱신할값)
            this.$emit('update-todo', this.todo, value)
        },
        deleteTodo(){//상위컴포넌트를 통해서 delete-todo 이벤트 이름으로 this.todo와 같이 데이터로 로 올려줌
            this.$emit('delete-todo',this.todo)
        }
    }
}
//style scoped 현재 내에서만 사용함
//&.done 자기자신에 done 이라는 클래스
</script>
 
<style scoped lang='scss'>
    .todo-item{
        margin-bottom: 10px;
        .item__inner{
            display: flex;
        }
        .item__date{
            font-size:12px;
        }
        &.done{
            .item__title{
                text-decoration: line-through;
            }
        }
    }
</style>