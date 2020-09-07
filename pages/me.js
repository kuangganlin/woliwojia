var app = getApp();
var util = require("../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.globalData.loginUserInfo,
    authSetting:app.globalData.authSetting,
    authSettingHide: app.globalData.authSetting,
    authSetting_mobile: app.globalData.authSetting_mobile,
    authSetting_mobileHide: app.globalData.authSetting_mobile,
    statisticsInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('aaaaaa');
    console.log(app.globalData.authSetting);
    console.log('bbbbb');
    console.log(app.globalData.loginUserInfo);
    var that=this;
    app.getUersInfoNew(function () {
      that.setData({
        userInfo: app.globalData.loginUserInfo,
      });
      
      if (!(util.dataUtil.isNullData(app.globalData.loginUserInfo.nickname) && util.dataUtil.isNullData(app.globalData.loginUserInfo.head_pic))) {//如果头像 和 昵称不为空，表示以前授权过
        that.setData({
          authSettingHide: true,
          authSetting: 1,

        });
      } 
      if (!util.dataUtil.isNullData(app.globalData.loginUserInfo.mobile)) {//电话不为空，表示以前授权过
        that.setData({
          authSetting_mobileHide: true,
          authSetting_mobile:1,

        });
      } 
      



    })
  },
  /**
   *用户统计数据
   */
  getUserStatistics: function (res) {
    var that = this;
    var postData = {};
    postData.user_id = app.globalData.loginUserInfo.user_id;
    util.httpUtil.httpPost(util.httpUtil.url.GetUserStatistics_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        if (!util.dataUtil.isNullData(res.data)) {
          that.setData({
            statisticsInfo: res.data,
          })
        }
      }
    }, function (res) {
    }, function (res) {
    });
  },
  get_personal_information:function(){
    wx.navigateTo({
      url: 'personal_information',
    })
  }
  ,
  //取消用户头像信息授权
  getUserNicknameCancelOnClick: function (res) {
    this.setData({
      authSettingHide: true,

    });
  },
  //取消用户电话信息授权
  getUserTelCancelOnClick: function (res) {
    this.setData({
      authSetting_mobileHide: true,
      authSettingHide: true,
    });
  },
  //授权登录
  handleUserInfo:function(){
    console.log("授权登录");
    var that=this;
    app.wxLogin(function(){
      app.getUersInfoNew(function () {
        that.setData({
          userInfo: app.globalData.loginUserInfo,
        })
      })
      that.setData({
        userInfo: app.globalData.loginUserInfo,
        authSetting: app.globalData.authSetting,
        authSettingHide:1,
      }); 
    });
  },
  //手机号码授权注册
  getPhoneNumberInfo: function (res) {
    var that=this;
    console.log("xxx:"+JSON.stringify(res));
    if (!(util.dataUtil.isNullData(res.detail.iv) || util.dataUtil.isNullData(res.detail.encryptedData))) {
      app.wxLogin(function () {
        app.getUersInfoNew(function () {
          that.setData({
            userInfo: app.globalData.loginUserInfo,
          })
        })
      that.setData({
        authSetting_mobile:1,
        authSetting_mobileHide:true

      })
      })
      app.wxGetUserPhone(res.detail, function (res) {

      });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    app.getUersInfoNew(function () {
      that.setData({
        userInfo: app.globalData.loginUserInfo,
      })
    })

    that.getUserStatistics();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})