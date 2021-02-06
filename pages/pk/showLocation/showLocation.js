// pages/pk/home/home.js
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
    //标记点
    // markers: [{
    //   //标记点 id
    //   id: 1,
    //   //标记点纬度
    //   latitude: 32.319739999999985,
    //   //标记点经度
    //   longitude: 120.14209999999999,
    //   name: '行之当前的位置'
    // }],

    


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
    var pk = wx.getStorageSync('locationShow');
    wx.removeStorageSync('locationShow')
    



    that.setData({
      pk:pk,
      latitude:pk.latitude,
      longitude: pk.longitude,
      markers:[pk.marker],
      circles:[pk.circle],
      scale:pk.type.scale
    })
 






  },
  showLength:function(){
    var that = this;
    if(that.data.includePoints.length<1)
    {
      locationUtil.getLocation(function(latitude,longitude){
        that.setData({
          includePoints:[{latitude:latitude,longitude:longitude},that.data.pk.marker],
          polyline:[{points:[{latitude: latitude, longitude: longitude},{latitude: that.data.pk.latitude, longitude: that.data.pk.longitude}]}]
        })
        var user = wx.getStorageSync("user");
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("", false);
        httpClient.send(request.url.queryLengthTime, "GET", { pkId: that.data.pk.pkId, userId: user.userId,latitude:latitude,longitude:longitude});

      })
    }
    else{
      that.setData({
        latitude:that.data.pk.latitude,
        longitude: that.data.pk.longitude,
        markers:[that.data.pk.marker],
        circles:[that.data.pk.circle],
        scale:that.data.pk.type.scale,
        includePoints:[],
        polyline:[]
      })
    }


  },
  
  hiddenLength:function(){
    var that = this;



  },


  onShow:function(){
    var that = this;

    //更新位置:
    locationUtil.locationChange(function(res){
      console.log("位置:",res);
      if(that.data.pk){
        var distance = locationUtil.getDistance(res.latitude,res.longitude,that.data.pk.latitude,that.data.pk.longitude);
        that.setData({
          length:distance*1000,
          lengthStr:distance<1?distance*1000+"米":distance+"公里"
        })
      }
    })

  },
  onUnload:function(){
    wx.stopLocationUpdate({
      success: (res) => {},
    })
  },
  onHide:function(){
    wx.stopLocationUpdate({
      success: (res) => {},
    })
  

  },

})