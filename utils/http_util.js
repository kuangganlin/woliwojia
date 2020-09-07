var logUtil =  require("./log_util.js");

var MainUrl = "https://www.irmhome.com/index.php";
var FileUrl = "https://www.irmhome.com";
var url = {
  //获取Open ID
  GetWxOpenId_Url: "/api/user/getWxOpenId",
   //解析电话号码
  WxPhoneDecrypt_Url: "/api/user/wxPhoneDecrypt",

  //获取用户资料
  GetUserInfo_Url: "/api/user/getUserInfo",
   //更新用户资料
  UpdateUserInfo_Url: "/api/user/updateUserInfo",
  
  //
  goods_url: MainUrl+"/api/goods",
  coupon_url: MainUrl+"/api/coupon",
  //获取商品分类
  GetGoodsTypes_Url: "/api/goods/getGoodsTypes",
  //获取品牌分类
  GetGoodsBrands_Url: "/api/goods/getGoodsBrands",
  //获取商品
  SearchGoods_Url:"/api/goods/searchGoods",
   //获取首页商品
  GetIndexGoodsList_Url:"/api/goods/getIndexGoodsList",
  //上传文件
  UploadFile_Url:"/api/upload/uploadFile",
  //发布福利
  AddCoupon_Url: "/api/coupon/addCoupon",
  //支付福利费用
  PayCoupon_Url: "/api/coupon/payCoupon",
  
  //我领到的订单列表  kgl
  MyOrderList_Url:"/api/order/myOrderList",
  
  //用户删除我领到的单个订单  kgl
  DelOrder_Url:"/api/order/delOrder",
  
  //我送出的的订单列表  kgl
  SoldOrderList_Url:"/api/order/soldOrderList",
  
  //我的用户信息  kgl
  UserInfo_Url:"/api/assets/userInfo",
  //获取广告信息
  GetAd_Url:"/api/ad/show",
  //检索搜索关键字 zy
  GetMatchSearchKey_Url: "/api/search/getMatchSearchKey",
  //热门搜索 zy
  GetHotSearchWord_Url: "/api/search/getHotSearchWord",
  //用户搜索记录 zy
  GetUserSearchWord_Url: "/api/search/getUserSearchWord",
  //清楚用户搜索记录 zy
  ClearUserSearchWord_Url: "/api/search/clearUserSearchWord",
  
  //获取商品信息2018-9-23 kgl
  GetGoodsInfo_Url: "/api/goods/getGoodsInfo",
  //获取用户地址 zy
  GetConAddr_Url: "/api/user/getConAddr",
   //添加用户地址 zy
  AddConAddr_Url: "/api/user/addConAddr",
  //刪除用户地址 zy
  DeleteConAddr_Url: "/api/user/deleteConAddr",
  //更新用户地址 zy
  UpdateConAddr_Url: "/api/user/updateConAddr",
   //生成商品订单
  SaveOrder_Url : "/api/order/saveOrderInfo",
  
  //订单支付 kgl
  PayGoods_Url:"/api/order/payGoods",
  
  //增加费用订单支付 kgl
  PayGoodsAddPrice_Url:"/api/order/payGoodsAddPrice",
  
    //我的商品、活动收藏  kgl
  ShowMycollectionList_Url:"/api/collection/showMycollectionList",
  
   //删除我的收藏  kgl
  DelCollection_Url:"/api/collection/delCollection",
  
    //我领到的订单列表  kgl
  MyOrderList_Url:"/api/order/myOrderList",
  
    //取得单个订单的信息 kgl
  GetOrderInfo_Url:"/api/order/getOrderInfo",
  
  //取得订单追加费用的信息 kgl
  GetOrderInfoAddPrice_Url:"/api/order/getOrderInfoAddPrice",
  
  
  
  //取消我的单个订单  zy
  CancelOrderInfo_Url: "/api/order/cancelOrderInfo",
  
  //确认师傅完成我的单个订单  kgl
  ConfirmOrderInfo_Url: "/api/order/confirmOrderInfo",
  
  //关闭我的单个订单  kgl
  CloseOrderInfo_Url: "/api/order/closeOrderInfo",

  //修改我的单个订单的预约时间  kgl
  ModifyOrderCovenantTimeInfo_Url: "/api/order/modifyOrderCovenantTimeInfo",
  
  //取得订单的退款手续费  kgl
  GetRefundRatioInfo_Url: "/api/order/getRefundRatioInfo",
  
  
  //用户对订单进行确认增加费用  kgl
  ConfirmAddOrderPrice_Url: "/api/order/confirmAddOrderPrice",

  //用户对订单进行确认增加费用  kgl
  ConfirmUserAddOrderPrice_Url: "/api/order/confirmUserAddOrderPrice",

  //用户对订单进行确认增加费用  kgl
  UnConfirmUserAddOrderPrice_Url: "/api/order/unconfirmUserAddOrderPrice",

  
  //获取用户评论
  GetGoodsCommenList_Url:"/api/goods/getGoodsCommentList",
  
    //用户统计  zy
  GetUserStatistics_Url: "/api/user/getUserStatistics",
  
  //获得单个订单及订单的商品详情 kgl
  GetOrderDetail_Url:"/api/order/getOrderDetail",
  //买家评价订单  kgl
  EvaluationOrder_Url:"/api/order/evaluationOrder",
  //获取系统配置的下单须知
  GetOrderSystemInfoConfig_Url:"/api/sys_config/getOrderSystemInfoConfig",
};


