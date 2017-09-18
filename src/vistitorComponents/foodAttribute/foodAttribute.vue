<template>
    <div class="attr-out-box" v-if='ATTR_BOX'>
        <div class="food-attribute">
            <div class="food-title clearfix">
                <span class="close pull-right" @click.stop.prevent="closeBox()">
                    <span class="icon-error"></span>
                </span>{{ATTR_BOX_DATA.fsitemname}}</div>
            <div class="food-content">
                <div class="rule-item" v-if="ATTR_BOX_DATA.menuItemUnitList">
    
                    <p>选择规格</p>
                    <span class="rule-box" v-for='(item,index) in ATTR_BOX_DATA.menuItemUnitList' @click.stop.prevent='changeUnit(index,item.fistatusUnit)'>
                        <span class='guige' :class='{active:item.fidefault == 1,choose:item.fistatusUnit!=1}'>{{item.fsorderunit}}</span>
                        <span class="sell-out" v-if="item.fistatusUnit!=1">售罄</span>
                    </span>
                </div>
                <div class="rule-item">
                    <div v-for='(item,index1) in ATTR_BOX_DATA.menuItemAskGroupOutVoList'>
                        <p>{{item.fsAskGpName}}</p>
                        <span v-for='(item2,index2) in item.menuItemAskOutVoList' @click.stop.prevent="changemenuItemAskOutVoList(index1,index2)">
                            <span class='guige' :class='{active:item2.fidefault == 1}'>{{item2.fsaskname}}</span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="food-footer clearfix">
                <button class="btn-confirm" @click='confirm' :class="{gray:fistatusUnit}">添加</button>
                <div class="btn-box">
                    <span>￥{{firstPrice}}/{{util}}</span>
                    <span style='padding-left:3px;text-decoration: line-through;font-size:12px;color:#ccc;' v-show='flag'>￥{{secondPrice}}</span>
    
                </div>
            </div>
        </div>
        <div class="backdrop" v-show="showDeskDrop"></div>
    </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import numberControl from '@/vistitorComponents/numControl/numControl.vue'
