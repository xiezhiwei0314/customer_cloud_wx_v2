<template>
    <div class="cart-box" v-show='CARD_SHOW'>
        <div class="cart clearfix">
            <button type="button" :class="{'btn-primary':true,'btn-grey':totalCount<=0}" @click="nextClick()">选好了</button>
            <div class="cart-num-box" @click='closeBox'>
                <span class="num" v-if="totalCount>0">{{totalCount}}</span>
            </div>
            <p v-show="totalCount<=0" class="no-dishes">还没添加菜品</p>
            <p class="price" v-show="totalCount>0">¥{{firstPriceFinall}}
                <span class="favorable-price" v-show='flag'>￥{{secondPriceFinall}}</span>
            </p>
        </div>
        <div class="cart-list">
            <div>
                <div :class="{'discount-text':true,'showDiv':ACTIVITY_SHOW}">•&nbsp;&nbsp;
                    <span v-if="ACTIVITY_TIP.type==202">下单减{{ACTIVITY_TIP.bargainValue}}元，再买
                        <span class="orange">{{ACTIVITY_TIP.minusMoney}}元</span>可减
                        <span class="orange">{{ACTIVITY_TIP.bargainValue}}元</span>
                    </span>
                    <span v-if="ACTIVITY_TIP.type==203">再买
                        <span class="orange">{{ACTIVITY_TIP.minusMoney}}元</span>可享受
                        <span class="orange">{{ACTIVITY_TIP.bargainValue}}折</span>
                    </span>
                </div>
            </div>
            <!--<transition name="slideUp">-->
            <div v-show="listShow">
                <div class="list-header clearfix">
                    <span class="empty pull-right" @click="setEmptyCart()">
                        <span class="icon-remove"></span>清除</span>
                    <h1 class="title">已选菜品({{totalCount}}份)</h1>
                </div>
                <div class="list-content" ref="cartFoodList">
                    <ul>
                        <li class="food" v-for="(item,index) in TOTAL_CART" :key="index">
                            <div class="main-content">
                                <div class="price pull-right">
                                    <span>￥{{firstPrice(item.discountSinglePrice,item.singlePrice,item.unitTotal)}}</span>
                                    <span style='text-decoration: line-through;' v-show='flagItem(item.discountSinglePrice,item.singlePrice,item.unitTotal)'>￥{{secondPrice(item.discountSinglePrice,item.singlePrice,item.unitTotal)}}</span>
                                    <!--<span class="now-price" style="display:block;padding-top:3px;" v-if="food.menuItemUnitList[0].bargainPrice>0">¥{{(food.menuItemUnitList[0].fdsaleprice*food.count).toFixed(2)}}</span>-->
                                </div>
                                <span class="name">{{item.fsitemname}}</span>
                                <span class="attr-name">
                                    ({{item.fsorderunit}}
                                    <span v-for="(item,askIndex) in item.fsasknames" :key="askIndex">
                                        {{item.fsaskname}}
                                    </span>)
                                </span>
                                <div class="cartcontrol-wrapper">
                                    <control-num :count='item.unitTotal' :index='index'></control-num>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <!--</transition>-->
        </div>
        <div class="backdrop" v-show="listShow" @click="listShow = false"></div>
    </div>