//查看数据是否成功
module.exports.isRequestSuccess = function (res) {
  if (res == undefined || res == null){
    return false;
  }
  if (res.status == undefined || res.status == null)
    return false;
  if (res.status == "1") {
    return true;
  }
  return false;
}


//获取图片地址
module.exports.getHttpImgPath = function (path) {
  if (path == undefined || path == null) {
    return "";
  }
  if (path.substring(0, 4) == "http") {
    return path;
  } else if (path.substring(0, 1) == "/") {
    return FileUrl + path;
  } else {
    return FileUrl + "/" + path;
  }
}

//httpUrl 地址处理
module.exports.httpUrlHandle = httpUrlHandle;
function  httpUrlHandle(path) {
  if (path == undefined || path == null) {
    return "";
  }
  if (path.substring(0, 4) == "http"){
    return path;
  }else if (path.substring(0, 1) == "/") {
    return FileUrl + path;
  } else {
    return FileUrl + "/" + path;
  }
}


//httpUrl url进行encodeURI处理
module.exports.httpUrlEncodeURI = httpUrlEncodeURI;
function  httpUrlEncodeURI(path) {
  if (path == undefined || path == null) {
    return "";
  }
  var encodePath = encodeURIComponent(path);
  return encodePath;
}

/**
 * 
 * 对象/数组中需要加全路径访问地址操作
 * 第一个参数为需要改变的对象/数组，
 * 后面的参数为对象/数组中需要改变地址路径的key
 */
module.exports.objectHttpUrlHandle = function () {
  var data ;
  var keys=[];
  if (arguments.length == 0){
    return null;
  }
  for (var i = 0; i < arguments.length; i++){
    if(i == 0){
      data = arguments[i];
    }else{
      keys.push(arguments[i]);
    }
  }
  if (keys.length == 0){
    return data;
  }
  if(data instanceof Array){
    for(var i = 0; i < data.length; i++){
      var item = data[i];
      if(item instanceof Object){
        for (var key in item) {
          for (var j = 0; j < keys.length;j++){
            if (key == keys[j]){
              item[key] = httpUrlHandle(item[key]);
            }
          }
        }
      }
    }
  } else if (data instanceof Object){
    for (var key in data) {
      for (var j = 0; j < keys.length; j++) {
        if (key == keys[j]) {
          data[key] = httpUrlHandle(data[key]);
        }
      }
    }
  }
  return data;
}

/**
 * sessionc处理
 */
function sessionIdHandle(res) {
  var cookies = res.header["Set-Cookie"];
  if (cookies != null) {
    cookies = cookies.split(";")[0]
    if (cookies != sessionId) {
      wx.setStorage({
        key: SessionIdKey,
        data: cookies,
      })
    }
  }
}
/**
 * 拼接参数
 */
function builderurlencoded(data) {
  if (data == null) return "";
  var _paraStr = "";
  if (typeof (data) == "string") {
    _paraStr = data;
  } else {
    for (var _key in data) {
      if (_paraStr.length > 0) {
        _paraStr += "&";
      }
      _paraStr = _paraStr + encodeURIComponent(_key) + "=" + encodeURIComponent(data[_key]);
    }
  }
  return _paraStr;
}


/**
 * get 请求参数
 * @param title 标题
 * @param mask 是否显示透明蒙层，防止触摸穿透，默认：false
 */
var SessionIdKey ="SessionIdKey"
function httpGet(url, data, success, fail, complete) {
  var sessionId = wx.getStorageSync(SessionIdKey)
  if (url.substring(0, 4) != "http") {
    url = MainUrl + url;
  }

  var paraStr = builderurlencoded(data);
  if(paraStr.length > 0){
    if (url.indexOf("?") >= 0) {
      url += "&" + paraStr;
    } else {
      url += "?" + paraStr;
    }
  }
  logUtil.logInfo("请求:url：" + url + "    参数：" + JSON.stringify(data));
  wx.request({
    url: url,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': sessionId
    },
    method: 'GET',
    success: function (res) {
      sessionIdHandle(res);
      successHandle(res, success);
    },
    fail: function (res) {
      if (fail != null) {
        fail(res.data);
      }
    }, complete: function () {
      if (complete != null) {
        complete();
      }
    }
  });
}

