// pages/pk/findSomeOne/findSomeOne.js
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

    imgUrl:'https://oss.211shopper.com/dir2/wx-1606375746086.jpg'

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
      that.setData({user:user})
    })
    that.setData({pkId:options.pkId})

    that.queryFinds("page",options.pkId);


  },
  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
  queryFinds:function(page,pkId){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(page, true);
    httpClient.send(request.url.queryPkFinds, "GET", { pkId: pkId});
  },

  onShareAppMessage:function(res){
    var that = this;
    var findId = res.target.dataset.findid;
    var url = res.target.dataset.url;
    var pkName = res.target.dataset.pkname;
    return {
        title: '遇见不撩 卡点互捞 @ ' + pkName ,
        desc: pkName,
        imageUrl:url+"?x-oss-process=image/crop,w_1000,h_1000,g_center",
        path: '/pages/pk/findCard/findCard?findId=' + findId,
    }

  },
  showText:function(res){
    var that  = this;
    var text = res.currentTarget.dataset.text;
    wx.navigateTo({
      url: '/pages/pk/showText/showText?text='+text,
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
  }
})