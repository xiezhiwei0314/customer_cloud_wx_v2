/*
* created 变量和过程说明
  this.shopId => 从url地址params拿到shopid 
  this.tableId => 从url 地址query拿到tableId
  localStorage.token =>把token传入到localStorage里，进行全局共用
  --------------------------
* data 数据说明
  isHide 在滚动时是否隐藏头部  deafult : false  
  currentIndex  滚动时当前下标
  tableId  桌号ID
  shopId  店铺ID
  goods 商品列表
  activityList 头部活动列表
*/

import {getShopActivityList} from '@/config/api.js'
let layoutMixin = {
    created () {
        localStorage.token = this.$route.params.token;
        this.shopId = this.$route.params.shopId;
        this.tableId = this.$route.query.tableId;
        getShopActivityList(this.shopId).then(res=>{
            this.activityList = res.model;
        })
    },
    data () {
        return {
             isHide : false,
             currentIndex : "",
             tableId : '',
             shopId: '',
             goods : [],
             activityList : {}
        }
    }
}


export {layoutMixin}