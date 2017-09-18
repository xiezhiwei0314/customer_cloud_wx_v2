import { Toast } from 'mint-ui';
import { Number } from "@/utils/money.js"
//判断当前时间段是否在某个时间段内
function timeRange(beginTime, endTime) {
    let flag = false;
    let str_b_t = beginTime.split(":");
    let str_e_t = endTime.split(":");
    // if (str_b_t.length != 2 ||str_e_t.length != 2) {  
    //     flag = false;  
    // }  
    var bt = new Date();
    var et = new Date();
    var nt = new Date();
    bt.setHours(str_b_t[0]);
    bt.setMinutes(str_b_t[1]);
    et.setHours(str_e_t[0]);
    et.setMinutes(str_e_t[1]);
    if (nt.getTime() - bt.getTime() > 0 && nt.getTime() - et.getTime() < 0) {
        flag = true;
    } else {
        // alert ("当前时间是：" + nt.getHours () + ":" + nt.getMinutes () + "，不在该时间范围内！");  
        flag = false;
    }
    return flag;
}


//时间进行格式化
function buildNowDate() {
    let date = new Date();
    let year = date.getFullYear();
    let month = (date.getMonth() + 1);
    if (month < 10) {
        month = "0" + month;
    }
    let day = date.getDate();
    if (day < 10) {
        day = "0" + day;
    }
    return year + "-" + month + "-" + day;
}

function isActivityLive(_week, _notusableHoliday, _notusableDate, _listPHoliday, _timeKind, _listMSection, _listMHour) {

    let resultFlag = false;
    //判断周几是否营业
    let _date = new Date();
    let _todayWeek = _date.getDay();//获取今天是星期几 0~6,0是星期日
    let _flag = false;//今天是否营业
    if (_todayWeek == 0) {
        if (_week[6] == 1) {
            _flag = true;//营业
        }
    } else {
        if (_week[_todayWeek - 1] == 1) {
            _flag = true;//营业
        }
    }
    if (_flag) {//今天营业(周几)
        let _flag2 = false;//今天是否在排除日期内
        // let _nowDay = _date.getFullYear()+'-'+(_date.getMonth()+1)+'-'+_date.getDate();
        let _nowDay = buildNowDate();
        if (_notusableDate) {//如果存在排除日期
            if (_notusableDate.indexOf(",") > -1) {
                _notusableDate.split(',').forEach(function (dd) {
                    if (dd == _nowDay) {
                        _flag2 = true;//今天在排除日起内
                    }
                })
            } else {
                if (_notusableDate == _nowDay) {
                    _flag2 = true;//今天在排除日起内
                }
            }
        }
        if (!_flag2) {//如果不存在排除日期或者今天不在排除日期内
            let _flag3 = false;//法定节假日是否适用
            if (_notusableHoliday == 1) {//如果法定节假日适用
                if (_listPHoliday) {//判断今天是否在法定节假日排除的日期内
                    _listPHoliday.forEach(function (pholiday) {
                        if (pholiday == _nowDay) {
                            _flag3 = true;//今天在法定节假日排除内
                        }
                    })
                }
            }
            if (!_flag3) {//如果法定节假日也可以使用
                let _flag4 = false;//判断该时间段是否在餐段内
                if (_timeKind == 1) { //1=餐段/2=时段
                    if (_listMSection) {
                        _listMSection.forEach(function (mse) {
                            if (timeRange(mse.mBeginTime, mse.mEndTime)) {
                                _flag4 = true;//现在在餐段内
                            }
                        })
                    }
                } else if (_timeKind == 2) {
                    if (_listMHour) {
                        _listMHour.forEach(function (mh) {
                            if (timeRange(mh.beginTime, mh.endTime)) {
                                _flag4 = true;//现在在餐段内
                            }
                        })
                    }
                } else if (_timeKind == 3) {//全天
                    _flag4 = true;
                }
                if (_flag4) {//如果当前符合就餐时间段
                    resultFlag = true;
                }
            }
        }
    }
    return resultFlag;
}

function isNewCustomer(activityList) {
    console.log('activityList' + activityList)
    if (!activityList) {
        return false
    }
    console.log('fdsafdsafdsfdsafdsafds')
    let _activityNewCustomer = activityList.activityNewCustomerResponse;//新客多点对象
    if (_activityNewCustomer && _activityNewCustomer.boolFirstActivity == 1) {
        if (_activityNewCustomer.discountType == 1) {
            return true
        }
    }
    return false
}


function isBigPlay(activityList) {
    if (!activityList) {
        return false
    }
    let _activityNewCustomer = activityList.activityBuygiftItemListResponse;//新客多点对象
    if (_activityNewCustomer && (_activityNewCustomer[0].bargainKind == "301" || _activityNewCustomer[0].bargainKind == "302")) {
        return true
    } else {
        return false
    }

}