/**
 * url 请求地址
 * success 成功的回调
 * fail 失败的回调
 * complete 完成回调
 */
function httpPost(url, data, success, fail, complete) {
  var sessionId = wx.getStorageSync(SessionIdKey)
  if (url.substring(0, 4) != "http") {
    url = MainUrl + url;
  }
 
  logUtil.logInfo("请求:url：" + url+"参数："+JSON.stringify(data));
  wx.request({
    url: url,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Cookie': sessionId
    },
    method: 'POST',
    data: data,
    success: function (res) {
      sessionIdHandle(res);
      successHandle(res, success);
    },
    fail: function (res) {
      if (fail != null) {
        fail(res.data);
      }
    }, complete: function () {
      if (complete != null) {
        complete();
      }
    }
  });
}



function successHandle(res, success){
  logUtil.logInfo("反馈:" + JSON.stringify(res));
  if (success != null) {
    if (typeof (res.data) == "string") {
      if (isJSON(res.data)) {
        success(JSON.parse(res.data));
      } else {
        success(res.data);
      }
    } else {
      success(res.data);
    }
  }
}

function uploadFile(url, filePath, formData, success, fail, complete) {
  var sessionId = wx.getStorageSync(SessionIdKey)
  if (url.substring(0, 4) != "http") {
    url = MainUrl + url;
  }
  logUtil.logInfo("----_upload_file_start---------");
  var fileName = filePath.substring(filePath.indexOf('//') + 2, filePath.length);
  if(formData == null){
    formData = { fileName: fileName};
  }else{
    formData.fileName = fileName;
  }
  var uploadTask  = wx.uploadFile({
    url: url,
    header: {
      'content-type': 'multipart/form-data',
      'Cookie': sessionId
    },
    filePath: filePath,
    name: "file",
    formData: formData,
    success: function (res) {
      // sessionIdHandle(res);
      successHandle(res, success);
    },
    fail: function (res) {
      if (fail != null) {
        fail(res.data);
      }
    }, complete: function () {
      logUtil.logInfo("----_upload_file_end---------");
      if (complete != null){
        complete();
      }
    }
  });
  return uploadTask;
}

/**
 * url 请求地址
 * files 上传文件
 * formData 提交数据
 * complete 完成回调
 */
function uploadFiles(url, files, formData, complete) {
  if (url.indexOf("http") == -1) {
    url = localURL + url;
  }
  var that = this;
  var i = files.i ? files.i : 0;
  var success = files.success ? files.success : 0;
  var fail = files.fail ? files.fail : 0;
  var successFiles = files.successFiles ? files.successFiles : new Array();
  var failFiles = files.failFiles ? files.failFiles : new Array();
  var fileNames = files.fileNames ? files.fileNames : new Array();
  var filePath = files.path[i];
  var fileName = filePath.substring(filePath.indexOf('//') + 2, filePath.length);
  formData.file = fileName;

  logUtil.logInfo("----_upload_file-------");
  var sessionId = wx.getStorageSync(SessionIdKey)
  wx.uploadFile({
    url: url,
    header: {
      'content-type': 'multipart/form-data',
      'Cookie': sessionId
    },
    filePath: filePath,
    name: "file",
    formData: formData,
    success: function (res) {
      res = JSON.parse(res.data);
      if (isRequestSuccess(res)) {//上传成功
        fileNames.push(fileName);
        successFiles.push(res.filePath);
        success++;
      } else {
        failFiles.push(filePath);
        fail++;
      }
    },
    fail: function (res) {
      fail++;
      failFiles.push(filePath);
    }, complete: function () {
      i++;
      files.i = i;
      files.fileNames = fileNames;
      files.success = success;
      files.fail = fail;
      files.successFiles = successFiles;
      files.failFiles = failFiles;
      if (i == files.path.length) {  //当图片传完时，停止调用     
        logUtil.logInfo('成功：' + success + " 失败：" + fail);
        complete(files);
      } else {//若图片还没有传完，则继续调用函数
        that.uploadFiles(url, files, formData, complete);
      }
    }
  })
}

function isJSON(str) {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  }
}

function isNullData(data) {
  if (data == undefined || data == null) return true;
  if (typeof (data) == "string" && data.length <= 0) return true;
  if (typeof (data) == "object") {
    var n = 0;
    for (var o in data) {
      n++;
    }
    if (n <= 0) return true;
  }
  return false;
};
module.exports.httpGet = httpGet;
module.exports.httpPost = httpPost;
module.exports.uploadFiles = uploadFiles;
module.exports.uploadFile = uploadFile;
module.exports.PageSize = 20;
module.exports.MainUrl = MainUrl;
module.exports.url = url;
module.exports.FileUrl = FileUrl;
