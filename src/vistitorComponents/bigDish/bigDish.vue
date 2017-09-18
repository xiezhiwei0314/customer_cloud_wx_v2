<template>
    <div>
        <div class="item-dish" v-for="(subItem,subIndex) in item.menuItemUnitList" :key="subIndex" v-if="subItem.fidefault" >
            <div class="dish-img" @click.stop.prevent="itemShowDishDetial(item,menu.fsmenuclsid)">
                <img v-if="item.fsimageurl" :src="cutImg(item.fsimageurl,350,350)">
                <img v-else src="../../assets/nodish-big.png">
                <div class="youhui" v-if="item.menuItemUnitList[0].menuItemActivity">{{item.menuItemUnitList[0].menuItemActivity.bargainName}}</div>
            </div>
            <h3>{{item.fsitemname}}</h3>
            <p class="clearfix"><span class="count pull-right">已售{{item.soldNum}}{{subItem.fsorderunit}}</span><span class="price">¥{{subItem.bargainPrice?subItem.bargainPrice:subItem.fdsaleprice}}/{{subItem.fsorderunit}}</span><span class="now-price" v-if="subItem.bargainPrice>0">¥{{subItem.fdsaleprice}}</span></p>
            <div class="btn-box">
                <a href="javascript:;" class="btn-add" @click.stop.prevent="itemShowAttribute(item,menu.fsmenuclsid)" v-if="item.isShowUnit==0">选规格</a>
                <!--<numberControl :item="item" :itemExtra="subItem" v-if="item.isShowUnit==1" @drop="drop($event)"></numberControl>-->
                <span class="num" v-show="item.attrCount>0">{{item.attrCount}}</span>
            </div>
        </div>
    </div>
</template>
<script>
    import cutImg from '@/config/cutImg.js'
    export default {
        props: {
            item: Object
        },
        mixins: [cutImg]
    }
</script>
<style lang="less">
    @import './bigDish.less';
</style>