function isCutMoney(activityList) {
    if (!activityList) {
        return false
    }
    let _activityCutMoneyListResponse = activityList.activityCutMoneyListResponse;//生意好点
    if (_activityCutMoneyListResponse) {
        return true
    } else {
        return false
    }
}

//新客多点活动算法
/** 
  boolFirstActivity //0代表是老客，1代表是新客
  discountType //1代表减价,2代表送菜
  totalPrice //传入的价格
**/
function activityNewCustomer(boolFirstActivity, discountType, totalPrice, discountAmountOrItemId) {
    if (boolFirstActivity == 1) {
        if (discountType == 1) {
            let calcutate = Number(totalPrice) - Number(discountAmountOrItemId)
            if (calcutate < 0) {
                return 0
            } else {
                return calcutate
            }
        }
    }
    return totalPrice
}


//生意好点

function activityCutMoneyListResponse(_activityCutMoneyList, totalBargainPrice, Vue) {
    if (_activityCutMoneyList) {
        let mytotalPrice = totalBargainPrice
        let flag = false;
        let flag2 = false;
        for (let i = 0; i < _activityCutMoneyList.length; i++) {

            let item = _activityCutMoneyList[i]
            let _kind = item.bargainKind;//活动类型
            let _bargainValue = item.bargainValue;//赠菜，减价，折扣，购菜
            let _fullMoney = item.fullMoney;//满价
            let _week = item.planTypeValue.split(",");//营业日期，星期几
            let _notusableDate = item.notusableDate;//不适用日期
            let _notusableHoliday = item.notusableHoliday;//法定节假日不适用;0=false不适用/1=true使用
            let _listPHoliday = item.listPHolidayResponse;//如果法定节假日优惠，则法定节假日排除的日期
            let _timeKind = item.timeKind;//执行时间段方式 1=餐段/2=时段 / 3=不限 ;预设3 
            let _listMSection = item.listMSectionResponse;//营业餐段
            let _listMHour = item.listMHourResponse;//营业时段

            let _isTrue = isActivityLive(_week, _notusableHoliday, _notusableDate, _listPHoliday, _timeKind, _listMSection, _listMHour);
            console.log('时间是否到了' + _isTrue)
            if (_isTrue) {
                if (_kind == 202) {
                    if (!flag) {
                        if (_fullMoney > totalBargainPrice) {
                            let activityPrice = {
                                minusMoney: (Number(_fullMoney) - Number(totalBargainPrice)).toFixed(2),
                                bargainValue: parseInt(_bargainValue),
                                type: 202
                            }
                            Vue.$store.commit('SAVE_ACTIVITY_SHOW', true)
                            Vue.$store.commit('SAVE_ACTIVITY_TIP', activityPrice)
                            flag = true;
                        } else {
                            Vue.$store.commit('SAVE_ACTIVITY_SHOW', false)
                            mytotalPrice = Number(totalBargainPrice) - Number(_bargainValue)

                        }
                        if (mytotalPrice <= 0) {
                            Vue.$store.commit('SAVE_ACTIVITY_SHOW', false)
                        }
                    }

                } else if (_kind == 203) {

                    if (!flag2) {
                        if (_fullMoney > totalBargainPrice) {
                            let activityPrice = {
                                minusMoney: (Number(_fullMoney) - Number(totalBargainPrice)).toFixed(2),
                                bargainValue: _bargainValue / 10,
                                type: 203
                            }
                            Vue.$store.commit('SAVE_ACTIVITY_SHOW', true)
                            Vue.$store.commit('SAVE_ACTIVITY_TIP', activityPrice)
                            flag2 = true
                        } else {
                            Vue.$store.commit('SAVE_ACTIVITY_SHOW', false)
                            // let _resultDiscount = Number(totalBargainPrice * (100 - _bargainValue) / 100);
                            // mytotalPrice = Number(totalBargainPrice) - Number(_resultDiscount);

                            mytotalPrice = Number(mytotalPrice * _bargainValue/100).toFixed(2)

                        }
                        if (mytotalPrice <= 0) {

                            Vue.$store.commit('SAVE_ACTIVITY_SHOW', false)
                        }
                    }

                }
            }
        }
        return mytotalPrice

    }
    return totalBargainPrice
}

