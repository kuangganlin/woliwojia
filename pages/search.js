// pages/search.js
const app = getApp();
var util = require("../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchType:"1",//1:搜索商品  2：搜索活动
    key:'',

   
    searchFalg:true,
    matchSearchKeyList:[],
    //热门搜索
    hotSearchList:[],
    //用户搜索记录
    userSearchList:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotSearchWord();
    this.getUserSearchWord();
  },
  //清除搜索记录
  cleanUserSearchBindtap:function(res){
    this.clearUserSearchWord();
  },
  //取消搜索
  resetSerchBindtap:function(){
    this.data.key="";
    this.setData({
      key:"",
      matchSearchKeyList:[],
    })
  },

//选择搜索类型
  searchTypeBindtap:function(res){
    this.setData({
      searchType: res.currentTarget.dataset.searchtype
    })
  },
  /** 
   * 输入框事件监听
  */
  searchInputBindinput:function(res){
    //  console.log("keyBindinput:"+JSON.stringify(res));
    this.data.key = res.detail.value;
    this.getMatchSearchKey();
  },
  /** 
   * 输入框失去焦点时触发
  */
  searchInputBindblur:function(res){
    console.log(111111111111);
    this.searchResultHandle();
  },
    /** 
   * 点击完成按钮时触发
  */
  searchInputBindconfirm: function (res) {
    this.searchResultHandle();
  },

  searchResultHandle:function(){
    if (util.dataUtil.isNullData(this.data.key)){
      return ;
    }
    if (this.data.searchFalg ){
      this.data.searchFalg = false;
        wx.navigateTo({
          url: '/pages/index/goods_list?keyword=' + this.data.key,
        })
    }
    
  },
  //选择搜索关键字
  selectSearchKey:function(res){
    this.setData({
      key: res.target.dataset.key,
    });
    this.searchResultHandle();
  },
  //检索搜索关键字提示
  getMatchSearchKey: function () {
    var that = this;
    var postData={};
    postData.keywords = this.data.key;
    util.httpUtil.httpPost(util.httpUtil.url.GetMatchSearchKey_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        // if(!util.dataUtil.isNullData(res.data)){
          that.setData({
            matchSearchKeyList: util.dataUtil.isNullData(res.data) ? [] : res.data
          })
        // }
      }
    }, function (res) {
    }, function (res) {
    });
  },

  //热门搜索
 getHotSearchWord: function () {
   var that = this;
    util.httpUtil.httpPost(util.httpUtil.url.GetHotSearchWord_Url, null, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        that.setData({
          hotSearchList: util.dataUtil.isNullData(res.data)?[]:res.data
        })
      }
    }, function (res) {
    }, function (res) {
    });
  },

 //用户搜索记录
 getUserSearchWord: function () {
   var that = this;
   var postData={};
   postData.user_id = app.globalData.loginUserInfo.user_id;
   util.httpUtil.httpPost(util.httpUtil.url.GetUserSearchWord_Url, postData, function (res) {
     if (util.httpUtil.isRequestSuccess(res)) {
       that.setData({
         userSearchList: util.dataUtil.isNullData(res.data)?[] :res.data
       })
     }
   }, function (res) {
   }, function (res) {
   });
 },
 //清除搜索记录
 clearUserSearchWord: function () {
   var that = this;
   var postData = {};
   postData.user_id = app.globalData.loginUserInfo.user_id;
   util.httpUtil.httpPost(util.httpUtil.url.ClearUserSearchWord_Url, postData, function (res) {
     if (util.httpUtil.isRequestSuccess(res)) {
       util.viewUtil.showToastNone(res.msg);
       that.getUserSearchWord();
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
    this.data.searchFalg = true;
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