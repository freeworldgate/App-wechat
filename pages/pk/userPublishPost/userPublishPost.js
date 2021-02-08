// pages/pk/invite/invite.js
var request = require('./../../../utils/request.js')
var login = require('./../../../utils/loginUtil.js')
var inviteReq = require('./../../../utils/invite.js')
var template = require('./../../../template/template.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:'https://oss.211shopper.com/dir2/wx-1606375746086.jpg',
    posts: [],
    pkEnd:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.hideShareMenu({
      complete: (res) => {},
    })
    inviteReq.getHeight(function (res) {
      that.setData({
          top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
      })
    })
    var targetId = options.userId;
    that.setData({
      targetId:targetId
    })
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("page", true);
    httpClient.send(request.url.userPublishPosts, "GET", {targetId:targetId});

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;

      if(that.data.nomore){return;}
      var user = wx.getStorageSync('user');
      var fromUser = wx.getStorageSync('fromUser')
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", false);
      httpClient.addHandler("success", function (posts) {
        that.setData({
            page:that.data.page + 1,
            posts:that.data.posts.concat(posts)
        })
      })
      httpClient.send(request.url.nextUserPublishPosts, "GET",{ targetId:that.data.targetId ,page:that.data.page});
    
  },
  uploadImg:function(res){
    var that = this;
    var userId = res.currentTarget.dataset.userid;
    template.createOperateDialog(that).show("上传背景图?", "修改背景图?...", function () {
  
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed', 'original'],
        sourceType: ['album'],
        success(res) {
          var files = res.tempFilePaths;
          template.uploadImages3("PK-User-Back", files,that, function(urls){
            
  
              var httpClient = template.createHttpClient(that);
              httpClient.setMode("label", true);
              httpClient.addHandler("success", function (posts) {
                var key = "userDynamic.userBack"
                  that.setData({
                    [key]:urls[0]
                  })
              })
              httpClient.send(request.url.updateUserBack, "GET",{ targetUserId:userId,url:urls[0]});
            


  
          }, function(){});
  
  
        },
      })
  
  
    }, function () {});



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

  
  showSingleImg:function(res){
    var that  = this;
    var url = res.currentTarget.dataset.url;
    var creator = res.currentTarget.dataset.creator;
    login.getUser(function(user){
      if(user.userId === creator){

          template.createOperateDialog(that).show("更换头像", "更换头像", function () {
            
            
            wx.chooseImage({
              count: 1,
              sizeType: ['compressed', 'original'],
              sourceType: ['album'],
              success(res) {
                var files = res.tempFilePaths;
                template.uploadImages3("PK-User-Img", files,that, function(urls){
                  
                  var httpClient = template.createHttpClient(that);
                  httpClient.setMode("label", true);
                  httpClient.send(request.url.setUserImg, "GET", { imgUrl:urls[0]});  
                }, function(){});
              },
            })


          }, function () {});
      
    



      }else{
        wx.previewImage({
          current:url,
          urls:[url]
        })
      }
    })

  },

  setName:function(res){
    var that  = this;
    var name = res.currentTarget.dataset.name;
    var creator = res.currentTarget.dataset.creator;
    
    login.getUser(function(user){
      if(user.userId === creator){
        template.createShortTextDialog(that).show('修改名字', 50,name, function(newname){
            if(newname === name ){return;}
            var httpClient = template.createHttpClient(that);
            httpClient.setMode("label", true);
            httpClient.send(request.url.setUserName, "GET", {userName:newname});  


        });
      }
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

  follow:function(res){
    var that = this;
    var targetId = res.currentTarget.dataset.targetid;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.followUser, "GET", {followerId:targetId});
  },
  cancelFollow:function(res){
    var that = this;
    var targetId = res.currentTarget.dataset.targetid;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.send(request.url.cancelFollow, "GET", {followerId:targetId});
  },
  onShow:function () {

    // var that = this;
    // var user = wx.getStorageSync('user');
    // if(user && (that.data.posts.length === 0) && !that.data.pkEnd ){that.init("label");}
    // else{}
    

  },


  onPullDownRefresh:function (params) {
      var that = this;
      var httpClient = template.createHttpClient(that);
      httpClient.setMode("label", true);
      httpClient.send(request.url.userPublishPosts, "GET", {targetId:that.data.targetId});
  },




  viewImg:function(res){
    var that = this;
    var url = res.currentTarget.dataset.url;
    wx.previewImage({
      urls: [url],
    })
  
  },










  deletePost:function(res){
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
  inPk:function(res){
    var pkId = res.currentTarget.dataset.pkid;
    wx.navigateTo({
      url: '/pages/pk/timepage/timepage?pkId='+pkId,
    })
   


  },
  userCardApply:function(res){
    var that = this;

    var type = res.currentTarget.dataset.type;
    var targetId = res.currentTarget.dataset.targetid;

    login.getUser(function(user){
      if(user.userId === targetId){
          wx.navigateTo({
            url: '/pages/pk/userCardApply/userCardApply?targetUserId='+targetId + "&type=" + type,
          })
      }
      else
      {
        // return;
        template.createDialog(that).show("仅用户自己有权查看?", "仅用户自己有权查看...");
    
      }
    })






  },
  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },



})