//打造爆炸款提示
function activityBuygiftItemListTip(_activityBuygiftItemList, fsitemid, fsorderunit, TOTAL_CART) {
    let _dishesCount = 0;
    let _fdsaleprice = 0
    if (_activityBuygiftItemList) {
        _activityBuygiftItemList.forEach((item, index) => {
            let _kind = item.bargainKind;//活动类型
            let _bargainValue = item.bargainValue;//赠菜，减价，折扣，购菜
            let _fullMoney = item.fullMoney;//满价
            let _week = item.planTypeValue.split(",");//营业日期，星期几
            let _notusableDate = item.notusableDate;//不适用日期
            let _notusableHoliday = item.notusableHoliday;//法定节假日不适用;0=false不适用/1=true使用
            let _listPHoliday = item.listPHolidayResponse;//如果法定节假日优惠，则法定节假日排除的日期
            let _timeKind = item.timeKind;//执行时间段方式 1=餐段/2=时段 / 3=不限 ;预设3 
            let _listMSection = item.listMSectionResponse;//营业餐段
            let _listMHour = item.listMHourResponse;//营业时段
            let _isTrue = isActivityLive(_week, _notusableHoliday, _notusableDate, _listPHoliday, _timeKind, _listMSection, _listMHour);
            let _minusCount = 0
            if (_isTrue) {
                if (item.itemId == fsitemid && item.orderUnit == fsorderunit) {
                    TOTAL_CART.forEach(item2 => {
                        if (item2.fsitemid == fsitemid && item2.fsorderunit == fsorderunit) {
                            _dishesCount += item2.unitTotal
                            _fdsaleprice = item2.unitOrginPrice
                        }
                    })
                    if (_kind == 301) {//301=买几赠几(变价) / 302=第几件半价(折扣) ,
                        if (_dishesCount % item.saleQty != 0) {//如果点了菜 //如果份数小于规定份数
                            _minusCount = item.saleQty - _dishesCount % item.saleQty;
                            let _text301 = item.dishName + '买' + item.saleQty + '送' + item.saleQtyGift + '，再买' + _minusCount + item.orderUnit + '送' + item.saleQtyGift + item.orderUnit;
                            Toast({
                                message: _text301,
                                duration: 2000
                            });
                        }

                    } else if (_kind == 302) {
                        if (_dishesCount > 0) {//如果点了菜
                            let _resultQty = parseInt(item.saleQty + item.saleQtyGift);
                            if (_dishesCount % _resultQty != 0) {//如果份数小于规定份数（第四件5折则，saleQty=3,saleQtyGift=1）
                                _minusCount = _resultQty - _dishesCount % _resultQty;
                                let _text302 = item.dishName + '第' + _resultQty + item.orderUnit + item.bargainValue / 10 + '折，再买' + _minusCount + item.orderUnit + '打' + item.bargainValue / 10 + '折';
                                Toast({
                                    message: _text302,
                                    duration: 2000
                                });
                            }

                        }
                    }
                }


            }
        })
    }

}



