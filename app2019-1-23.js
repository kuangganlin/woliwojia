var util = require("./utils/util.js");
var amap = require('./libs/amap-wx.js');
var JMessage = require('./libs/jmessage-wxapplet-sdk-1.4.0.min.js');//引入激光的即时通讯
var jim = new JMessage({
   debug : true
});
jim.init({
  

  "appkey": "4f7aef34fb361292c566a1cd",
  "random_str": "404",
  "signature": '7db047a67a9d7293850ac69d14cc82bf',
  "timestamp": 1507882399401



}).onSuccess(function (data) {
  //TODO
}).onFail(function (data) {
  //TODO
});  



App({
  onLaunch: function() {
    
    this.getStore();// 展示本地存储能力
    this.wxCheckSession(); //其实是判断本地缓存里面是否有openid
    //this.wxLogin();
    //获取定位信息
    //this.getLocation();

    //获取系统配置的下单须知
    this.getOrderSystemInfo();
    this.wxVersionUpdate();

  },


  //获取系统配置的下单须知
  getOrderSystemInfo: function (_success) {
    var that = this;
    var postData = {};
    
      util.httpUtil.httpPost(util.httpUtil.url.GetOrderSystemInfoConfig_Url, null, function (res) {
        
        if (util.httpUtil.isRequestSuccess(res)) {
         
          if (!util.dataUtil.isNullData(res.data)) {
            
            that.globalData.orderNotice = res.data.order_notice;
            
            
            if (_success != null) {
              _success(that.globalData.orderNotice);
            }
          }
        }
        if (_success != null) {
          _success(res);
        }
      }, function (res) {
      }, function (res) {
      });
   
    

  },

  //获取存储
  getStore:function(){
    this.globalData.wxOpenId = wx.getStorageSync(this.globalData.StoreWxOpenIdKey);
    this.globalData.wxUserInfo = wx.getStorageSync(this.globalData.StoreWxUserInfoKey);//获取存储的从微信服务端获取的用户信息
    this.globalData.loginUserInfo = wx.getStorageSync(this.globalData.StoreLoginUserInfoKey);//获取存储的从服务器数据库获取的用户信息
    this.globalData.authSetting = wx.getStorageSync(this.globalData.StoreWxAuthSettingKey);//获取存储的是否授权获取基本信息
    this.globalData.authSetting_mobile = wx.getStorageSync(this.globalData.StoreWxAuthSetting_mobileKey);//获取存储的是否授权获取电话信息
  },
  //重新获取用户信息
  getUersInfoNew: function (_success){
    var that = this;
    var postData = {
      wxOpenId: that.globalData.wxOpenId
    };
    util.httpUtil.httpPost(util.httpUtil.url.GetUserInfo_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        if (!util.dataUtil.isNullData(res.data)) {
          wx.setStorageSync(that.globalData.StoreLoginUserInfoKey, res.data);
          that.globalData.loginUserInfo = wx.getStorageSync(that.globalData.StoreLoginUserInfoKey);;
          console.log("重新获取后台用户数据:" + JSON.stringify(that.globalData.loginUserInfo));
        }
      }
      if (_success != null) {
        _success();
      }
    }, function (res) { }, function (res) { }
    );
  },
  //登录 
  wxLogin: function(_success) {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("wx.login成功:" + JSON.stringify(res));
        if (res.code) { //&& this.globalData.wxOpenId == null
          this.getWxOpenId(res.code, _success);
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log("授权情况:" + JSON.stringify(res));
        if (res.authSetting['scope.userInfo']) {
          wx.setStorageSync(this.globalData.StoreWxAuthSettingKey, 1);
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              console.log("getUserInfo:"+JSON.stringify(res));

              this.globalData.wxUserInfo = res.userInfo;
              this.globalData.authSetting =1;
              console.log(res.userInfo.nickName);
              this.updateUserInfo({ nickname: res.userInfo.nickName, head_pic: res.userInfo.avatarUrl,sex:res.userInfo.gender});
              wx.setStorageSync(this.globalData.StoreWxUserInfoKey, res.userInfo);
              wx.setStorageSync(this.globalData.StoreWxAuthSettingKey, 1)
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (typeof _success == "function") {
                _success();
              }
            }
          })
        }
      }
    });

},
//获取openid 并保存到后台数据库,并读取用户信息表供后期更新用户数据
getWxOpenId: function(code, _success) {
  console.log("开始获取openid..");
  var that = this;
  var postData = {
    code: code
  };
  util.httpUtil.httpPost(util.httpUtil.url.GetWxOpenId_Url, postData, function(res) {
    console.log(JSON.stringify(res));
    if (util.httpUtil.isRequestSuccess(res)) {
      if (!util.dataUtil.isNullData(res.data)) {
        that.globalData.wxOpenId = res.data.wx_openid; console.log('我的openid:' + res.data.wx_openid);
        wx.setStorageSync(that.globalData.StoreWxOpenIdKey, that.globalData.wxOpenId);
        wx.setStorageSync(that.globalData.StoreLoginUserInfoKey, res.data);
        that.globalData.loginUserInfo = res.data;
        console.log("首次存入openid并获取后台用户数据:"+JSON.stringify(that.globalData.loginUserInfo));
      }
    }
    if (_success != null) {
      _success(res);
    }
  }, function(res) {}, function(res) {}
  );
},
//校验用户当前session_key是否有效
wxCheckSession: function(_success, _fail) {
  var that = this;
  wx.checkSession({
    success: function() {
      console.log("session_key有效");
    },
    fail: function() {
      if (_fail != null) {
        _fail();
      }
      console.log("session_key失效");
      that.wxLogin(_success);
    }
  })
},
//更新用户信息
updateUserInfo: function(postData, _success) {
  var that = this;
  if (util.dataUtil.isNullData(postData)) {
    return;
  }
  if (util.dataUtil.isNullData(postData.user_id)) {
    postData.user_id = this.globalData.loginUserInfo.user_id;
  }


  util.httpUtil.httpPost(util.httpUtil.url.UpdateUserInfo_Url, postData, function(res) {
    if (util.httpUtil.isRequestSuccess(res)) {
      if (!util.dataUtil.isNullData(res.data)) {
        if (res.data instanceof Object) {
          for (var key in res.data) {
            if (key == 'head_pic') {
              that.globalData.loginUserInfo[key] = util.httpUtil.httpUrlHandle(res.data[key]);
            } else {
              that.globalData.loginUserInfo[key] = res.data[key];
            }
          }
        }
      }
    }
    if (_success != null) {
      _success(res);
    }
  }, function(res) {}, function(res) {});
},
  //微信获取手机号码
  wxGetUserPhone: function (phoneInfo, _success) {
    wx.setStorageSync(this.globalData.StoreWxAuthSetting_mobileKey,1);
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          var postData = {};
          postData.encryptedData = phoneInfo.encryptedData;
          postData.iv = phoneInfo.iv;
          postData.code = res.code;
          if (util.dataUtil.isNullData(that.globalData.loginUserInfo)) {
            postData.shareUserId = that.globalData.shareUserId;
          }
          that.getWxPhoneDecrypt(postData, _success);
        }
      }
    })
  },

  //手机号码解析
  getWxPhoneDecrypt: function (postData, _success) {
    var that = this;
    util.httpUtil.httpPost(util.httpUtil.url.WxPhoneDecrypt_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        if (!util.dataUtil.isNullData(res.data)) {
          console.log("解析手机号码,存入,读取出数据"+JSON.stringify(res.data));
          //保存注册用户信息
          wx.setStorageSync(that.globalData.StoreLoginUserInfoKey, res.data);
          that.globalData.loginUserInfo = res.data;

          //that.saveLoginUserInfo(res.data);
        }
      }

    }, function (res) {
    }, function (res) {
    });
  },
  //保存用户登录资料 手机号码
  saveLoginUserInfo: function (data) {
    if (!util.dataUtil.isNullData(data.head_pic)) {
      data.head_pic = util.httpUtil.httpUrlHandle(data.head_pic);
    }
    this.globalData.loginUserInfo = data;
    //this.globalData.loginUserInfo.showUserName = util.entityUtil.getShowUserName(data);
    wx.setStorageSync(this.globalData.StoreLoginUserInfoKey, data);
    this.getUersInfoNew();
  },

  //微信支付
  wxPay: function (params, _success, _fail) {
    wx.requestPayment(
      {
        timeStamp: params.timeStamp,
        nonceStr: params.nonceStr,
        package: params.package,
        signType: params.signType,
        paySign: params.paySign,
        success: function (res) {
          if (_success != null) {
            _success(res);
          }
        },
        fail: function (res) {
          if (_fail != null) {
            _fail(res);
          }
        }
      })
  },
  
  //获取定位信息
  getLocation: function (_success, _fail) {
    var that = this;
    wx.getLocation({
      type: "gcj02",
      success: function (res) {
        if (res != undefined && res != null) {
          if (util.dataUtil.isNullData(res.latitude) || util.dataUtil.isNullData(res.longitude)) {
            if (_fail != null) {
              _fail();
            }
          } else {
            that.globalData.locationInfo = res;
            that.globalData.selectLocationAddr = res;
            if (_success != null) {
              _success(res);
            }
          }

        }
      },
      fail: function () {
        if (_fail != null) {
          _fail();
        }
      }
    })
  },

  //微信版本更新
  wxVersionUpdate: function () {
    var updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      util.logUtil.logInfo(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
    })
  },
  //高德经纬度逆袭地址
  gaodeGetRegeo: function (latitude, longitude, _success) {
    var that = this;
    var AMap = new amap.AMapWX({ key: that.globalData.gaodeAk });
    AMap.getRegeo({
      location: longitude + "," + latitude,
      success: function (data) {
        if (!util.dataUtil.isNullData(data)) {
          that.globalData.analysisAddress = {
            longitude: data[0].longitude,
            latitude: data[0].latitude,
            country: data[0].regeocodeData.addressComponent.country,
            province: data[0].regeocodeData.addressComponent.province,
            city: data[0].regeocodeData.addressComponent.city,
            district: data[0].regeocodeData.addressComponent.district,
            address: data[0].regeocodeData.formatted_address
          }
        }
        if (_success != null) {
          _success(that.globalData.analysisAddress);
        }
        // console.log("getRegeo-success:" + JSON.stringify(that.globalData.analysisAddress));
        // console.log("getRegeo-success:" + JSON.stringify(data));
      },
      fail: function (info) {
      }
    });
  },
  //设置选择位置
  setSelectLocationAddr: function (res,_success) {
    if (!util.dataUtil.isNullData(res)) {
      this.globalData.selectLocationAddr = res;
      _success;
    }
  }, 
globalData: {
  StoreWxOpenIdKey: "StoreWxOpenIdKey",
  StoreWxUserInfoKey: "StoreWxUserInfoKey",
  StoreWxAuthSettingKey: "StoreWxAuthSettingKey",
  StoreWxAuthSetting_mobileKey: "StoreWxAuthSetting_mobileKey",
  StoreLoginUserInfoKey: "StoreLoginUserInfoKey",
  loginUserInfo:'',
  orderNotice: '下单须知',
  wxUserInfo: null,
  wxOpenId: null, //微信openid
  wxUnionId: "", //微信unionId
  authSetting: 0, //微信授权情况
  authSetting_mobile: 0, //微信授权情况
  locationInfo: {},//当前定位位置
  selectLocationAddr: {},//选择定位位置

  gaodeAk: '3eb23b956a13ccfb3255adaa3e67fd67',//高德地图ak

}
})