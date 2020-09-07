// Common-Address.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectType:0,//0:选择地址 1：查看地址
    addrList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.selectType = util.dataUtil.isNullData(options.selectType) ? this.data.selectType : options.selectType;
    this.getConAddr();
  }, 
  //添加
  addAddressBindtap:function(res){
    wx.navigateTo({
      url: '/pages/addr/add_address',
    })
  },
//选择地址处理
  chooseAddressEvent: function (res){
    if (this.data.selectType != 1){
      var item = this.data.addrList[res.currentTarget.dataset.index];
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      if (typeof prevPage.resultAddress === 'function') {
        prevPage.resultAddress(item);
      }
      wx.navigateBack();
    }
 
  },

  //编辑地址
  editAddressBindtap:function(res){
    // console.log("editAddressBindtap:"+JSON.stringify(res));
    var item = this.data.addrList[res.currentTarget.dataset.index];
    wx.navigateTo({
      url: '/pages/addr/add_address?addrs=' + JSON.stringify(item),
    })
  },
  resultAddAddress:function(res){
    this.getConAddr();
  },
  //删除地址
  deleteAddressBindtap: function (res) {
    var that = this;
    var item = this.data.addrList[res.currentTarget.dataset.index];
    util.viewUtil.showModal("提示","确认是否删除该地址!",function(res){
      if (res.confirm) {
        that.deleteConAddr(item);
      }
    });
   
  },
  //默认地址
  defAddressBindtap:function(res){

    var item = this.data.addrList[res.currentTarget.dataset.index];
    console.log('item:' + JSON.stringify(item));
    if (item.def_flag == 0) {
      item.def_flag = 1;
    } else {
      item.def_flag = 0;
    }
    this.updateConAddr(item);
  },
  //获取地址
  getConAddr: function () {
    var that = this;
    var postData={};
    postData.user_id = app.globalData.loginUserInfo.user_id;
    util.httpUtil.httpPost(util.httpUtil.url.GetConAddr_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        that.setData({
          addrList: util.dataUtil.isNullData(res.data) ?[]: res.data
        })
      }else{
        util.viewUtil.showToastNone(res.msg);
      }
    }, function (res) {
    }, function (res) {
      wx.stopPullDownRefresh();
    });
  },
  //修改地址
  updateConAddr: function (address) {
    var that = this;
    var postData = {};
    postData.addr_id = address.addr_id;
    postData.def_flag = address.def_flag;
    postData.user_id = app.globalData.loginUserInfo.user_id;
    util.httpUtil.httpPost(util.httpUtil.url.UpdateConAddr_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        util.viewUtil.showToastNone(res.msg);
        that.getConAddr();
      } else {
        util.viewUtil.showToastNone(res.msg);
      }
    }, function (res) {
    }, function (res) {
    });
  },

  //刪除地址
  deleteConAddr: function (address) {
    var that = this;
    var postData = {};
    postData.addr_id = address.addr_id;
    postData.user_id = app.globalData.loginUserInfo.user_id;
    util.viewUtil.showLoading("正在提交数据");
    util.httpUtil.httpPost(util.httpUtil.url.DeleteConAddr_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        util.viewUtil.showToastNone(res.msg);
        that.getConAddr();
      } else {
        util.viewUtil.showToastNone(res.msg);
      }
    }, function (res) {
    }, function (res) {
    });
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
    this.getConAddr();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return app.shareHome();
  }
})