import { activityBuygiftItemListTip } from '@/config/menuCommonzzx.js'
export default {
    props: {
        activityList: Object,
        food: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            fistatusUnit: false,
            unitIndex: 0,//当前选中的规格类型
            showDeskDrop: true,
            isHasAskList: false,
            totalMoney: "",
            bargainPrice: "",
            singlePrice: "",
            discountSinglePrice: "",
        }
    },
    components: {
        numberControl
    },
    filters: {
        reduceZero(value) {
            if (!value) return ""
            if (value == 0) {
                return ""
            }
        }
    },
    watch: {
        ATTR_BOX_DATA: {
            handler: function (val, oldval) {
                if (!val.menuItemUnitList) {
                    return
                }
                this.fistatusUnit = false


                let menuItemUnitListMoney = 0; //原价
                let bargainPrice = 0 //优惠价
                let chooseMoney = 0
                val.menuItemUnitList.forEach(item => {
                    if (item.fidefault == 1) {
                        menuItemUnitListMoney = item.fdsaleprice
                        bargainPrice = item.bargainPrice
                    }

                    if (item.fidefault == 1 && (item.fistatusUnit == 3 || item.fistatusUnit == 2)) {
                        console.log()
                        this.fistatusUnit = true
                    }
                })
                if (val.menuItemAskGroupOutVoList) {
                    val.menuItemAskGroupOutVoList.forEach(item => {
                        item.menuItemAskOutVoList.forEach(item2 => {
                            if (item2.fidefault == 1) {
                                let money = Number(item2.fdaddprice)
                                chooseMoney += money
                            }
                        })
                    })
                }
                if (!bargainPrice) {
                    bargainPrice = menuItemUnitListMoney;

                } else {
                    bargainPrice = Number(bargainPrice)
                }
                this.discountSinglePrice = Number(bargainPrice + chooseMoney)
                this.singlePrice = Number(chooseMoney + menuItemUnitListMoney)
                this.bargainPrice = Number((bargainPrice + chooseMoney).toFixed(2))
                this.totalMoney = Number((chooseMoney + menuItemUnitListMoney).toFixed(2))
            },
            deep: true,
            immediate: true
        }
    },
    computed: {
        firstPrice() {
            if (this.bargainPrice > 0 && this.bargainPrice < this.totalMoney) {
                return this.bargainPrice
            } else {
                return this.totalMoney
            }
        },
        secondPrice() {
            if (this.bargainPrice > 0 && this.bargainPrice < this.totalMoney) {
                return this.totalMoney
            }
        },
        flag() {
            if (this.bargainPrice > 0 && this.bargainPrice < this.totalMoney) {
                return true
            } else {
                return false
            }
        },
        util() {
            let util = ""
            this.ATTR_BOX_DATA.menuItemUnitList.forEach(item => {
                if (item.fidefault == 1) {
                    util = item.fsorderunit
                }
            })
            return util
        },
        ...mapState([
            'ATTR_BOX', 'ATTR_BOX_DATA', 'TOTAL_CART'
        ]),

    },
    methods: {
        //改变规格
        changeUnit(index, fistatusUnit) {
            if (fistatusUnit == 1) {
                this.$store.commit('CHANGE_ATTR_BOX_DATA', index)
            }

        },
        //改变口味
        changemenuItemAskOutVoList(index1, index2) {
            let obj = {
                index1: index1,
                index2: index2
            }
            this.$store.commit('CHANGE_ATTR_BOX_DATA2', obj)
        },
        //关闭弹窗
        closeBox() {
            this.$store.commit('CHANGE_ATTR_BOX', false)
            this.$store.commit('CLEAR_ATTR_BOX_DATA', null)
        },
        //确认后的
        confirm() {
            if (this.fistatusUnit) {
                return
            }
            let flagindex = 0
            let fsitemname, totalMoney, fsorderunit, unitTotal, bargainPrice, singlePrice, discountSinglePrice, outIndex, innerIndex, fsitemid, unitOrginPrice, unitDiscountOrginPrice; //bargainPrice优惠价,//singlePrice没有精度过的单价
            let fsasknames = []
            unitTotal = 1
            totalMoney = this.totalMoney
            fsitemname = this.ATTR_BOX_DATA.fsitemname
            bargainPrice = this.bargainPrice
            singlePrice = this.singlePrice
            outIndex = this.ATTR_BOX_DATA.outIndex
            innerIndex = this.ATTR_BOX_DATA.innerIndex
            discountSinglePrice = this.discountSinglePrice
            fsitemid = this.ATTR_BOX_DATA.fsitemid
            let indexObj = { outIndex, innerIndex, fsitemid }

            this.$store.commit('CHANGE_COUNT', indexObj)




            this.ATTR_BOX_DATA.menuItemUnitList.forEach((item) => {
                if (item.fidefault == 1) {
                    fsorderunit = item.fsorderunit
                    unitOrginPrice = item.fdsaleprice
                    unitDiscountOrginPrice = item.bargainPrice
                }
            })
            if (this.ATTR_BOX_DATA.menuItemAskGroupOutVoList) {
                this.ATTR_BOX_DATA.menuItemAskGroupOutVoList.forEach(item => {
                    item.menuItemAskOutVoList.forEach(item2 => {
                        if (item2.fidefault == 1) {
                            fsasknames.push({ fsaskname: item2.fsaskname, fsaskid: item2.fsaskid, fdaddprice: item2.fdaddprice })
                        }
                    })
                })
            }

            let obj = {
                totalMoney, fsorderunit, unitTotal, fsasknames, fsitemname, bargainPrice, singlePrice, discountSinglePrice, outIndex, innerIndex, fsitemid, unitOrginPrice, unitDiscountOrginPrice
            }

            let activityBuygiftItemListTipfsorderunit = fsorderunit
            //表示一开始选择
            if (this.TOTAL_CART.length == 0) {
                this.$store.commit('CHANGE_TOTAL_CART', obj)
                this.$store.commit('CHANGE_ATTR_BOX', false)
                //打造爆款
                if (this.activityList) {
                    activityBuygiftItemListTip(this.activityList.activityBuygiftItemListResponse, fsitemid, activityBuygiftItemListTipfsorderunit, this.TOTAL_CART)
                }
                return
            }

            for (let i = 0; i < this.TOTAL_CART.length; i++) {
                let fsitemname = false
                let fsorderunit = false
                let fsasknamesFlag = 0
                let objleng = obj.fsasknames.length;
                flagindex = i
                if (this.TOTAL_CART[i].fsitemname == obj.fsitemname) {
                    fsitemname = true
                }
                if (this.TOTAL_CART[i].fsorderunit == obj.fsorderunit) {
                    fsorderunit = true
                }
                if (obj.fsasknames.length == 0 && this.TOTAL_CART[i].fsasknames.length == 0) {
                    if (fsitemname && fsorderunit) {
                        this.$store.commit('ADD_ITEM_COUNT', flagindex)
                        this.$store.commit('CHANGE_ATTR_BOX', false)
                        if (this.activityList) {
                            activityBuygiftItemListTip(this.activityList.activityBuygiftItemListResponse, fsitemid, activityBuygiftItemListTipfsorderunit, this.TOTAL_CART)
                        }
                        return false
                    }
                } else {
                    this.TOTAL_CART[i].fsasknames.forEach((item2) => {
                        obj.fsasknames.forEach(item3 => {
                            if (item2.fsaskname == item3.fsaskname) {
                                fsasknamesFlag += 1
                            }
                        })
                    })
                    if (fsitemname && fsorderunit && objleng == fsasknamesFlag && (obj.fsasknames.length == this.TOTAL_CART[i].fsasknames.length)) {

                        this.$store.commit('ADD_ITEM_COUNT', flagindex)
                        this.$store.commit('CHANGE_ATTR_BOX', false)
                        if (this.activityList) {
                            activityBuygiftItemListTip(this.activityList.activityBuygiftItemListResponse, fsitemid, activityBuygiftItemListTipfsorderunit, this.TOTAL_CART)
                        }
                        return false
                    }
                }

            }

            this.$store.commit('CHANGE_TOTAL_CART', obj)
            this.$store.commit('CHANGE_ATTR_BOX', false)
            //打造爆款
            if (this.activityList) {
                activityBuygiftItemListTip(this.activityList.activityBuygiftItemListResponse, fsitemid, activityBuygiftItemListTipfsorderunit, this.TOTAL_CART)
            }
        },
    }
}
</script>
<style lang="less" scoped>
@import './foodAttribute.less';
.guige {
    display: inline-block;
    font-size: 13px;
    margin-right: 8px;
    margin-bottom: 8px;
    padding: 8px 15px;
    border: 1px solid #efefef;
    background-color: #efefef;
    border-radius: 4px;
}

.active {
    color: #06c1ae;
    border: 1px solid #06c1ae;
    background: rgba(6, 193, 174, .1);
}

.choose {
    color: #ccc;
    border: 1px solid #ccc;
}

.gray {
    color: #ccc !important;
    border: 1px solid #ccc !important;
    background: #fff !important;
}
</style>