const app = getApp();
var util = require("../utils/util.js");
var dateTimePicker = require('../libs/dateTimePicker.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalputCovenant_time: true,
    modelName: "",
    modelValue: "",
    refundRatioPrice:"",
    //预约时间
    enrollDateTimeArray: [],
    enrollDateTime: [],
    selectEnrollDateTime: '',
    orderStatus: 1,
    is_home: 0,
    no_order_desc: '暂时没有订单信息',
    order_list: [],
    ordersPageIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectTimeDataInit();

    var that = this;
    this.data.orderStatus = util.dataUtil.isNullData(options.orderStatus) ? this.data.orderStatus : options.orderStatus;
    this.data.is_home = util.dataUtil.isNullData(options.is_home) ? this.data.is_home : options.is_home;
    that.setData({
      orderStatus: this.data.orderStatus,
      is_home: this.data.is_home
    });

    //判断user_id是否存在
    if (util.dataUtil.isNullData(app.globalData.loginUserInfo)) {
      app.wxCheckSession(function () {
        if (!util.dataUtil.isNullData(app.globalData.loginUserInfo)) {
          that.myOrderList();
        }
      })
    } else {
      that.myOrderList();
    }

  },
  /**
     * 订单详细返回刷新 
     */
  orderDetailResult: function () {
    this.data.ordersPageIndex = 0;
    this.myOrderList();
  },
  /**
   * 刷新页面 
   */
  updatePage: function () {
    this.data.ordersPageIndex = 0;
    this.myOrderList();
  },
  /**
   * 切换显示不同的订单列表 
   */
  orderStatusBindtap: function (e) {
    var that = this;
    this.data.orderStatus = e.target.dataset.status_type;
    that.setData({
      orderStatus: this.data.orderStatus
    });
    this.updatePage();
  },

  /**
   * 评价 
   */
  evaluationOrderBindtap: function (res) {
    var order_id = res.target.dataset.order_id;
    wx.navigateTo({
      url: '/pages/evaluation?orderId=' + order_id,
    })
  },
  orderEvaluationResult: function (res) {
    this.updatePage();
  },

  /**
   * 确认增加费用按钮
   */
  confirmAddOrderPriceBindtap: function (res) {
    var that = this;
    var order_id = res.target.dataset.order_id;
    var order_no = res.target.dataset.order_no;
    util.viewUtil.showModal("提示", "确认是否增加费用,增加后不可恢复!", function (res) {
      if (res.confirm) {
        that.confirmAddOrderPriceHandle(order_id,order_no);
      }
    });
  },

  /**
   * 确认增加费用操作
   */
  confirmAddOrderPriceHandle: function (order_id,order_no) {
    var that = this;
    var postData = {};
    postData.order_id = order_id;
    postData.user_id = app.globalData.loginUserInfo.user_id;
    util.httpUtil.httpPost(util.httpUtil.url.ConfirmAddOrderPrice_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        //重新加载显示订单
        //that.data.ordersPageIndex = 0;
        //that.myOrderList();
        //直接支付订单2020-4-7
        wx.navigateTo({
          url: '/pages/order/order_pay_add_price?orderNo=' + order_no
        })
      }
      util.viewUtil.showToastNone(res.msg);
    }, function (res) {
    }, function (res) {
    });
  },


  /**
   * 取消订单
   */
  cancelOrderBindtap: function (res) {
    var that = this;
    var order_id = res.target.dataset.order_id;
    util.viewUtil.showModal("提示", "确认是否取消该订单,取消后不可恢复!", function (res) {
      if (res.confirm) {
        that.cancelOrderHandle(order_id);
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
        //重新加载显示订单
        that.data.ordersPageIndex = 0;
        that.myOrderList();
      }
      util.viewUtil.showToastNone(res.msg);
    }, function (res) {
    }, function (res) {
    });
  },

  /**
   * 确认师傅完成订单
   */
  confirmOrderBindtap: function (res) {
    var that = this;
    var order_id = res.target.dataset.order_id;
    util.viewUtil.showModal("提示", "确认师傅是否完成该订单,确认后不可恢复!", function (res) {
      if (res.confirm) {
        that.confirmOrderHandle(order_id);
      }
    });
  },
  /**
     * 确认师傅完成订单
     */
  confirmOrderHandle: function (order_id) {
    var that = this;
    var postData = {};
    postData.order_id = order_id;
    postData.user_id = app.globalData.loginUserInfo.user_id;
    util.httpUtil.httpPost(util.httpUtil.url.ConfirmOrderInfo_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        //重新加载显示订单
        that.data.ordersPageIndex = 0;
        that.myOrderList();
      }
      util.viewUtil.showToastNone(res.msg);
    }, function (res) {
    }, function (res) {
    });
  },

  /**
   * 用户主动关闭订单
   */
  closeOrderBindtap: function (res) {
    var that = this;
    var order_id = res.target.dataset.order_id; 
    var order_status = res.target.dataset.order_status;
    var modify_covenant_time_num = res.target.dataset.modify_covenant_time_num;
    if (order_status == 4 && modify_covenant_time_num >=1){
      var postData = {};
      postData.order_id = order_id;
      postData.user_id = app.globalData.loginUserInfo.user_id;
      util.httpUtil.httpPost(util.httpUtil.url.GetRefundRatioInfo_Url, postData, function (re) {
        if (util.httpUtil.isRequestSuccess(re)) {
          
          //that.data.refundRatioPrice = re.data;
          that.setData({
            refundRatioPrice: re.data
          });


          util.viewUtil.showModal("提示", "取消订单将会收取订单总价的" + that.data.refundRatioPrice + "手续费，确认取消该订单吗,确认后不可恢复!", function (e) {
            if (e.confirm) {
              that.closeOrderHandle(order_id);
            }
          });



          console.log('手续费' + re.data);
        }
        //util.viewUtil.showToastNone(re.msg);
      }, function (re) {
        }, function (re) {
      });  



      
    }else{
      util.viewUtil.showModal("提示", "取消订单将会自动退款,确认取消该订单吗,确认后不可恢复!", function (e) {
        if (e.confirm) {
          that.closeOrderHandle(order_id);
        }
      });
    }
  },
  
  /**
     * 用户关闭订单订单
     */
  closeOrderHandle: function (order_id) {
    var that = this;
    var postData = {};
    postData.order_id = order_id;
    postData.user_id = app.globalData.loginUserInfo.user_id;
    util.httpUtil.httpPost(util.httpUtil.url.CloseOrderInfo_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        //重新加载显示订单
        that.data.ordersPageIndex = 0;
        that.myOrderList();
      }
      util.viewUtil.showToastNone(res.msg);
    }, function (res) {
    }, function (res) {
    });
  },


  /**
   * 用户修改订单的预约时间
   */
  modifyCovenant_timeBindtap: function (res) {
    var that = this;
    util.viewUtil.showModal("提示", "只有一次修改预约时间的机会,确认后不可恢复!", function (e) {
      if (e.confirm) {
        that.setData({
          hiddenmodalputCovenant_time: false,
          modelName: "修改预约时间",
          modelValue: res.target.dataset.covenant_time,
          order_id: res.target.dataset.order_id,
          selectEnrollDateTime: res.target.dataset.covenant_time,
        })
      }
    });
  },

  modalCancel: function (res) {
    this.setData({
      selectEnrollDateTime: res.target.dataset.covenant_time,
      hiddenmodalputCovenant_time: true,
    })
  },

  modalConfirmCovenant_time: function (e) {
    var that = this;
    var postData = {};
    postData.order_id = e.target.dataset.order_id;
    postData.covenant_time = that.data.selectEnrollDateTime;
    postData.user_id = app.globalData.loginUserInfo.user_id;
    util.httpUtil.httpPost(util.httpUtil.url.ModifyOrderCovenantTimeInfo_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        
        that.setData({
          hiddenmodalputCovenant_time: true,
        })
        //重新加载显示订单
        that.data.ordersPageIndex = 0;
        that.myOrderList();
      }
      util.viewUtil.showToastNone(res.msg);
    }, function (res) {
    }, function (res) {
    });


  },

  selectTimeDataInit: function () {
    var reDate = new Date();
    var endData = new Date().addYears(1);
    var obj = dateTimePicker.dateTimePicker(reDate.getFullYear(), endData.getFullYear());
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj.dateTimeArray.pop();
    var lastTime = obj.dateTime.pop();
    this.setData({
      enrollDateTimeArray: obj.dateTimeArray,
      enrollDateTime: obj.dateTime,
      startDateTimeArray: obj.dateTimeArray,
      startDateTime: obj.dateTime,
      endDateTimeArray: obj.dateTimeArray,
      endDateTime: obj.dateTime,
    })
  },

  //选择预约时间
  enrollDateTimeBindchange(e) {
    this.setData({ enrollDateTime: e.detail.value });
    this.data.selectEnrollDateTime = this.data.enrollDateTimeArray[0][this.data.enrollDateTime[0]] + "-" + this.data.enrollDateTimeArray[1][this.data.enrollDateTime[1]] + "-" + this.data.enrollDateTimeArray[2][this.data.enrollDateTime[2]] + " " + this.data.enrollDateTimeArray[3][this.data.enrollDateTime[3]] + ":" + this.data.enrollDateTimeArray[4][this.data.enrollDateTime[4]];
    this.setData({ selectEnrollDateTime: this.data.selectEnrollDateTime });
    console.log('选择的日期为：' + this.data.selectEnrollDateTime);


    var date = new Date(this.data.selectEnrollDateTime);
    var curr_date = new Date();
    //var selectEnrollDateTimeStamp = parseInt(this.data.selectEnrollDateTime.getTime() / 1000);
    var selectEnrollDateTimeStamp = parseInt(date.getTime() / 1000);
    var currTimeStamp = parseInt(curr_date.getTime() / 1000);
    console.log('选择的日期时间戳为：' + selectEnrollDateTimeStamp);
    console.log('现在的日期时间戳为：' + currTimeStamp);

    if (selectEnrollDateTimeStamp < currTimeStamp) {
      util.viewUtil.showToastNone("预约时间不能小于当前时间!");
      return;
    }


  },
  enrollDateTimeBindcolumnchange(e) {
    var arr = this.data.enrollDateTime, dateArr = this.data.enrollDateTimeArray;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      enrollDateTimeArray: dateArr
    });
    console.log(dateArr);
  },



  /**
    * 删除订单点击
    */
  delOrderBindtap: function (res) {
    var that = this;
    var order_id = res.target.dataset.order_id;
    util.viewUtil.showModal("提示", "确认是否删除该订单,删除后不可恢复!", function (res) {
      if (res.confirm) {
        that.delOrderHandle(order_id);
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
        that.data.ordersPageIndex = 0;
        that.myOrderList();
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
    var order_id = e.target.dataset.order_id;
    util.viewUtil.showModal("提示", "确认收货吗,确认收货后不可恢复!", function (res) {
      if (res.confirm) {
        that.receiveGoods(order_id);
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
        that.data.ordersPageIndex = 0;
        that.myOrderList();//默认参数是1
      }
      util.viewUtil.showToastNone(res.msg);
    }, function (res) {
    }, function (res) {
    });

  },

  /**
   * 订单列表
   */
  myOrderList: function () {
    var that = this;
    var postData = {};
    postData.order_status = this.data.orderStatus;
    postData.user_id = app.globalData.loginUserInfo.user_id;
    postData.pageIndex = that.data.ordersPageIndex;
    postData.pageSize = util.httpUtil.PageSize;
    util.httpUtil.httpPost(util.httpUtil.url.MyOrderList_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        that.showOrderListResult(res);
      }
    }, function (res) {
    }, function (res) {
      wx.stopPullDownRefresh();
    });
  },



  showOrderListResult: function (res) {
    var that = this;
    if (this.data.ordersPageIndex == 0) {
      this.data.order_list = [];
    }
    if (util.dataUtil.isNullData(res.data)) {
      if (this.data.ordersPageIndex == 0) {
        util.viewUtil.showToastNone("没有查询到订单!");
      } else {
        util.viewUtil.showToastNone("没有查询到更多订单!");
      }

      this.setData({
        order_list: this.data.order_list
      })
      return;
    }
    for (var i = 0; i < res.data.length; i++) {
      var item = res.data[i];
      util.httpUtil.objectHttpUrlHandle(item.goods_list, 'goods_pic');

      this.data.order_list.push(item);
    }
    if (res.data.length > 0) {
      this.data.ordersPageIndex++;
    }
    this.setData({
      order_list: this.data.order_list
    })
    console.log(this.data.order_list);
    
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

  /**
   * 正常支付
   */
  payBindtap: function (e) {
    var order_no = e.currentTarget.dataset.order_no;
    wx.navigateTo({
      url: '/pages/order/order_pay?orderNo=' + order_no
    })
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
    this.data.ordersPageIndex = 0;
    this.myOrderList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.myOrderList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.shareHome();
  }
})