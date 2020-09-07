// pages/checkorder.js
import { $wuxCountDown } from '../libs/wux';
const app = getApp();
var util = require("../utils/util.js");
var dateExt = require("../utils/ext/date_ext.js");
Page({


  /**
   * 页面的初始数据
   */
  data: {
    userId: app.globalData.loginUserInfo.user_id,
    orderId: 0,
    orderInfo: {},
    orderCountDownDesc: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (util.dataUtil.isNullData(options.orderId)) {
      util.viewUtil.showModal("提示", "传递参数不正确!", function (res) {
        wx.navigateBack({});
      })
      return;
    }
    this.data.orderId = options.orderId;
    //更新userid
    if (util.dataUtil.isNullData(app.globalData.loginUserInfo)) {
      app.wxCheckSession(function () {
        if (!util.dataUtil.isNullData(app.globalData.loginUserInfo)) {
          that.setData({
            userId: app.globalData.loginUserInfo.user_id
          })
          that.getOrderInfo();
        }
      })
    } else {
      that.getOrderInfo();
    }



  },


  /**
   * 取得单个订单信息
   */
  getOrderInfo: function () {
    var that = this;
    var postData = {};
    postData.order_id = this.data.orderId;
    util.httpUtil.httpPost(util.httpUtil.url.GetOrderDetail_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        if (!util.dataUtil.isNullData(res.data)) {
          util.httpUtil.objectHttpUrlHandle(res.data.service_user_info, 'head_pic');
          util.httpUtil.objectHttpUrlHandle(res.data.order_file_list, 'file_path');
          util.httpUtil.objectHttpUrlHandle(res.data.order_file_list_success, 'file_path');
          //res.data.buy_user_info.showUserName = util.entityUtil.getShowUserName(res.data.buy_user_info);
         // util.httpUtil.objectHttpUrlHandle(res.data.seller_user_info, 'head_pic');
          //res.data.seller_user_info.showUserName = util.entityUtil.getShowUserName(res.data.seller_user_info);

          util.httpUtil.objectHttpUrlHandle(res.data.goods_info, 'goods_pic');

          that.setData({ orderInfo: res.data });

          //that.orderStatusCountDown();

        } else {
          util.viewUtil.showToastNone(res.msg);
        }
      } else {
        util.viewUtil.showToastNone(res.msg);
      }

    }, function (res) {
    }, function (res) {
      wx.stopPullDownRefresh();
    });

  },
  



  /**
   * 拨打电话
   */
  phoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.contact_tel,
      success: function () {
      },
    })
  },


  logisticsInfoBindtap: function (res) {
    var index = res.currentTarget.dataset.index;
    if (this.data.orderInfo.logistics_info != null && this.data.orderInfo.logistics_info.length > 0) {
      var logInfo = this.data.orderInfo.logistics_info[index];
      wx.navigateTo({
        url: '/pages/order/order_logistics_info?logsNo=' + logInfo.logs_no + "&logsCode=" + logInfo.logs_code + "&logsCompany=" + logInfo.logs_company,
      })
    }

  },

  /**
   * 评价 
   */
  evaluationOrderBindtap: function (res) {
    wx.navigateTo({
      url: '/pages/evaluation?orderId=' + this.data.orderInfo.order_id,
    })
  },
  orderEvaluationResult: function () {
    //取得单个订单信息
    this.getOrderInfo();
  },

  /**
   * 确认增加费用按钮
   */
  confirmAddOrderPriceBindtap: function (res) {
    var that = this;
    var order_id = res.target.dataset.order_id;
    util.viewUtil.showModal("提示", "确认是否增加费用,增加后不可恢复!", function (res) {
      if (res.confirm) {
        that.confirmAddOrderPriceHandle(order_id);
      }
    });
  },

  /**
   * 确认增加费用操作
   */
  confirmAddOrderPriceHandle: function (order_id) {
    var that = this;
    var postData = {};
    postData.order_id = order_id;
    postData.user_id = app.globalData.loginUserInfo.user_id;
    util.httpUtil.httpPost(util.httpUtil.url.ConfirmAddOrderPrice_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        //重新加载显示订单
        that.data.ordersPageIndex = 0;
        that.getOrderInfo();
      }
      util.viewUtil.showToastNone(res.msg);
    }, function (res) {
    }, function (res) {
    });
  },

  //2020-7-14 KuangGanLin
/**
   * 用户确认增加费用按钮--用户操作
   */
  confirmUserAddOrderPriceBindtap: function (res) {
    var that = this;
    var order_no = res.target.dataset.order_no;
    util.viewUtil.showModal("提示", "确认是否增加费用,增加后不可恢复!", function (res) {
      if (res.confirm) {
        that.confirmUserAddOrderPriceHandle(order_no);
      }
    });
  },

  /**
   * 用户确认增加费用操作--用户操作
   */
  confirmUserAddOrderPriceHandle: function (order_no) {
    var that = this;
    var postData = {};
    postData.order_no = order_no;
    postData.user_id = app.globalData.loginUserInfo.user_id;
    util.httpUtil.httpPost(util.httpUtil.url.ConfirmUserAddOrderPrice_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        //重新加载显示订单
        that.data.ordersPageIndex = 0;
        that.getOrderInfo();
      }
      util.viewUtil.showToastNone(res.msg);
    }, function (res) {
    }, function (res) {
    });
  },

  //2020-7-14 KuangGanLin--用户操作
