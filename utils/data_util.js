

/**
 * 判断值是否为JSON 对象
 * @param data 判断的值
 */
module.exports.isJSON = function (data) {
  return typeof data == "object" && data != null && typeof data.length == "undefined";
}


//---------------------------------------------------------------
/**
 * 判断值是否为JSON Array
 * @param data 判断的值
 */
module.exports.isArray = function (data) {
  return typeof data == "object" && data != null && typeof data.length != "undefined";
}
//---------------------------------------------------------------
/**
 * 判断值是否为空值
 * @param data 判断的值
 */
module.exports.isNull = function (data) {
  if (data == undefined || data == null || data == '') return true;
  return false;
};

/**
 * 字符串空处理
 * @param data 判断的值
 */
module.exports.nullStrToEmpty = function (data) {
  if (isNullData(data)) {
    return "";
  } else if (typeof (data) == "string") {
    return data;
  }
  return data + "";
};


//---------------------------------------------------------------
/**
 * 判断值是否为空数据
 * @param data 判断的值
 */
module.exports.isNullData = function (data) {
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
