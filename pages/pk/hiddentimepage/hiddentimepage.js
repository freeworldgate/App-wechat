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
    })
    var user = wx.getStorageSync("user");
    that.setData({user:user})
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryHiddenPost, "GET", { pkId: that.data.pkId});

  },







  /**
   * 用户点击右上角分享
   */


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

  showPost:function(res){
      var that = this;
      var post = res.currentTarget.dataset.post;
      wx.navigateTo({
        url: '/pages/pk/post/post?pkId=' + that.data.pkId + "&postId=" + post.postId,
      })



  },






  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },













  showPost:function(res){
      var that = this;
      var post = res.currentTarget.dataset.post;
      wx.navigateTo({
        url: '/pages/pk/post/post?pkId=' + that.data.pkId + "&postId=" + post.postId,
      })
  },
  oper:function(res){
    var that  = this;
    var post = res.currentTarget.dataset.post;
    var index = res.currentTarget.dataset.index;
   

    var selection = template.createSelectionDialog(that).setLayout("bottom","y")

    login.getUser(function(user){
        //发布者

        selection.addItem("","举报Ta",function(){
          template.createSelectionDialog(that).hide();
          var httpClient = template.createHttpClient(that);
          httpClient.setMode("label", true);
          httpClient.addHandler("success", function () {
              tip.showContentTip("已收到您的投诉信息");
          })
          var selection = template.createSelectionDialog(that).setLayout("bottom","y")
          selection.addItem("","垃圾或广告",function(){httpClient.send(request.url.complainPost, "GET", { postId: post.postId,pkId:post.pkId,type:1 });})
                    .addItem("","涉黄或有害信息",function(){httpClient.send(request.url.complainPost, "GET", { postId: post.postId,pkId:post.pkId,type:2 });})
                    .addItem("","暴恐或违法",function(){httpClient.send(request.url.complainPost, "GET", { postId: post.postId,pkId:post.pkId,type:3 });})
                    .addItem("","诈骗或谣言",function(){httpClient.send(request.url.complainPost, "GET", { postId: post.postId,pkId:post.pkId,type:4 });})
                    .addItem("","人身攻击或者抄袭",function(){httpClient.send(request.url.complainPost, "GET", { postId: post.postId,pkId:post.pkId,type:5 });})
          selection.show();
        });
        selection.addItem("","Ta的打卡记录",function(){

            wx.navigateTo({
                url: '/pages/pk/userSort/userSort?pkId='+post.pkId+"&targetId="+post.creator.userId,
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

      
        selection.show();
    });
    
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

})