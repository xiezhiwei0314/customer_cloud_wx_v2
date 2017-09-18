import http from './axios.js'
import mapAxios from './mapAxios.js'
let baseUrl = '/fastfood_wechat_v2'
//获取当前地址位置
function getAddress(location) {

  return mapAxios('get','https://restapi.amap.com/v3/geocode/regeo',{output:"json",location : location,key : "a064595ce2a07c934f505a79e6cf5272",radius:"1000",extensions:"all"})

}
//获取位置列表接口
function addressList (value,city) {

  return mapAxios('get','https://restapi.amap.com/v3/place/text',{keywords : value,city:city, output : "json", key : "a064595ce2a07c934f505a79e6cf5272"})
}




/*
  获取店铺所有菜单明细
  -------------------------------------
  params 参数解释 
  -> shopId  店铺id
  -> tableId 桌号id
*/
function getShopMenu (shopId,tableId) {
   return http('get',baseUrl + '/getShopMenu',{shopId:shopId,tableId:tableId})
}



/*
  获取店铺活动明细
  --------------------------------------
  params 参数解释 
  -> shopId  店铺id
*/ 

function getShopActivityList (shopId) {
  return http('get',baseUrl+'/getShopActivityList',{shopId:shopId})
}



export { getAddress ,addressList,getShopMenu,getShopActivityList}
