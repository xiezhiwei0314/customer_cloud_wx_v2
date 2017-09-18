<template>
<div>
    <span class="buttn-default" v-if='count == undefined'>确定</span>
    <div class="cart-btn-box" v-else>
        <span class="minus" @click='reduce'>-</span>
        <span>{{count}}</span>
        <span class="plus" @click='add'>+</span>
    </div>
</div>
</template>

<script>
export default {
   props : {
       count : {
           type : Number,
           deafult:0
       }
   },
   methods : {
       reduce () {

       },
       add () {

       }
   }
}
</script>

<style lang='less' scoped>
@import './singleStyleBtn.less';
</style>

