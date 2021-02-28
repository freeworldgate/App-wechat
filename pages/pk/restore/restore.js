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

    var comment = wx.getStorageSync('comment');
    wx.removeStorageSync('comment');
    that.setData({
      comment:comment
    })
    var httpClient = template.createHttpClient(that);
    if(options.commentId)
    {
      httpClient.setMode("page", true);
      httpClient.send(request.url.queryRestores, "GET", { commentId: options.commentId});
    }
    else
    {
      httpClient.setMode("label", true);
      httpClient.send(request.url.queryRestores, "GET", { commentId: comment.commentId});
    }
    
    
    
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
    httpClient.addHandler("success", function (prestores) {
      var newrestores = that.data.restores.concat(prestores);
      that.setData({
        restores: newrestores,
        page: that.data.page + 1
      })
    })
    httpClient.send(request.url.nextRestores, "GET", { commentId: that.data.comment.commentId, page: that.data.page });

  },


  inputRestore:function(res)
  {
    var that= this;
    template.createEditTextDialog(that).show("回复", "公开回复...","", 300,function(text){
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function (restore) {
          that.data.restores.unshift(restore);
          var key = 'comment.restores';
          that.setData({
            [key]:that.data.comment.restores+1,
            restores: that.data.restores,
          })
        })
        httpClient.send(request.url.publishRestore, "GET", { commentId: that.data.comment.commentId,targetUserId: "", comment: text });
    


    }); 



  },

  toRestore:function(res)
  {
    var that = this;
    var targetUser =  res.currentTarget.dataset.user;


    template.createEditTextDialog(that).show("回复 @"+targetUser.userName, "回复","", 300,function(text){
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function (restore) {
          that.data.restores.unshift(restore);
          var key = 'comment.restores';
          that.setData({
            restores: that.data.restores,
          })
        })
        httpClient.send(request.url.publishRestore, "GET", { commentId: that.data.comment.commentId,targetUserId: targetUser.userId, comment: text });
    


    }); 



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
  delRestore:function(res){
    var that = this;
    var restoreId = res.currentTarget.dataset.restore;
    var index = res.currentTarget.dataset.index;
    template.createOperateDialog(that).show("删除回复?", "删除回复?", function () {


        var httpClient = template.createHttpClient(that);
        httpClient.setMode("label", true);
        httpClient.addHandler("success", function () {
          var restore = that.data.restores[index];
          that.data.restores.splice(index, 1); 
          var key = 'comment.restores';
          if(restore.targetUser){
            that.setData({
              restores: that.data.restores,
            })
          }else{
            that.setData({
              [key]:that.data.comment.restores-1,
              restores: that.data.restores,
            })
          }

        })
        httpClient.send(request.url.delRestore, "GET", { restoreId: restoreId });
    
  


    }, function () {});








  },
  like:function(res){
    var that = this;
    var id = res.currentTarget.dataset.id;
    var index = res.currentTarget.dataset.index;
    login.getUser(function(user){
      
      if(!that.data.restores[index].gtag){
          that.data.restores[index].gtag = true;
          var httpClient = template.createHttpClient(that);
          httpClient.setMode("", true);
          httpClient.addHandler("success", function () {
            that.data.restores[index].gtag = false;
          })
          httpClient.send(request.url.greate, "GET", { id: id,scene:7,statu:that.data.restores[index].statu === 1?0:1});
          var key = "restores["+index+"].statu";
          var likes = "restores["+index+"].likes";
          var dislikes = "restores["+index+"].dislikes";

          that.setData({
            [likes]:(that.data.restores[index].statu!=1)?that.data.restores[index].likes+1:that.data.restores[index].likes>0?that.data.restores[index].likes-1:0,
            [dislikes]:(that.data.restores[index].statu===2)?that.data.restores[index].dislikes>0?that.data.restores[index].dislikes-1:0:that.data.restores[index].dislikes,
            [key]:(that.data.restores[index].statu===1)?0:1,
          })
          setTimeout(() => {
            that.data.restores[index].gtag = false;
          }, 1000);
      }


    })



  },
  dislike:function(res){
    var that = this;
    var id = res.currentTarget.dataset.id;
    var index = res.currentTarget.dataset.index;
    login.getUser(function(user){
      
      if(!that.data.restores[index].gtag){
          that.data.restores[index].gtag = true;
          var httpClient = template.createHttpClient(that);
          httpClient.setMode("", true);
          httpClient.addHandler("success", function () {
            that.data.restores[index].gtag = false;
          })
          httpClient.send(request.url.greate, "GET", { id: id,scene:8,statu:that.data.restores[index].statu === 2?0:2});
          var key = "restores["+index+"].statu";
          var likes = "restores["+index+"].likes";
          var dislikes = "restores["+index+"].dislikes";


          that.setData({
            [likes]:(that.data.restores[index].statu!=1)?that.data.restores[index].likes:that.data.restores[index].likes>0?that.data.restores[index].likes-1:0,
            [dislikes]:(that.data.restores[index].statu===2)?that.data.restores[index].dislikes>0?that.data.restores[index].dislikes-1:0:that.data.restores[index].dislikes+1,
            [key]:(that.data.restores[index].statu===2)?0:2,
          })

          setTimeout(() => {
            that.data.restores[index].gtag = false;
          }, 1000);
      }


    })



  },
  likeC:function(res){
    var that = this;
    var id = res.currentTarget.dataset.id;
    login.getUser(function(user){
      
      if(!that.data.comment.gtag){
          that.data.comment.gtag = true;
          var httpClient = template.createHttpClient(that);
          httpClient.setMode("", true);
          httpClient.addHandler("success", function () {
            that.data.comment.gtag = false;
          })
          httpClient.send(request.url.greate, "GET", { id: id,scene:4,statu:that.data.comment.statu === 1?0:1});
          var key = "comment.statu";
          var likes = "comment.likes";
          var dislikes = "comment.dislikes";

          that.setData({
            [likes]:(that.data.comment.statu!=1)?that.data.comment.likes+1:that.data.comment.likes>0?that.data.comment.likes-1:0,
            [dislikes]:(that.data.comment.statu===2)?that.data.comment.dislikes>0?that.data.comment.dislikes-1:0:that.data.comment.dislikes,
            [key]:(that.data.comment.statu===1)?0:1,
          })
          setTimeout(() => {
            that.data.comment.gtag = false;
          }, 1000);
      }


    })



  },
  dislikeC:function(res){
    var that = this;
    var id = res.currentTarget.dataset.id;
    login.getUser(function(user){
      
      if(!that.data.comment.gtag){
          that.data.comment.gtag = true;
          var httpClient = template.createHttpClient(that);
          httpClient.setMode("", true);
          httpClient.addHandler("success", function () {
            that.data.comment.gtag = false;
          })
          httpClient.send(request.url.greate, "GET", { id: id,scene:5,statu:that.data.comment.statu === 2?0:2});
          var key = "comment.statu";
          var likes = "comment.likes";
          var dislikes = "comment.dislikes";


          that.setData({
            [likes]:(that.data.comment.statu!=1)?that.data.comment.likes:that.data.comment.likes>0?that.data.comment.likes-1:0,
            [dislikes]:(that.data.comment.statu===2)?that.data.comment.dislikes>0?that.data.comment.dislikes-1:0:that.data.comment.dislikes+1,
            [key]:(that.data.comment.statu===2)?0:2,
          })

          setTimeout(() => {
            that.data.comment.gtag = false;
          }, 1000);
      }


    })



  },

})