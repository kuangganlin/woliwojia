var util = require("../utils/util.js");
const app = getApp()
Page({

data: {
    url:'' ,
},
onLoad: function (options) {
  console.log(JSON.stringify(options));
  
  this.setData({
    url: util.httpUtil.MainUrl + '/api/goods/getGoodsDetail?goods_id=' + options.goods_id + '&user_id=' + app.globalData.loginUserInfo.user_id,

    
  })
  console.log(this.data.url);
},


/**
 * 用户点击右上角分享
 */
onShareAppMessage: function () {

}

})