</template>
<script>
import Vue from 'vue'
import { MessageBox } from 'mint-ui';
import { mapMutations, mapState } from 'vuex'
Vue.component(MessageBox.name, MessageBox);
import BScroll from 'better-scroll'
import ControlNum from '@/vistitorComponents/controlNum/controlNum.vue'
import { totalCalcutate, isNewCustomer, activityBuygiftItemListTip, isBigPlay, totalCalcutateDis, isCutMoney } from '@/config/menuCommonzzx.js'
export default {
    mounted() {
        console.log(this.activityList)
    },
    props: {

        total: Object,
        activityPrice: Object,
        activityShowText: {
            type: Boolean,
            default: false
        },
        activityList: Object

    },
    data() {
        return {
            totalCount: 0,
            listShow: false,
            originalPrice: "",//原价
            discountPrice: "",//优惠价
            originalPriceFinall: 0,//总价的原价
            discountPriceFinall: 0 //总价的优惠价
        }
    },
    components: {
        ControlNum
    },
    computed: {
        firstPriceFinall() {
            let _this = this
            let originalPriceFinall = 0;
            let discountPriceFinall = 0
            if (this.TOTAL_CART.length > 0) {

                this.TOTAL_CART.forEach(item => {
                    originalPriceFinall += item.singlePrice * item.unitTotal
                    discountPriceFinall += item.discountSinglePrice * item.unitTotal


                })
                console.log('第一次' + originalPriceFinall, discountPriceFinall)
                if (discountPriceFinall < originalPriceFinall) {

                    if (this.activityList) {
                        return Number(totalCalcutate(this.activityList, discountPriceFinall, _this, this.TOTAL_CART)).toFixed(2)
                    } else {
                        return discountPriceFinall.toFixed(2)
                    }
                } else {

                    if (this.activityList) {
                        return Number(totalCalcutate(this.activityList, originalPriceFinall, _this, this.TOTAL_CART)).toFixed(2)
                    } else {
                        return Number(originalPriceFinall).toFixed(2)
                    }

                }
            }

        },
        secondPriceFinall() {
            let _this = this
            let originalPriceFinall = 0;
            let discountPriceFinall = 0
            if (this.TOTAL_CART.length > 0) {
                this.TOTAL_CART.forEach(item => {
                    originalPriceFinall += item.singlePrice * item.unitTotal
                    discountPriceFinall += item.discountSinglePrice * item.unitTotal

                })
                // console.log('第二次'+originalPriceFinall,discountPriceFinall)
                // console.log("isNewCustomer" +isNewCustomer(this.activityList))
                // console.log("isBigPlay"+isBigPlay(this.activityList))
                if (Number(discountPriceFinall) < Number(originalPriceFinall) || isCutMoney(this.activityList) || isNewCustomer(this.activityList) || isBigPlay(this.activityList)) {
                    if (this.activityList) {
                        return Number(totalCalcutateDis(this.activityList, originalPriceFinall, _this, this.TOTAL_CART)).toFixed(2)
                    } else {
                        return Number(originalPriceFinall).toFixed(2)
                    }

                }
            }

        },
        flag() {
            var _this = this
            let originalPriceFinall = 0;
            let discountPriceFinall = 0
            if (this.TOTAL_CART.length > 0) {
                this.TOTAL_CART.forEach(item => {
                    originalPriceFinall += item.singlePrice * item.unitTotal
                    discountPriceFinall += item.discountSinglePrice * item.unitTotal

                })
                if (this.activityList) {
                    discountPriceFinall = Number(totalCalcutate(this.activityList, discountPriceFinall, _this, this.TOTAL_CART)).toFixed(2)
                    originalPriceFinall = Number(totalCalcutateDis(this.activityList, originalPriceFinall, _this, this.TOTAL_CART)).toFixed(2)
                } else {
                    originalPriceFinall = Number(originalPriceFinall).toFixed(2)
                    discountPriceFinall = Number(discountPriceFinall).toFixed(2)
                }

                // console.log(originalPriceFinall+'//////////////originalPriceFinall')
                // console.log(discountPriceFinall+'//////////////discountPriceFinall')
                // console.log(discountPriceFinall < originalPriceFinall)
                // console.log("isNewCustomer11111" +isNewCustomer(this.activityList))
                // console.log("isBigPlay1111"+isBigPlay(this.activityList))
                if (Number(discountPriceFinall) < Number(originalPriceFinall) && (isCutMoney(this.activityList) || isNewCustomer(this.activityList) || isBigPlay(this.activityList))) {
                    return true
                } else {
                    return false
                }
            }

        },
        ...mapState([
            'TOTAL_CART', 'ACTIVITY_TIP', 'ACTIVITY_SHOW', 'CARD_SHOW'
        ]),
    },
    watch: {
        TOTAL_CART: {
            handler: function (val, oldval) {
                let total = 0
                if (val.length > 0) {
                    val.forEach(item => {
                        total += item.unitTotal
                    })

                    this.totalCount = total
                } else {
                    this.totalCount = 0
                    this.listShow = false
                    this.$store.commit('SAVE_ACTIVITY_SHOW', false)
                }

            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        firstPrice(discountSinglePrice, singlePrice, unitTotal) {
            if (this.TOTAL_CART.length > 0) {
                let discountSinglePriceTotal = discountSinglePrice * unitTotal //总个例价优惠价
                let singlePriceTotal = singlePrice * unitTotal  //总个例的原价
                if (discountSinglePriceTotal > 0 && discountSinglePriceTotal < singlePriceTotal) {
                    return discountSinglePriceTotal.toFixed(2)
                } else {
                    return singlePriceTotal.toFixed(2)
                }
            }

        },
        secondPrice(discountSinglePrice, singlePrice, unitTotal) {
            if (this.TOTAL_CART.length > 0) {
                let discountSinglePriceTotal = discountSinglePrice * unitTotal
                let singlePriceTotal = singlePrice * unitTotal
                if (discountSinglePriceTotal > 0 && discountSinglePriceTotal < singlePriceTotal) {
                    return singlePriceTotal.toFixed(2)
                }
            }

        },
        flagItem(discountSinglePrice, singlePrice, unitTotal) {
            if (this.TOTAL_CART.length > 0) {
                let discountSinglePriceTotal = discountSinglePrice * unitTotal
                let singlePriceTotal = singlePrice * unitTotal
                if (discountSinglePriceTotal > 0 && discountSinglePriceTotal < singlePriceTotal) {
                    return true
                } else {
                    return false
                }
            }

        },
        closeBox() {
            if (this.totalCount > 0) {
                this.listShow = !this.listShow
                this.$nextTick(() => {
                    if (!this.foodlistScroll) {
                        this.initCartScroll();
                    } else {
                        this.foodlistScroll.refresh();
                    }
                })
            }
        },
        //初始化购物车列表
        initCartScroll() {
            this.foodlistScroll = new BScroll(this.$refs.cartFoodList, {
                click: true
            });
        },
        nextClick() {
            if (this.TOTAL_CART.length > 0) {
                
                localStorage.setItem('cartFoods', JSON.stringify(this.TOTAL_CART));
                this.$router.push({ name: 'confirmOrder' });
            }
        },
        //清空购物车
        setEmptyCart() {
            MessageBox.confirm('确定要清除购物车吗?').then(action => {
                this.$store.commit('CLEAR_ITEM_COUNT')
                this.$store.commit('CLEAR_ALL_MODEL')
            }, err => {
                console.log(err);
            });
        }
    }
}
</script>
<style lang="less">
@import './cart.less';
</style>
