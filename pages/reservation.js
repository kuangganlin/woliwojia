var util = require("../utils/util.js");
const app = getApp()

Page({
  data: {

    fileUrl: util.httpUtil.FileUrl,
    goodsPageIndex: 0,
    keyword: "",
    goodsDatas: [],
  },
  onLoad: function () {
    this.searchGoods();
  },
  //搜索商品
  searchGoods: function () {
    var that = this;
    var postData = {};
    if (!util.dataUtil.isNullData(app.globalData.selectLocationAddr.longitude)) {
      postData.longitude = app.globalData.selectLocationAddr.longitude;
      postData.latitude = app.globalData.selectLocationAddr.latitude;
    }
    if (!util.dataUtil.isNullData(app.globalData.loginUserInfo)) {
      postData.user_id = app.globalData.loginUserInfo.user_id;
    }

    if (!util.dataUtil.isNullData(this.data.keyword)) {
      postData.keyword = this.data.keyword;
    }
    postData.goods_type = 2;
    postData.pageIndex = this.data.goodsPageIndex;
    postData.pageSize = util.httpUtil.PageSize;
    util.httpUtil.httpPost(util.httpUtil.url.SearchGoods_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        that.searchGoodsResult(res);
      }
    }, function (res) { }, function (res) {
      wx.stopPullDownRefresh();
    });
  },
  searchGoodsResult: function (res) {
    var that = this;
    if (this.data.goodsPageIndex == 0) {
      this.data.goodsDatas = [];
    }
    if (util.dataUtil.isNullData(res.data)) {
      util.viewUtil.showToastNone("没有搜索到数据!");
      if (this.data.goodsPageIndex == 0) {
        this.setData({
          goodsDatas: this.data.goodsDatas
        })
      }
      return;
    }
    for (var i = 0; i < res.data.length; i++) {
      var item = res.data[i];
      item.type_pic = util.httpUtil.httpUrlHandle(item.type_pic);
      item.goods_pic = util.httpUtil.httpUrlHandle(item.goods_pic);
      item.head_pic = util.httpUtil.httpUrlHandle(item.head_pic);

      if (!util.dataUtil.isNull(item.distance)) {
        item.showDistance = (parseInt(item.distance) / 1000.0).toFixed(1) + "km";
      }

      this.data.goodsDatas.push(item);
    }
    if (res.data.length > 0) {
      this.data.goodsPageIndex++;
    }
    this.setData({
      goodsDatas: this.data.goodsDatas
    })
  },
  gaodeGetRegeo: function () {
    var that = this;
    app.gaodeGetRegeo(this.data.selectLocationAddr.latitude, this.data.selectLocationAddr.longitude, function (res) {
      if (!util.dataUtil.isNullData(res)) {
        if (util.dataUtil.isNullData(that.data.selectLocationAddr.address)) {
          that.data.selectLocationAddr.address = res.address;
          app.setSelectLocationAddr(that.data.selectLocationAddr);
          that.setData({
            selectLocationAddr: that.data.selectLocationAddr
          })
        }
      }
    });
  },
  //选择地址页面返回  微信自带地图包
  addrSelectBindTap: function (res) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          selectLocationAddr: res,
          goodsPageIndex: 0,
        })
        app.setSelectLocationAddr(that.data.selectLocationAddr);
        that.gaodeGetRegeo();
        that.searchGoods();
      },
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})