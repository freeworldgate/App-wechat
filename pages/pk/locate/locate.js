// pages/pk/home/home.js
import {CDN_PATH, MOYUAN_KEY, BAIQIAN_KEY, YULU_KEY, DIFUNI_KEY, REFERER} from '../../../config/appConfig';
const chooseLocation = requirePlugin('chooseLocation');//导入插件
var request = require('./../../../utils/request.js')
var login = require('./../../../utils/loginUtil.js')
var locationUtil = require('./../../../utils/locationUtil.js')
var inviteReq = require('./../../../utils/invite.js')
var template = require('./../../../template/template.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    current:0,
    scale:16,
    latitude: 31.9902783203125,
    //经度
    longitude: 118.73781711154514,
    circle:[],
    markers:[],
    includePoints:[],
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

    choose:false,

    pageTag:false,
    pks: [],
    user:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // that.locate();
    wx.hideShareMenu({
      complete: (res) => {},
    })
    inviteReq.getHeight(function (res) {
      that.setData({
          top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
      })
  })

    locationUtil.getLocation(function (latitude,longitude) {
      that.setData({
        latitude:latitude,
        longitude:longitude
      })
    
      that.queryInvites("page",latitude,longitude);
    });


  },




  myPk:function(){
    login.getUser(function(user){
      wx.navigateTo({
        url: '/pages/pk/userPk/userPk?userId='+user.userId,
      })

    })


  },

  myInvite:function(){
    login.getUser(function(user){
      wx.navigateTo({
        url: '/pages/pk/invite/invite?userId='+user.userId,
      })

    })


  },
  addInvite:function(){
    var that = this;
    var pkId = res.currentTarget.dataset.pkId;
    var index = res.currentTarget.dataset.index;

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.addUserInvite, "GET", { pkId: pkId});
},


  locate:function(){
    let that = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      that.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          that.getLocation();
        }
        else {
          //调用wx.getLocation的API
          that.getLocation();
        }
      }
    })


  },
  getLocation: function () {
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        that.setData({
          latitude : res.latitude - 0.003,
          longitude : res.longitude
        })
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  queryInvites:function (tab,latitude,longitude) {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tab, false);
    var user = wx.getStorageSync('user');
    httpClient.send(request.url.queryHomePage, "GET", { userId:user.userId,latitude:latitude,longitude:longitude });


  },
  viewImg:function(res){
    var that = this;
    var url = res.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
    })
  
  },



  myFollow:function(){
    login.getUser(function(user){

        wx.navigateTo({
          url: '/pages/pk/userFinds/userFinds?userId='+user.userId,
        })


    })


  },



  addPost: function () {

    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);

    httpClient.addHandler("publishPost", function () {
      template.createOperateDialog(that).show("发布图册", "将要消耗您一个图册", function () {
        that.publishPost();
      }, function () { });
    });
    httpClient.addHandler("free", function () {
      that.publishPost();
    });
    httpClient.send(request.url.addPost, "GET", { pkId: that.data.pkId });
  },

  publishPost: function () {
    var that = this;

    template.createEditImageDialog(that).setDialog("编辑图册", "编辑你想说的话", 9, function () {
      // 发布图册



    }).show();
  },

  showPk:function(res){
    var that = this;
    var pkId = res.currentTarget.dataset.pkid;

    template.createShowPkDialog(that).show("","")

  },







  click: function (e) {
    var tab = parseInt(e.currentTarget.dataset.tab);
    var id = e.currentTarget.dataset.id;
    var user = wx.getStorageSync("user");

    var httpClient = template.createHttpClient(this);
    httpClient.setMode("label", false);
    httpClient.addHandler("login", function () {
      login.getUser(function (user) {
        console.log("登录成功:", user);
      });
    });
    httpClient.send(request.url.click, "GET", { userId: user.userId, tab: tab, id: id });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onHide:function(){
    var that = this;
    that.setData({
      autoplay:false
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      autoplay:true
    })
    var user = wx.getStorageSync('user');

    that.setData({user:user})


    that.updateDistance();
    if(that.data.choose){
      const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
      console.log(location)  //得到你刚刚选择的地址信息
      if(location){
        wx.navigateTo({
          url: '/pages/pk/singleLocation/singleLocation?latitude='+location.latitude+"&longitude="+location.longitude+"&name="+location.name+"&address="+location.address+"&city="+location.city,
        })
        that.data.choose = false;
      }
    }



  },
  searchLocation:function(){
    var that = this;
    wx.getLocation({
      success:(res)=>{
          const key = YULU_KEY;
          const referer = REFERER;
          const location = JSON.stringify(res);
          let url = 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer;
          url += '&location=' + location;
          wx.navigateTo({
            url
          });
          that.data.choose = true;
      }
    })

  },
  updateDistance:function(){
    var that = this;
    locationUtil.getLocation(function(latitude,longitude){
      // console.log("位置:",res);
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



  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh:function (params) {
    var that = this;
    template.createPageLoadingError(that).hide();
    if(that.data.pageTag)
    {
     
      locationUtil.getLocation(function (latitude,longitude) {
        that.setData({
          latitude:latitude,
          longitude:longitude
        })
        that.queryInvites("label",latitude,longitude);
      });
    }
    else
    {
      locationUtil.getLocation(function (latitude,longitude) {
        that.setData({
          latitude:latitude,
          longitude:longitude
        })
        that.queryInvites("page",latitude,longitude);
      });

    }
    that.updateDistance();


  },

  /**
   * 页面上拉触底事件的处理函数
   */
  // onReachBottom: function () {
  //   var that = this;

  //     if(that.data.pkEnd){return;}
  //     var user = wx.getStorageSync('user');
  //     var fromUser = wx.getStorageSync('fromUser')
  //     var httpClient = template.createHttpClient(that);
  //     httpClient.setMode("label", false);
  //     httpClient.addHandler("success", function (pagePks) {
  //       that.setData({
  //           page:that.data.page + 1,
  //           pks:that.data.pks.concat(pagePks)
  //       })
  //     })
  //     httpClient.send(request.url.nextHomePage, "GET",{ userId:user.userId,fromUser:fromUser ,page:that.data.page});
    
  // },




  


  showImg:function(res){
    var imgs = res.currentTarget.dataset.imgs;
    var index = res.currentTarget.dataset.index;

    wx.previewImage({
      current:imgs[index],
      urls: imgs,
    })


  },
  userCenter:function(){
    login.getUser(function(user){
      wx.navigateTo({
        url: '/pages/pk/userPublishPost/userPublishPost?userId='+user.userId,
      })

    })
  },
  changePk:function(res){
    var that = this;

    var current =  res.detail.current;
    var pk = that.data.pks[current];
    
    console.log("当前PK位置:",location);
    that.setData({
      latitude : pk.latitude - 0.000,
      longitude : pk.longitude,
      circles:[pk.circle],
      scale:pk.type.scale,
      current:current
    })
    // that.updateDistance();
  },

  seeLocation:function(res){
    var location = res.currentTarget.dataset.location;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.openLocation({
          latitude,
          longitude,
          scale: 18
        })
      }
     })

  },


  groupCode:function(res) {
    var that = this;
    var pkId = res.currentTarget.dataset.pkid;

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.viewGroupCode, "GET",{pkId:pkId});   

  },

  myGroups:function(){
    login.getUser(function(user){
      wx.navigateTo({
        url: '/pages/pk/userGroups/userGroups',
      })
    })
  },
  unlockGroup:function()
  {
    login.getUser(function(user){
      wx.navigateTo({
        url: '/pages/pk/groupCardList/groupCardList',
      })

    })
  },
  showLocation:function(res){
    var pk = res.currentTarget.dataset.pk;
    wx.setStorageSync('locationShow', pk)
    wx.navigateTo({
      url: '/pages/pk/showLocation/showLocation',
    })
  },



  showText:function(res){
    var that  = this;
    var text = res.currentTarget.dataset.text;
    wx.navigateTo({
      url: '/pages/pk/showText/showText?text='+text,
    })
  },


  changeUser:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", false);
    httpClient.addHandler("success", function (user) {
        wx.setStorageSync('user', user)
        wx.reLaunch({
          url: '/pages/pk/locate/locate',
        })
    })
    httpClient.send(request.url.changeUser, "GET",{});   


  }

})