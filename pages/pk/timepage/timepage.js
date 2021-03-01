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


  like:function(){
    var that = this;
    login.getUser(function(user){
      that.setData({greateStatu:!that.data.greateStatu});
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("", true);    
      httpClient.send(request.url.likePk, "GET",{pkId: that.data.pkId});
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
      wx.setStorageSync('imgPk', that.data.pk)
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
    template.createPageLoadingError(that).hide();
    var user = wx.getStorageSync("user");
    var httpClient = template.createHttpClient(that);
    if(that.data.pageTag)
    {
      httpClient.setMode("label", false);
    }
    else
    {
      httpClient.setMode("page", false);
    }
    
    httpClient.send(request.url.queryPk, "GET", { pkId: that.data.pkId, userId: user.userId});
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

  oper:function(res){
    var that  = this;
    var post = res.currentTarget.dataset.post;
    var index = res.currentTarget.dataset.index;
    var pkId = res.currentTarget.dataset.pkid;

    var selection = template.createSelectionDialog(that).setLayout("bottom","y")

    login.getUser(function(user){
        //发布者
        selection.addItem("","详情",function(){

          wx.navigateTo({
              url: '/pages/pk/comments/comments?pkId='+pkId+"&postId="+post.postId,
          })
    
      });
        selection.addItem("","举报Ta",function(){
          template.createSelectionDialog(that).hide();
          var httpClient = template.createHttpClient(that);
          httpClient.setMode("label", true);
          httpClient.addHandler("success", function () {
              tip.showContentTip("已收到您的投诉信息");
          })
          var selection = template.createSelectionDialog(that).setLayout("bottom","y")
          selection.addItem("","垃圾或广告",function(){httpClient.send(request.url.complainPost, "GET", { postId: post.postId,pkId:pkId,type:1 });})
                    .addItem("","涉黄或有害信息",function(){httpClient.send(request.url.complainPost, "GET", { postId: post.postId,pkId:pkId,type:2 });})
                    .addItem("","暴恐或违法",function(){httpClient.send(request.url.complainPost, "GET", { postId: post.postId,pkId:pkId,type:3 });})
                    .addItem("","诈骗或谣言",function(){httpClient.send(request.url.complainPost, "GET", { postId: post.postId,pkId:pkId,type:4 });})
                    .addItem("","人身攻击或者抄袭",function(){httpClient.send(request.url.complainPost, "GET", { postId: post.postId,pkId:pkId,type:5 });})
          selection.show();
        });
        selection.addItem("","Ta的打卡记录",function(){

            wx.navigateTo({
                url: '/pages/pk/userSort/userSort?pkId='+pkId+"&targetId="+post.creator.userId,
            })
      
        });
        if(user.userId === post.creator.userId){
          
            selection.addItem("","删除",function(){
              template.createOperateDialog(that).show("确定删除该条打卡信息吗?", "确定删除该条打卡信息吗?", function () {
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
        
      
        });}
        if((user.userId === that.data.pk.user.userId) && (that.data.pk.topPostId != post.postId)){
            selection.addItem("","隐藏该条打卡信息",function(){
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
          })
        }
        // //榜主
        if((user.userId === that.data.pk.user.userId) && (that.data.pk.topPostId != post.postId) && (post.type != 1)){
            selection.addItem("","顶置该条打卡信息",function(){
            template.createOperateDialog(that).show("顶置卡册", "确定顶置该条打卡信息?", function () {
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
                          ['pk.topPostId']:post.postId,
                          ['pk.topPostTimeLengthStr']:post.topPostTimeLengthStr,
                          ['pk.topPostTimeLength']:value,
                          topTime:"1秒钟"
                        })
                    })
                    httpClient.send(request.url.setTopPostTime, "GET", { postId: post.postId,pkId:pkId,value:value });
                
      
                });
      
      
            })
            httpClient.send(request.url.topPost, "GET", { postId: post.postId,pkId:pkId });
          }, function () {});
        });}
       
        selection.show();
    });
    
  },

  showImg:function(res){
    var post = res.currentTarget.dataset.post;
    var index = res.currentTarget.dataset.index;

    wx.previewImage({
      current:post.postImages[index].imgUrl,
      urls: [post.postImages[0].imgUrl,post.postImages[1].imgUrl,post.postImages[2].imgUrl,post.postImages[3].imgUrl,post.postImages[4].imgUrl,post.postImages[5].imgUrl,post.postImages[6].imgUrl,post.postImages[7].imgUrl,post.postImages[8].imgUrl],
    })


  },


  comment:function(res){
      var that = this;
      var post = res.currentTarget.dataset.post;
      var index = res.currentTarget.dataset.index;
      login.getUser(function(user){
          wx.navigateTo({
            url: '/pages/pk/comments/comments?pkId='+post.pkId+"&postId="+post.postId,
          })
  
  
      })
  
  


  },
  like:function(res){
    var that = this;
    var id = res.currentTarget.dataset.id;
    var index = res.currentTarget.dataset.index;
    login.getUser(function(user){
      
      if(!that.data.posts[index].gtag){
          that.data.posts[index].gtag = true;
          var httpClient = template.createHttpClient(that);
          httpClient.setMode("", true);
          httpClient.addHandler("success", function () {
            that.data.posts[index].gtag = false;
          })
          httpClient.send(request.url.greate, "GET", { id: id,scene:1,statu:that.data.posts[index].statu === 1?0:1});
          var key = "posts["+index+"].statu";
          var likes = "posts["+index+"].likes";
          var dislikes = "posts["+index+"].dislikes";
          var width = "posts["+index+"].lwidth";
          var height = "posts["+index+"].lheight";
          that.setData({[width]:25,[height]:25})
          for(var i=0;i<1000;i++){}
          that.setData({[width]:15,[height]:15})
          for(var i=0;i<1000;i++){}
          that.setData({[width]:5,[height]:5})
          that.setData({
            [likes]:(that.data.posts[index].statu!=1)?that.data.posts[index].likes+1:that.data.posts[index].likes>0?that.data.posts[index].likes-1:0,
            [dislikes]:(that.data.posts[index].statu===2)?that.data.posts[index].dislikes>0?that.data.posts[index].dislikes-1:0:that.data.posts[index].dislikes,
            [key]:(that.data.posts[index].statu===1)?0:1,
          })
          that.setData({[width]:15,[height]:15})
          for(var i=0;i<1000;i++){}
          that.setData({[width]:25,[height]:25})
          for(var i=0;i<1000;i++){}
          that.setData({[width]:35,[height]:35})
          setTimeout(() => {
            that.data.posts[index].gtag = false;
          }, 2000);
      }


    })



  },
  dislike:function(res){
    var that = this;
    var id = res.currentTarget.dataset.id;
    var index = res.currentTarget.dataset.index;
    login.getUser(function(user){
      
      if(!that.data.posts[index].gtag){
          that.data.posts[index].gtag = true;
          var httpClient = template.createHttpClient(that);
          httpClient.setMode("", true);
          httpClient.addHandler("success", function () {
            that.data.posts[index].gtag = false;
          })
          httpClient.send(request.url.greate, "GET", { id: id,scene:2,statu:that.data.posts[index].statu === 2?0:2});
          var key = "posts["+index+"].statu";
          var likes = "posts["+index+"].likes";
          var dislikes = "posts["+index+"].dislikes";
          var width = "posts["+index+"].dwidth";
          var height = "posts["+index+"].dheight";
          that.setData({[width]:25,[height]:25})
          for(var i=0;i<1000;i++){}
          that.setData({[width]:15,[height]:15})
          for(var i=0;i<1000;i++){}
          that.setData({[width]:5,[height]:5})

          that.setData({
            [likes]:(that.data.posts[index].statu!=1)?that.data.posts[index].likes:that.data.posts[index].likes>0?that.data.posts[index].likes-1:0,
            [dislikes]:(that.data.posts[index].statu===2)?that.data.posts[index].dislikes>0?that.data.posts[index].dislikes-1:0:that.data.posts[index].dislikes+1,
            [key]:(that.data.posts[index].statu===2)?0:2,
          })

          that.setData({[width]:15,[height]:15})
          for(var i=0;i<1000;i++){}
          that.setData({[width]:25,[height]:25})
          for(var i=0;i<1000;i++){}
          that.setData({[width]:35,[height]:35})
          setTimeout(() => {
            that.data.posts[index].gtag = false;
          }, 2000);
      }


    })



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
    var target = res.currentTarget.dataset.user;
    login.getUser(function(user){
        wx.navigateTo({
            url: '/pages/pk/userSort/userSort?pkId='+pkId+"&targetId="+target.userId,
        })
    })



  },

  onReady:function (params) {
    
  },

  onShow:function(){
    var that = this;
    that.data.locationUpdate = true;
    var update = wx.getStorageSync('postUpdate');
    wx.removeStorageSync('postUpdate');
    if(update){
      var user = wx.getStorageSync("user");
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("", false);
      httpClient.send(request.url.queryPk, "GET", { pkId: that.data.pkId, userId: user.userId});
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

    template.createOperateDialog(that).show("顶置卡册", "确定顶置该条打卡信息?", function () {
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
                    ['pk.topPostId']:post.postId,
                    ['pk.topPostTimeLength']:value,
                    topTime:"1秒钟"
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

    template.createOperateDialog(that).show("确定删除该条打卡信息吗?", "确定删除该条打卡信息吗?", function () {
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
    var poster =  res.currentTarget.dataset.user;
    if( poster.userType === 3){return;}
    login.getUser(function(){
      wx.navigateTo({
        url: "/pages/pk/userPublishPost/userPublishPost?userId=" + poster.userId,
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




          var selection = template.createSelectionDialog(that).setLayout("bottom","y")
          wx.setStorageSync('publish-pk', that.data.pk)
          selection.addItem("","文字",function(){
                          
                          wx.navigateTo({
                            url: '/pages/pk/uploadImgs/uploadImgs?type=1&pkId=' + that.data.pkId+"&postTimes="+that.data.totalPostTimes,
                          })
                    })
                    .addItem("","卡片",function(){
                    
                          wx.navigateTo({
                            url: '/pages/pk/uploadImgs/uploadImgs?type=2&pkId=' + that.data.pkId+"&postTimes="+that.data.totalPostTimes,
                          })
                    })
                    .addItem("","图片",function(){
                          wx.chooseImage({
                            count: 9,
                            sizeType: ['compressed', 'original'],
                            sourceType: ['album', 'camera'],
                            success(res) {
                                var files = res.tempFilePaths;
                  
                                wx.navigateTo({
                                  url: '/pages/pk/uploadImgs/uploadImgs?type=3&imgs='+files + "&pkId=" + that.data.pkId+"&postTimes="+that.data.totalPostTimes,
                                })
                            },
                          })
                    })
                    .addItem("","视频(30秒以内)",function(){
                          wx.chooseVideo({
                            sourceType: ['album','camera'],
                            maxDuration: 30,
                            camera: 'back',
                            success(res) {
                              if(res.duration > 30){tip.showContentTip("视频过长");return;}
                              if(res.size > 100 * 1024 * 1024){tip.showContentTip("内容过大");return;}
                              wx.navigateTo({
                                url: '/pages/pk/uploadImgs/uploadImgs?type=4&videoUrl='+res.tempFilePath+"&width="+res.width+"&height=" + res.height + "&pkId=" + that.data.pkId+"&postTimes="+that.data.totalPostTimes,
                              })
                            }
                          })




                    })
          selection.show();



        


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
  showSingleImg:function(res){
    var that  = this;
    var url = res.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
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


  },

  video_play(e) {
    var curIdx = e.currentTarget.id;
    // 没有播放时播放视频
    console.log(curIdx)
    if (!this.data.indexCurrent) {
      this.setData({
        indexCurrent: curIdx
      })
      var videoContext = wx.createVideoContext(curIdx,this) //这里对应的视频id
      videoContext.play()
    } else { // 有播放时先将prev暂停，再播放当前点击的current
      var videoContextPrev = wx.createVideoContext(this.data.indexCurrent,this)//this是在自定义组件下，当前组件实例的this，以操作组件内 video 组件（在自定义组件中药加上this，如果是普通页面即不需要加）
      if (this.data.indexCurrent != curIdx) {
        videoContextPrev.pause()
        this.setData({
          indexCurrent: curIdx
        })
        var videoContextCurrent = wx.createVideoContext(curIdx,this)
        videoContextCurrent.play()
      }
    }
  },


})