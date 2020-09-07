
import WeCropper from '../../libs/we-cropper/we-cropper.js'
var device = wx.getSystemInfoSync()
var width = device.windowWidth
var height = device.windowHeight - 50
var cropWidth = device.windowWidth;
var cropHeight = device.windowWidth;// parseInt(device.windowWidth*(2/3.0));
Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - cropWidth) / 2,
        y: (height - cropHeight) / 2,
        width: cropWidth,
        height: cropHeight
      }
    },
    //比例
    proportion:1,
    //裁剪图片
    cropImages:null,
    //
    handleImages:[],
    selectHandleImageIndex:0,

    button01Desc:"上传图片",
    button02Desc:"",

  },
  touchStart (e) {
    this.wecropper.touchStart(e)
  },
  touchMove (e) {
    this.wecropper.touchMove(e)
  },
  touchEnd (e) {
    this.wecropper.touchEnd(e)
  },
  button02Bindtap () {
    var that = this;
    that.wecropper.getCropperImage((src) => {
      if (src) {
        console.log("getCropperImage:"+src);
        if (that.data.cropImages.length == 0) {
          that.data.handleImages[that.data.selectHandleImageIndex].cropImg = src;
          that.resultCrop();
        } else if (that.data.cropImages.length == 1) {
          that.data.handleImages[that.data.selectHandleImageIndex].cropImg = src;
          that.resultCrop();
        } else if (that.data.cropImages.length > 1) {
          that.data.handleImages[that.data.selectHandleImageIndex].cropImg = src;
          that.data.selectHandleImageIndex += 1;
          this.setData({
            button02Desc: (that.data.selectHandleImageIndex+1) == that.data.cropImages.length ? "确认完成" : "确认并下一个(" + (this.data.selectHandleImageIndex + 1) + "/" + this.data.handleImages.length + ")",
          })
          if (that.data.selectHandleImageIndex < that.data.handleImages.length){
            that.wecropper.pushOrign(that.data.handleImages[that.data.selectHandleImageIndex].orgImg);
          }else{
            that.resultCrop();
          }
        }
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },
  button01Bindtap () {
    if (this.data.cropImages.length == 0){//没有传递照片
      this.chooseImageHandle();
    }
  },
  onLoad (option) {
    if (option.proportion != null){
      var proportion = parseFloat(option.proportion);
      cropHeight = parseInt(device.windowWidth * proportion);
      var cropperOpt = {
        id: 'cropper', width, height, scale: 2.5, zoom: 8,
        cut: { x: (width - cropWidth) / 2, y: (height - cropHeight) / 2, width: cropWidth, height: cropHeight }
      };
      this.setData({
        cropperOpt: cropperOpt,
      })

    }

    this.weCropperInit();
    if (option.cropImages != null){
      this.data.cropImages = JSON.parse(option.cropImages);
    }else{
      this.data.cropImages=[];
    }
    this.handleImageDataInit();
   
  },

 
  
  //裁剪后反馈
  resultCrop: function () {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    if (typeof prevPage.resultCrop === 'function') {
      prevPage.resultCrop(this.data.handleImages);
    }
    wx.navigateBack();
  },

  //选择照片
  chooseImageHandle:function(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: 'compressed',
      success(res) {
        var src = res.tempFilePaths[0]
        that.data.handleImages.push({ orgImg: src });
        that.data.selectHandleImageIndex =0;
        that.wecropper.pushOrign(src);
      }
    })
  },

  //初始化参数
  handleImageDataInit:function(){
    this.data.handleImages = [];
    for (var i = 0; i < this.data.cropImages.length; i++) {
      this.data.handleImages.push({ orgImg: this.data.cropImages[i] });
    }
    if (this.data.handleImages.length == 0) {
      this.setData({
        selectHandleImageIndex:0,
        button01Desc: "上传图片",
        button02Desc: "确认裁剪",
      })
    } else if (this.data.handleImages.length == 1) {
      this.setData({
        selectHandleImageIndex: 0,
        button01Desc: "",
        button02Desc: "确认裁剪",
      })
      this.wecropper.pushOrign(this.data.handleImages[0].orgImg);
    } else if (this.data.handleImages.length > 1) {
      this.setData({
        selectHandleImageIndex: 0,
        button01Desc: "",
        button02Desc: "确认并下一个(" + (this.data.selectHandleImageIndex + 1) + "/" + this.data.handleImages.length + ")",
      })
      this.wecropper.pushOrign(this.data.handleImages[0].orgImg);
    }
  },

  weCropperInit:function(){
    const { cropperOpt } = this.data
    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        // console.log(`111111111111wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        // console.log(`22222222222222before picture loaded, i can do something`)
        // console.log(`current canvas context:`, ctx)
        // wx.showToast({
        //   title: '上传中',
        //   icon: 'loading',
        //   duration: 20000
        // })
      })
      .on('imageLoad', (ctx) => {
        // console.log(`33333333333333picture loaded`)
        // console.log(`current canvas context:`, ctx)
        // wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        // console.log(`4444444444before canvas draw,i can do something`)
        // console.log(`current canvas context:`, ctx)
      })
      .updateCanvas()
  }

})
