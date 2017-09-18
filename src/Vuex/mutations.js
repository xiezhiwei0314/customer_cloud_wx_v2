import Vue from 'vue'
import {
  SAVE_LOCATION,
  SAVE_CITY_CODE,
  SAVE_ADDRESS,
  SAVE_CITY,
  SAVE_TITLE,
  CHANGE_EVALUATESTATUS,
  SAVE_SHOP_STATUS,
  CHANGE_SHARE_MODEL,
  CHANGE_ATTR_BOX,
  SAVE_ATTR_BOX_DATA,
  CHANGE_ATTR_BOX_DATA,
  CLEAR_ATTR_BOX_DATA,
  CHANGE_ATTR_BOX_DATA2,
  CHANGE_TOTAL_CART,
  ADD_ITEM_COUNT,
  REDUCE_ITEM_COUNT,
  CLEAR_ITEM_COUNT,
  SAVE_ALL_MODEL,
  CHANGE_COUNT,
  REDUCE_MODE_COUNT,
  CLEAR_ALL_MODEL,
  REDUCE_ITEM2_COUNT,
  SAVE_ACTIVITY_TIP,
  SAVE_ACTIVITY_SHOW,
  CHANGE_CARD_SHOW,
  CLEAR_TOTLA_CART,
  SAVE_IS_PAGE
} from './mutation-types.js'

export default {
  //存径尾度
  [SAVE_LOCATION](state, location) {
    state.LOCATION = location
  },
  //存城市码
  [SAVE_CITY_CODE](state, citycode) {
    state.CITY_CODE = citycode
  },
  //存当前地址
  [SAVE_ADDRESS](state, address) {
    state.ADDRESS = address
  },
  //存城市地址
  [SAVE_CITY](state, city) {
    state.CITY = city
  },
  [SAVE_TITLE](state, title) {
    state.TITLE = title
  },
  [CHANGE_EVALUATESTATUS](state, number) {
    state.EVALUATE_STATUS = number
  },
  [SAVE_SHOP_STATUS](state, shopstatus) {
    state.SHOP_STATUS = shopstatus
  },
  [CHANGE_SHARE_MODEL](state, param) {
    state.SHARE_MODEL = param
  },
  [CHANGE_ATTR_BOX](state, flag) {
    state.ATTR_BOX = flag
  },
  [SAVE_ATTR_BOX_DATA](state, obj) {
    state.ATTR_BOX_DATA = {}
    state.ATTR_BOX_DATA.menuItemUnitList = obj.menuItemUnitList;
    state.ATTR_BOX_DATA.menuItemAskGroupOutVoList = obj.menuItemAskGroupOutVoList
    state.ATTR_BOX_DATA.fsitemname = obj.fsitemname
    state.ATTR_BOX_DATA.outIndex = obj.outIndex
    state.ATTR_BOX_DATA.innerIndex = obj.innerIndex
    state.ATTR_BOX_DATA.fsitemid = obj.fsitemid
  },
  [CLEAR_ATTR_BOX_DATA](state, flag) {
    state.ATTR_BOX_DATA.menuItemUnitList = flag
  },
  [CHANGE_ATTR_BOX_DATA](state, index) {
    let menuItemUnitList = state.ATTR_BOX_DATA.menuItemUnitList
    menuItemUnitList.forEach((item, index2) => {
      if (index2 == index) {
        menuItemUnitList[index2].fidefault = 1
      } else {
        menuItemUnitList[index2].fidefault = 0
      }
    })
  },
  [CHANGE_ATTR_BOX_DATA2](state, obj) {
    let menuItemAskGroupOutVoList = state.ATTR_BOX_DATA.menuItemAskGroupOutVoList
    menuItemAskGroupOutVoList.forEach((item, index) => {
      if (index == obj.index1) {
        let menuItemAskOutVoList = menuItemAskGroupOutVoList[index].menuItemAskOutVoList
        menuItemAskOutVoList.forEach((item2, index2) => {
          if (index2 == obj.index2) {
            if (item2.fidefault == 1) {
              item2.fidefault = 0
            } else {
              item2.fidefault = 1
            }
          }
        })
      }
    })
  },
  [CHANGE_TOTAL_CART](state, obj) {
    state.TOTAL_CART.push(obj)
  },
  [ADD_ITEM_COUNT](state, index) {
    state.TOTAL_CART[index].unitTotal += 1
  },
  [REDUCE_ITEM_COUNT](state, index) {
    //state.TOTAL_CART[index].unitTotal -=1
    let unitTotal = state.TOTAL_CART[index].unitTotal
    if (unitTotal == 1) {
      state.TOTAL_CART.splice(index, 1)
    } else {
      state.TOTAL_CART[index].unitTotal -= 1
    }
  },
  [CLEAR_ITEM_COUNT](state) {
    state.TOTAL_CART = []
  },
  [SAVE_ALL_MODEL](state, array) {
    state.ALL_MODEL = array
  },
  [CHANGE_COUNT](state, obj) {   //多种样式选择
    state.ALL_MODEL.forEach((item, index1) => {
      if (!item.fsmenuclsid) {
        item.menuItemList.forEach((item2, index2) => {
          if (item2.fsitemid == obj.fsitemid) {
            item2.innerCount += 1
          }
        })
      } else {
        item.menuItemList.forEach((item2, index2) => {
          if (item2.fsitemid == obj.fsitemid) {
            item2.innerCount += 1
            item.outCount+=1
          }
          
        })
        
      }
    })
  },
  [REDUCE_MODE_COUNT](state, obj) {
    state.ALL_MODEL.forEach((item, index1) => {
      if (!item.fsmenuclsid) {
        item.menuItemList.forEach((item2, index2) => {
          if (item2.fsitemid == obj.fsitemid) {
            item2.innerCount -= 1
          }
        })
      } else {

        item.menuItemList.forEach((item2, index2) => {
          if (item2.fsitemid == obj.fsitemid) {
            item2.innerCount -= 1
            item.outCount-=1
          }
          
        })
        
      }
    })
  },

  [CLEAR_ALL_MODEL](state) {
    state.ALL_MODEL.forEach(item => {
      item.outCount = 0;
      item.menuItemList.forEach(item2 => {
        item2.innerCount = 0
      })
    })
  },
  [REDUCE_ITEM2_COUNT](state, obj) {
    state.TOTAL_CART.forEach((item, index) => {
      if (item.fsitemid == obj.fsitemid) {
        let unitTotal = state.TOTAL_CART[index].unitTotal
        if (unitTotal == 1) {
          state.TOTAL_CART.splice(index, 1)
        } else {
          state.TOTAL_CART[index].unitTotal -= 1
        }
      }
    })
  },
  [SAVE_ACTIVITY_TIP](state, obj) {
    state.ACTIVITY_TIP = obj
  },
  [SAVE_ACTIVITY_SHOW] (state,flag) {
    state.ACTIVITY_SHOW = flag
  },
  [CHANGE_CARD_SHOW] (state,flag) {
    state.CARD_SHOW = flag
  },
  [CLEAR_TOTLA_CART] (state,flag) {
    state.TOTAL_CART = []
  },
  [SAVE_IS_PAGE] (state,flag) {
    state.IS_PAGE = flag
  }
}
