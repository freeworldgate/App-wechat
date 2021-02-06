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


Page({

  /**
   * 页面的初始数据
   */
  data: {


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

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryApprovingFinds, "GET", {});

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
    httpClient.addHandler("success", function (data) {
      var newPosts = that.data.findUsers.concat(data);
      that.setData({
        findUsers: newPosts,
        page: that.data.page + 1
      })
    })
    httpClient.send(request.url.nextApprovingFinds, "GET", {  page: that.data.page });

    // wx.stopPullDownRefresh()
  },

  onPullDownRefresh:function(){
    // var that = this;
    // var httpClient = template.createHttpClient(that);
    // httpClient.setMode("label", false);
    // var user = wx.getStorageSync("user");

    // httpClient.send(request.url.queryHiddenPost, "GET", { pkId: that.data.pkId});  

    // that.queryLengthTime(that.data.pkId);
  },

  refreshPage: function () {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("", false);
    var user = wx.getStorageSync("user");
    httpClient.addHandler("success", function (data) {
      // var newPosts = that.data.posts.concat(data);
      that.setData({
        posts: data,
        page:that.data.page+1
      })
    })
    httpClient.send(request.url.nextPage, "GET", { pkId: that.data.pkId, userId: user.userId, page: that.data.page });

    // wx.stopPullDownRefresh()
  },
  openText:function(res)
  {
    var that = this;
    var index = res.currentTarget.dataset.index;
    var tag = 'findUsers['+index+'].tag';
    var ctag = that.data.findUsers[index].tag;
    that.setData({
      [tag]:!ctag
    })
  },
  approvePass:function(res){
    var that = this;
    var find = res.currentTarget.dataset.find;
    var index = res.currentTarget.dataset.index;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (findUser) {
      var key = "findUsers["+index+"]";
      that.setData({
        [key] : findUser,
      });
    })
    httpClient.send(request.url.passFindUser, "GET", {findId:find.findId});


  }










})