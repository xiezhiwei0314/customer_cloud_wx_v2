<template>
    <div class="dish-detail">
        <div class="dish-img">
            <img v-if="dishDetail.fsimageurl" :src="cutImg(dishDetail.fsimageurl,750,750)">
            <img v-else src="../../assets/nodish-big.png">
        </div>
        <div class="dish-text">
            <h3>{{dishDetail.fsitemname}}</h3>
            <p>已售{{dishDetail.soldNum}}份</p>
            <span class="dish-price">¥{{unitList.bargainPrice?unitList.bargainPrice:unitList.fdsaleprice}}/{{unitList.fsorderunit}}
                <span class="now-price" v-if="unitList.bargainPrice>0">¥{{unitList.fdsaleprice}}</span>
            </span>
            <div class="order-dish-box pull-right" v-if='dishDetail.isShowUnit == 1'>
                    <z-balls :item="dishDetail" :outIndex='outIndex' :count='count' :innerIndex='innerIndex' :activityListCopy='activityList'></z-balls>
            </div>
            <div class="order-dish-box pull-right" v-else>
                <a href="javascript:;" class="btn-add" :class='{"gray":dishDetail.fiiscout == 1 || SHOP_STATUS != 1}' @click.stop.prevent="showAttribute(dishDetail.fsitemname,dishDetail.menuItemUnitList,dishDetail.menuItemAskGroupOutVoList,outIndex,innerIndex,dishDetail.fsitemid)">{{dishDetail.fiiscout==1 || this.SHOP_STATUS != 1?'已售罄':'选规格'}}</a>
                <span class="num" v-show='count>0'>{{count}}</span>
            </div>
        </div>
        <div class="dish-dis" v-if="dishDetail.fsitemdesc">
            <h3>菜品信息</h3>
            <p>{{dishDetail.fsitemdesc}}</p>
        </div>
        <div class="dish-star">
            <p class="pull-right dis">
                <span v-if="dishDetail.likeNum>0">
                    <span class="count">{{dishDetail.likeNum}}</span></span>
                <span v-else>暂无</span>
            </p>
            <h3>菜品点赞数</h3>
        </div>
    </div>
</template>
<script>
import Vue from 'vue'
import ZBalls from '@/vistitorComponents/zBalls/zBalls.vue'
import cutImg from '@/config/cutImg.js'
import numberControl from '@/vistitorComponents/numControl/numControl.vue'
import { mapMutations, mapState } from 'vuex'
export default {
    created() {
        this.activityList = JSON.parse(sessionStorage.activityDish)
        let dishDetail = JSON.parse(sessionStorage.itemInfo)
        this.dishDetail = dishDetail
        //拿到初始化的值
        dishDetail.menuItemUnitList.forEach(item => {
            if (item.fidefault == 1 ) {
                this.unitList = item
            }
        })
    },

    watch: {
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
    data() {
        return {
            dishDetail: {},
            unitList: [],
            outIndex: 　sessionStorage.outIndex,
            innerIndex: sessionStorage.innerIndex,
            count: 0,
            activityList : {}   
        }
    },
    components: {
        numberControl,
        ZBalls
    },
    computed: {
        ...mapState([
            'ALL_MODEL','SHOP_STATUS'
        ]),
    },
    mixins: [cutImg],
    methods: {
        showAttribute(fsitemname, menuItemUnitList, menuItemAskGroupOutVoList, outIndex, innerIndex, fsitemid) {
            if (this.dishDetail.fiiscout == 1 || this.SHOP_STATUS != 1) {
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
@import './dishDetail.less';
.gray {
    color: #ccc !important;
    border: 1px solid #ccc !important
}
</style>