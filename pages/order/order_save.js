// pages/bbuy.js
import { $wuxKeyBoard } from '../../libs/wux'
var app = getApp();
var util = require('../../utils/util.js');
var md5Util = require('../../utils/md5_util.js');

var dateExt = require('../../utils/ext/date_ext.js');
var dateTimePicker = require('../../libs/dateTimePicker.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectLocalImages: [],
    tradeUnit: app.globalData.tradeUnit,
    order_notice: app.globalData.orderNotice,
    selectAddress:null,
    goodsId: "",//39,//
    goodsInfo:{},
    ytaoExchangeScale: app.globalData.ytaoExchangeScale,
    pay_type:1,
    //预约时间
    enrollDateTimeArray: [],
    enrollDateTime: [],
    selectEnrollDateTime: '',
    order_desc: ''
 
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    //下单须知
    // this.setData({
    //   order_notice: app.globalData.orderNotice
    // })

    this.selectTimeDataInit();

    var that = this;
    if (util.dataUtil.isNullData(options.goodsId) && util.dataUtil.isNullData(options.goodsInfo)){
      util.viewUtil.showModal("提示", "没有传递商品ID", function (res) {
        wx.navigateBack({});
      })
      return;
    }else{
      this.data.goodsId = options.goodsId;
      this.data.spec_price_id = options.spec_price_id;//商品规格id
      this.data.goodsInfo = options.goodsInfo;
    }
    if (util.dataUtil.isNullData(this.data.goodsInfo)) {
      this.getGoodsInfo();
    } else {
      that.setData({
        goodsInfo: JSON.parse(this.data.goodsInfo)
      })
    }

    this.refreshViewData();

    this.pageConfigOrderNoticeInit();//下单须知
  },

  //预览图片
  previewImageBindtap: function (res) {
    var that = this;
    var index = res.currentTarget.dataset.index;
    var currentUrl = this.data.selectLocalImages[index];
    wx.previewImage({
      current: currentUrl,
      urls: that.data.selectLocalImages,
    })
  },
  //删除图片
  imageDeleteOnClickEvent: function (res) {
    var index = res.currentTarget.dataset.index;
    this.data.selectLocalImages.splice(index, 1);
    this.setData({
      selectLocalImages: this.data.selectLocalImages
    })
  },

  //图片选择事件
  imageOnClickEvent: function () {
    var that = this;
    wx.chooseImage({
      count: 6,
      sizeType: 'compressed',
      success: function (res) {
        wx.navigateTo({
          url: '/pages/imagecrop/image_crop?cropImages=' + JSON.stringify(res.tempFilePaths),
        })

        // for (var i = 0; i < res.tempFilePaths.length; i++) {
        //   that.data.selectLocalImages.push(res.tempFilePaths[i]);
        // }
        // that.setData({
        //   selectLocalImages: that.data.selectLocalImages
        // })
      }
    })
  },
  resultCrop: function (res) {
    console.log("resultCrop:" + JSON.stringify(res));
    var that = this;
    for (var i = 0; i < res.length; i++) {
      if (util.dataUtil.isNullData(res[i].cropImg)) {
        that.data.selectLocalImages.push(res[i].orgImg);
      } else {
        that.data.selectLocalImages.push(res[i].cropImg);
      }
    }
    that.setData({
      selectLocalImages: that.data.selectLocalImages
    })
  },

  //获取配置的下须知
  pageConfigOrderNoticeInit: function () {
    var that = this;
    this.data.order_notice = app.globalData.orderNotice;
    if (util.dataUtil.isNullData(this.data.order_notice)) {
      app.getOrderSystemInfo(function (res) {
        that.setData({
          order_notice: app.globalData.orderNotice
        })
      });
    } else {
      this.setData({
        order_notice: this.data.order_notice
      })
    }
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
    var currTimeStamp = parseInt(curr_date.getTime()/1000);
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

  //更新页面数据
  refreshViewData:function(res){
    var that = this;
    this.getGoodsInfo();
    
    this.getConAddr();
  },
  
  //计算商品价格
  calculateGoodsPrice:function(){
    //this.data.goodsInfo.allPayYtaoPrice = parseInt(this.data.goodsInfo.ytao_price) + parseInt(this.data.goodsInfo.service_price);
    //this.data.goodsInfo.allPayRmbPrice = parseFloat(this.data.goodsInfo.goods_price) + parseFloat(this.data.goodsInfo.service_price);
    var allPayRmbPrice = parseFloat(this.data.goodsInfo.goods_price) + parseFloat(this.data.goodsInfo.service_price);
    allPayRmbPrice = allPayRmbPrice.toFixed(2); //保留2位小数
    this.data.goodsInfo.allPayRmbPrice = allPayRmbPrice;
    this.setData({
      goodsInfo: this.data.goodsInfo
    })
  },

  //选择支付方式
  selectPayType:function(res){
    // console.log("selectPayType:" + JSON.stringify(res));
    this.setData({
      pay_type: res.currentTarget.dataset.pay_type
    });

  },

  payTypeBindchange:function(res){
    // console.log("payTypeBindchange:"+JSON.stringify(res));
    this.data.pay_type = res.detail.value; 
  },

  /**
    * 下单备注
    */
  orderDescInputBindinput: function (res) {
    this.data.order_desc = res.detail.value;
  },

  //获取商品信息
  getGoodsInfo: function () {
    var that = this;
    var postData = {};
    postData.goods_id = this.data.goodsId;
    postData.spec_price_id = this.data.spec_price_id;//商品规格id
    postData.showSellerUser = 0;
    util.httpUtil.httpPost(util.httpUtil.url.GetGoodsInfo_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
          console.log(res.data);

        if (!util.dataUtil.isNullData(res.data)) {
          that.data.goodsInfo= util.httpUtil.objectHttpUrlHandle(res.data,'goods_pic');
          that.setData({
            goodsInfo: that.data.goodsInfo
          })
          that.calculateGoodsPrice();
        }
      }
    }, function (res) {
    }, function (res) {
    });
  },
  //获取地址
  getConAddr: function () {
    var that = this;
    var postData = {};
    postData.user_id = app.globalData.loginUserInfo.user_id;
    postData.def_flag = 1;
    util.httpUtil.httpPost(util.httpUtil.url.GetConAddr_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        that.setData({
          selectAddress: util.dataUtil.isNullData(res.data) ? null : res.data
        })
      } else {
        util.viewUtil.showToastNone(res.msg);
      }
    }, function (res) {
    }, function (res) {
      wx.stopPullDownRefresh();
    });
  },
