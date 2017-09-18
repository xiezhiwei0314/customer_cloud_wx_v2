<template>
    <div :class="{'small-menus':true,'hide-title':isHide}">
        <span class="search-box" v-if="goods.length>0" @click.stop.prevent="enterSearchDish">
            <span class="icon-search"></span>搜索</span>
        <div class="menu-sidebar" ref="menuWrapper">
            <ul>
                <li v-for="(menu,index) in goods" @click="selectMenu(index,$event)" :class="{'current':currentIndex==index,'menu-list-hook':true}" :key='index'>
                    {{menu.fsmenuclsname}}
                    <span class="num" v-show='ALL_MODEL[index].outCount>0'>{{ALL_MODEL[index].outCount}}</span>
                </li>
            </ul>
        </div>
        <div class="menu-lists" ref="foodsWrapper" @touchstart="replaceCuIndex=false">
            <ul>
                <li v-for="(menu,menuIndex) in goods" class="menu-list-hook" :key='menuIndex'>
                    <h2>{{menu.fsmenuclsname}}</h2>
                    <ul class="list-item">
                        <li v-for="(item,itemIndex) in menu.menuItemList" :key='itemIndex'>
                            <div v-for="(subItem,subIndex) in item.menuItemUnitList" :key="subIndex" v-if="subItem.fidefault">
                                <dish :activityList='activityList' :outIndex='menuIndex' :innerIndex='itemIndex' :menusid="menu.fsmenuclsid" :item="item" :itemExtra="subItem" @showDishDetial="showDishDetial" @showAttribute="showAttribute" ></dish>
                            </div>
                        </li>
                    </ul>
                </li>
                <!--<li class="menu-list-hook" v-show="goods.length>0"><h2>图片仅供参考 菜品请以实物为准</h2></li>-->
            </ul>
        </div>
        <cart :total="total" :activityPrice="activityPrice" @drop="drop($event)" @clearCart="clearCart()" :activityList="activityList"></cart>
        <foodAttribute ref="attrItem" :activityList='activityList' :food="attrifoods"  @selectAsk="selectAsk"></foodAttribute>
        <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>
        <balls ref="balls"></balls>
    </div>
</template>
<script>
import Vue from 'vue'
import BScroll from 'better-scroll'
import axios from 'axios'
import cart from '@/vistitorComponents/cart/cart.vue'
import foodAttribute from '@/vistitorComponents/foodAttribute/foodAttribute.vue'
import dishDetail from '@/pages/dishDetail/dishDetail.vue'
import dish from '@/vistitorComponents/dish/dish.vue'
import balls from '@/vistitorComponents/balls/balls.vue'
import mixin from '@/config/menuCommon.js'
import cutImg from '@/config/cutImg.js'
import { mapMutations, mapState } from 'vuex'

export default {
    name: 'smallMenus',
    mixins: [mixin],
    data() {
        return {
            shopId: '',
            showLoading: true,
            listHeight: [],//存储列表的高度
            sumMenuList: []//存储菜单的高度
        }
    },
    computed: {
        ...mapState([
            'ALL_MODEL', 'TOTAL_CART','IS_PAGE'
        ]),
    },
    watch :{
        IS_PAGE (value,oldval) {
            if(oldval == ""){
                return 
            }else{
                location.reload()
            }
           
        }
    },
    components: {
        foodAttribute,
        cart,
        dishDetail,
        dish,
        balls
    },
    created() {
        sessionStorage.removeItem('actFoods')
        this.$store.commit('CLEAR_TOTLA_CART')
        let tableId = this.$route.query.tableId;
        if(tableId == 'null' || !tableId) {
            tableId = ""
            sessionStorage.tableId = ""
        }
        this.shopId = this.$route.params.shopId; //获取shopId
        this.$store.commit('SAVE_IS_PAGE',this.shopId)
        this.$indicator.open('加载中...')  //加载中...
        this.$http('get', this.baseUrl + '/getShopMenu',
            {
                shopId: this.shopId,
                tableId : tableId
            }
        ).then((res) => {
            this.$indicator.close()
            let data = res;
            if (data.code == 200) {
                this.goods = res.model;
                let zzxGoods = res.model;
                //把外层和里层的菜都进行一个数量变量
                zzxGoods.forEach(item => {
                    Vue.set(item, 'outCount', 0)
                    item.menuItemList.forEach(item2 => {
                        Vue.set(item2, 'innerCount', 0)
                    })
                })
                this.$store.commit('SAVE_ALL_MODEL', zzxGoods)
                this.commonDishesList = res.model[0].menuItemList;
                this.menusid = res.model[0].fsmenuclsid;
                this.$nextTick(() => {
                    this.initScroll(); // 初始化scroll
                    this._calculateHeight(); // 初始化列表高度列表
                });
                let sellOutList = JSON.parse(localStorage.getItem("sellOutList"));//售罄菜品
            } else {
                alert(data.message);
                this.$indicator.close()
            }
        });

        //获取店铺活动
        this.getShopActivityList();
    },

    methods: {
        enterSearchDish () {
             sessionStorage.activityDish = JSON.stringify(this.activityList)
            this.$router.push({name:'searchDishes'})
           
        },
        initScroll() {
            //初始化侧边栏滚动
            this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                click: true//打开点击事件
            });
            //初始化菜单列表滚动
            this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
                click: true,
                probeType: 3
            });
            let _this = this;
            this.foodsScroll.on('scroll', (pos) => {
                _this.scrollY = Math.abs(Math.round(pos.y))
                for (let i = 0; i < _this.listHeight.length; i++) {
                    let height1 = _this.listHeight[i];
                    let height2 = _this.listHeight[i + 1];
                    if (!height2 || (_this.scrollY >= height1 && _this.scrollY < height2)) {
                        if (_this.replaceCuIndex) {//点击左边菜单
                            return _this.currentIndex;
                        } else {
                            let liList = _this.$refs.menuWrapper.querySelectorAll('li');
                            let el = liList[i - 1];
                            if (i != 0) {//判断是否滚动了一屏
                                _this.menuScroll.scrollToElement(el, 300);
                                this.isHide = true;
                            } else {
                                _this.menuScroll.scrollTo(0, 0);
                                this.isHide = false;
                            }
                            return _this.currentIndex = i;
                        }
                    }
                }
            })
        },
        //计算每个分类的高度
        _calculateHeight() {
            let foodList = this.$refs.foodsWrapper.getElementsByClassName('menu-list-hook')
            let height = 0;
            this.listHeight.push(height);
            for (let i = 0; i < foodList.length; i++) {
                let item = foodList[i];
                height += item.clientHeight;
                this.listHeight.push(height)
            }
        },
        //选择菜单
        selectMenu(index, enent) {
            this.currentIndex = index;
            if (!this.replaceCuIndex) {
                this.replaceCuIndex = true;
            }
            let foodList = this.$refs.foodsWrapper.getElementsByClassName('menu-list-hook')
            let el = foodList[index];
            //获取列表dom，并且滚动到对应位置 
            this.foodsScroll.refresh();
            this.foodsScroll.scrollToElement(el, 300)
        },
        //初始化购物车列表
        _initScroll() {
            this.foodlistScroll = new BScroll(this.$refs.foodlist, {
                click: true
            });
        }
    }
}
</script>
<style lang="less">
@import "./smallMenus.less";
</style>
