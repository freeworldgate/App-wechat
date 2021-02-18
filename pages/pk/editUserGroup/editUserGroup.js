var request = require('../../../utils/request.js')
var http = require('../../../utils/http.js')
var tip = require('../../../utils/tipUtil.js')
var login = require('../../../utils/loginUtil.js')
var locationUtil = require('../../../utils/locationUtil.js')
var route = require('../../../utils/route.js')
var redirect = require('../../../utils/redirect.js')
var uuid = require('../../../utils/uuid.js')
var inviteReq = require('../../../utils/invite.js')
var userInvite = require('../../../utils/userInvite.js')
var upload = require('../../../utils/uploadFile.js')
var template = require('../../../template/template.js')
var amapFile = require('../../../utils/amap-wx.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userGroup:{}
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
      pkId:options.pkId
    })


    that.queryUserLength(options.pkId);
    that.queryUserGroup(options.pkId);

  },
  queryUserLength:function(pkId){
    var that = this;
    locationUtil.getLocation(function(latitude,longitude){
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("", false);
      httpClient.addHandler("length", function (pk) {
        var distance = locationUtil.getDistance(latitude,longitude,pk.latitude,pk.longitude);
        that.setData({
          myLength:distance,
          myLengthStr:distance<1?distance*1000:distance,
          range:pk.typeRange,
          rangeStr:pk.typeRange<1000?pk.typeRange:(pk.typeRange/1000.0).toFixed(1),
        })
      })
      httpClient.send(request.url.queryGroupLength, "GET", {pkId:pkId});

    })

  },
  queryUserGroup:function(pkId){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.addHandler("userGroup", function (userGroup) {
      var distance = locationUtil.getDistance(latitude,longitude,userGroup.latitude,userGroup.longitude);
      that.setData({
        myLength:distance,
        userGroup:userGroup
      })
    })
    httpClient.send(request.url.queryUserGroup, "GET", {pkId:pkId});
  },
  cancelGroup:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.cancelGroup, "GET", {pkId:that.data.pkId});
  },


  editName:function(){
    var that = this;
    if(that.data.userGroup&&that.data.userGroup.statu)
    {
      wx.navigateTo({
        url: '/pages/pk/showText/showText?text='+that.data.userGroup.groupName
      })
      return;
    }





    if(that.data.userGroup&&that.data.userGroup.groupName){
      wx.navigateTo({
        url: '/pages/pk/editText/editText?scene=groupName&text='+that.data.userGroup.groupName
      })
    }
    else
    {
      wx.navigateTo({
        url: '/pages/pk/editText/editText?scene=groupName&text='
      })
    }


  },
  editDesc:function(){
    var that = this;
    if(that.data.userGroup&&that.data.userGroup.statu)
    {
      wx.navigateTo({
        url: '/pages/pk/showText/showText?text='+that.data.userGroup.groupDesc
      })

      return;
    }
    if(that.data.userGroup&&that.data.userGroup.groupDesc){
      wx.navigateTo({
        url: '/pages/pk/editText/editText?scene=groupDesc&text='+that.data.userGroup.groupDesc
      })
    }
    else
    {
      wx.navigateTo({
        url: '/pages/pk/editText/editText?scene=groupDesc&text='
      })
    }


  },
  uploadImgs:function(){
    var that = this;
    if(that.data.userGroup&&that.data.userGroup.statu)
    {
      template.createDialog(that).show("提示", "当前状态不支持修改");
      return;
    }
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album'],
      success(res) {
        var files = res.tempFilePaths;
        template.uploadImages3("PK-User-Back", files,that, function(urls){
            that.setData({
              'userGroup.groupCard':urls[0]?urls[0]:'',
            })
        }, function(){});
      },
    })


  },
  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
  uploadGroup:function(){
    var that = this;
    if(that.data.myLength > that.data.range)
    {
      template.createOperateDialog(that).show("提示", "超出有效范围",function(){
      },function(){});
      return;
    }

    if(that.data.userGroup&&that.data.userGroup.statu)
    {
      template.createDialog(that).show("提示", "当前状态不支持修改");
      return;
    }
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("groupPay", function () {
      template.createOperateDialog(that).show("提示","可用群组卡不足",function(){
        wx.navigateTo({
          url: '/pages/pk/pay/pay?type=4',
        })
    },function(){});
    })
    httpClient.send(request.url.createGroup, "GET", {
      pkId:that.data.pkId,
      groupName:that.data.userGroup.groupName,
      groupDesc:that.data.userGroup.groupDesc,
      url:that.data.userGroup.groupCard,
    });


  },

  update:function(){
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album'],
      success(res) {
        var files = res.tempFilePaths;
        template.uploadImages3("PK-Update-Group", files,that, function(urls){

          var httpClient = template.createHttpClient(that);
          httpClient.setMode("label", true);
          httpClient.addHandler("success", function () {
              that.setData({
                'userGroup.groupCard':urls[0],
              })
          })
          httpClient.send(request.url.updateGroup, "GET", {pkId:that.data.pkId,groupCard:urls[0]});



          

        }, function(){});
      },
    })


  }






})