//打造爆款计算
function activityBuygiftItemList(_activityBuygiftItemList, totalBargainPrice, TOTAL_CART, flagdis) {
    let newTotal = []
    let arrTotal = []
    let allTotal = totalBargainPrice
    TOTAL_CART.forEach(item => {
        TOTAL_CART.forEach(item2 => {
            if (item.fsorderunit == item2.fsorderunit && item.fsitemid == item2.fsitemid) {
                newTotal.push({ fsorderunit: item2.fsorderunit, fsitemid: item2.fsitemid, unitOrginPrice: item2.unitOrginPrice })
            }
        })
    })

    function obj2key(obj, keys) {
        var n = keys.length,
            key = [];
        while (n--) {
            key.push(obj[keys[n]]);
        }
        return key.join('|');
    }
    function uniqeByKeys(array, keys) {
        var arr = [];
        var hash = {};
        for (var i = 0, j = array.length; i < j; i++) {
            var k = obj2key(array[i], keys);
            if (!(k in hash)) {
                hash[k] = true;
                arr.push(array[i]);
            }
        }

        // console.log(arr)
        // console.log(TOTAL_CART)
        arr.forEach(item => {
            TOTAL_CART.forEach(item2 => {
                if (item.fsorderunit == item2.fsorderunit && item.fsitemid == item2.fsitemid) {
                    if (item.unitTotal == undefined) { item.unitTotal = 0 }

                    item.unitTotal += item2.unitTotal
                }
            })
        })


        console.log(arr)
        return arr;
    }
    var arr = uniqeByKeys(newTotal, ['fsorderunit', 'fsitemid']);

    localStorage.setItem('actFoods', JSON.stringify(arr))
    if (_activityBuygiftItemList) {
        _activityBuygiftItemList.forEach((item, index) => {
            let _kind = item.bargainKind;//活动类型
            let _bargainValue = item.bargainValue;//赠菜，减价，折扣，购菜
            let _fullMoney = item.fullMoney;//满价
            let _week = item.planTypeValue.split(",");//营业日期，星期几
            let _notusableDate = item.notusableDate;//不适用日期
            let _notusableHoliday = item.notusableHoliday;//法定节假日不适用;0=false不适用/1=true使用
            let _listPHoliday = item.listPHolidayResponse;//如果法定节假日优惠，则法定节假日排除的日期
            let _timeKind = item.timeKind;//执行时间段方式 1=餐段/2=时段 / 3=不限 ;预设3 
            let _listMSection = item.listMSectionResponse;//营业餐段
            let _listMHour = item.listMHourResponse;//营业时段
            let _isTrue = isActivityLive(_week, _notusableHoliday, _notusableDate, _listPHoliday, _timeKind, _listMSection, _listMHour);
            let _minusCount = 0
            let _resultQty = 0
            if (_isTrue) {
                let _dishesCount = 0;
                let _fdsaleprice = 0
                arr.forEach(item2 => {

                    if (item2.fsitemid == item.itemId && item2.fsorderunit == item.orderUnit) {
                        console.log(item2.fsitemid, item.itemId)


                        _dishesCount = item2.unitTotal
                        _fdsaleprice = item2.unitOrginPrice
                        if (_kind == '302') {
                            if (_dishesCount > 0) {
                                let _resultQty = parseInt(item.saleQty + item.saleQtyGift);
                                let _orderCount = parseInt(_dishesCount / _resultQty);
                                console.log("__resultQty" + _resultQty)
                                console.log("_dishesCount" + _dishesCount)
                                console.log('_orderCount' + _orderCount)
                                if (_dishesCount > 0 && _orderCount > 0) {
                                    
                                    let _nowPrice = Number((_dishesCount-_orderCount)*_fdsaleprice + _orderCount*item.bargainValue/100*_fdsaleprice).toFixed(2)
                                    allTotal = Number(allTotal) -(Number(_dishesCount*_fdsaleprice) - Number(_nowPrice))
                                    if (allTotal < 0) {
                                        allTotal = 0
                                    }
                                }
                            }
                        }
                        if (_kind == '301' && flagdis == 1) {
                            let _orderCount = parseInt(_dishesCount / item.saleQty);
                            if (_dishesCount > 0 && _orderCount > 0) {
                                let _resultDiscount = _fdsaleprice * _orderCount * item.saleQtyGift;
                                if (_resultDiscount <= 0.005) {
                                    _resultDiscount = 0;
                                }

                                console.log('resultDiscount' + parseFloat(_resultDiscount.toFixed(2)))
                                allTotal = Number(Number(allTotal).toFixed(2)) + Number(Number(_resultDiscount.toFixed(2)));
                            }
                        }
                    }
                })
            }

        })
        return allTotal
    }

}










function totalCalcutateDis(activityList, totalPrice, Vue, TOTAL_CART) {
    let mytotalPrice = totalPrice
    let flagdis = 1 //代表是打折价过来
    if (activityList) {
        let _activityBuygiftItemList = activityList.activityBuygiftItemListResponse;//打造爆款对象
        if (_activityBuygiftItemList && _activityBuygiftItemList[0].bargainKind == '301') {
            mytotalPrice = activityBuygiftItemList(_activityBuygiftItemList, mytotalPrice, TOTAL_CART, flagdis)
        }
        return mytotalPrice
    }
    return mytotalPrice
}




function totalCalcutate(activityList, totalPrice, Vue, TOTAL_CART) {

    let mytotalPrice = totalPrice
    if (activityList) {
        let _activityOrder = activityList.listBargainClsOrderResponse//活动顺序对象
        let _activityBuygiftItemList = activityList.activityBuygiftItemListResponse;//打造爆款对象
        let _activityCutMoneyList = activityList.activityCutMoneyListResponse;//生意好点对象
        let _activityNewCustomer = activityList.activityNewCustomerResponse;//新客多点对象
        console.log('fffffff' + _activityNewCustomer)
        if (_activityNewCustomer) {
            mytotalPrice = activityNewCustomer(_activityNewCustomer.boolFirstActivity, _activityNewCustomer.discountType, totalPrice, _activityNewCustomer.discountAmountOrItemId)
        }

        //console.log('bbbbbb' + mytotalPrice)
        if (_activityBuygiftItemList) {
            mytotalPrice = activityBuygiftItemList(_activityBuygiftItemList, mytotalPrice, TOTAL_CART)
        }
        if (_activityCutMoneyList) {
            mytotalPrice = activityCutMoneyListResponse(_activityCutMoneyList, mytotalPrice, Vue)//生意好点
        }
    }
    return mytotalPrice

}

export { totalCalcutate, activityBuygiftItemListTip, isNewCustomer, isBigPlay, totalCalcutateDis, isCutMoney }