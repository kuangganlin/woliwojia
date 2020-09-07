// Choose-address.js
var app = getApp();
var util = require('../../utils/util.js');
var gpsUtil = require('../../utils/gps_util.js');
var bmap = require('../../libs/bmap-wx.js');
var BMap;
Page({

  /**
   * 页面的初始数据
   */
  data: {

    ak: app.globalData.baiduAk,
    searchKey:'',
    map: {
      longitude: app.globalData.locationInfo.longitude,//106.551557,
      latitude: app.globalData.locationInfo.latitude,// 29.56380823,
      scale: 15,
      // height:'40%',
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
    //构造百度地图api实例
    BMap = new bmap.BMapWX({
      ak: that.data.ak
    })
    that.setData({
      'map.hidden':false,
    })
    //地址
    if (!util.dataUtil.isNullData(this.data.map.longitude) && !util.dataUtil.isNullData(this.data.map.latitude)) {
      var location = that.data.map.latitude + "," + that.data.map.longitude;
      that.baiduSearch(location);
      that.baiduRegeocoding();
    } else {
      this.getLocation();
    } 
  },
  //地址逆袭
  baiduRegeocoding:function(){
    var that = this;
    // gpsUtil.GPS.bd_encrypt()

    var location = that.data.map.latitude + "," + that.data.map.longitude;
    BMap.regeocoding({
      location: location,
      success: function(res){
        // console.log("regeocoding:" + JSON.stringify(res));
        that.data.regeocodingAddress = res.originalData.result.addressComponent;
        // console.log("regeocodingAddress:" + JSON.stringify(that.data.regeocodingAddress));
      }
    });
  },
  //搜索
  baiduSearch:function(location){
    var that = this;
    var searchData={};
    var fail = function (data) {
    };
    var success = function (data) {
      // console.log("baiduSearch:"+JSON.stringify(data));
       that.setData({
         poiListData: data.originalData.results
       });
    };
    searchData.fail = fail;
    searchData.success = success;
    if(!util.dataUtil.isNull(location)){
      searchData.location = location;
    }
    // console.log("searchData:" + JSON.stringify(searchData));
    BMap.search(searchData);
    
    // BMap.search(searchData);
 

  },

  //搜索
  baiduSuggestion: function (location, query) {
    var that = this;
    var searchData = {};
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      that.setData({
        poiListData: data.result
      });
      // console.log("baiduSuggestion："+JSON.stringify(data));
    };
    searchData.fail = fail;
    searchData.success = success;

    if (!util.dataUtil.isNull(location)) {
      searchData.location = location;
    }
    if (!util.dataUtil.isNull(query)) {
      searchData.query = query;
      if (!util.dataUtil.isNullData(that.data.regeocodingAddress)) {
        searchData.region = that.data.regeocodingAddress.city;
      }
      BMap.suggestion(searchData);
    } 
  },

  // 地图发生变化的时候，获取中间点，也就是用户选择的位置
  regionchange:function(e) {

    // console.log('视野发生变化：regionchange:' + JSON.stringify(e));
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
        // console.log("移动距离:" + temp);
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
          
            var location = that.data.map.latitude + "," + that.data.map.longitude;
 
            that.baiduSearch(location);
          }, app.globalData.distanceRefreshTime);

        }
      }, fail: function (res) {
        util.viewUtil.showNoCancelModal("提示","没有获取到您的地址位置，请检测您手机是否打开GPS!");
      }, complete: function (res) {
      }
    })
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
          var location = that.data.map.latitude + "," + that.data.map.longitude;
     

          that.baiduSearch(location);
          that.baiduRegeocoding();
        }
      }, fail: function (res) {
        
      }, complete: function (res) {
      }
    })
  },
  //定位
  locationOnClick:function(res){
    this.getLocation();
  },
  //搜索按钮
  searchBtnOnCLick:function(){
    var location = that.data.map.latitude + "," + that.data.map.longitude;
    that.baiduSuggestion(location, that.data.searchKey);
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
    that.data.searchKey = res.detail.value
    var location = that.data.map.latitude + "," + that.data.map.longitude;
    if (that.data.searchKey.length == 0) {
      that.setData({
        'map.hidden':false,
        scrollViewHeight: '50%'
      })
      that.baiduSearch(location);
    } else {
      that.setData({
        'map.hidden': true,
        scrollViewHeight: '90%'
      })
    }
    that.baiduSuggestion(location, that.data.searchKey);
  },

  selectAddrEvent:function(res){
    var selectAddr = res.currentTarget.dataset.addr;
    if (util.dataUtil.isNull(selectAddr.address)){
      selectAddr.address = selectAddr.city + selectAddr.district + selectAddr.name;
    }
    console.log('address:' + JSON.stringify(selectAddr));
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];  //当前页面
    var prevPage = pages[pages.length - 2]; //上一个页面
 
    if (typeof prevPage.resultSelectAddr === 'function') {
      prevPage.resultSelectAddr(selectAddr);
    }
    wx.navigateBack();
  },



  /**
   * 显示搜索的信息
   */
  showSearchInfo: function (data, i) {
    var that = this;
    that.setData({
      placeData: {
        title: '名称：' + data[i].title + '\n',
        address: '地址：' + data[i].address + '\n',
        telephone: '电话：' + data[i].telephone
      }
    });
  },
  changeMarkerColor: function (data, i) {
    var that = this;
    var markers = [];
    for (var j = 0; j < data.length; j++) {
      if (j == i) {
        // 此处需要在相应路径放置图片文件 
        data[j].iconPath = "../images/btn3_05.png";
      } else {
        // 此处需要在相应路径放置图片文件 
        data[j].iconPath = "../images/map_15.jpg";
      }
      markers[j]=data[j];
    }
    that.setData({
      markers: markers
    });
  },
 /**
  * 关键字查询
  */
  searchKeyEvent:function(e){
    
      this.setData({
        searchKey:e.detail.value
      })
      this.searchFunc();

  },
 
  /**
   * 搜索方法
   */
  searchFunc:function(){
    var that = this;
    var fail = function (data) {
      // console.log(data)
    };
    var success = function (data) {
      wxMarkerData = data.wxMarkerData;
      if(wxMarkerData.length>0){
        wxMarkerData[0].iconPath = "../images/btn3_05.png";
      }
      that.setData({
        markers: wxMarkerData
      });
      that.setData({
        latitude: wxMarkerData[0].latitude
      });
      that.setData({
        longitude: wxMarkerData[0].longitude
      });
    }
    // 发起POI检索请求 
    BMap.search({
      "query": that.data.searchKey,
      fail: fail,
      success: success,
      // 此处需要在相应路径放置图片文件 
      iconPath: '../images/map_15.jpg',
      // 此处需要在相应路径放置图片文件 
      iconTapPath: '../images/btn3_05.png'
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('myMap');
    this.mapCtx.moveToLocation();
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