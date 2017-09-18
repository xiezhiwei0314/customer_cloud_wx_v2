 import {cloneObj} from '@/utils/untils.js'
const state = {
  LOCATION : null, //存储径尾度
  CITY_CODE : "",//存城市码
  CITY : "上海市",//存城市
  ADDRESS : "正在定位中..." , //存定位
  TITLE : "", //title设置
  EVALUATE_STATUS : "" ,//是否评价
  SHARE_MODEL : false,
  ATTR_BOX : false,//属性的显示，
  ATTR_BOX_DATA : {},//属性池里的数据
  TOTAL_CART : [],//选择后的价钱
  ALL_MODEL : [],//后台所有的菜品数据
  ALL_MODEL_COPY : [], //后台所有数据副本
  ACTIVITY_TIP : {}, //提示信息
  ACTIVITY_SHOW : false,
  CARD_SHOW : true,
  IS_PAGE : ""
}

export default state
