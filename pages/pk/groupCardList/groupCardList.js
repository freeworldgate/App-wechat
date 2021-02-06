// pages/pk/invite/invite.js
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

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nomore: false,
    pkGroups: [],

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


    wx.hideShareMenu({
      complete: (res) => {},
    })
    that.setData({
      pkId:options.pkId
    })
    
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    if(options.pkId)
    {
      httpClient.send(request.url.queryMyUnlockPkGroups, "GET", {pkId:options.pkId});
    }
    else
    {
      httpClient.send(request.url.queryMyUnlockGroups, "GET", {});
    }
    

  },
  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
  goUser:function(res){
    var userId = res.currentTarget.dataset.user;
    wx.navigateTo({
      url: '/pages/pk/userPublishPost/userPublishPost?userId='+user,
    })


  },
  showText:function(res){
    var that  = this;
    var text = res.currentTarget.dataset.text;
    wx.navigateTo({
      url: '/pages/pk/showText/showText?text='+text,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;

      if(that.data.nomore){return;}
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (pkGroups) {
        that.setData({
            page:that.data.page + 1,
            pkGroups:that.data.pkGroups.concat(pkGroups)
        })
      })
      if(that.data.pkId)
      {
        httpClient.send(request.url.nextMyUnlockPkGroups, "GET",{page:that.data.page});
      }
      else
      {
        httpClient.send(request.url.nextMyUnlockGroups, "GET",{page:that.data.page,pkId:that.data.pkId});
      }
    
  },







})