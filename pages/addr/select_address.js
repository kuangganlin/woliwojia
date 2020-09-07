// Choose-address.js
var app = getApp();
var util = require('../../utils/util.js');
var amap = require('../../libs/amap-wx.js');
var AMap;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    ak: app.globalData.gaodeAk, //"3eb23b956a13ccfb3255adaa3e67fd67"
    searchKey:'',
    map: {
      longitude: app.globalData.locationInfo.longitude,//106.551557,
      latitude: app.globalData.locationInfo.latitude,// 29.56380823,
      scale: 15,
      hidden:false
    },
    scrollViewHeight:'50%',
    regeocodingAddress:{},
    poiListData:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    AMap = new amap.AMapWX({ key: app.globalData.gaodeAk });
    that.setData({
      'map.hidden':false,
    })
    //地址
    if (!util.dataUtil.isNullData(this.data.map.longitude) && !util.dataUtil.isNullData(this.data.map.latitude)) {
      that.getPoiAround();
    } else {
      this.getLocation();
    } 
  },
// 分类设置：生活服务 住宿服务 风景名胜 商务住宅 政府机构及社会团体 科教文化服务 交通设施服务 金融保险服务 公司企业 道路附属设施 地名地址信息
  //获取周边的POI
  getPoiAround: function (keywords) {
    var that = this;
    if (util.dataUtil.isNull(keywords)){
      keywords = "";
    }
    AMap.getPoiAround({
      querykeywords: keywords,
      location: that.data.map.longitude + "," + that.data.map.latitude,
      success: function (data) {
        // console.log("getPoiAround-success:" + JSON.stringify(data));
        that.setData({
          poiListData: data.poisData,
        });
      },
      fail: function (info) {
      }
    });
  },
  //获取地址描述信息
  getRegeo: function () {
    var that = this;
    AMap.getRegeo({
      location: that.data.map.longitude + "," + that.data.map.latitude ,
      success: function (data) {
        // console.log("getRegeo-success:"+JSON.stringify(data));
      },
      fail: function (info) {
        // console.log("getRegeo-fail:" +JSON.stringify (info));
      }
    });
  },

  //定位
  getLocation: function () {
    var that = this;
    wx.getLocation({
      type: "gcj02",
      success: function (res) {
        if (!util.dataUtil.isNull(res.latitude) && !util.dataUtil.isNull(res.longitude)) {
          that.setData({
            'map.longitude': res.longitude,
            'map.latitude': res.latitude,
          })
         that.getPoiAround();
        }
      }, fail: function (res) {
        util.viewUtil.showNoCancelModal("提示", "没有获取到您的地址位置，请检测您手机是否打开GPS!");
      }, complete: function (res) {
      }
    })
  },
  //定位
  locationOnClick: function (res) {
    this.getLocation();
  },

  searchBindblur:function(res){
    this.inputTextHeadle(res);
  },

  searchBindinput:function(res){
    this.inputTextHeadle(res);
  },
  inputTextHeadle:function(res){
    var that = this;
    if (that.data.searchKey == res.detail.value) {
      return;
    }
    that.data.searchKey = res.detail.value;
    if (that.data.searchKey.length == 0) {
      that.setData({
        'map.hidden':false,
        scrollViewHeight: '50%'
      })
    } else {
      that.setData({
        'map.hidden': true,
        scrollViewHeight: '90%'
      })
    }
    that.getPoiAround(that.data.searchKey);

  },


  // 地图发生变化的时候，获取中间点，也就是用户选择的位置
  regionchange:function(e) {
    if (e.type == 'end') {
      this.getLngLat()
    }
  },
  //获取中间点的经纬度，并mark出来
  getLngLat: function () {
    var that = this;
    this.data.mapCtx = wx.createMapContext("myMap");
    this.data.mapCtx.getCenterLocation({
      success: function (res) {
        var temp = app.getDistance(res.latitude, res.longitude, that.data.map.latitude, that.data.map.longitude)
		   if (temp >50){   
          that.setData({
            'map.longitude': res.longitude,
            "map.latitude": res.latitude,
          })
          if (that.data.timeout != null) {
            clearTimeout(that.data.timeout);
            that.data.timeout = null;
          }
          that.data.timeout = setTimeout(function () {
            that.getPoiAround(that.data.searchKey);
          }, app.globalData.distanceRefreshTime);
        }
      }, fail: function (res) {
        util.viewUtil.showNoCancelModal("提示","没有获取到您的地址位置，请检测您手机是否打开GPS!");
      }, complete: function (res) {
      }
    })
  },

  //搜索按钮
  searchBtnOnCLick:function(){
    var location = that.data.map.latitude + "," + that.data.map.longitude;
    that.baiduSuggestion(location, that.data.searchKey);
  },

  //item.pname+item.cityname+item.adname + item.address
  selectAddrEvent:function(res){
    var selectAddr = res.currentTarget.dataset.addr;
    selectAddr.address = selectAddr.pname + selectAddr.cityname + selectAddr.adname + selectAddr.address + selectAddr.name;
    var locationArray = selectAddr.location.split(',');
    if (locationArray.length != 2){
      util.viewUtil.showToastNone("该地址失效，请重新选择");
      return;
    }
    selectAddr.location={};
    selectAddr.location.lng = locationArray[0];
    selectAddr.location.lat = locationArray[1];

    console.log('address:' + JSON.stringify(selectAddr));
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    if (typeof prevPage.resultSelectAddr === 'function') {
      prevPage.resultSelectAddr(selectAddr);
    }
    wx.navigateBack();
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