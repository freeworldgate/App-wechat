// pages/pk/pk/pk.js
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



const width = wx.getSystemInfoSync().windowWidth;
const vwPx = width/100;
const r_width = 2*vwPx;
const l_width = 2*vwPx;
const img_width = 10*vwPx;
const small_size = (100*vwPx - r_width - l_width*2 - img_width - 1*vwPx)/3;
const large_size = small_size * 2 + 0.5 *vwPx


Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 30.319739999999985,
    //经度
    longitude: 112.222,
    //标记点
    markers: [{
      //标记点 id
      id: 1,
      //标记点纬度
      latitude: 32.319739999999985,
      //标记点经度
      longitude: 120.14209999999999,
      name: '行之当前的位置'
    }],

    dates: ['12/30', '昨天', '前天', '9/19'],
    index: 0,


    circular:false,
    autoplay:false,
    interval:2000,

   
    pkId:"",


    leftTime:0,
    posts:[],
    hourStr:"00",
    minStr:"00",
    secStr:"00",
    locationUpdate:true,
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
    var pkId = options.pkId;   
    
    that.data.pkId = pkId;
    that.setData({
      pkId:pkId,
      type:options.type
    })
    var user = wx.getStorageSync("user");
    that.setData({user:user})
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryHiddenPost, "GET", { pkId: that.data.pkId});

  },

 
  addInvite:function(){
        var that = this;
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.send(request.url.addUserInvite, "GET", { pkId: that.data.pk.pkId});
  },

  createPay:function(payInfo)
  {

    wx.requestPayment({
      timeStamp: payInfo.timeStamp,//记住，这边的timeStamp一定要是字符串类型的，不然会报错
      nonceStr: payInfo.nonceStr,
      package: payInfo.package,
      signType: 'MD5',
      paySign: payInfo.paySign,
      success: function (event) {

       
      },
      fail: function (error) {
       
      },
       

       
    });

  },
  like:function(){
    var that = this;
    login.getUser(function(user){
      that.setData({greateStatu:!that.data.greateStatu});
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("", true);    
      httpClient.send(request.url.likePk, "GET",{pkId: that.data.pkId});
    })
  },
  collect:function(){
    var that = this;
    login.getUser(function(user){

      that.setData({inviteStatu:!that.data.inviteStatu})
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("", true);    
      httpClient.send(request.url.collectPk, "GET",{pkId: that.data.pkId});
    })

  },
  goPost:function(){

    var that = this;
    var pkId = res.currentTarget.dataset.pkId;
    var postId = res.currentTarget.dataset.postId;

    wx.navigateTo({
      url: '/pages/pk/prepost/prepost?pkId='+pkId + "&postId=" + postId,
    })


  },

  drawPkCode:function(res){
    var that = this;
    var pk = res.currentTarget.dataset.pk;
    wx.setStorageSync('drawPk', pk);
    wx.navigateTo({
      url: '/pages/pk/drawPost/drawPost?',
    })



  },




  publish:function(){
    var that = this;
  
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);

    
    httpClient.send(request.url.queryUserPost, "GET",{pkId: that.data.pkId,});
  },

  uploadImgs:function(successCallBack){
    var that = this;

  },




  hiddenMap:function(){
    this.setData({
      mapShow:false
    })
  },
  showMap:function(){
    this.setData({
      mapShow:true
    })
  },
  queryLengthTime:function(pkId){
    var that = this;
    locationUtil.getLocation(function(latitude,longitude){
        var user = wx.getStorageSync("user");
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("", false);
        httpClient.send(request.url.queryLengthTime, "GET", { pkId: pkId, userId: user.userId,latitude:latitude,longitude:longitude});
    })



  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
  
    return {
        title: '邀请你一起打卡@'+ that.data.pk.name ,
        desc: "from",
        imageUrl:that.data.pk.backUrl,
        path: '/pages/pk/timepage/timepage?type=share&pkId=' + that.data.pk.pkId,
    }


  },
  pkImage:function(res){
    var that = this;
    login.getUser(function(user){
      wx.navigateTo({
        url: '/pages/pk/locationImages/locationImages?pkId='+that.data.pk.pkId,
      })

    })


  },
  onReachBottom:function(){
    if(!this.data.nomore)
    {
      this.nextPage();
    }


  },
  nextPage: function () {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", false);
    var user = wx.getStorageSync("user");
    httpClient.addHandler("success", function (data) {
      var newPosts = that.data.posts.concat(data);
      that.setData({
        posts: newPosts,
        page: that.data.page + 1
      })
    })
    httpClient.send(request.url.nextHiddenPage, "GET", { pkId: that.data.pkId, page: that.data.page });

    // wx.stopPullDownRefresh()
  },

  onPullDownRefresh:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", false);
    var user = wx.getStorageSync("user");

    httpClient.send(request.url.queryHiddenPost, "GET", { pkId: that.data.pkId});  

    // that.queryLengthTime(that.data.pkId);
  },

  refreshPage: function () {
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("", false);
    var user = wx.getStorageSync("user");
    httpClient.addHandler("success", function (data) {
      // var newPosts = that.data.posts.concat(data);
      that.setData({
        posts: data,
        page:that.data.page+1
      })
    })
    httpClient.send(request.url.nextPage, "GET", { pkId: that.data.pkId, userId: user.userId, page: that.data.page });

    // wx.stopPullDownRefresh()
  },

  

  showImg:function(res){
    var post = res.currentTarget.dataset.post;
    var index = res.currentTarget.dataset.index;

    wx.previewImage({
      current:post.postImages[index].imgUrl,
      urls: [post.postImages[0].imgUrl,post.postImages[1].imgUrl,post.postImages[2].imgUrl,post.postImages[3].imgUrl,post.postImages[4].imgUrl,post.postImages[5].imgUrl,post.postImages[6].imgUrl,post.postImages[7].imgUrl,post.postImages[8].imgUrl],
    })


  },

  showPost:function(res){
      var that = this;
      var post = res.currentTarget.dataset.post;
      wx.navigateTo({
        url: '/pages/pk/post/post?pkId=' + that.data.pkId + "&postId=" + post.postId,
      })



  },






  updateDynamic:function(){
    var that = this;
    // wx.request({
    //   url: request.url.queryPkStatu,
    //   method:"GET",
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
    //   data:{
    //     pkId: that.data.pkId,
    //     userId:that.data.user.userId,

    //   },
      
    //   success:function(res){
    //       that.setData({ 
    //          infos:res.data._4_data,

    //       })

    //   }
      
    // })


    that.onTimeTask();
  },
  groupCode:function(){
    var that = this;
    login.getUser(function(){
      wx.navigateTo({
        url: "/pages/pk/message/message?pkId=" + that.data.pk.pkId,
      })
    })


  },

  onTimeTask:function () {
    var that = this;
    if(that.data.isApprove && that.data.posts && that.data.user)
    {
      that.data.isApprove = false;  
      setTimeout(function() {
        
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("", true);
        httpClient.addHandler("editApproverMessage", function (result) {
          template.createOperateDialog(that).show(result.castV2, result.castV3, function () {

            that.approverMessage();

          }, function () {});
          
        })
        httpClient.addHandler("groupCode", function (result) {
          template.createOperateDialog(that).show(result.castV2, result.castV3, function () {

              that.groupCode();


          }, function () {});
          
        })

        httpClient.addHandler("select", function (result) {
          template.createOperateDialog(that).show(result.castV2, result.castV3, function () {

              wx.navigateTo({
                url: "/pages/pk/post/post?pkId=" + that.data.pkId + "&postId=" + result.castV1 ,
              })

          }, function () {});
          
        })

        httpClient.addHandler("publish", function (tip) {
          template.createOperateDialog(that).show(result.castV2, result.castV3, function () {
                that.publish();
  
          }, function () {});
          
        })
      
        httpClient.addHandler("no", function (tip) {
          
        })
        httpClient.send(request.url.oneTimeTask, "GET", { pkId: that.data.pkId });
        
      },1)
    }
  },
  onReady:function (params) {
    
  },
  goPost:function(res){
    var that = this;
    var postId = res.currentTarget.dataset.postid;
    var pkId = res.currentTarget.dataset.pkid;
    wx.navigateTo({
      url: '/pages/pk/mypost/mypost?pkId='+pkId+"&postId="+postId,
    })

  },
  onShow:function(){
    var that = this;
    that.data.locationUpdate = true;
    var userPost = wx.getStorageSync('userPost');
    if(userPost)
    {
        wx.removeStorageSync('userPost')
        if(that.data.posts && that.data.posts.length>0 && that.data.pk.topPostId === that.data.posts[0].postId)
        {//存在顶置 
          that.data.posts.splice(1, 0,userPost); 
        }
        else
        {//不存在顶置
          that.data.posts.unshift(userPost);
        }
        that.setData({
          posts:that.data.posts
        })

    }

  },
  onUnload:function(){
    var that = this;
    clearInterval(that.data.interval);
  },
  onHide:function(){
    var that = this;
    that.data.locationUpdate = false;
  },



  openText:function(res)
  {
    var that = this;
    var index = res.currentTarget.dataset.index;
    var tag = 'posts['+index+'].tag';
    var ctag = that.data.posts[index].tag;
    that.setData({
      [tag]:!ctag
    })
  },

  topPost:function(res){
    var that = this;
    var post = res.currentTarget.dataset.post;
    var pkId = res.currentTarget.dataset.pkid;
    var index = res.currentTarget.dataset.index;

    template.createOperateDialog(that).show("顶置图册", "确定将该图册设置为首页?...", function () {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function (post) {
              that.data.posts.splice(index, 1); 
              that.data.posts.unshift(post);
              that.setData({
                posts: that.data.posts,
                ['pk.topPostId']:post.postId  
              })


      })
      httpClient.send(request.url.topPost, "GET", { postId: post.postId,pkId:pkId });
    }, function () {});




  },
  removePost:function(res){
    var that = this;

    var post = res.currentTarget.dataset.post;
    var pkId = res.currentTarget.dataset.pkid;
    var index = res.currentTarget.dataset.index;

    template.createOperateDialog(that).show("删除打卡信息?", "删除?...", function () {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function () {
              that.data.posts.splice(index, 1); 
              that.setData({
                posts: that.data.posts,
              })


      })
      httpClient.send(request.url.removePost, "GET", { postId: post.postId,pkId:pkId });
    }, function () {});




  },
  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
  hiddenPost:function(res){
    var that = this;

    var post = res.currentTarget.dataset.post;
    var pkId = res.currentTarget.dataset.pkid;
    var index = res.currentTarget.dataset.index;

    template.createOperateDialog(that).show("确定从隐藏列表中移除该条记录?", "确定从隐藏列表中移除该条记录?", function () {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function () {
              that.data.posts.splice(index, 1); 
              that.setData({
                posts: that.data.posts,
              })


      })
      httpClient.send(request.url.removeFromHiddenPosts, "GET", { postId: post.postId });
    }, function () {});




  },
  showLocation:function(res){
    var that = this;
    var pk = res.currentTarget.dataset.pk;
    wx.setStorageSync('locationShow', pk)
    locationUtil.getLocation(function(latitude,longitude){

      var distance = locationUtil.getDistance(latitude,longitude,that.data.pk.latitude,that.data.pk.longitude);
      that.setData({
        length:parseFloat(distance*1000),
        lengthStr:distance<1?distance*1000:distance
      })
    })
    wx.navigateTo({
      url: '/pages/pk/showLocation/showLocation',
    })

  },
  signLocation:function(){
    var that = this;
    login.getUser(function(user){
      locationUtil.getLocation(function(latitude,longitude){

            var distance = locationUtil.getDistance(latitude,longitude,that.data.pk.latitude,that.data.pk.longitude);
            that.setData({
              length:distance*1000,
              lengthStr:distance<1?distance*1000:distance
            })

            if(distance*1000 > that.data.pk.type.rangeLength)
            {
              template.createDialog(that).show("超出打卡区域","您所在区域不在卡点可打卡范围之内");
              return;
            }
            //非打卡时间
            if(that.data.leftTime > 0)
            {
              template.createDialog(that).show("计时结束后可再次打卡","距离上次打卡时间过近，计时归零后请再打卡.");
              return;
            }
            wx.chooseImage({
              count: 9,
              sizeType: ['compressed', 'original'],
              sourceType: ['album', 'camera'],
              success(res) {
                  var files = res.tempFilePaths;
                  wx.navigateTo({
                    url: '/pages/pk/uploadImgs/uploadImgs?imgs='+files + "&pkId=" + that.data.pkId,
                  })
              },
            })
        


  })





    })

  },



  relaunch:function (params) {
    wx.reLaunch({
      url: '/pages/pk/locate/locate',
    })
  },
  showPk:function(res){
    var that = this;
    var topic = res.currentTarget.dataset.topic;
    var watchword =  res.currentTarget.dataset.watchword;

    template.createShowPkDialog(that).show(topic,watchword)

  },

  importPost:function(res){
    var that = this;
    var postId =  res.currentTarget.dataset.postid;
    var pkId =  res.currentTarget.dataset.pkid;
    var style =  res.currentTarget.dataset.style;
    var post =  res.currentTarget.dataset.post;
    wx.setStorageSync('importPost', post);
    wx.navigateTo({
      url: '/pages/pk/drawPost/drawPost?pkId=' + pkId + "&postId=" + postId +"&imgBack=" + that.data.imgBack + "&style=" + style ,
    })

  },

  freshPost:function(res){
    var that = this;
    var index =  res.currentTarget.dataset.index;
    var post =  res.currentTarget.dataset.post;
    post.postImages.sort(function(){
                   return Math.random()-0.5;
            });

    post.style = Math.floor(Math.random() * (6) + 1);
    var upost = "posts[" + index + "]";
    that.setData({
      [upost]:post
    })

  },
  freshCpost:function(res){
    var that = this;
    var post =  res.currentTarget.dataset.post;
    post.postImages.sort(function(){
                   return Math.random()-0.5;
            });
    post.style = Math.floor(Math.random() * (6) + 1);

    that.setData({
      cpost:post
    })

  },
  openTopic:function(res){
      var that = this;
      var index =  res.currentTarget.dataset.index;
      var flag = "posts[" + index + "].flag";
      that.setData({
        [flag]:!that.data.posts[index].flag
      })




  },
  changeEyeStatu:function(){
    var that = this;
    that.setData({
      eyeStatu:!that.data.eyeStatu
    })


  },
  setLocation:function(){
    var that = this;
      template.createOperateDialog(that).show("添加主题位置", "将主题锁定到当前位置，以便附近用户可见...", function () {
      tip.showContentTip("定位中...") 
      that.setNetLocation();
    }, function () {});
  },

  setNetLocation: function () {
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
  // 获取定位当前位置的经纬度
  getLocation: function () {
    let that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        that.setData({
          latitude : res.latitude,
          longitude : res.longitude
        })
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  // 获取当前地理位置
  getLocal: function (latitude, longitude) {
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
  
          that.setData({
            "pk.location":location
          })

        })
        httpClient.send(request.url.setLocation, "GET",
          {
            pkId: that.data.pkId,
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

  editTip:function()
  {
    var that = this;
    template.createPkTipDialog(that).show(that.data.tips,that.data.pk.tips,that.data.maxTips,function(newTips){
      var ids = [];
      that.setData({
        'pk.tips':newTips
      });
      for (var i = 0; i< newTips.length;i++) {
        ids.unshift(newTips[i].id);  
      }
  
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("", true);
      httpClient.send(request.url.setPkTips, "GET", { pkId: that.data.pk.pkId, tips:ids});


    });








  },
  changeCpost:function(res){
    var that = this;
    var current =  res.detail.current;
    that.setData({
      'cpost.current':current
    })
  },
  selectCpost:function(res){
    var that = this;
    var index =  res.currentTarget.dataset.index;
    that.setData({
      'cpost.current':index
    })
  },
  changePost:function(res){
    var that = this;
    var index =  res.currentTarget.dataset.index;
    var current =  res.detail.current;
    var key = "posts["+index+"].current";
    that.setData({
      [key]:current
    })
  },
  selectPost:function(res){
    var that = this;
    var index =  res.currentTarget.dataset.index;
    var index1 =  res.currentTarget.dataset.index1;
    var key = "posts["+index+"].current";
    that.setData({
      [key]:index1
    })
  }

})