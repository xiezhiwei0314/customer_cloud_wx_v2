<template>
    <div>
        <span class="add-btn" v-show='count == 0' @click.stop.prevent='addCount' :class='{"gray":item.fiiscout == 1 || SHOP_STATUS != 1}'>{{item.fiiscout == 1 || SHOP_STATUS != 1?'已售罄':'添加'}}</span>
        <div v-show='count>0' class="noattr-btn-box">
            <span class="minus" @click='reduceCount'>-</span>
            <span>{{count}}</span>
            <span class="plus" @click='addCount'>+</span>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
import { activityBuygiftItemListTip } from '@/config/menuCommonzzx.js'
export default {
    mounted () {
       console.log('mmmmmmm'+this.activityListCopy)
    },
    props: {
        activityListCopy : Object,
        outIndex: [Number, String],
        innerIndex: [Number, String],
        count: [Number, String],
        item: Object
    },
    computed: {
        ...mapState([
            'TOTAL_CART','SHOP_STATUS'
        ]),
    },
    methods: {
        addCount(e) {
            if (this.item.fiiscout == 1 || this.SHOP_STATUS !=1) {
                return
            }
            let obj = {
                outIndex: this.outIndex,
                innerIndex: this.innerIndex,
                fsitemid: this.item.fsitemid
            }
            //小球动画
            if(this.$route.name=="searchDishes"){
                this.$parent.$parent.$parent.drop(e);
            }else{
                this.$parent.$parent.drop(e);
            }
            this.$store.commit('CHANGE_COUNT', obj)
            let flagindex = 0
            let fsitemname, totalMoney, fsorderunit, unitTotal, bargainPrice, singlePrice, discountSinglePrice, outIndex, innerIndex, fsitemid, unitOrginPrice, unitDiscountOrginPrice; //bargainPrice优惠价,//singlePrice没有精度过的单价
            let fsasknames = []
            unitTotal = 1
            totalMoney = this.item.menuItemUnitList[0].fdsaleprice
            fsitemname = this.item.fsitemname
            if(!this.item.menuItemUnitList[0].bargainPrice){
                bargainPrice = totalMoney
            }else{
                bargainPrice = this.item.menuItemUnitList[0].bargainPrice
            }
            unitOrginPrice = singlePrice = this.item.menuItemUnitList[0].fdsaleprice
            outIndex = this.outIndex
            innerIndex = this.innerIndex
            unitDiscountOrginPrice = discountSinglePrice = bargainPrice
            fsitemid = this.item.fsitemid
            fsorderunit = this.item.menuItemUnitList[0].fsorderunit
            let obj2 = {
                totalMoney, fsorderunit, unitTotal, fsasknames, fsitemname, bargainPrice, singlePrice, discountSinglePrice, outIndex, innerIndex, fsitemid, unitOrginPrice, unitDiscountOrginPrice
            }
            let activityBuygiftItemListTipfsorderunit = fsorderunit
            if (this.TOTAL_CART.length == 0) {
                this.$store.commit('CHANGE_TOTAL_CART', obj2)
                //打造爆款
                if(this.activityListCopy){
                  activityBuygiftItemListTip(this.activityListCopy.activityBuygiftItemListResponse, fsitemid, activityBuygiftItemListTipfsorderunit, this.TOTAL_CART)
                }
                return
            }
            for (let i = 0; i < this.TOTAL_CART.length; i++) {
                let fsitemname = false
                let fsorderunit = false
                let fsasknamesFlag = 0
                let objleng = obj2.fsasknames.length;
                flagindex = i
                if (this.TOTAL_CART[i].fsitemname == obj2.fsitemname) {
                    fsitemname = true
                }
                if (this.TOTAL_CART[i].fsorderunit == obj2.fsorderunit) {
                    fsorderunit = true
                }
                if (obj2.fsasknames.length == 0 && this.TOTAL_CART[i].fsasknames.length == 0) {
                    if (fsitemname && fsorderunit) {
                        this.$store.commit('ADD_ITEM_COUNT', flagindex)
                        //打造爆款
                        if(this.activityListCopy){
                             activityBuygiftItemListTip(this.activityListCopy.activityBuygiftItemListResponse, fsitemid, activityBuygiftItemListTipfsorderunit, this.TOTAL_CART)
                         }
                        return false
                    }
                }

            }
            //打造爆款
            if(this.activityListCopy){
                activityBuygiftItemListTip(this.activityListCopy.activityBuygiftItemListResponse, fsitemid, activityBuygiftItemListTipfsorderunit, this.TOTAL_CART)
            }
            this.$store.commit('CHANGE_TOTAL_CART', obj2)

        },
        reduceCount() {
            let obj = {
                outIndex: this.outIndex,
                innerIndex: this.innerIndex,
                fsitemid: this.item.fsitemid
            }
            let activityBuygiftItemListTipfsorderunit = this.item.menuItemUnitList[0].fsorderunit
            console.log(',,,,,,,,,,,,,,,,,,,,,,')
            console.log(obj)
            this.$store.commit('REDUCE_MODE_COUNT', obj)
            this.$store.commit('REDUCE_ITEM2_COUNT', obj)
            //this.$store.commit('CHANGE_TOTAL_CART', obj)
            //打造爆款
             if(this.activityListCopy){
                activityBuygiftItemListTip(this.activityListCopy.activityBuygiftItemListResponse, obj.fsitemid, activityBuygiftItemListTipfsorderunit, this.TOTAL_CART)
            }

        }
    }
}
</script>
<style lang="less">
.add-btn {
    display: inline-block;
    width: 80px;
    font-size: 14px;
    color: #06C1AE;
    height: 24px;
    line-height: 24px;
    border: 1px solid #06C1AE;
    text-align: center;
    border-radius: 4px;
}
.gray {
    color: #ccc !important;
    border: 1px solid #ccc !important
}
.noattr-btn-box {
    width: 80px;
    font-size: 14px;
    position: absolute;
    right: 0;
    top: -24px;
    background: url(../../assets/mini-plus-minus.png) no-repeat center;
    background-size: 100%;
    border: none;
    height: 24px;
    line-height: 24px;
    text-align: center;
    >span {
        width: 48%;
        border: 1px solid transparent;
        text-align: center;
        height: 100%;
        background: transparent;
        font-size: 15px;
    }
    .minus,
    .plus {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 30%;
        color: #06C1AE;
        font-size: 0;
        opacity: 0;
    }
    .plus {
        left: inherit;
        right: 0;
    }
}
</style>

