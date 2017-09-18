<template>
    <div>
        <div class="item-dish" v-for="(subItem,subIndex) in itemDish.menuItemUnitList" :key="subIndex" v-if="subItem.fidefault">
            <div class="dish-img" @click.stop.prevent="itemShowDishDetial(itemDish,menu.fsmenuclsid)">
                <img v-if="itemDish.fsimageurl" :src="cutImg(itemDish.fsimageurl,350,350)">
                <img v-else src="../../../../assets/nodish-big.png">
                <div class="youhui" v-if="itemDish.menuItemUnitList[0].menuItemActivity">{{itemDish.menuItemUnitList[0].menuItemActivity.bargainName}}</div>
            </div>
            <h3>{{itemDish.fsitemname}}</h3>
            <p class="clearfix">
                <span class="count pull-right">已售{{itemDish.soldNum}}{{subItem.fsorderunit}}</span>
                <span class="price">¥{{subItem.bargainPrice?subItem.bargainPrice:subItem.fdsaleprice}}/{{subItem.fsorderunit}}</span>
                <span class="now-price" v-if="subItem.bargainPrice>0">¥{{subItem.fdsaleprice}}</span>
            </p>
            <div class="btn-box">
                <single-style-btn v-if='itemDish.isShowUnit == 1'></single-style-btn>
                <multi-style-btn v-else></multi-style-btn>
                <span class="num" v-show="itemDish.attrCount>0">{{itemDish.attrCount}}</span>
            </div>
        </div>
    </div>
</template>
<script>
    import cutImg from '@/config/cutImg.js'
    import SingleStyleBtn from './singleStyleBtn/singleStyleBtn.vue'
    import MultiStyleBtn from './multiStyleBtn/multiStyleBtn.vue'
    export default {
        props: {
            itemDish: [Object]
        },
        mixins: [cutImg],
        components: {
            SingleStyleBtn,
            MultiStyleBtn
        }
    }
</script>
<style lang="less">
    @import './itemDish.less';
</style>