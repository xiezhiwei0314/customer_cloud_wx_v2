<template>
  <div class="person-center">
    <!--<router-link :to="{name:updateInfo}">-->
      <div class="header">
        <div class="header-logo">
          <img src="../../assets/default_head.png" v-if="!user.headImgUrl">
          <img :src="user.headImgUrl" v-if="user.headImgUrl">
        </div>
        
        <div class="user-info">
          <p class="username">{{ user.nickname?user.nickname:'游客'}}</p>
          <p class="intro" v-if="user.phone">{{user.phone}}</p>
          <p class="intro" v-if="!user.phone">未绑定</p>
        </div>
        <!-- <div class="arrow">
           <img src="../../assets/arrow.png">
        </div> -->
      </div>
    <!--</router-link>-->

      <div class="order-count">
        <router-link :to="{ name: order}">
           <div class="row bottom-line">
            <div class="float-left">
               <img src="../../assets/my_order.png" class="my-order-icon icon">
               <span>我的订单</span>
             </div>
             <div class="float-right">
               <span class="col999" v-if="user.orderNum">{{user.orderNum}}条</span>
               <span class="col999" v-if="!user.orderNum">暂无</span>
               <img src="../../assets/arrow.png" class="arrow">
             </div>
           </div>
         </router-link>

         <router-link :to="{name:serviceRecord}">
           <div class="row">
            <div class="float-left">
               <img src="../../assets/clock.png" class="clock icon">
               <span>服务记录</span>
             </div>
              <div class="float-right">
               <span class="col999">暂无</span>
               <img src="../../assets/arrow.png" class="arrow">
             </div>
           </div>
         </router-link>
      </div>

      <router-link :to="{name:myCollection}">
        <div class="my-file">
           <div class="row">
            <div class="float-left">
               <img src="../../assets/star.png" class="star icon">
               <span>我的收藏</span>
             </div>
              <div class="float-right">
               <span class="col999" v-if="user.shopNum">{{user.shopNum}}条</span>
               <span class="col999" v-if="!user.shopNum">暂无</span>
               <img src="../../assets/arrow.png" class="arrow">
             </div>
           </div>
        </div>
      </router-link>
       <transition name="router-slid" mode="out-in">
            <router-view></router-view>
        </transition>

   </div>
</template>

<script>
  const SUCCESS = 200;
  export default {
    data () {
      return {
        user: {},
        order : "order",
        myCollection :"myCollection",
        serviceRecord : "serviceRecord",
        updateInfo : "updateInfo",
        enterPersonCenterFlag : ""
      }
    },
    methods : {
      enterUpdateInfo () {
           this.$router.push({name:this.updateInfo,query:{enterPersonCenterFlag:this.enterPersonCenterFlag}})
      }
    },
    created() {
      this.$store.commit('SAVE_TITLE','个人中心');

      let token = this.$route.query.token;
      //console.log('token'+token)
      let enterPersonCenterFlag = this.$route.query.enterPersonCenterFlag
      this.enterPersonCenterFlag = enterPersonCenterFlag
      console.log("enterPersonCenterFlag"+enterPersonCenterFlag)
      if(token || enterPersonCenterFlag == 1) {

        this.order = 'order2',
        this.updateInfo = 'updateInfo2'
        this.myCollection = 'myCollection2'
        this.serviceRecord = 'serviceRecord2'
      }
      if(token){
        console.log("从地址栏获取的token:"+token);
        localStorage.token = token;
      }
      this.$http("get",this.baseUrl + '/getUserInfo').then((response) => {
        if(response.code==SUCCESS){
          this.user = response.model;
          // window.localStorage.setItem('user', JSON.stringify(this.user));
        }
      });
    }
  }
</script>

<style lang="less">
  @import './personCenter.less';
</style>
