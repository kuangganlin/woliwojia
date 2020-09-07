

//用户名称解析
module.exports.getShowUserName = function (data) {
  if (isNull(data)) {
    return "匿名";
  }
  if (!isNull(data.nickname)){
    return data.nickname;
  }
  if (!isNull(data.userAccount)) {
    return data.userAccount;
  }
  if (!isNull(data.mobile)) {
    return data.mobile.replace(data.mobile.substring(3,9), '**');
  }
  if (!isNull(data.publish_type)){
    if (data.publish_type == 0){
      return "官方";
    }
  }
  return "匿名";
}

//用户名称解析
module.exports.getMsgShowUserName = function (data) {
  if (isNull(data)) {
    return "匿名";
  }
  if (!isNull(data.msg_nickname)) {
    return data.msg_nickname;
  }
  if (!isNull(data.msg_userAccount)) {
    return data.msg_userAccount;
  }
  if (!isNull(data.msg_mobile)) {
    return data.msg_mobile.replace(data.msg_mobile.substring(3, 9), '**');
  }
  if (!isNull(data.msg_publish_type)) {
    if (data.msg_publish_type == 0) {
      return "官方";
    }
  }
  return "匿名";
}
//隐藏手机号码显示
module.exports.hideShowPhone = function(phone){
  if (isNull(phone)) {
    return "未知";
  }
  if (phone.length <= 3){
    return phone;
  }else  if (phone.length <= 6){
    return phone.replace(phone.substring(2, phone.length-2), '***');
  }else {
    return phone.replace(phone.substring(3, phone.length - 3), '***');
  }

}

function isNull(data) {
  if (data == undefined || data == null || data == '') return true;
  return false;
};