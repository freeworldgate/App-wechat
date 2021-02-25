// pages/pk/pk/pk.js
var request = require('./../../../utils/request.js')
var http = require('./../../../utils/http.js')
var tip = require('./../../../utils/tipUtil.js')
var login = require('./../../../utils/loginUtil.js')
var locationUtil = require('./../../../utils/locationUtil.js')
var route = require('./../../../utils/route.js')
var redirect = require('./../../../utils/redirect.js')
var uuid = require('./../../../utils/uuid.js')
var inviteReq = require('./../../../utils/invite.js')
var userInvite = require('./../../../utils/userInvite.js')
var upload = require('./../../../utils/uploadFile.js')
var template = require('./../../../template/template.js')
var amapFile = require('./../../../utils/amap-wx.js')



const width = wx.getSystemInfoSync().windowWidth;
const vwPx = width/100;
const r_width = 2*vwPx;
const l_width = 2*vwPx;
const img_width = 10*vwPx;
const small_size = (100*vwPx - r_width - l_width*2 - img_width - 1*vwPx)/3;
const large_size = small_size * 2 + 0.5 *vwPx


Page({


  data: {
    images:[]
  },


  onLoad: function (options) {

    var that = this;
    //Top高度
    inviteReq.getHeight(function (res) {
        that.setData({
            top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
        })
    })
    var pkId = options.pkId;   
    that.data.pkId = pkId;
    var pk = wx.getStorageSync('imgPk');
    wx.removeStorageSync('imgPk');
    that.setData({pk:pk});
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryPkImages, "GET", { pkId:pkId});

  },

  uploadImage:function(){
    var that = this;
    login.getUser(function(user){
      if(that.data.pk.user.userId === user.userId){
              template.createOperateDialog(that).show("上传卡点背景图?", "图片上传后可设置为卡点背景...", function () {
                  wx.chooseImage({
                    count: 1,
                    sizeType: ['compressed', 'original'],
                    sourceType: ['album'],
                    success(res) {
                      var files = res.tempFilePaths;
                      template.uploadImages3("PK-User-Back", files,that, function(urls){
              
                        var httpClient = template.createHttpClient(that);
                        httpClient.setMode("label", true);
                        httpClient.addHandler("success", function (image) {
              
                            for(var i=0;i<that.data.images.length;i++)
                            {
                                if(image.imageId === that.data.images[i].imageId ){
                                  that.data.images.splice(i, 1); 
                                  break;
                                }
              
                            }
              
              
                            that.data.images.unshift(image);
                            that.setData({
                              images:that.data.images
                            })
                        })
                        httpClient.send(request.url.uploadPkImages, "GET", { pkId:that.data.pkId,imgUrl:urls[0]});
              
              
              
              
                      }, function(){});
              
              
                    },
                  })
              }, function () {});
        return;
      }
      locationUtil.getLocation(function(latitude,longitude){
            var distance = locationUtil.getDistance(latitude,longitude,that.data.pk.latitude,that.data.pk.longitude);
            if(distance*1000 < that.data.uploadRange*1000)
            {

              template.createOperateDialog(that).show("上传卡点背景图?", "图片审核通过后可成为卡点背景素材...", function () {
                  wx.chooseImage({
                    count: 1,
                    sizeType: ['compressed', 'original'],
                    sourceType: ['album'],
                    success(res) {
                      var files = res.tempFilePaths;
                      template.uploadImages3("PK-User-Back", files,that, function(urls){
              
                        var httpClient = template.createHttpClient(that);
                        httpClient.setMode("label", true);
                        httpClient.addHandler("success", function (image) {
              
                            for(var i=0;i<that.data.images.length;i++)
                            {
                                if(image.imageId === that.data.images[i].imageId ){
                                  that.data.images.splice(i, 1); 
                                  break;
                                }
              
                            }
              
              
                            that.data.images.unshift(image);
                            that.setData({
                              images:that.data.images
                            })
                        })
                        httpClient.send(request.url.uploadPkImages, "GET", { pkId:that.data.pkId,imgUrl:urls[0]});
              
              
              
              
                      }, function(){});
              
              
                    },
                  })
              }, function () {});
        
        
            }
            else
            {
              tip.showContentTip("有效操作范围"+that.data.uploadRange+"公里...");
            }
      })
    })

  },
  onReachBottom:function(){
    if(!this.data.nomore)
    {
      this.nextPage();
    }


  },
  nextPage: function () {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    var user = wx.getStorageSync("user");
    httpClient.addHandler("success", function (data) {
      var newPosts = that.data.images.concat(data);
      that.setData({
        images: newPosts,
        page: that.data.page + 1
      })
    })
    httpClient.send(request.url.nextPkImagePage, "GET", { pkId: that.data.pkId, page: that.data.page });

    // wx.stopPullDownRefresh()
  },
  setUser:function(res){
    var userId =  res.currentTarget.dataset.user;
    var user = wx.getStorageInfoSync("user");
    user.userId = userId;
    wx.setStorageSync('user', user);
    wx.reLaunch({
      url: '/pages/pk/locate/locate',
    })

  },
  deleteImage:function(res){
    var that = this;
    var imageId =  res.currentTarget.dataset.imageid;
    var index =  res.currentTarget.dataset.index;

    template.createOperateDialog(that).show("删除卡点图片?", "删除卡点图片?", function () {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function () {
              that.data.images.splice(index, 1); 
              that.setData({
                images: that.data.images,
              })
      })
      httpClient.send(request.url.deletePkImages, "GET", { pkId: that.data.pkId,imageId:imageId });
    }, function () {});





  },
  setPkBack:function(res){
    var that = this;
    var image =  res.currentTarget.dataset.image;
    var index =  res.currentTarget.dataset.index;

    template.createOperateDialog(that).show("设置为卡点背景?", "设置为卡点背景?", function () {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function () {
              that.setData({
                pkBackUrl:image.imgUrl
              })
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];  //上一个页面
              prevPage.setData({
                "pk.backUrl": image.imgUrl
              });
              wx.navigateBack({
                delta: 0,
              })
              wx.setStorageSync('postUpdate',true);
      })
      httpClient.send(request.url.setPkBack, "GET", { pkId: that.data.pkId,imageId:image.imageId });
    }, function () {});





  },
  goUser:function(res){
    var userId = res.currentTarget.dataset.user;
    wx.navigateTo({
      url: '/pages/pk/userPublishPost/userPublishPost?userId='+userId,
    })
  },
  showImg:function(res){
    var that  = this;
    var index = res.currentTarget.dataset.index;
    var imgs = res.currentTarget.dataset.imgs;
    var current = imgs[index].imgUrl;
    var images = [];
    for(var i=0;i<imgs.length;i++)
    {
        images[i] = imgs[i].imgUrl;
    }
    wx.previewImage({
      current:current,
      urls: images,
    })
  },
  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
})