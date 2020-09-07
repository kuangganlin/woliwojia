
/**
 * 提示框
 * @param title 标题
 * @param duration 提示的延迟时间，单位毫秒，默认：1500
 * @param mask 是否显示透明蒙层，防止触摸穿透，默认：false
 */
module.exports.showToastNone = function (title, duration, mask){
  wx.showToast({
    icon:'none',
    title: title,
    duration: isNull(duration) ? 1500 : duration,
    mask: isNull(mask) ? false : mask
  })
}


/**
 * loading 提示框
 * @param title 标题
 * @param mask 是否显示透明蒙层，防止触摸穿透，默认：false
 */
module.exports.showLoading = function (title, mask) {
  wx.showLoading({
    title: title,
    mask: isNull(mask) ? false : mask
  })
}

/**
 * 隐藏 loading 提示框
 */
module.exports.hideLoading = function () {
  wx.hideLoading()
}

/**
 * 对话框
 */
module.exports.showModal = function (title, content,_success) {
  wx.showModal({
    title: title,
    content: content,
    success: function (res) {
      if(_success != null){
        _success(res);
      }
    }
  })
};

function isNull(data) {
  if (data == undefined || data == null || data == '') return true;
  return false;
}