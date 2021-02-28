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
    maxLength:300,
    left:300
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
    
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("page", true);
      httpClient.send(request.url.queryUserComments, "GET", {});

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
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (pcomments) {
      var newComments = that.data.comments.concat(pcomments);
      that.setData({
        comments: newComments,
        page: that.data.page + 1
      })
    })
    httpClient.send(request.url.nextUserComments, "GET", { page: that.data.page });

  },
  inPk:function(res){
    var pkId = res.currentTarget.dataset.pkid;
    wx.navigateTo({
      url: '/pages/pk/timepage/timepage?pkId='+pkId,
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




  oper:function(res){
    var that  = this;
    var commentId = res.currentTarget.dataset.commentid;
    var index = res.currentTarget.dataset.index;
    var post = res.currentTarget.dataset.post;

    var selection = template.createSelectionDialog(that).setLayout("bottom","y")

          selection.addItem("","查看卡点",function(){
              login.getUser(function(user){
                  wx.navigateTo({
                    url: '/pages/pk/timepage/timepage?pkId='+post.pkId,
                  })
              })
          });



          selection.addItem("","详情",function(){
              login.getUser(function(user){
                  wx.navigateTo({
                    url: '/pages/pk/comments/comments?pkId='+post.pkId+"&postId="+post.postId,
                  })
              })
          });

          selection.addItem("","删除",function(){
            template.createOperateDialog(that).show("确定删除该条评论信息吗?", "确定删除该条评论信息吗?", function () {
                var httpClient = template.createHttpClient(that);
                httpClient.setMode("label", true);
                httpClient.addHandler("success", function () {
                  that.data.comments.splice(index, 1); 
                  that.setData({
                    comments: that.data.comments,
                    commentNums:that.data.commentNums-1,
                  })
                })
                httpClient.send(request.url.delComment, "GET", { commentId: commentId });
            }, function () {});
        
      
        });

     
       
          selection.show();
  
    
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
  restore:function(res){
    var that = this;
    var comment = res.currentTarget.dataset.comment;
    wx.setStorageSync('comment', comment)
    wx.navigateTo({
      url: '/pages/pk/restore/restore',
    })
  },


  back:function (params) {
    wx.navigateBack({
      complete: (res) => {},
    })
  },






})