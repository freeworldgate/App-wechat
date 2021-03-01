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
    left:300,
    commentStr:''
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
      pkId:options.pkId,
      postId : options.postId
    })
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryComments, "GET", { postId: options.postId});
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
    httpClient.send(request.url.nextComments, "GET", { postId: that.data.postId, page: that.data.page });

  },
  _inputComment:function(res){
    var that = this;
    var value = res.detail.value;
    if (value.length > 300) {
      tip.showContentTip("内容超出最大长度");
      return;
    }
    that.setData({
      commentStr: value
    })


  },

  confirmComment:function(res)
  {
    var that= this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (comment) {
      that.data.comments.unshift(comment);
      that.setData({
        commentNums:that.data.commentNums+1,
        comments: that.data.comments,
        commentStr:''
      })
    })
    httpClient.send(request.url.publishComment, "GET", { postId: that.data.postId, comment: that.data.commentStr });



  },



  oper:function(res){
    var that  = this;
    var post = res.currentTarget.dataset.post;
    var index = res.currentTarget.dataset.index;
    var pkId = res.currentTarget.dataset.pkid;

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
          selection.addItem("","垃圾或广告",function(){httpClient.send(request.url.complainPost, "GET", { postId: post.postId,pkId:pkId,type:1 });})
                    .addItem("","涉黄或有害信息",function(){httpClient.send(request.url.complainPost, "GET", { postId: post.postId,pkId:pkId,type:2 });})
                    .addItem("","暴恐或违法",function(){httpClient.send(request.url.complainPost, "GET", { postId: post.postId,pkId:pkId,type:3 });})
                    .addItem("","诈骗或谣言",function(){httpClient.send(request.url.complainPost, "GET", { postId: post.postId,pkId:pkId,type:4 });})
                    .addItem("","人身攻击或者抄袭",function(){httpClient.send(request.url.complainPost, "GET", { postId: post.postId,pkId:pkId,type:5 });})
          selection.show();
        });

        if(user.userId === post.creator.userId){selection.addItem("","删除",function(){
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

        selection.addItem("","查看卡点",function(){
          wx.navigateTo({
            url: '/pages/pk/timepage/timepage?pkId='+post.pkId,
          })
        });

        selection.show();
    });
    
  },



  plike:function(res){
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
  pdislike:function(res){
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



  back:function (params) {
    wx.navigateBack({
      complete: (res) => {},
    })
  },



  _input:function(res){
    var that = this;
    var value = res.detail.value;
    if (value.length >= that.data.maxLength) {
      showTip("内容超出最大长度");
      // return;
    }
    that.setData({
      text: value,
      left:that.data.maxLength - value.length
    })


  },
  delComment:function(res){
    var that = this;
    var commentId = res.currentTarget.dataset.comment;
    var index = res.currentTarget.dataset.index;
    template.createOperateDialog(that).show("删除评论?", "删除评论?", function () {


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








  },
  publishComment:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (comment) {
      that.data.comments.unshift(comment);
      that.setData({
        text:'',
        commentNums:that.data.commentNums+1,
        comments: that.data.comments,
      })
    })
    httpClient.send(request.url.publishComment, "GET", { postId: that.data.postId, comment: that.data.text });




  },
  restore:function(res){
    var that = this;
    var comment = res.currentTarget.dataset.comment;
    wx.setStorageSync('comment', comment);
    login.getUser(function(user){
      wx.navigateTo({
        url: '/pages/pk/restore/restore',
      })
    })



  },

  
  like:function(res){
    var that = this;
    var id = res.currentTarget.dataset.id;
    var index = res.currentTarget.dataset.index;
    login.getUser(function(user){
      
      if(!that.data.comments[index].gtag){
          that.data.comments[index].gtag = true;
          var httpClient = template.createHttpClient(that);
          httpClient.setMode("", true);
          httpClient.addHandler("success", function () {
            that.data.comments[index].gtag = false;
          })
          httpClient.send(request.url.greate, "GET", { id: id,scene:4,statu:that.data.comments[index].statu === 1?0:1});
          var key = "comments["+index+"].statu";
          var likes = "comments["+index+"].likes";
          var dislikes = "comments["+index+"].dislikes";

          that.setData({
            [likes]:(that.data.comments[index].statu!=1)?that.data.comments[index].likes+1:that.data.comments[index].likes>0?that.data.comments[index].likes-1:0,
            [dislikes]:(that.data.comments[index].statu===2)?that.data.comments[index].dislikes>0?that.data.comments[index].dislikes-1:0:that.data.comments[index].dislikes,
            [key]:(that.data.comments[index].statu===1)?0:1,
          })
          setTimeout(() => {
            that.data.comments[index].gtag = false;
          }, 1000);
      }


    })



  },
  dislike:function(res){
    var that = this;
    var id = res.currentTarget.dataset.id;
    var index = res.currentTarget.dataset.index;
    login.getUser(function(user){
      
      if(!that.data.comments[index].gtag){
          that.data.comments[index].gtag = true;
          var httpClient = template.createHttpClient(that);
          httpClient.setMode("", true);
          httpClient.addHandler("success", function () {
            that.data.comments[index].gtag = false;
          })
          httpClient.send(request.url.greate, "GET", { id: id,scene:5,statu:that.data.comments[index].statu === 2?0:2});
          var key = "comments["+index+"].statu";
          var likes = "comments["+index+"].likes";
          var dislikes = "comments["+index+"].dislikes";


          that.setData({
            [likes]:(that.data.comments[index].statu!=1)?that.data.comments[index].likes:that.data.comments[index].likes>0?that.data.comments[index].likes-1:0,
            [dislikes]:(that.data.comments[index].statu===2)?that.data.comments[index].dislikes>0?that.data.comments[index].dislikes-1:0:that.data.comments[index].dislikes+1,
            [key]:(that.data.comments[index].statu===2)?0:2,
          })

          setTimeout(() => {
            that.data.comments[index].gtag = false;
          }, 1000);
      }


    })



  },

})