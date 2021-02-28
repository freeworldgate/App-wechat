// pages/pk/pk/pk.js
var request = require('./../../../utils/request.js')
var inviteReq = require('./../../../utils/invite.js')
var template = require('./../../../template/template.js')



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

})