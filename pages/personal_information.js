// pages/personal_information.js
var app = getApp();
var util = require("../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalputNickname: true,
    hiddenmodalputSign: true,
    hiddenmodalputSex: true,
    modelName: "",
    modelValue: "",
    userInfo: app.globalData.loginUserInfo,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.getUersInfoNew(function() {
      that.setData({
        userInfo: app.globalData.loginUserInfo,
      })
    });
  },
  //编辑常用地址----选择地址页面返回  微信自带地图包
  addrSelectBindTap: function(res) {
    var that = this;
    wx.chooseLocation({
      success: function(res) {
        console.log(JSON.stringify(res));
        app.updateUserInfo({
          address: res.address
        }, function() {
          app.getUersInfoNew(function() {
            that.setData({
              userInfo: app.globalData.loginUserInfo,
            })
          })
        });
      },
    })
  },
  //编辑生日
  editBirthday:function(e){
    var that=this;
    app.updateUserInfo({
      birthday: e.detail.value
    }, function () {
      app.getUersInfoNew(function () {
        that.setData({
          userInfo: app.globalData.loginUserInfo,
        })
      })
    });
  } ,
  //编辑头像
  editHeadImg: function() {
    var that = this;
    wx.chooseImage({
      count: 1, //最多可以选择的图片总数    
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有    
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function(res) { // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
        var url = util.httpUtil.url.UploadFile_Url;
        var filePath = res.tempFilePaths[0];
        var formData = {
          type: "headImg"
        };
        var success = function(res) {
          var headImg = util.httpUtil.FileUrl + "/" + res.data;
          app.updateUserInfo({
            head_pic: headImg
          }, function() {
            app.getUersInfoNew(function() {
              that.setData({
                userInfo: app.globalData.loginUserInfo,
              })
            })
          });
        }
        var fail = function(res) {
        }
        var complete = function(res) {
        }
        util.httpUtil.uploadFile(url, filePath, formData, success, fail, complete);
      }
    });

  },
  //编辑性别
  editSex: function() {
    var that = this;
    wx.showActionSheet({
      itemList: ['保密', '男', '女'],
      success: function(res) {
        app.updateUserInfo({
          sex: res.tapIndex
        }, function() {
          app.getUersInfoNew(function() {
            that.setData({
              userInfo: app.globalData.loginUserInfo,
            })
          })
        });
        if (0 == res.tapIndex) {
          wx.showToast({
            title: '保密',
          })
        } else if (1 == res.tapIndex) {
          wx.showToast({
            title: '男',
          })
        } else if (2 == res.tapIndex) {
          wx.showToast({
            title: '女',
          })
        }
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },
  //编辑昵称
  editNickname: function() {
    this.setData({
      hiddenmodalputNickname: false,
      modelName: "输入昵称",
      modelValue: this.data.userInfo.nickname,
    })
  },
  //编辑签名
  editSign: function() {
    this.setData({
      hiddenmodalputSign: false,
      modelName: "输入个性签名",
      modelValue: this.data.userInfo.signature_desc,
    })
  },
  modalCancel: function() {
    this.setData({
      modelValue: '',
    })
  },
  modalConfirmNickname: function(e) {
    var that = this;
    app.updateUserInfo({
      nickname: that.data.modelValue
    }, function() {
      app.getUersInfoNew(function() {
        that.setData({
          userInfo: app.globalData.loginUserInfo,
          hiddenmodalputNickname: true,
        })
      })
    });
  },
  modalConfirmSign: function(e) {
    var that = this;
    app.updateUserInfo({
      signature_desc: that.data.modelValue
    }, function() {
      app.getUersInfoNew(function() {
        that.setData({
          userInfo: app.globalData.loginUserInfo,
          hiddenmodalputSign: true,
        })
      })
    });
  },
  inputValue: function(e) {
    this.setData({
      modelValue: e.detail.value,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})