/**
   * 用户不同意增加费用按钮--用户操作
   */
  unconfirmUserAddOrderPriceBindtap: function (res) {
    var that = this;
    var order_no = res.target.dataset.order_no;
    util.viewUtil.showModal("提示", "确认是否不同意,请与维修师傅重新协商!", function (res) {
      if (res.confirm) {
        that.unconfirmUserAddOrderPriceHandle(order_no);
      }
    });
  },

  /**
   * 用户不同意增加费用操作--用户操作
   */
  unconfirmUserAddOrderPriceHandle: function (order_no) {
    var that = this;
    var postData = {};
    postData.order_no = order_no;
    postData.user_id = app.globalData.loginUserInfo.user_id;
    util.httpUtil.httpPost(util.httpUtil.url.UnConfirmUserAddOrderPrice_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        //重新加载显示订单
        that.data.ordersPageIndex = 0;
        that.getOrderInfo();
      }
      util.viewUtil.showToastNone(res.msg);
    }, function (res) {
    }, function (res) {
    });
  },


  /**
  * 增加费用支付
  */
  addPricePayBindtap: function (e) {
    var order_no = e.currentTarget.dataset.order_no;
    wx.navigateTo({
      url: '/pages/order/order_pay_add_price?orderNo=' + order_no
    })
  },

  /**
     * 取消订单
     */
  cancelOrderBindtap: function (res) {
    var that = this;
    util.viewUtil.showModal("提示", "确认是否取消该订单,取消后不可恢复!", function (res) {
      if (res.confirm) {
        that.cancelOrderHandle(that.data.orderInfo.order_id);
      }
    });
  },
  /**
     * 取消订单
     */
  cancelOrderHandle: function (order_id) {
    var that = this;
    var postData = {};
    postData.order_id = order_id;
    postData.user_id = app.globalData.loginUserInfo.user_id;
    util.httpUtil.httpPost(util.httpUtil.url.CancelOrderInfo_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        that.getOrderInfo();
      }
      util.viewUtil.showToastNone(res.msg);
    }, function (res) {
    }, function (res) {
    });
  },

  /**
    * 删除订单点击
    */
  delOrderBindtap: function (res) {
    var that = this;
    util.viewUtil.showModal("提示", "确认是否删除该订单,删除后不可恢复!", function (res) {
      if (res.confirm) {
        that.delOrderHandle(that.data.orderInfo.order_id);
      }
    });
  },
  /**
   * 删除订单 
   */
  delOrderHandle: function (order_id) {
    var that = this;
    var postData = {};
    postData.order_id = order_id;
    postData.user_id = app.globalData.loginUserInfo.user_id;
    util.httpUtil.httpPost(util.httpUtil.url.DelOrder_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        that.backPageHandle();
      }
      util.viewUtil.showToastNone(res.msg);
    }, function (res) {
    }, function (res) {
    });
  },


  /**
   * 确认收货
   */
  receiveGoodsBindtap: function (e) {
    var that = this;
    util.viewUtil.showModal("提示", "确认收货吗,确认收货后不可恢复!", function (res) {
      if (res.confirm) {
        that.receiveGoods(that.data.orderInfo.order_id);
      }
    });
  },

  /**
  * 确认收货处理
  */
  receiveGoods: function (order_id) {
    var that = this;
    var postData = {};
    postData.order_id = order_id;
    postData.user_id = app.globalData.loginUserInfo.user_id;
    util.httpUtil.httpPost(util.httpUtil.url.ReceiveGoods_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        that.getOrderInfo();
      }
      util.viewUtil.showToastNone(res.msg);
    }, function (res) {
    }, function (res) {
    });

  },


  /**
  * 支付
 */
  payBindtap: function (e) {
    wx.navigateTo({
      url: '/pages/order/order_pay?orderNo=' + this.data.orderInfo.order_no
    })
  },
  /**
    * 卖家删除订单 
    */
  sellerDelOrderBindtap: function (res) {
    var that = this;
    util.viewUtil.showModal("提示", "确认是否删除该订单,删除后不可恢复!", function (res) {
      if (res.confirm) {
        that.sellerDelOrderHandle(that.data.orderInfo.order_id);
      }
    });
  },
  /**
   * 卖家删除订单 
   */
  sellerDelOrderHandle: function (order_id) {
    var that = this;
    var postData = {};
    postData.order_id = order_id;
    postData.user_id = app.globalData.loginUserInfo.user_id;
    util.httpUtil.httpPost(util.httpUtil.url.SellerDelOrder_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        that.backPageHandle();
      }
      util.viewUtil.showToastNone(res.msg);
    }, function (res) {
    }, function (res) {
    });

  },
  backPageHandle: function () {
    var pages = getCurrentPages();//所有页面栈
    var prevPage = pages[pages.length - 2];  //上一个页面
    if (!util.dataUtil.isNull(prevPage)) {
      wx.navigateBack({});
      if (typeof prevPage.orderDetailResult === 'function') {
        prevPage.orderDetailResult();
      }
    }
  },

  /**
  * 发货
  */
  sendGoodsBindtap: function (res) {
    wx.navigateTo({
      url: '/pages/order/order_logistics?orderId=' + this.data.orderInfo.order_id,
    })
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
    this.getOrderInfo();
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