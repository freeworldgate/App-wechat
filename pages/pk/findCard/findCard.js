// pages/pk/findCard/findCard.js
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
    var findId = options.findId;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", false);
    httpClient.send(request.url.querySingleFind, "GET", { findId: findId});


  },
  showText:function(res){
    var that  = this;
    var text = res.currentTarget.dataset.text;
    wx.navigateTo({
      url: '/pages/pk/showText/showText?text='+text,
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  userCard:function(res){
    var that = this;
    var userId = res.currentTarget.dataset.userid;
    login.getUser(function(user){
      wx.navigateTo({
        url: '/pages/pk/userCard/userCard?userId='+userId,
      })


    })


  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage:function(res){
    var that = this;
    var findId = res.target.dataset.findid;
    var url = res.target.dataset.url;
    var pkName = res.target.dataset.pkname;
    return {
      title: '遇见不撩 卡点互捞 @ ' + pkName ,
      desc: pkName,
        imageUrl:url,
        path: '/pages/pk/findCard/findCard?findId=' + findId,
    }

  },
  relaunch:function(){
    wx.reLaunch({
      url: '/pages/pk/locate/locate',
    })
  },
  showImg:function(res)
  {
    var img = res.currentTarget.dataset.img;
    var img1 = res.currentTarget.dataset.img1;
    var img2 = res.currentTarget.dataset.img2;
    var img3 = res.currentTarget.dataset.img3;
    var imgs = [];
    if(img1){imgs.push(img1);};
    if(img2){imgs.push(img2);};
    if(img3){imgs.push(img3);};
    wx.previewImage({
      current:img,
      urls: imgs,
    })
  },
  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
})