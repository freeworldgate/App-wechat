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
    opacity:'00',
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

    showTime:false,
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
    httpClient.setMode("page", false);
    httpClient.send(request.url.queryPk, "GET", { pkId: that.data.pkId, userId: user.userId});
    that.startClock();
  },
  startClock:function(){
      var that= this;
      var interval = setInterval(function(){
        var left = that.data.leftTime;
        var hourStr = "00";
        var minStr = "00";
        var secStr = "00";
        var hour = Math.floor(left/3600);
        var min = Math.floor(left%3600/60);
        var sec = Math.floor(left%60);

        if(hour <1 ){hourStr = "00";}
        else if(hour<10){hourStr = "0" + hour}
        else{hourStr = hour}
        if(min <1 ){minStr = "00";}
        else if(min<10){minStr = "0" + min}
        else{minStr = min}

        if(sec <1 ){secStr = "00";}
        else if(sec<10){secStr = "0" + sec}
        else{secStr =sec}

        that.setData({
          hourStr:hourStr,
          minStr:minStr,
          secStr:secStr,
          leftTime:left-1
        })
      //更新位置:
      if(that.data.locationUpdate&&that.data.pk)
      {
       
        // that.queryLengthTime(that.data.pk.pkId);
        locationUtil.getLocation(function(latitude,longitude){

              var distance = locationUtil.getDistance(latitude,longitude,that.data.pk.latitude,that.data.pk.longitude);
              that.setData({
                length:distance*1000,
                lengthStr:distance<1?distance*1000:distance
              })
              that.data.locationUpdate = false;

    
        })
    
      }
        



    },1000)
      that.data.interval = interval;
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
  goUser:function(res){
    var userId = res.currentTarget.dataset.userid;
    login.getUser(function(user)
    {
        wx.navigateTo({
          url: "/pages/pk/userPublishPost/userPublishPost?userId="+userId,
        })
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
    // locationUtil.getLocation(function(latitude,longitude){
    //     var user = wx.getStorageSync("user");
    //     var httpClient = template.createHttpClient(that);
    //     httpClient.setMode("", false);
    //     httpClient.send(request.url.queryLengthTime, "GET", { pkId: pkId, userId: user.userId,latitude:latitude,longitude:longitude});
    // })



  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
  
    return {
        title: '邀请你一起打卡@'+ that.data.pk.name ,
        imageUrl:that.data.pk.backUrl+"?x-oss-process=image/crop,w_1000,h_1000,g_center",
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
    httpClient.send(request.url.nextPage, "GET", { pkId: that.data.pkId, userId: user.userId, page: that.data.page });

    // wx.stopPullDownRefresh()
  },

  onPullDownRefresh:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", false);
    var user = wx.getStorageSync("user");

    httpClient.send(request.url.queryPk, "GET", { pkId: that.data.pkId, userId: user.userId});  

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
      wx.setStorageSync('groupPk', that.data.pk)
      wx.navigateTo({
        url: "/pages/pk/groupCard/groupCard?pkId=" + that.data.pk.pkId,
      })
    })


  },
  userSort:function(res)
  {
    var that = this;
    var pkId = res.currentTarget.dataset.pkid;
    login.getUser(function(user){
        wx.navigateTo({
            url: '/pages/pk/userSort/userSort?pkId='+pkId,
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

    template.createOperateDialog(that).show("顶置图册", "确定将该帖设置为首页?", function () {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function () {
          template.createEditNumberDialog(that).show("设置顶置周期(单位分钟)",4,"顶置周期内不可更改...",function(value){
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
              httpClient.send(request.url.setTopPostTime, "GET", { postId: post.postId,pkId:pkId,value:value });
          

          });








      })
      httpClient.send(request.url.topPost, "GET", { postId: post.postId,pkId:pkId });
    }, function () {});




  },
  removePost:function(res){
    var that = this;

    var post = res.currentTarget.dataset.post;
    var pkId = res.currentTarget.dataset.pkid;
    var index = res.currentTarget.dataset.index;

    template.createOperateDialog(that).show("确定删除该条记录吗?", "确定删除该条记录吗?", function () {
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
  
  hiddenPost:function(res){
    var that = this;

    var post = res.currentTarget.dataset.post;
    var pkId = res.currentTarget.dataset.pkid;
    var index = res.currentTarget.dataset.index;

    template.createOperateDialog(that).show("确定隐藏该条打卡信息吗?", "确定隐藏该条打卡信息吗?", function () {
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.addHandler("success", function () {
              that.data.posts.splice(index, 1); 
              that.setData({
                posts: that.data.posts,
              })


      })
      httpClient.send(request.url.hiddenPost, "GET", { postId: post.postId,pkId:pkId });
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
    that.setData({
      showLocation:false
    })

  },
  hiddeTime:function(){
    this.setData({
      showTime:false
    })
  },
  findSomeOne:function(res){
      var that = this;
      var pk = res.currentTarget.dataset.pk;
      wx.removeStorageSync('findPk')
      wx.setStorageSync('findPk', pk)
      login.getUser(function(user){
        wx.navigateTo({
          url: '/pages/pk/findSomeOne/findSomeOne?pkId='+pk.pkId,
        })
        // wx.navigateTo({
        //   url: '/pages/pk/userFind/userFind'
        // })
        // wx.navigateTo({
        //   url: '/pages/pk/payForPk/payForPk'
        // })
      })


  },
  userPage:function(res){
    var that = this;
    var userId =  res.currentTarget.dataset.user;
    login.getUser(function(user){
      wx.navigateTo({
        url: "/pages/pk/userPublishPost/userPublishPost?userId=" + userId,
      })

    })



  },
  hiddenLocation:function(){
    var that = this;
    that.setData({
      showLocation:false
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
              that.setData({
                showLocation:true
              })
              return;
            }
            //非打卡时间
            if(that.data.leftTime > 0)
            {
              that.setData({
                showTime:true
              })
              return;
            }

            wx.chooseImage({
              count: 9,
              sizeType: ['compressed', 'original'],
              sourceType: ['album', 'camera'],
              success(res) {
                  var files = res.tempFilePaths;
                  wx.setStorageSync('publish-pk', that.data.pk)
                  wx.navigateTo({
                    url: '/pages/pk/uploadImgs/uploadImgs?imgs='+files + "&pkId=" + that.data.pkId+"&postTimes="+that.data.postTimes,
                  })
              },
            })
        


  })





    })

  },
  signLocation1:function(){
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
              template.createOperateDialog(that).show("不在可打卡范围内，查看卡点范围?", "不在可打卡范围内，查看卡点范围?", function () {
                var pk = that.data.pk;
                wx.setStorageSync('locationShow', pk)
                wx.navigateTo({
                  url: '/pages/pk/showLocation/showLocation',
                })
              }, function () {});
              return;
            }
            //非打卡时间
            if(that.data.leftTime > 0)
            {
              that.setData({
                showTime:true
              })
              return;
            }
            wx.setStorageSync('publish-pk', that.data.pk)
            wx.navigateTo({
              url: '/pages/pk/uploadImgs/uploadImgs?pkId=' + that.data.pkId+"&postTimes="+that.data.postTimes
            })


  })





    })

  },

  back:function (params) {
    wx.navigateBack({
      complete: (res) => {},
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
  },
  showText:function(res){
    var that  = this;
    var text = res.currentTarget.dataset.text;
    wx.navigateTo({
      url: '/pages/pk/showText/showText?text='+text,
    })
  },
  showImg:function(res){
    var that  = this;
    var index = parseInt(res.currentTarget.dataset.index);
    var imgs = res.currentTarget.dataset.imgs;
    if(index > imgs.length-1){return;}
    var current = imgs[index].imgUrl;
    var images = [];
    for(var i=0;i<imgs.length;i++)
    {
        images[i] = imgs[i].imgUrl;
    }
    wx.previewImage({
      current:current,
      urls: images,
    })
  },
  onPageScroll:function(e){
    var that = this;
    var top = e.scrollTop;

    if(top<200 && top > 100)
    { 
        var topValue = parseInt((top-100) * (256/100)).toString(16);
        that.setData({
            opacity:topValue
        })
    }
    if(top<100)
    {
        var topValue = parseInt(top).toString(16);
        that.setData({
            opacity:"00"
        })
    }
    if(top>200)
    {
        var topValue = parseInt(top).toString(16);
        that.setData({
            opacity:"ff"
        })
    }


  }

})