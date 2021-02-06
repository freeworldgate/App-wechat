// pages/pk/pk/pk.js
var request = require('./../../../utils/request.js')
var http = require('./../../../utils/http.js')
var tip = require('./../../../utils/tipUtil.js')
var login = require('./../../../utils/loginUtil.js')
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

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'https://oss.211shopper.com/dir2/wx-1606375746086.jpg'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //Top高度
    inviteReq.getHeight(function (res) {
        that.setData({
            top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
        })
    })


    var userId = options.userId;   
    that.data.targetUserId = userId;



    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryUserCard, "GET", {targetId:options.userId});
    
  },

  userCardApply:function(res){
    var that = this;

    var type = res.currentTarget.dataset.type;
    var targetId = res.currentTarget.dataset.targetid;

    login.getUser(function(user){
      if(user.userId === targetId){
          wx.navigateTo({
            url: '/pages/pk/userCardApply/userCardApply?targetUserId='+targetId + "&type=" + type,
          })
      }
      else
      {
        // return;
        template.createDialog(that).show("仅用户自己有权查看?", "仅用户自己有权查看...");
      }
    })
  },
  
  showSingleImg:function(res){
    var that  = this;
    var url = res.currentTarget.dataset.url;
   
    wx.previewImage({
      current:url,
      urls:[url]
    })
  },


  apply:function(){
    var that = this;
    login.getUser(function(user){
        template.createEditTextDialog(that).show("想认识Ta", "编辑留言...","", 120,function(text){
          var httpClient = template.createHttpClient(that);
          httpClient.setMode("label", true);
          // httpClient.addHandler("success", function () {
          //   that.setData({
          //     userApply:{applyer:user,text:text},
          //   })
          // },function(){});
          httpClient.send(request.url.userCardApply, "GET", { text:text,targetId:that.data.targetUserId});  
        });
    })




  },
  showText:function(res){
    var that  = this;
    var text = res.currentTarget.dataset.text;
    wx.navigateTo({
      url: '/pages/pk/showText/showText?text='+text,
    })
  },
  onShow:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("", true);
    httpClient.send(request.url.queryUserCard, "GET", {targetId:that.data.targetUserId});
    

  },
  uploadImg:function(){
    var that = this;
    login.getUser(function(user){
       if(user.userId === that.data.targetUserId)
       {
          wx.chooseImage({
            count: 1,
            sizeType: ['compressed', 'original'],
            sourceType: ['album'],
            success(res) {
              var files = res.tempFilePaths;
              template.uploadImages3("PK-User-Back", files,that, function(urls){
                
                var httpClient = template.createHttpClient(that);
                httpClient.setMode("label", true);
                httpClient.send(request.url.setUserCard, "GET", { userCard:urls[0]});  
              }, function(){});
            },
          })
       }
    })
  

  },
  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
  saveImg:function (res) {

    var imgSrc = res.currentTarget.dataset.url;
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存到相册',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("当初用户拒绝，再次发起授权")
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          },
          complete(res) {
            console.log(res);
          }
        })
      }
    })





  },

})