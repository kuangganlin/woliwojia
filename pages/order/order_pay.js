// pages/pay.js
import { $wuxKeyBoard } from '../../libs/wux'
var app = getApp();
var util = require("../../utils/util.js");
var md5Util = require('../../utils/md5_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageType:1,//1:返回上一个页面  2：返回首页
    tradeUnit: app.globalData.tradeUnit,
    payType: 1, //支付方式，1是微信，4是婴淘
    orderInfo:{},
    orderNo: "",//2018071200212589365
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (util.dataUtil.isNullData(options.orderNo) && util.dataUtil.isNullData(options.orderInfo)) {
      util.viewUtil.showModal("提示", "没有传递支付订单号", function (res) {
        wx.navigateBack({});
      })
      return;
    } else {
      this.data.orderNo = options.orderNo;
      this.data.orderInfo = options.orderInfo;
    }
    if (util.dataUtil.isNullData(this.data.orderInfo)) {
      this.getOrderInfo();
    } else {
      that.setData({
        orderInfo:JSON.parse( this.data.orderInfo)
      })
    }
    // this.getOrderInfo();
    
  },
  /**
   * 取得单个订单信息
   */
  getOrderInfo: function () {
    var that = this;
    var postData = {};
    if (util.dataUtil.isNullData(app.globalData.loginUserInfo)) {
      util.viewUtil.showToastNone('没有登录账号');
      return;
    } else {
      postData.user_id = app.globalData.loginUserInfo.user_id;
    }
    postData.order_no = this.data.orderNo;
    util.httpUtil.httpGet(util.httpUtil.url.GetOrderInfo_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        if (!util.dataUtil.isNullData(res.data)) {
          that.data.orderInfo = res.data;
          
          that.setData({ orderInfo: that.data.orderInfo });
        } else{
          util.viewUtil.showToastNone(res.msg);
        }
      }else{
        util.viewUtil.showToastNone(res.msg);
      } 
    }, function (res) {
    }, function (res) {
    });
  },
  /**
   * 选择支付方式
   */
  selectPayType:function(e){
    this.setData({
      payType: e.currentTarget.dataset.paytype
    });
    
  },
  

  payGoodsBindtap:function(res){
    this.payGoodsHandle();
  },
  /**
    * 支付
   */
  payGoodsHandle: function () {
    if (util.dataUtil.isNullData(this.data.orderInfo)) {
      util.viewUtil.showToastNone("没有支付信息");
      return;
    }
    var that = this;
    var postData = {};
    postData.order_no = this.data.orderInfo.order_no;
    postData.open_id = app.globalData.loginUserInfo.wx_openid;
    postData.user_id = app.globalData.loginUserInfo.user_id;
    postData.pay_type = that.data.payType;
    if (postData.pay_type == 1) {//微信
      that.payGoods(postData);
    } else if (postData.pay_type == 4) {//婴淘
      if (app.isSetPayPassword(that.data.orderInfo.order_ytao_price)) {
        var keyboard = $wuxKeyBoard.show({
          callback(value) {
            postData.pay_password = md5Util.hexMD5(value);
            that.payGoods(postData);
            return true;
          },
        });
      }
    }
  },

  payGoods: function (postData) {
    var that = this;
    //console.log(postData);
    util.httpUtil.httpPost(util.httpUtil.url.PayGoods_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        if (postData.pay_type == 1) {//现金支付
          if (!util.dataUtil.isNullData(res.data)) {
            app.wxPay(res.data, function (res) {
              that.payGoodsResult();
            }, function (res) {
              util.viewUtil.showToastNone("支付失败");
            });
          }
        } else if (postData.pay_type == 4) {//婴淘支付
          that.payGoodsResult();
        }
      }
      util.viewUtil.showToastNone(res.msg,2000);
    }, function (res) {
    }, function (res) {
    });
  },

  /**
   * 返回上一页
   */
  payGoodsResult: function (index) {
    //支付成功发送短信
    var that = this;
    //that.sendSms();

    if (this.data.pageType == 1){
      var pages = getCurrentPages();//所有页面栈
      var prevPage = pages[pages.length - 2];  //上一个页面
      if (!util.dataUtil.isNull(prevPage)){
        wx.navigateBack({});
        if (typeof prevPage.orderPayResult === 'function') {
          prevPage.orderPayResult();
        }
      }
    }else{
      var pages = getCurrentPages();
      var mainPage = pages[0]; //上一个页面
      wx.navigateBack({ delta: pages.length });
      if (typeof mainPage.myOrderSuccess === 'function') {
        mainPage.myOrderSuccess();
      }
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
    return app.shareHome();
  }
})