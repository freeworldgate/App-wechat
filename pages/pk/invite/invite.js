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


Page({

  /**
   * 页面的初始数据
   */
  data: {

    scale:16,
    latitude: 30.319739999999985,
    //经度
    longitude: 112.222,
    circle:[],
    markers:[],

    pks: [],
    mapShow:false,
    pkEnd:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.hideShareMenu({
      complete: (res) => {},
    })
    inviteReq.getHeight(function (res) {
      that.setData({
          top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
      })
    })
    var target = options.userId;
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
  queryPks:function (tab,latitude,longitude,target) {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tab, false);
    httpClient.send(request.url.queryInvites, "GET", {latitude:latitude,longitude:longitude,targetId:target});
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;

      if(that.data.pkEnd){return;}
      var user = wx.getStorageSync('user');
      var fromUser = wx.getStorageSync('fromUser')
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", false);
      httpClient.addHandler("success", function (pagePks) {
        that.setData({
            page:that.data.page + 1,
            pks:that.data.pks.concat(pagePks)
        })
      })
      httpClient.send(request.url.nextInvitePage, "GET",{targetId:that.data.targetId ,page:that.data.page,latitude:that.data.latitude,longitude:that.data.longitude});
    
  },

  hiddenMap:function(){
    this.setData({
      mapShow:false
    })
  },
  showLocation:function(res){
    var pk = res.currentTarget.dataset.pk;
    wx.setStorageSync('locationShow', pk)
    wx.navigateTo({
      url: '/pages/pk/showLocation/showLocation',
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
  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
  showText:function(res){
    var that  = this;
    var text = res.currentTarget.dataset.text;
    wx.navigateTo({
      url: '/pages/pk/showText/showText?text='+text,
    })
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
      that.queryPks("label",that.data.latitude,that.data.longitude)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
  changePk:function(res){
    var that = this;
    var current =  res.detail.current;
    var location = that.data.pks[current].location;
    console.log("当前PK位置:",location);
    that.setData({
      latitude : location.latitude/1000000,
      longitude : location.longitude/1000000,
      scale:16
    })
    if(current === that.data.pks.length-1)
    {
      if(that.data.pkEnd){return;}
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("", true);
      httpClient.addHandler("success", function (pagePks) {
        that.setData({
            page:that.data.page + 1,
            pks:that.data.pks.concat(pagePks)
        })
      })
      httpClient.send(request.url.nextInvitePage, "GET",{page:that.data.page});
    
    }



  },


  pkDetail:function (params) {
    wx.navigateTo({
      url: '/pages/pk/pk/pk?pkId=PK01',
    })
  },
  viewImg:function(res){
    var that = this;
    var url = res.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
    })
  
  },
  showImg:function(res){
    var imgs = res.currentTarget.dataset.imgs;
    var index = res.currentTarget.dataset.index;

    wx.previewImage({
      current:imgs[index],
      urls: [imgs[0],imgs[1],imgs[2],imgs[3],imgs[4],imgs[5],imgs[6],imgs[7],imgs[8]],
    })


  },




})