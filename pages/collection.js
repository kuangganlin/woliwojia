// pages/collection.js
const app = getApp();
var util = require("../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    collection_type: 1, //1：商品收藏  2：活动收藏
    goodsPageIndex: 0,
    collectGoodsList: [], //收藏的商品
    selectedAllStatus: false,

    activityPageIndex: 0,
    collectActivityList: [], //收藏的活动
    
    collection_id_list: [],//选择的collection_id列表

    mycollectionList: []//所有的收藏列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (!util.dataUtil.isNullData(options.collection_type)) {
      this.data.collection_type = parseInt(options.collection_type);
      this.setData({
        collection_type: this.data.collection_type
      })
    }
    that.showMycollectionList(that.data.collection_type);

  },

  /**
   * 单选选中
   */
  bindCheckbox: function (e) {
    var index = parseInt(e.currentTarget.dataset.index);
    if (this.data.collection_type == 1) {
      var collectListTemp = this.data.collectGoodsList;
    } else if (this.data.collection_type == 2) {
      var collectListTemp = this.data.collectActivityList;
    }
    var selected = collectListTemp[index].selected;
    //var collectGoodsList = this.data.collectGoodsList;
    var select_collection_id = parseInt(collectListTemp[index].collection_id);
    var collection_id_list = this.data.collection_id_list;
    // console.log(selected+'点击初始值:' + JSON.stringify(collection_id_list));

    if (!selected) {
      collection_id_list.push(select_collection_id);
      this.setData({
        // count: this.data.count + num * price,
        // number: num + this.data.number
        collection_id_list: collection_id_list
      });
    } else {
      collection_id_list.splice(collection_id_list.indexOf(select_collection_id), 1);
      // console.log('点击' + JSON.stringify(collection_id_list));

      this.setData({
        // count: this.data.count - num * price,
        // number: this.data.number - num
        collection_id_list: collection_id_list

      });
    }
    // console.log('单个点击了' + JSON.stringify(collection_id_list));
    collectListTemp[index].selected = !selected;

    // this.setData({
    //   collectGoodsList: collectGoodsList
    // });

    if (this.data.collection_type == 1) {
      this.setData({
        collectGoodsList: collectListTemp
      });
    } else if (this.data.collection_type == 2) {
      this.setData({
        collectActivityList: collectListTemp
      });

    }




  },

  /**
   * 全选、反选
   */

  bindSelectAll: function () {
    var selectedAllStatus = this.data.selectedAllStatus;
    selectedAllStatus = !selectedAllStatus;
    if (this.data.collection_type == 1) {
      var collectListTemp = this.data.collectGoodsList;
    } else if (this.data.collection_type == 2) {
      var collectListTemp = this.data.collectActivityList;
    }

    var collection_id_list = this.data.collection_id_list;
    //var collectGoodsList = this.data.collectGoodsList;
    if (!selectedAllStatus) {//反选
      // console.log('全取消');
      for (var i = 0; i < collectListTemp.length; i++) {
        collectListTemp[i].selected = selectedAllStatus;
        //collection_id_list.splice(collection_id_list.indexOf(collectGoodsList[i].collection_id));
      }
      collection_id_list = [];
      this.setData({
        selectedAllStatus: selectedAllStatus,
        collection_id_list: collection_id_list
      });
      if (this.data.collection_type == 1) {
        this.setData({
          collectGoodsList: collectListTemp
        });
      } else if (this.data.collection_type == 2) {
        this.setData({
          collectActivityList: collectListTemp
        });

      }


      console.log(collection_id_list);
      console.log(collectListTemp);

    } else {//全选
      // console.log('全选中');
      for (var i = 0; i < collectListTemp.length; i++) {
        collection_id_list.push(parseInt(collectListTemp[i].collection_id));
        collectListTemp[i].selected = selectedAllStatus;
      }
      this.setData({
        selectedAllStatus: selectedAllStatus,
        collection_id_list: collection_id_list
      });

      if (this.data.collection_type == 1) {
        this.setData({
          collectGoodsList: collectListTemp
        });
      } else if (this.data.collection_type == 2) {
        this.setData({
          collectActivityList: collectListTemp
        });

      }



      // console.log(collection_id_list);
      // console.log(collectListTemp);
    }
  },
  /**
   * 选项卡切换
   */
  collectionTypeBindTap: function (res) {
    var that = this;
    this.setData({
      collection_type: res.currentTarget.dataset.collection_type,
      selectedAllStatus: false,
      collection_id_list: []
    })
    var collection_type = res.currentTarget.dataset.collection_type;
    that.showMycollectionList(collection_type);//默认参数是1
  },

  /**
   * 商品、活动收藏列表
   */
  showMycollectionList: function (collection_type) {
    var that = this;

    var postData = {};
    postData.collection_type = collection_type;
    postData.user_id = app.globalData.loginUserInfo.user_id;

    if (collection_type == 1) {
      postData.pageIndex = that.data.goodsPageIndex;
    } else {
      postData.pageIndex = that.data.activityPageIndex;
    }
    postData.pageSize = util.httpUtil.PageSize;
    util.httpUtil.httpGet(util.httpUtil.url.ShowMycollectionList_Url, postData, function (res) {

      if (util.httpUtil.isRequestSuccess(res)) {
        that.showMycollectionListResult(res, collection_type);
      } else {
        // console.log('error:' + res.msg);
      }


    }, function (res) {
    }, function (res) {
      wx.stopPullDownRefresh();
    });
  },


  showMycollectionListResult: function (res, collection_type) {
    var that = this;

    if (collection_type == 1) {
      if (this.data.goodsPageIndex == 0) {
        this.data.collectGoodsList = [];
      }
    } else if (collection_type == 2) {
      if (this.data.activityPageIndex == 0) {
        this.data.collectActivityList = [];
      }
    }

    if (util.dataUtil.isNullData(res.data)) {
      //util.viewUtil.showToastNone("没有搜索到数据!");
      if (collection_type == 1) {
        this.setData({
          collectGoodsList: this.data.collectGoodsList
        })
      } else if (collection_type == 2) {
        this.setData({
          collectActivityList: this.data.collectActivityList
        })
      }
      return;
    }
    for (var i = 0; i < res.data.length; i++) {
      var item = res.data[i];
      util.httpUtil.objectHttpUrlHandle(item, 'goods_pic', 'head_pic');

      if (collection_type == 1) {
        this.data.collectGoodsList.push(item);
      } else if (collection_type == 2) {
        this.data.collectActivityList.push(item);
      }

    }
    if (res.data.length > 0) {
      if (collection_type == 1) {
        //this.data.sendPageIndex++;
      } else if (collection_type == 2) {
        //this.data.joinPageIndex++;
      }
    }

    if (collection_type == 1) {
      this.setData({
        collectGoodsList: this.data.collectGoodsList
      })
    } else if (collection_type == 2) {
      this.setData({
        collectActivityList: this.data.collectActivityList
      })
    }




  },


  //删除
  delcollectionBindtap: function (res) {
    var that = this;
    var collection_id_list = that.data.collection_id_list;
    if (collection_id_list == 0) {
      util.viewUtil.showToastNone('请先选择要删除的');//3秒后消失
      return;
    }

    util.viewUtil.showModal("删除", "确定要删除该收藏吗?", function (res) {
      if (res.confirm) {
        that.delcollection(collection_id_list);
      }
    })


  },

  /**
   * 删除收藏
   */
  delcollection: function (collection_id_list) {
    var that = this;
    var collection_id_str = collection_id_list.join(",");//将数组分隔成字符串
    var postData = {};
    if (util.dataUtil.isNullData(app.globalData.loginUserInfo)) {
      util.viewUtil.showToastNone('没有登录账号');
      return;
    } else {
      postData.user_id = app.globalData.loginUserInfo.user_id;
    }
    postData.collection_id_list = collection_id_str;

    util.httpUtil.httpGet(util.httpUtil.url.DelCollection_Url, postData, function (res) {
      if (util.httpUtil.isRequestSuccess(res)) {
        var collection_type = that.data.collection_type;
        that.showMycollectionList(collection_type);//默认参数是1
      }

    }, function (res) {
    }, function (res) {
    });
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
    console.log('这是下拉');
    if (this.data.collection_type == 1) {
      this.data.goodsPageIndex = 0;

    } else {
      this.data.activityPageIndex = 0;

    }
    this.showMycollectionList(this.data.collection_type);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // if (this.data.collection_type == 1) {
    //   this.getMyCollectGoods();
    // } else {
    //   this.getMyCollectActivity();
    // }

    console.log('这是上拉');
    //this.data.goodsPageIndex += 1;

    if (this.data.collection_type == 1) {
      this.data.goodsPageIndex++;
    } else {
      this.data.activityPageIndex++;
    }

    this.showMycollectionList(this.data.collection_type);



  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.shareHome();
  }
})