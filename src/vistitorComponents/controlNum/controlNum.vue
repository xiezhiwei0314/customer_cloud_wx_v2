<template>
    <div class="cart-btn-box">
        <span class="minus" @click='reduce'>-</span>
        <span>{{count}}</span>
        <span class="plus" @click='add'>+</span>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { activityBuygiftItemListTip } from '@/config/menuCommonzzx.js'
export default {
    props : {
        count : Number,
        index : [String,Number],
    },
     computed : {
         ...mapState([
            'TOTAL_CART'
        ]),
     },
     methods : {
         add () {
            this.$store.commit('ADD_ITEM_COUNT',this.index)
            let model = this.TOTAL_CART[this.index]
            let obj = {
                outIndex : model.outIndex,
                innerIndex : model.innerIndex,
                fsitemid : model.fsitemid
            }
            this.$store.commit('CHANGE_COUNT',obj)
             //打造爆款
             if(this.$parent.activityList) {
                 activityBuygiftItemListTip(this.$parent.activityList.activityBuygiftItemListResponse, model.fsitemid,model.fsorderunit, this.TOTAL_CART)
             }
            

         },
         reduce () {
            var  model = this.TOTAL_CART[this.index]
            if(!model) return
            let obj = {
                outIndex : model.outIndex,
                innerIndex : model.innerIndex,
                fsitemid : model.fsitemid
            }
            console.log(obj)
            this.$store.commit('REDUCE_ITEM_COUNT',this.index)
            this.$store.commit('REDUCE_MODE_COUNT',obj)
             //打造爆款
             if(this.$parent.activityList) {
                 activityBuygiftItemListTip(this.$parent.activityList.activityBuygiftItemListResponse, model.fsitemid,model.fsorderunit, this.TOTAL_CART)
             }
         }
     }

}
</script>
<style lang="less">
    .cart-btn-box{
        width:80px;
        font-size: 14px;
        position: absolute;
        right: 0;
        top: 7px;
        background:url(../../assets/mini-plus-minus.png) no-repeat center;
        background-size:100%;
        border:none;
        height:24px;
        line-height: 24px;
        text-align: center;
        > span{
            width: 48%;
            border: 1px solid transparent;
            text-align: center;
            height: 100%;
            background: transparent;
            font-size: 15px;
        }
        .minus, 
        .plus{
            position:absolute;
            left:0;
            top:0;
            bottom:0;
            width:30%;
            color:#06C1AE;
            font-size: 0;
            opacity: 0;
        }
        .plus{
            left:inherit;
            right:0;
        }
    }
</style>
