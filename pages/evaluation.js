// pages/evaluation.js
var app = getApp();
var util = require('../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: null,
    selectLocalImages: [],
    orderId: 0,
    service_grade:0,
    task_grade: 0,
    timely_grade: 0,
    dress_grade: 0,
    speak_grade: 0,
    pay_grade: 0,
    selectedAllStatus: false,
    evaluationContent: ''
  },
  changeColor1:function(e){
    this.setData({
      service_grade: e.currentTarget.dataset.service_grade
    })

  },
  changeColor2: function (e) {
    this.setData({
      task_grade: e.currentTarget.dataset.task_grade
    })

  },
  changeColor3: function (e) {
    this.setData({
      timely_grade: e.currentTarget.dataset.timely_grade
    })

  },
  changeColor4: function (e) {
    this.setData({
      dress_grade: e.currentTarget.dataset.dress_grade
    })

  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (util.dataUtil.isNullData(options.orderId)) {
      util.viewUtil.showModal("提示", "没有传递订单ID", function (res) {
        wx.navigateBack({});
      })
      return;
    }
    that.setData({ orderId: options.orderId });

    that.getOrderDetail();
  },

  /**
   * 得到订单信息
   */
  getOrderDetail: function () {
    var that = this;
    var postData = {};
    postData.order_id = this.data.orderId;
    util.httpUtil.httpPost(util.httpUtil.url.GetOrderDetail_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        if (!util.dataUtil.isNullData(res.data)) {
          util.httpUtil.objectHttpUrlHandle(res.data.order_file_list, 'file_path');
          util.httpUtil.objectHttpUrlHandle(res.data.order_file_list_success, 'file_path');
          //res.data.seller_user_info.showUserName = util.entityUtil.getShowUserName(res.data.seller_user_info);
          that.setData({ orderInfo: res.data });
          console.log(res.data);
        }
      } else {
        util.viewUtil.showToastNone('获取信息失败');
      }
    }, function (res) {
    }, function (res) {
    });

  },

  /**
   * 全选、反选
   */

  bindSelectAll: function () {
    var selectedAllStatus = this.data.selectedAllStatus;
    selectedAllStatus = !selectedAllStatus;
     if (!selectedAllStatus) {//反选
      this.setData({
        selectedAllStatus: selectedAllStatus,  
      });
    } else {//全选
      this.setData({
        selectedAllStatus: selectedAllStatus,
      });
    }
  },

   /**
    * 评价描述
    */
  goodsEvaluationInputBindinput: function (res) {
    this.data.evaluationContent = res.detail.value;
  },

  /**
   * 提交评价
   */
  saveEvaluationClickEvent: function () {
    var that = this;

    this.data.uploadTempFile = [];
    this.data.uploadSuccessFile = [];

    var service_grade = that.data.service_grade;
    var task_grade = that.data.task_grade;
    var timely_grade = that.data.timely_grade;
    var dress_grade = that.data.dress_grade;
    

    var evaluationContent = that.data.evaluationContent;
    if (util.dataUtil.isNull(evaluationContent)) {
      util.viewUtil.showToastNone('请填写一下评价吧!');
      return;
    }

    for (var i = 0; i < this.data.selectLocalImages.length; i++) {
      this.data.uploadTempFile.push(this.data.selectLocalImages[i]);
    }
    
    
    
    //var postData = {};
    this.data.postData = {};
    this.data.postData.order_id = that.data.orderInfo.order_id;
    this.data.postData.user_id = that.data.orderInfo.service_user_id;//服务的师傅id

    var selectedAllStatus = this.data.selectedAllStatus;
    if (!selectedAllStatus) {//反选
      this.data.postData.anonymous = 0;//非匿名
    }else{
      this.data.postData.anonymous = 1;//匿名
    }

    this.data.postData.evt_desc = that.data.evaluationContent;
    this.data.postData.service_grade = that.data.service_grade;
    this.data.postData.task_grade = that.data.task_grade;
    this.data.postData.timely_grade = that.data.timely_grade;
    this.data.postData.dress_grade = that.data.dress_grade;
    
    


    this.data.postData.goods_id = that.data.orderInfo.goods_info.goods_id;
    this.data.postData.evt_user_id = app.globalData.loginUserInfo.user_id;


    this.data.postGoodsFile = [];
    if (this.data.selectLocalImages.length == 0) {//如果没有上传评价图片
      this.postEvaluationInfo();
    }else{
      this.uploadFileHandle();//处理上传图片

    }
   


    // util.httpUtil.httpPost(util.httpUtil.url.EvaluationOrder_Url, this.data.postData, function (res) {

    //   if (util.httpUtil.isRequestSuccess(res)) {
    //     that.updatePage();
    //   }
    //   util.viewUtil.showToastNone(res.msg);
    // }, function (res) {
    // }, function (res) {
    // });

    //提交到数据库

  },


  //上传文件
  uploadFileHandle: function () {
    var that = this;
    util.viewUtil.showLoading('正在上传文件');
    var filePath = that.data.uploadTempFile[0];
    var formData = {};
    formData.type = 'goods';
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
            that.postEvaluationInfo();
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

  //发布评价图片
  postEvaluationInfo: function () {
    var that = this;


    util.httpUtil.httpPost(util.httpUtil.url.EvaluationOrder_Url, this.data.postData, function (res) {

      if (util.httpUtil.isRequestSuccess(res)) {
        that.updatePage();
      }
      util.viewUtil.showToastNone(res.msg);
    }, function (res) {
    }, function (res) {
    });





    // util.httpUtil.httpPost(util.httpUtil.url.AddGoods_Url, this.data.postData, function (res) {
    //   if (util.httpUtil.isRequestSuccess(res)) {
    //     that.postGoodsInfoSucessResult();
    //   }
    //   util.viewUtil.showToastNone(res.msg);
    // }, function (res) {
    // }, function (res) {
      
    // });


  },

  postGoodsInfoSucessResult: function () {
    if (this.data.resultType == 1) {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      wx.navigateBack({});
      if (!util.dataUtil.isNullData(prevPage)) {
        if (typeof prevPage.publishGoodsResult === 'function') {
          prevPage.publishGoodsResult();
        }
      }
    } else {
      var pages = getCurrentPages();
      var mainPage = pages[0]; //上一个页面
      wx.navigateBack({ delta: pages.length });
      if (typeof mainPage.publishGoodsResult === 'function') {
        mainPage.publishGoodsResult();
      }
    }


  },






  /**
   *  
   */
  updatePage: function () {
    var pages = getCurrentPages();//所有页面栈
    var prevPage = pages[pages.length - 2];  //上一个页面
    if (!util.dataUtil.isNull(prevPage)) {
      wx.navigateBack({
        delta: 1
      })
      if (typeof prevPage.orderEvaluationResult === 'function') {
        prevPage.orderEvaluationResult();
      }
    }
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
  onShareAppMessage: function () {
  
  }
})