// pages/pk/home/home.js
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


Page({

  /**
   * 页面的初始数据
   */
  data: {
    mode:0,
    scale:16,
    latitude: 30.319739999999985,
    //经度
    longitude: 112.222,
    circle:[],
    markers:[],
    includePoints:[],
    polyline:[],

    pks: [],
    user:{}
  },
  back:function(){
    wx.navigateBack({
      delta: 0,
    })
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
    var pk = wx.getStorageSync('editRange');
    wx.removeStorageSync('editRange')
    that.setData({
      rangeTime:options.rangeTime
    })
  
    that.setData({
      pk:pk,
      latitude:pk.latitude,
      longitude: pk.longitude,
      markers:[pk.marker],
      circles:[pk.circle],
      scale:pk.type.scale
    })
 






  },
  changeRange:function(e){
    var value =  e.detail.value;
    var range = parseInt(value*10);
    var rangeKey="circles[0].radius"
    this.setData({
      [rangeKey]: range
    })
  },
  save:function(res)
  {
    var that = this;
    var radius = res.currentTarget.dataset.radius;
    var pkId = res.currentTarget.dataset.pkid;

    template.createOperateDialog(that).show("", "设置打卡范围!", function () {
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function () {
          tip.showContentTip("设置成功");
        });
        httpClient.send(request.url.setUserPkRange, "GET", {pkId:pkId,radius:radius});
    }, function () {});





  },
  decr:function(){
    var that  = this;
    var value = that.data.circles[0].radius;
    if(value<20){
      tip.showContentTip("超出可设置范围")
      return;
    }


    var rangeKey="circles[0].radius"
    that.setData({
      [rangeKey]:(value-10)
    })

  },
  incr:function(){
    var that  = this;
    var value = that.data.circles[0].radius;
    if(value > 990){
      tip.showContentTip("超出可设置范围")
      return;
    }
    var rangeKey="circles[0].radius"
    that.setData({
      [rangeKey]:(value+10)
    })

  }

})