var util = require("../../utils/util.js");
const app = getApp()

Page({
  data: {

    fileUrl: util.httpUtil.FileUrl,
    selectLocationAddr: app.globalData.selectLocationAddr,
    goodsPageIndex: 0,
    keyword: "",
    goodsDatas: [],
    ad: [],
    goodsTypes: [],
    goodsTypesGroup: [],
    //轮播
    indicatorDots: true,
    vertical: false,//滑动方向是否为纵向
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false  // loading

  },
  onLoad: function() {
    this.getAd();
    var that = this;
    this.getGoodsTypes();
    app.getLocation(function() {
      that.setData({
        selectLocationAddr: app.globalData.selectLocationAddr
      })
      that.searchGoods();
    });
    this.data.selectLocationAddr.address = '正在定位....';
    this.setData({
      selectLocationAddr: this.data.selectLocationAddr,

    })
    
    

    //定位信息
    if (util.dataUtil.isNullData(this.data.selectLocationAddr.latitude)) {
      
      app.getLocation(function(res) {
        console.log('获取的定位的地址:' + JSON.stringify(res));
        that.data.selectLocationAddr = res;
        app.setSelectLocationAddr(that.data.selectLocationAddr);
        that.gaodeGetRegeo();
      }, function() {
        util.viewUtil.showModal("提示", "定位失败,请左上角选择地理位置.");
      });
    } else {
      that.gaodeGetRegeo();
    }


  },

  swiperchange:function(){

  },

  //获取广告
  getAd: function () {
    var that = this;
    util.httpUtil.httpPost(util.httpUtil.url.GetAd_Url, null, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        if (!util.dataUtil.isNullData(res.data)) {
          // that.setData({
          //  ad: res.data
          // })
           for (var i = 0; i < res.data.length; i++) {
            var item = res.data[i];
            item.link_data = util.httpUtil.httpUrlEncodeURI(item.link_data);
            that.data.ad.push(item);
          }
          that.setData({
            ad: that.data.ad
          })
          console.log('11111111111');
          console.log(that.data.ad);



        }
      }
    }, function (res) { }, function (res) { });
  },

  //获取广告链接地址
  getAdShow: function (e) {
    wx.navigateTo({
      url: '/pages/ad_show?url=' +e.url,
    }) 
  },

  //获取分类
  getGoodsTypes: function() {
    var that = this;
    util.httpUtil.httpPost(util.httpUtil.url.GetGoodsTypes_Url, null, function(res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        if (!util.dataUtil.isNullData(res.data)) {
          var res2 = [];
          for (var i = 0; i < res.data.length; i += 4) {
            res2.push({ "key": i, "group": res.data.slice(i, i + 4) });
          }
          that.setData({
            goodsTypesGroup: res2,
            goodsTypes: res.data
          })
        }
      }
    }, function(res) {}, function(res) {});
  },
  //搜索商品
  searchGoods: function() {
    var that = this;
    var postData = {};
    if (!util.dataUtil.isNullData(this.data.selectLocationAddr.longitude)) {
      postData.longitude = this.data.selectLocationAddr.longitude;
      postData.latitude = this.data.selectLocationAddr.latitude;
      
    }
    if (!util.dataUtil.isNullData(app.globalData.loginUserInfo)) {
      postData.user_id = app.globalData.loginUserInfo.user_id;
    }

    if (!util.dataUtil.isNullData(this.data.keyword)) {
      postData.keyword = this.data.keyword;
    }
    console.log('user_id:' + app.globalData.loginUserInfo.user_id+',search_map:' + this.data.selectLocationAddr.latitude);

    postData.pageIndex = this.data.goodsPageIndex;
    postData.goods_type = 0;
    postData.pageSize = util.httpUtil.PageSize;
    util.httpUtil.httpPost(util.httpUtil.url.GetIndexGoodsList_Url, postData, function(res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        that.searchGoodsResult(res);
      }
    }, function(res) {}, function(res) {
      wx.stopPullDownRefresh();
    });
  },
  searchGoodsResult: function(res) {
    var that = this;
    if (this.data.goodsPageIndex == 0) {
      this.data.goodsDatas = [];
    }
    if (util.dataUtil.isNullData(res.data)) {
      //util.viewUtil.showToastNone("没有搜索到数据!");
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
  gaodeGetRegeo: function() {
    var that = this;
    app.gaodeGetRegeo(this.data.selectLocationAddr.latitude, this.data.selectLocationAddr.longitude, function(res) {
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
  addrSelectBindTap: function(res) {
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          selectLocationAddr: res,
          goodsPageIndex:0,
        })
        app.setSelectLocationAddr(that.data.selectLocationAddr, that.searchGoods());
        console.log(JSON.stringify(that.data.selectLocationAddr));
        that.gaodeGetRegeo();
       // that.searchGoods();
      },
    })
  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    this.getAd();
    this.getGoodsTypes();
    this.searchGoods();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getAd();
    this.getGoodsTypes();
    this.searchGoods();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})