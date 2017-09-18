<template>
    <div class="search-dishes">
        <search  class="crib-search" :text='text' :fixed='true' :autoFocus='true' placeholder='输入菜品名称' :inputValue.sync='value' @on-submit='submit'></search>
        <div class="search-result">
           
            <ul class="list-item">
                <li v-for="(item,index) in array" :key="index">
                     <dish :item="item" :activityList='activity' :innerIndex='item.innerIndex' :outIndex='item.outIndex' :itemExtra="item.menuItemUnitList[0]"></dish>
                    <!--<dish :item="item" : :itemExtra="item.menuItemUnitList[0]" @showDishDetial="showDishDetial" @showAttribute="showAttribute" @drop="drop($event)" @openKeyboard="openKeyboard"></dish>-->
                </li>
            </ul>
            <div class="no-search-list" v-show="showNoResult"><img src="../../assets/search.png"><p>没有搜索结果</p></div>
        </div>
    </div>
</template>  
<script>
    import { mapMutations, mapState } from 'vuex'
    import Vue from 'vue'
    import {Search} from "@/crib-zk"
    import dish from '@/vistitorComponents/dish/dish.vue'
    export default {
        created () {
            this.activity = JSON.parse(sessionStorage.activityDish)
        },
        data () {
           return {
               value : "",
               array : [],
               activity : "",
               showNoResult : false,
               text : "取消"
           }
        },
        computed: {
            ...mapState([
                'ALL_MODEL'
            ]),
        },
        methods : {
            submit () {
               this.$router.back()
            },
            // foucs () {
            //     document.body.height =document.body.clientHeight
            // },
            // blur () {
            //     setTimeout(()=>{
            //          this.$store.commit('CHANGE_CARD_SHOW',true)
            //     },500)
                 
            // }
        },      
        watch : {
           array: {
            handler: function (val, oldval) {
               if(val.length>0) {
                 let flag = 0
                 val.forEach(item=>{
                    flag += item.innerCount
                 })
                 if(flag >0){
                     this.text = "完成"
                     return
                 }
             }
             this.text = "取消"
            },
            deep: true
        },
          value (val,oldval) {
             if(val == ""){
                 this.array = []
                 this.showNoResult = false
                 return 
             }
             this.array = []
             let nowArr = []
             this.ALL_MODEL.forEach((item,index)=>{
                 if(item.fsmenuclsid){
                     item.menuItemList.forEach((item2,index2)=>{
                        let flag = item2.fsitemname.indexOf(val)
                        if(flag > -1){
                            if(nowArr[item2.fsitemname]==undefined){
                                nowArr[item2.fsitemname] = item2.fsitemname
                                this.showNoResult= false
                                item2.outIndex = index
                                item2.innerIndex = index2
                                this.array.push(item2)
                            }
                        }
                    })
                 }
                 if(this.array.length== 0){
                    this.showNoResult= true
                 }
             })
          }
        },
        components : {
            dish,
            Search
        }
    }
</script>
<style lang="less">
    @import './searchDishes.less';
</style>