//选择地址
  resultAddress:function(res){
    this.setData({
      selectAddress: res
    })
  },
  //支付商品
  payGoodsBindtap:function(res){
    var that = this;
    this.data.uploadTempFile = [];
    this.data.uploadSuccessFile = [];
    for (var i = 0; i < this.data.selectLocalImages.length; i++) {
      this.data.uploadTempFile.push(this.data.selectLocalImages[i]);
    }

    this.data.postData = {};
    this.data.postData.user_id = app.globalData.loginUserInfo.user_id;
    this.data.postData.goods_id = that.data.goodsInfo.goods_id;
    this.data.postData.order_desc = that.data.order_desc;
    this.data.postData.spec_price_id = that.data.goodsInfo.spec_price_id;//商品规格id
    this.data.postData.goods_price = that.data.goodsInfo.allPayRmbPrice;
    if (that.data.goodsInfo.goods_type == 0){//如果是普通商品
      if (util.dataUtil.isNullData(that.data.selectEnrollDateTime)) {
        util.viewUtil.showToastNone("请选择预约时间");
        return;
      }else{

        var date = new Date(that.data.selectEnrollDateTime);
        var curr_date = new Date();
        var selectEnrollDateTimeStamp = parseInt(date.getTime() / 1000);
        var currTimeStamp = parseInt(curr_date.getTime() / 1000);
        

        if (selectEnrollDateTimeStamp < currTimeStamp) {
          util.viewUtil.showToastNone("预约时间不能小于当前时间!");
          return;
        }


      }







      this.data.postData.covenant_time = that.data.selectEnrollDateTime;

    }
    if (that.data.goodsInfo.goods_type == 2) {//如果是服务商品
      
      this.data.postData.covenant_time = that.data.goodsInfo.service_date;

    }

    if (util.dataUtil.isNullData(that.data.selectAddress)){
      util.viewUtil.showToastNone("请选择地址");
      return;
    }
    this.data.postData.addr_id = that.data.selectAddress.addr_id;

    this.data.postGoodsFile = [];
    if (this.data.selectLocalImages.length == 0) {//如果没有上传图片
        this.saveOrderProcess();
    } else{//如果上传了图片
      if (util.dataUtil.isNullData(this.data.useSelectLocalImagesData)) {//初次上传图片提交
        this.uploadFileHandle();//处理上传图片
      } else if (this.data.useSelectLocalImagesData == JSON.stringify(this.data.selectLocalImages)) {//非初次提交，如果没有再上传新的图片
        this.saveOrderProcess();
      } else {//非初次提交，如果有再上传新的图片
        console.log('图片个数' + this.data.selectLocalImages.length);
        console.log('图片' + JSON.stringify(this.data.selectLocalImages));
        this.uploadFileHandle();//处理上传图片
      }
    }


    // if (this.data.hisPostData != JSON.stringify(this.data.postData)) {
    //   this.saveOrder();
    // } else if (util.dataUtil.isNullData(this.data.postResult)) {
    //   this.saveOrder();
    // } else {
    //   this.payOrderHandle(this.data.postResult);
    // }
  },

  //订单最后处理
  saveOrderProcess:function(){
    var that = this;
    if (this.data.hisPostData != JSON.stringify(this.data.postData)) {
      this.saveOrder();
    } else if (util.dataUtil.isNullData(this.data.postResult)) {
      this.saveOrder();
    } else {
      this.payOrderHandle(this.data.postResult);
    }

  },

  //上传文件
  uploadFileHandle: function () {
    var that = this;
    //暂存，防止重复提交。只有有新的图片上传，才会生成新的订单，否则不会生成新的订单
    that.data.useSelectLocalImagesData = JSON.stringify(that.data.selectLocalImages);

    util.viewUtil.showLoading('正在上传文件');
    var filePath = that.data.uploadTempFile[0];
    var formData = {};
    formData.type = 'service';
    util.httpUtil.uploadFile(util.httpUtil.url.UploadFile_Url, filePath, formData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        if (!util.dataUtil.isNullData(res.data)) {
          var fileItem = {};
          if (filePath == that.data.selectLocalImages[0]) {
            that.data.postData.goods_pic = res.data;
            fileItem.home_flag = 1;
          }
          fileItem.file_path = res.data;
          that.data.postGoodsFile.push(fileItem);
          that.data.uploadTempFile.shift();
          if (that.data.uploadTempFile.length > 0) {
            that.uploadFileHandle();
          } else {
            that.data.postData.goodsFiles = JSON.stringify(that.data.postGoodsFile);
            
            //console.log(that.data.hisPostData);
            that.saveOrderProcess();
          }
        } else {
          that.uploadFailHandle(filePath);
        }
      } else {
        that.uploadFailHandle(filePath);
      }
    }, function (res) {

    }, function (res) {

    });
  },
  uploadFailHandle: function (filePath) {
    var that = this;
    util.viewUtil.hideLoading();
    util.viewUtil.showModal("提示", filePath + "上传失败,是否继续上传!", function (res) {
      if (res.confirm) {
        that.uploadFileHandle();
      }
    });
  },



  //保存订单
  saveOrder: function(){
    util.viewUtil.showLoading('正在下单...');
    this.data.hisPostData = JSON.stringify(this.data.postData);
    var that = this;
    util.httpUtil.httpPost(util.httpUtil.url.SaveOrder_Url, this.data.postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        that.data.postResult = res.data;
        that.payOrderHandle(res.data);
      } else {
        util.viewUtil.showToastNone(res.msg);
      }
    }, function (res) {
    }, function (res) {
    });
  },
  //订单支付

  payOrderHandle: function (res) {
    var orderNo = res.order_no;
    if (util.dataUtil.isNullData(orderNo)) {
      this.data.postResult = {};
      util.viewUtil.showToastNone("没有支付信息");
      return;
    }
    var that = this;
    var postData = {};
    postData.order_no = orderNo;
    postData.open_id = app.globalData.loginUserInfo.wx_openid;
    postData.user_id = app.globalData.loginUserInfo.user_id;
    postData.pay_type = this.data.pay_type;
    if (postData.pay_type== 1) {//微信支付
      that.payGoods(postData);
    } else if (postData.pay_type == 4) {//婴淘支付
      if (app.isSetPayPassword(this.data.goodsInfo.allPayYtaoPrice)) {
        var keyboard = $wuxKeyBoard.show({
          callback(value) {
            postData.pay_password = md5Util.hexMD5(value);
            that.payGoods(postData);
            return true;
          },
        });
      }
    }

  },

  payGoods: function (postData) {
    var that = this;
    util.httpUtil.httpPost(util.httpUtil.url.PayGoods_Url, postData, function (res) {

      if (util.httpUtil.isRequestSuccess(res)) {
        if (postData.pay_type == 1) {//现金支付
          if (!util.dataUtil.isNullData(res.data)) {
            app.wxPay(res.data, function (res) {
              util.viewUtil.showToastNone(util.dataUtil.isNull(res.msg) ? "支付成功" : res.msg);
              that.goodsPaySucessResult();
            }, function (res) {
              util.viewUtil.showToastNone(util.dataUtil.isNull(res.msg) ? "支付失败" : res.msg);
            });
          } else {
            util.viewUtil.showToastNone(util.dataUtil.isNull(res.msg) ? "未知原因" : res.msg);
          }
        } else if (postData.pay_type == 4) {//婴淘支付
          util.viewUtil.showToastNone(util.dataUtil.isNull(res.msg) ? "支付成功" : res.msg);
          that.goodsPaySucessResult();
        }
      } else {
        util.viewUtil.showToastNone(util.dataUtil.isNull(res.msg) ? "未知原因" : res.msg);
      }
    }, function (res) {
    }, function (res) {
    });
  },



  goodsPaySucessResult: function () {
    var that = this;
    //that.sendSms();

    var pages = getCurrentPages();
    if (pages.length == 2){//分享页面购买商品页面后到订单页面
      var mainPage = pages[0]; //上一个页面
      wx.navigateBack();
      if (typeof mainPage.orderSaveResult === 'function') {
        mainPage.orderSaveResult();
      }
    }else{
      var mainPage = pages[0]; //首页
      wx.navigateBack({ delta: pages.length });
      if (typeof mainPage.myOrderSuccess === 'function') {
        mainPage.myOrderSuccess();
      }
    }
    
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
    this.refreshViewData();
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