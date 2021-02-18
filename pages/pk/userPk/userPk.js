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
    scale:16,
    leftPks:0,
    unlock:0,
    pkTimes:0,
    inviteTimes:0,
    mapShow:false,
    pks: [],

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

    var target = options.userId
    that.data.targetId = target;
    login.getUser(function(user){
      that.setData({user:user})
    })
    template.createPageLoading(that).show();
    locationUtil.getLocation(function (latitude,longitude) {
      that.setData({
        latitude:latitude,
        longitude:longitude
      })
      that.init("page",latitude,longitude,target);
    });

  },
  showLocation:function(res){
    var pk = res.currentTarget.dataset.pk;
    wx.setStorageSync('locationShow', pk)
    wx.navigateTo({
      url: '/pages/pk/showLocation/showLocation',
    })
  },
  queryPks:function (tab,latitude,longitude,target) {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tab, false);
    httpClient.send(request.url.userPks, "GET", {latitude:latitude,longitude:longitude,targetId:target});
  },
  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;

      if(that.data.pkEnd){return;}
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", false);
      httpClient.addHandler("success", function (pagePks) {
        that.setData({
            page:that.data.page + 1,
            pks:that.data.pks.concat(pagePks)
        })
      })
      httpClient.send(request.url.nextUserPks, "GET",{ targetId:that.data.targetId ,page:that.data.page,latitude:that.data.latitude,longitude:that.data.longitude});
    
  },





  onShow:function () {
    var that = this;

    locationUtil.getLocation(function(latitude,longitude){

      if(that.data.pks.length>0){
        for(var i=0;i<that.data.pks.length;i++)
        {
          var distance = locationUtil.getDistance(latitude,longitude,that.data.pks[i].latitude,that.data.pks[i].longitude);
          var length = "pks[" + i + "].userLength"
          var lengthStr = "pks[" + i + "].userLengthStr"
          that.setData({
            [length]:distance*1000,
            [lengthStr]:distance<1?distance*1000+"米":distance+"公里"
          })
        }
      }
    })

  },
  onHide:function(){

  },

  init:function (tab,latitude,longitude,target) {
    var that = this;
 
      that.queryPks(tab,latitude,longitude,target);
 
  },
  onPullDownRefresh:function (params) {
      var that = this;
      
      template.createPageLoadingError(that).hide();
      if(that.data.pageTag){
        
        that.queryPks("label",that.data.latitude,that.data.longitude);
      }else{
        that.queryPks("page",that.data.latitude,that.data.longitude)
      }
      
  },











  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  viewImg:function(res){
    var that = this;
    var url = res.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
    })
  
  },
  login:function(){
    login.getUser(function(user){})    
  },



  showText:function(res){
    var that  = this;
    var text = res.currentTarget.dataset.text;
    wx.navigateTo({
      url: '/pages/pk/showText/showText?text='+text,
    })
  },
  hiddenMap:function(){
    this.setData({
      mapShow:false
    })
  },
  showMap:function(res){
    var that = this;
    var pk = res.currentTarget.dataset.pk; 
    that.setData({
      mapShow:true,
      // includePoints:[{latitude:that.data.latitude,longitude:that.data.longitude},{latitude:pk.marker.latitude,longitude:pk.marker.longitude}],
      markers:[pk.marker],
      circles:[pk.circle],
      latitude:pk.marker.latitude,
      longitude:pk.marker.longitude,
      scale:pk.type.scale
      
    })
  },
  setPkRange:function(res)
  {
    var that  = this;
    var pk = res.currentTarget.dataset.pk;
    var index = res.currentTarget.dataset.index;
    var pk = res.currentTarget.dataset.pk;
    wx.setStorageSync('editRange', pk)
    wx.navigateTo({
      url: '/pages/pk/setPkRange/setPkRange',
    })


  },

  // 获取定位当前位置的经纬度
  getLocation: function (pkId,index) {
    let that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        let speed = res.speed
        let accuracy = res.accuracy;
        tip.showContentTip("定位中...")
        that.getLocal(latitude, longitude,pkId,index)
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  // 获取当前地理位置
  getLocal: function (latitude, longitude,pkId,index) {
    let that = this;
    var myAmapFun = new amapFile.AMapWX({key:'528540a597af4bb3937965f09078dba4'});
    myAmapFun.getRegeo({
      success: function(data){
        var cityCode = data[0].regeocodeData.addressComponent.citycode;
        var cityName = data[0].regeocodeData.addressComponent.city;
        var desc = data[0].desc;
        var name = data[0].name;
        var latitude = data[0].latitude;
        var longitude = data[0].longitude;

        var msg = name+"&&TAG&&"+desc+"&&TAG&&"+cityName+"&&TAG&&"+cityCode+"&&TAG&&"+latitude+"&&TAG&&"+longitude;

        var httpClient = template.createHttpClient(that);
        httpClient.setMode("", true);
        httpClient.addHandler("success", function (location) {
          tip.showContentTip("更新主题位置") 
          var msg = "pks[" + index + "].location"
          that.setData({
            [msg]: location
          })
         

  
        })
        httpClient.send(request.url.setLocation, "GET",
          {
            pkId:pkId,
            name:name,
            desc:desc,
            city:cityName,
            cityCode:cityCode,
            latitude:latitude,
            longitude:longitude
          }
        );    


        //成功回调
        that.setData({
          address:data[0].desc
        })
        console.log("地址:",latitude,longitude,data);
      },
      fail: function(info){
        //失败回调
        tip.showContentTip("获取位置失败...");
      }
    })



  },


})