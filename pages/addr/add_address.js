
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    address: { contact_name: '', contact_tel: '', addr_dec: '', def_flag:0},

    selectAddr:{},
    isShowTextarea:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var modifyAddress = util.dataUtil.isNullData(options.addrs) ? {}: JSON.parse(options.addrs);
    if (!util.dataUtil.isNullData(modifyAddress)){
      this.setData({
        address: modifyAddress,
        isShowTextarea: false
      })
    }
  },
  //联系人姓名
  contactNameBindinput:function(res){
    this.data.address.contact_name = res.detail.value;
  },
  //联系人电话
  contactTelBindinput: function (res) {
    this.data.address.contact_tel = res.detail.value;
  },
  //联系人电话
  addressBindinput: function (res) {
    this.data.address.addr_dec = res.detail.value;
  },
  saveBindtap:function(){
    this.addConAddr();
  },
  //添加地址
  addConAddr: function () {
    var that = this;
    var postData = {};
    if (util.dataUtil.isNullData(this.data.address.contact_name)){
      util.viewUtil.showToastNone("联系人必填");
      return ;
    }
    postData.contact_name = this.data.address.contact_name;

    if (util.dataUtil.isNullData(this.data.address.contact_tel)) {
      util.viewUtil.showToastNone("联系人电话必填");
      return;
    }
    postData.contact_tel = this.data.address.contact_tel;
    if (util.dataUtil.isNullData(this.data.address.addr_dec)) {
      util.viewUtil.showToastNone("地址必填");
      return;
    } 
    postData.addr_dec = this.data.address.addr_dec;
    postData.def_flag = this.data.address.def_flag;

    if (util.dataUtil.isNullData(this.data.selectAddr)) {
      util.viewUtil.showToastNone("请在地图上选择地址");
      return;
    }

    // if (!util.dataUtil.isNullData(this.data.selectAddr.location)){
    //   postData.latitude = this.data.selectAddr.location.lat;
    //   postData.longitude = this.data.selectAddr.location.lng;
    // }else{
    //   util.viewUtil.showToastNone("请在地图上选择地址");
    //   return;
    // }

    if (!util.dataUtil.isNullData(this.data.selectAddr.latitude)) {
      postData.latitude = this.data.selectAddr.latitude;
      postData.longitude = this.data.selectAddr.longitude;
    } else {
      util.viewUtil.showToastNone("请在地图上选择地址");
      return;
    }


    if (!util.dataUtil.isNullData(this.data.address.addr_id)) {
      postData.addr_id = this.data.address.addr_id;
    }
    postData.user_id = app.globalData.loginUserInfo.user_id;
    util.viewUtil.showLoading("正在提交数据");
    util.httpUtil.httpPost(util.httpUtil.url.AddConAddr_Url, postData, function (res) {
      util.viewUtil.showToastNone(res.msg);
      if (util.httpUtil.isRequestSuccess(res)) {
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        if (typeof prevPage.resultAddAddress === 'function') {
          prevPage.resultAddAddress(that.data.address);
        }
        wx.navigateBack();
      }
      
      
    }, function (res) {
    }, function (res) {
    });
  },
  //选择地址
  selectAddressBindtap:function(data){
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        that.data.address.addr_dec = res.address;
        that.setData({
          selectAddr: res,
          address: that.data.address,
          isShowTextarea: false
        })
      },
    })
  },

  // //选择地址页面返回
  // resultSelectAddr: function (res) {
  //   this.data.address.addr_dec = res.address;
  //   this.setData({
  //     selectAddr: res,
  //     address: this.data.address,
  //     isShowTextarea:false
  //   })
  // },
  //默认地址选择
  addressDefBindtap:function(res){
    if (this.data.address.def_flag == 0){
      this.data.address.def_flag = 1;
    }else{
      this.data.address.def_flag = 0;
    }
    this.setData({
      address: this.data.address
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