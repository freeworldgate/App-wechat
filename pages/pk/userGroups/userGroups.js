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
    nomore: false,
    pkGroups: [],

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

    // template.createPageLoading(that).show();
    // locationUtil.getLocation(function (latitude,longitude) {
    //   that.setData({
    //     latitude:latitude,
    //     longitude:longitude
    //   })
      
    // });
    that.init("page");
  },
  userGroup:function(res){
    var that = this;
    var pkId = res.currentTarget.dataset.pkid;
    wx.navigateTo({
      url: '/pages/pk/editUserGroup/editUserGroup?pkId='+pkId,
    })

  },
  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
  queryPks:function (tab) {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tab, true);
    httpClient.send(request.url.queryMyGroups, "GET", {});
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;

      if(that.data.nomore){return;}
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (pkGroups) {
        that.setData({
            page:that.data.page + 1,
            pkGroups:that.data.pkGroups.concat(pkGroups)
        })
      })
      httpClient.send(request.url.nextMyGroups, "GET",{page:that.data.page});
    
  },






  init:function (tab,latitude,longitude) {
    var that = this;
 
      that.queryPks(tab,latitude,longitude);
 
  },



})