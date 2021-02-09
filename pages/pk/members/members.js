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
    that.data.groupId = options.groupId;

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryGroupMembers, "GET", {groupId:options.groupId});

  },
  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
  userCenter:function(res){
    var that = this;
    var follower =  res.currentTarget.dataset.follower;

    login.getUser(function(user){
      wx.navigateTo({
        url: '/pages/pk/userPublishPost/userPublishPost?userId='+follower.userId,
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
    httpClient.setMode("label", false);
    var user = wx.getStorageSync("user");
    httpClient.addHandler("success", function (data) {
      var newPosts = that.data.members.concat(data);
      that.setData({
        members: newPosts,
        page: that.data.page + 1
      })
    })
    httpClient.send(request.url.nextGroupMembers, "GET", { groupId:that.data.groupId,page: that.data.page });

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