// pages/pk/editTag/editTag.js
var request = require('./../../../utils/request.js')
var template = require('./../../../template/template.js')
var inviteReq = require('./../../../utils/invite.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    inviteReq.getHeight(function (res) {
      that.setData({
          top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
      })
    })
    that.setData({text:options.type})


    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryActiveTips, "GET", {});


  },
  input:function(res){
    var that = this;
    var value = res.detail.value;
    that.setData({
      text: value,
    })

  },
  select:function(res){
    var that = this;
    var tip =  res.currentTarget.dataset.tip;
    that.setData({
      text: tip,
    })
  },
  save:function(){
    var that = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      type: that.data.text
    });

    wx.navigateBack({
      delta: 0,
    })

  },
  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  }
})