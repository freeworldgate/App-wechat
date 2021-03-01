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
    maxLength:300,
    left:300
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
 
    login.getUser(function(user){
    
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("page", true);
      httpClient.send(request.url.queryUserMessages, "GET", {});

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
    httpClient.addHandler("success", function (pcomments) {
      var newComments = that.data.comments.concat(pcomments);
      that.setData({
        comments: newComments,
        page: that.data.page + 1
      })
    })
    httpClient.send(request.url.nextUserMessages, "GET", { page: that.data.page });

  },
  inPk:function(res){
    var pkId = res.currentTarget.dataset.pkid;
    wx.navigateTo({
      url: '/pages/pk/timepage/timepage?pkId='+pkId,
    })
  },

  gopost:function(res){
    var that = this;
    var message = res.currentTarget.dataset.message;
    if(message.new){
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("", true);
      httpClient.send(request.url.seeMsg, "GET", { messageId:message.messageId });
    }
    login.getUser(function(user){
      wx.navigateTo({
        url: '/pages/pk/comments/comments?pkId='+message.pkId+"&postId="+message.postId,
      })
    })
  },
  detail:function(res){
    var that = this;
    var message = res.currentTarget.dataset.message;
    console.log("消息",message);
    if(message.new){
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("", true);
      httpClient.send(request.url.seeMsg, "GET", { messageId:message.messageId });
    }


    if(message.type === 1)
    {
      wx.navigateTo({
        url: '/pages/pk/comments/comments?pkId='+message.pkId+"&postId="+message.postId,
      })
    }
    else
    {
      wx.navigateTo({
        url: '/pages/pk/restore/restore?commentId='+message.commentId,
      })
    }
  },



  showText:function(res){
    var that  = this;
    var text = res.currentTarget.dataset.text;
    wx.navigateTo({
      url: '/pages/pk/showText/showText?text='+text,
    })
  },


  userPage:function(res){
    var that = this;
    var poster =  res.currentTarget.dataset.user;
    if( poster.userType === 3){return;}
    login.getUser(function(){
      wx.navigateTo({
        url: "/pages/pk/userPublishPost/userPublishPost?userId=" + poster.userId,
      })

    })



  },

  back:function (params) {
    wx.navigateBack({
      complete: (res) => {},
    })
  },






})