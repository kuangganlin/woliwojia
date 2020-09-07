var util = require("../../utils/util.js");
const app = getApp()

Page({
  data: {

    goods_id:'',
    goodsCommenList:[]
  },
  onLoad: function(e) {
  this.setData({
    goods_id:e.goodsId,
  })
    this.getGoodsCommentList();
  },
  //获取星级评价
  getGoodsCommentList: function () {
    var that = this;
    var postData = {
      goods_id: that.data.goods_id
    };
    util.httpUtil.httpPost(util.httpUtil.url.GetGoodsCommenList_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        if (!util.dataUtil.isNullData(res.data)) {
          for (var i = 0; i < res.data.length; i++) {
            res.data[i].userInfo.head_pic = util.httpUtil.httpUrlHandle(res.data[i].userInfo.head_pic);
          }
          console.log(JSON.stringify(res.data));
          that.setData({
            goodsCommenList: res.data
          })
        }else{
          console.log("没有搜到评价");
         // wx.showToast("没有搜到评价");
        }
      }
    }, function (res) { }, function (res) { });

  },
})