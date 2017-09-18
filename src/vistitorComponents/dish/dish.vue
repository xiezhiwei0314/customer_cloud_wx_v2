<template>
    <div>
        <div class="img-box pull-left" @click="showDishDetial(item)">
            <img v-if="item.fsimageurl" :src="cutImg(item.fsimageurl,134,134)">
            <img v-else src="../../assets/nodish-small.png">
            <div class="youhui" v-if='bargainNameFlag'>{{bargainName}}</div>
        </div>
        <h3>{{item.fsitemname}}</h3>
        <p>已售{{item.soldNum}}份</p>
         <p class="price">￥{{itemExtra.bargainPrice?itemExtra.bargainPrice:itemExtra.fdsaleprice}}/{{itemExtra.fsorderunit}}<span class="now-price" v-if="itemExtra.bargainPrice >0">¥{{itemExtra.fdsaleprice}}</span></p>
        <div class="number-control" v-if='item.isShowUnit == 1'>
           <z-balls :activityListCopy="activityListCopy" :item="item"  :outIndex='outIndex' :count='count' :innerIndex='innerIndex'></z-balls>
        </div>
        <div class="number-control" v-else>
            <a href="javascript:;" class="btn-add" :class='{"gray":item.fiiscout == 1 || SHOP_STATUS != 1}' @click.stop.prevent="showAttribute(item.fsitemname,item.menuItemUnitList,item.menuItemAskGroupOutVoList,outIndex,innerIndex,item.fsitemid)">{{item.fiiscout == 1 || item.fiiscout==1?'已售罄':'选规格'}}</a>
            <span class="num" v-show='count>0'>{{count}}</span>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import { cloneObj } from '@/utils/untils.js'
import cutImg from '@/config/cutImg.js'
import ZBalls from '@/vistitorComponents/zBalls/zBalls.vue'
import numberControl from '@/vistitorComponents/numControl/numControl.vue'
import { mapMutations, mapState } from 'vuex'
export default {
    props: {
        activityList : Object,
        outIndex: [String, Number],
        innerIndex: [String, Number],
        item: Object,
        itemExtra: Object,

    },
    data() {
        return {
            activityListCopy : "",
            count: 0,
            countFlag: false,
            bargainName : "",
            bargainNameFlag : false
        }
    },
    
    computed: {
        ...mapState([
            'ALL_MODEL','SHOP_STATUS'
        ]),
    },
    watch: {
        activityList: {
             handler : function(val,oldval) {
                 this.activityListCopy = val
                 console.log('fdsafdsafds'+val)
             },
            deep: true,
            immediate: true
        },
        item: {
            handler: function (val, oldval) {
                let menuItemUnitList = val.menuItemUnitList
                if (menuItemUnitList) {
                    for (let i = 0; i < menuItemUnitList.length; i++) {
                        if (menuItemUnitList[i].fidefault == 1) {
                            if (menuItemUnitList[i].menuItemActivity) {
                                this.bargainName  =  menuItemUnitList[i].menuItemActivity.bargainName
                                this.bargainNameFlag = true
                                break
                            }
                        }
                    }
                }
            },
             deep: true,
            immediate: true
        },
        ALL_MODEL: {
            handler: function (val, oldval) {
                let out = val[this.outIndex]
                if (out && out.menuItemList) {
                    this.count = out.menuItemList[this.innerIndex].innerCount
                }
            },
            deep: true,
            immediate: true
        }
    },
    components: {
        numberControl,
        ZBalls
    },
    mixins: [cutImg],
    methods: {
        showDishDetial() {
            sessionStorage.activityDish = JSON.stringify(this.activityList)
            sessionStorage.itemInfo=JSON.stringify(this.item)
            sessionStorage.outIndex = this.outIndex
            sessionStorage.innerIndex = this.innerIndex
            this.$router.push({name:'dishDetail'})
        },
        //显示选择属性框,传入规格
        showAttribute(fsitemname, menuItemUnitList, menuItemAskGroupOutVoList, outIndex, innerIndex,fsitemid) {
            if (this.item.fiiscout == 1 || this.SHOP_STATUS !=1) {
                return
            }
            if (menuItemAskGroupOutVoList) {
                menuItemAskGroupOutVoList.forEach((item, index) => {
                    item.menuItemAskOutVoList.forEach(item2 => {
                        Vue.set(item2, 'fidefault', 0)
                    })
                })
            }
            let obj = {
                fsitemid,
                menuItemUnitList,
                menuItemAskGroupOutVoList,
                fsitemname,
                outIndex,
                innerIndex,
                
            }
            this.$store.commit('SAVE_ATTR_BOX_DATA', obj)
            this.$store.commit('CHANGE_ATTR_BOX', true)
        },
    }
}
</script>
<style lang="less">
@import './dish.less';
.gray {
    color: #ccc !important;
    border: 1px solid #ccc !important
}
</style>