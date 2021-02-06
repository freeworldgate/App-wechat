
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
    that.setData({
      targetUserId:options.targetUserId,
      type:options.type
    })
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryUserCardApplys, "GET", {targetUserId:options.targetUserId,type:options.type});

  },
  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
  deletApply:function(res){
    var that = this;
    var applyId =  res.currentTarget.dataset.applyid;
    var index =  res.currentTarget.dataset.index;
    template.createOperateDialog(that).show("删除留言?", "删除留言?...", function () {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function () {
              that.data.applys.splice(index, 1); 
              that.setData({
                applys: that.data.applys,
              })
      })
      httpClient.send(request.url.deleteApply, "GET", {applyId:applyId });
    }, function () {});




  },
  showText:function(res){
    var that  = this;
    var text = res.currentTarget.dataset.text;
    wx.navigateTo({
      url: '/pages/pk/showText/showText?text='+text,
    })
  },
  changeLock:function(res){
    var that = this;
    var apply =  res.currentTarget.dataset.apply;
    var index =  res.currentTarget.dataset.index;
    template.createOperateDialog(that).show(apply.lock?"禁止?":"解锁?", apply.lock?"禁止用户查看你的二维码名片...":"解锁后，用户将能够查看你的二维码名片...", function () {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function () {
          var lock = "applys["+index+"].lock" 
        that.setData({
          [lock]:!apply.lock
        })
      })
      httpClient.send(request.url.changeLock, "GET", {applyId:apply.applyId });
    }, function () {});

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
    httpClient.addHandler("success", function (data) {
      var mapplys = that.data.applys.concat(data);
      that.setData({
        applys: mapplys,
        page: that.data.page + 1
      })
    })
    httpClient.send(request.url.nextUserCardApplys, "GET", { targetUserId:that.data.targetUserId,type:that.data.type,page: that.data.page });

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

  }
})