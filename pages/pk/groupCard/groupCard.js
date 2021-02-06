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

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'https://oss.211shopper.com/dir2/wx-1606375746086.jpg',
    pkGroups:[]
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

    // that.data.pkId = options.pkId;   
    var groupPk = wx.getStorageSync('groupPk');
    wx.removeStorageSync('groupPk');
    that.setData({
      pkId:options.pkId,
      pk:groupPk
    })

    locationUtil.getLocation(function(latitude,longitude){
      var distance = locationUtil.getDistance(latitude,longitude,groupPk.latitude,groupPk.longitude);
      that.setData({
        length:parseFloat(distance*1000),
        lengthStr:distance<1?distance*1000:distance
      })
    })

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryPkGroups, "GET", {pkId:options.pkId});
    
  },
  goUser:function(res){
    var userId = res.currentTarget.dataset.user;
    wx.navigateTo({
      url: '/pages/pk/userPublishPost/userPublishPost?userId='+userId,
    })


  },
  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
  unLock:function(res){
    var that = this;
    var groupId = res.currentTarget.dataset.groupid;
    var index = res.currentTarget.dataset.index;
    locationUtil.getLocation(function(latitude,longitude){
        var distance = locationUtil.getDistance(latitude,longitude,that.data.pk.latitude,that.data.pk.longitude);
        if(distance*1000 > that.data.pk.type.rangeLength)
        {
            template.createOperateDialog(that).show("您当前距离超出解锁范围", "您当前距离超出解锁范围...", function () {
            }, function () {});
            return;
        }
        else
        {
          var httpClient = template.createHttpClient(that);
          httpClient.setMode("label", true);
          httpClient.addHandler("success", function (data) {
            var key = "pkGroups["+index+"].queryerMemberEntity";
            that.setData({
              [key] : data,
            });
          });
          httpClient.send(request.url.unLockGroup, "GET", { groupId:groupId});  
        }
    })
  },
  showText:function(res){
    var that  = this;
    var text = res.currentTarget.dataset.text;
    wx.navigateTo({
      url: '/pages/pk/showText/showText?text='+text,
    })
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
        template.createOperateDialog(that).show("仅用户自身可见?", "仅用户自身可见...", function () {
        }, function () {});
      }
    })
  },
  showLocation:function(res){
    var that = this;
    var pk = res.currentTarget.dataset.pk;
    wx.setStorageSync('locationShow', pk)

    wx.navigateTo({
      url: '/pages/pk/showLocation/showLocation',
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
          httpClient.send(request.url.userCardApply, "GET", { text:text,targetId:that.data.userId});  
        });
    })




  },
  uploadImg:function(){
    var that = this;
    login.getUser(function(user){
       if(user.userId === that.data.userId)
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
                httpClient.addHandler("success", function () {
                  that.setData({
                    userCard:urls[0],
                  })
                },function(){});
                httpClient.send(request.url.setUserCard, "GET", { userCard:urls[0]});  
              }, function(){});
            },
          })
       }
    })
  

  },
  userGroup:function(res)
  {
      var that = this;
      var pkId = res.currentTarget.dataset.pkid;
      login.getUser(function(user){
        wx.navigateTo({
          url: '/pages/pk/editUserGroup/editUserGroup?pkId=' + pkId,
        })
      })
  },
  showImg:function(res){
    var that = this;
    var img = res.currentTarget.dataset.img;
    wx.previewImage({
      current:img,
    })
  }



})