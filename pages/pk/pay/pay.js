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
    that.setData({
      type:options.type,
    })
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.pay, "GET", {type:options.type});
  },
  paySuccess:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (pay) {
        wx.requestPayment({
          timeStamp: pay.timeStamp,
          nonceStr: pay.nonceStr,
          package: pay.packageStr,
          signType: pay.signType,
          paySign: pay.paySign,
          success (res) {

            var httpClient = template.createHttpClient(that);
            httpClient.setMode("label", true);
            httpClient.send(request.url.paySuccess, "GET", {payId:pay.payId});

            that.setData({
                statu:"success"
            })
          
          
          },
          fail (res) {
              tip.showContentTip("支付失败");

           }


        })
    })
    httpClient.send(request.url.payType, "GET", {type:that.data.type,payId:that.data.selectPay.payId});
  },
  change:function(res){
    var that = this;
    var select = res.currentTarget.dataset.select;
    that.setData({
      selectPay:select
    })

  },
  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
  
})