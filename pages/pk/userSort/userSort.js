// pages/pk/pk/pk.js
var request = require('./../../../utils/request.js')
var inviteReq = require('./../../../utils/invite.js')
var template = require('./../../../template/template.js')
var login = require('./../../../utils/loginUtil.js')


Page({


  data: {
    sorts:[]
  },


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
      targetId:options.targetId
    })
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.queryUserPkPosts, "GET", {pkId:options.pkId,targetId:options.targetId});

  },
  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
  openText:function(res)
  {
    var that = this;
    var index = res.currentTarget.dataset.index;
    var tag = 'sorts['+index+'].tag';
    var ctag = that.data.sorts[index].tag;
    that.setData({
      [tag]:!ctag
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
    var user = wx.getStorageSync("user");
    httpClient.addHandler("success", function (data) {
      var newPosts = that.data.sorts.concat(data);
      that.setData({
        sorts: newPosts,
        page: that.data.page + 1
      })
    })
    httpClient.send(request.url.nextUserPkPost, "GET", { page: that.data.page,pkId: that.data.pkId });
  },
  like:function(res){
    var that = this;
    var id = res.currentTarget.dataset.id;
    var index = res.currentTarget.dataset.index;
    login.getUser(function(user){
      
      if(!that.data.sorts[index].gtag){
          that.data.sorts[index].gtag = true;
          var httpClient = template.createHttpClient(that);
          httpClient.setMode("", true);
          httpClient.addHandler("success", function () {
            that.data.sorts[index].gtag = false;
          })
          httpClient.send(request.url.greate, "GET", { id: id,scene:1,statu:that.data.sorts[index].statu === 1?0:1});
          var key = "sorts["+index+"].statu";
          var likes = "sorts["+index+"].likes";
          var dislikes = "sorts["+index+"].dislikes";

          that.setData({
            [likes]:(that.data.sorts[index].statu!=1)?that.data.sorts[index].likes+1:that.data.sorts[index].likes>0?that.data.sorts[index].likes-1:0,
            [dislikes]:(that.data.sorts[index].statu===2)?that.data.sorts[index].dislikes>0?that.data.sorts[index].dislikes-1:0:that.data.sorts[index].dislikes,
            [key]:(that.data.sorts[index].statu===1)?0:1,
          })

          setTimeout(() => {
            that.data.sorts[index].gtag = false;
          }, 2000);
      }


    })



  },
  dislike:function(res){
    var that = this;
    var id = res.currentTarget.dataset.id;
    var index = res.currentTarget.dataset.index;
    login.getUser(function(user){
      
      if(!that.data.sorts[index].gtag){
          that.data.sorts[index].gtag = true;
          var httpClient = template.createHttpClient(that);
          httpClient.setMode("", true);
          httpClient.addHandler("success", function () {
            that.data.sorts[index].gtag = false;
          })
          httpClient.send(request.url.greate, "GET", { id: id,scene:2,statu:that.data.sorts[index].statu === 2?0:2});
          var key = "sorts["+index+"].statu";
          var likes = "sorts["+index+"].likes";
          var dislikes = "sorts["+index+"].dislikes";


          that.setData({
            [likes]:(that.data.sorts[index].statu!=1)?that.data.sorts[index].likes:that.data.sorts[index].likes>0?that.data.sorts[index].likes-1:0,
            [dislikes]:(that.data.sorts[index].statu===2)?that.data.sorts[index].dislikes>0?that.data.sorts[index].dislikes-1:0:that.data.sorts[index].dislikes+1,
            [key]:(that.data.sorts[index].statu===2)?0:2,
          })

          setTimeout(() => {
            that.data.sorts[index].gtag = false;
          }, 2000);
      }


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