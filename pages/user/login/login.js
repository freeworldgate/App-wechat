// pages/login/login.js
var request = require('./../../../utils/request.js')
var redirect = require('./../../../utils/redirect.js')
var tip = require('./../../../utils/tipUtil.js')
var invite = require('./../../../utils/invite.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    loginStatu:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.code = options.code;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onShow: function () {
    var user = wx.getStorageSync("user");
    if (user) {
      this.setData({
        loginStatu: 1
      })
    }
  },


  back: function () {
    wx.navigateBack({})
  },

  login: function (res) {
    var that = this;
    var fromUser = wx.getStorageSync("fromUser");
    var pkId = wx.getStorageSync("pkId");
    tip.showLoading('登陆中...');
    wx.request({
      //  注册用户地址
      method: "GET",
      url: request.url.loginUrl,
      data: {
        code: this.data.code,
        encryptedData: res.detail.encryptedData,
        iv: res.detail.iv,
        appName: request.appinfo.appName,
        fromUser: fromUser,
        pkId: pkId
      },
      success: (response) => {
        wx.hideLoading();
        if (response.data.code == request.value.success) {
          wx.setStorageSync("user", response.data.data);
          // invite.inviteHistory(response.data.data.userId, wx.getStorageSync("from-inviteId"), wx.getStorageSync("from-fromUser"));
          // wx.navigateBack({})
          tip.showTip("登陆成功...");
          that.setData({
            loginStatu:1
          });
          return;
        }
        // 不存在该用户
        if (response.data.code == request.value.nouser) {      
          redirect.goTo('/pages/user/register/register?userId=' + response.data.data.userId + "&userName=" + response.data.data.userName + "&imgUrl=" + response.data.data.imgUrl  );
          return;
        }
        // wx.navigateBack({})
        tip.showContentTip("登录失败", "服务器异常");
        wx.navigateBack({})
      },
      fail: function () {
        wx.navigateBack({})
        wx.hideLoading();
        // wx.navigateBack({})
        tip.showContentTip("登录失败", "网络异常");
      }
    })
  },





  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }








})