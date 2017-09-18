<template>
    <div :class="{'bigMenus':true,'hide-title':isHide}">
        <div class="menu-box">
            <div class="menu-header">
                <span class="pull-left search-box" v-if="goods.length>0" @click="showSearchDish=!showSearchDish">
                    <span class="icon-search"></span>搜索</span>
                <div ref="menuHeaderWrapper">
                    <ul :style="{'width':menuHeaderWidth}">
                        <li v-for="(menu,index) in goods" @click="selectMenu(index)" :class="{'current':currentIndex==index}" :key="index">
                            {{menu.fsmenuclsname}}
                            <span class="num" v-show="menu.total>0&&menu.fsmenuclsid">{{menu.total}}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="menu-list" ref="menuListWrapper" @touchstart="replaceCuIndex=false">
            <ul class="menu-list-item">
                <li v-for="(menu,menuIndex) in goods" class="menu-list-hook" :key="menuIndex">
                    <h4>{{menu.fsmenuclsname}}</h4>
                    <ul class="item-list">
                        <li v-for="(itemDish,itemDishIndex) in menu.menuItemList" :key="itemDishIndex">
                            <itemDish :itemDish="itemDish"></itemDish>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <!--<cart :total="total" :activityPrice="activityPrice"></cart>-->
        <!--<foodAttribute ref="attrItem" :food="attrifoods" v-show="showAttributeBox" @closeAttributeBox="showAttributeBox=false" @drop="drop($event)" @selectAsk="selectAsk"></foodAttribute>-->
        <!--<transition name="slideLeft">-->
        <!--<dishDetail :dishDetail="dishDetail" :unitList="unitList" :detailMenusid="detailMenusid" v-show="showDetail" @showAttribute="showAttribute" @drop="drop($event)"></dishDetail>-->
        <!--</transition>-->
        <!--<searchDishes @closeSearchBox="closeSearchBox" @showAttribute="showAttribute" :lists="goods" :menusid="menusid" :commonDishesList="commonDishesList" v-show="showSearchDish" @drop="drop($event)"></searchDishes>-->
        <!--<balls ref="balls"></balls>-->
    </div>
</template>
<script>
import {getShopMenu} from '@/config/api.js'
import Vue from 'vue'
import BScroll from 'better-scroll'
// import cart from '@/vistitorComponents/cart/cart.vue'
// import balls from '@/vistitorComponents/balls/balls.vue'
import itemDish from './itemDish/itemDish.vue'
import {layoutMixin} from '@/pages/menus/mixin/layout.mixin.js'

/*
* data 属性说明
  menuHeaderWidth => 存储菜单高度
  menuHeaderWidth => 存储菜单栏宽度
  ---------------------------------------
  created 参数和过程说明
  getShopMenu => 从api.js全局请封装的请求,需要传入 shopId和tableId参数

*/ 
export default {
    name: 'udLayout',
    mixins: [layoutMixin],
    data() {
        return {
            menuListHeight: [],
            menuHeaderWidth: 0
        }
    },
    created() {
         getShopMenu(this.shopId,this.tableId).then(res=>{
           if (res.code == 200) {
                this.goods = res.model;
                this.$nextTick(() => {
                    this.headerWidth();
                    this.initMenuListHeight();// 初始化列表高度列表
                    this.$nextTick(() => {
                        this.initScroll(); // 初始化scroll
                    })
                });
            } else {
                alert(data.message);
            }
        })
    },
    components: {
        itemDish,
        // cart,
        // balls,
    },
    methods: {
        initScroll() {
            //初始化侧边栏滚动
            this.headerScroll = new BScroll(this.$refs.menuHeaderWrapper, {
                click: true,//打开点击事件
                scrollX: true
            });

            //初始化菜单列表滚动
            this.menusScroll = new BScroll(this.$refs.menuListWrapper, {
                click: true,
                probeType: 3
            });

            //初始化滚动条
            let _this = this;
            _this.menusScroll.on('scroll', (pos) => {
                _this.scrollY = Math.abs(Math.round(pos.y))
                for (let i = 0; i < _this.menuListHeight.length; i++) {
                    let height1 = _this.menuListHeight[i]
                    let height2 = _this.menuListHeight[i + 1]
                    if (!height2 || (_this.scrollY >= height1 && _this.scrollY < height2)) {
                        if (_this.replaceCuIndex) {//点击左边菜单
                            return _this.currentIndex;
                        } else {
                            let liList = _this.$refs.menuHeaderWrapper.querySelectorAll('li');
                            if (i != 0) {
                                this.isHide = true;
                                let el = liList[i - 1];
                                _this.headerScroll.scrollToElement(el, 300);
                            } else {
                                this.isHide = false;
                                _this.headerScroll.scrollTo(0, 0);
                            }
                            return _this.currentIndex = i;
                        }
                    }
                }
            })
        },
        headerWidth() { //初始化菜品分类宽度
            let liList = this.$refs.menuHeaderWrapper.querySelectorAll('li');
            let liWidth = liList[0].clientWidth + 35;
            for (let i = 0; i < liList.length; i++) {
                liWidth = liList[i].clientWidth + 35;
                this.menuHeaderWidth += liWidth;
            }
            this.menuHeaderWidth += 80;
            this.menuHeaderWidth = this.menuHeaderWidth + 'px';
            // this.menuHeaderWidth = liList.length * liWidth + 'px';
        },
        initMenuListHeight() {  //初始化菜品分类高度
            let menuList = this.$refs.menuListWrapper.querySelectorAll(".menu-list-hook");
            let height = 0;
            this.menuListHeight.push(height);
            for (let i = 0; i < menuList.length; i++) {
                let item = menuList[i];
                height += item.clientHeight;
                this.menuListHeight.push(height)
            }
        },
        selectMenu(index) { //选中菜品分类事件
            this.currentIndex = index;
            if (!this.replaceCuIndex) {
                this.replaceCuIndex = true;
            }
            let menuList = this.$refs.menuListWrapper.querySelectorAll(".menu-list-hook");
            let el = menuList[index];
            this.menusScroll.refresh();
            this.menusScroll.scrollToElement(el, 300)
        }
    }
}
</script>
<style lang="less">
@import "./udLayout.less";
</style>