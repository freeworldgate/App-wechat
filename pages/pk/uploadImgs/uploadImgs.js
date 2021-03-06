// pages/pk/uploadImgs/uploadImgs.js
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






Page({

  /**
   * 页面的初始数据
   */



  data: {
    text:"",
    left:200,
    maxLength:200,
    whiteBack: {backId:-1,backColor:'ffffff',backUrl:'',fontColor:'000000'},
    currentBack: {backId:-1,backColor:'ffffff',backUrl:'',fontColor:'000000'},
    imgs:[],
    textBacks:[]

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
    
    var pk = wx.getStorageSync('publish-pk', that.data.pk)
    wx.removeStorageSync('publish-pk')
    var type = parseInt(options.type);
    var postTimes = options.postTimes;
    var pkId = options.pkId;
    if(type === 1)
    {
        that.setData({
          type:type,
          pkId:pkId,
          postTimes:parseInt(postTimes)+1,
          pk:pk
        })
    }
    else if(type === 2)
    {
        that.setData({
          type:type,
          pkId:pkId,
          postTimes:parseInt(postTimes)+1,
          pk:pk,
          left:100,
          maxLength:100,
        })
        var httpClient = template.createHttpClient(that);
        httpClient.setMode("page", true);
        httpClient.send(request.url.queryTextBacks, "GET", {});
  
    }
    else if(type === 3)
    {
        var allFiles = that.data.imgs;
        if(options.imgs){
          var imgFiles = options.imgs.split(",");
          var allFiles = that.data.imgs.concat(imgFiles);
        }
        that.setData({
          type:type,
          imgs:allFiles,
          pkId:pkId,
          postTimes:parseInt(postTimes)+1,
          pk:pk
        })
    }
    else if(type === 4)
    {
        var width = options.width;
        var height = options.height;
        that.setData({
          oldWidth:width,
          oldHeight:height,
        })
        if(width > height)
        {
            that.setData({width:76.2,height: 76.2*height/width});
        }
        else
        {
          that.setData({height:60,width: 50});
        }
        that.setData({
          type:type,
          videoUrl:options.videoUrl,
          pkId:pkId,
          postTimes:parseInt(postTimes)+1,
          pk:pk
        })
    }
    else
    {
      wx.navigateBack({
        delta: 0,
      })
      tip.showContentTip("不支持的内容类型");
    }






    locationUtil.getLocation(function(latitude,longitude){
      var distance = locationUtil.getDistance(latitude,longitude,that.data.pk.latitude,that.data.pk.longitude);
      that.setData({
        length:distance*1000,
        lengthStr:distance<1?distance*1000:distance
      })
    })

  },
  select:function(res){
    var that = this;
    var back = res.currentTarget.dataset.back;
    that.setData({
      currentBack:back
    })
    that.setData({
      text:that.data.text
    })

  },
  selectnone:function(){
    that.setData({
      currentBack:{}
    })
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

  _input:function(res){
    var that = this;
    var value = res.detail.value;
    if (value.length > that.data.maxLength) {
      showTip("内容超出长度");
      // return;
    }
    this.setData({
      'text': value,
      'left':that.data.maxLength - value.length
    })

  },
  _remove:function(res){
    var that = this;
    var index = parseInt(res.currentTarget.dataset.index);
    that.data.imgs.splice(index, 1);

    that.setData({
      imgs: that.data.imgs,
    })
    if(that.data.imgs.length === 0 )
    {
      var textLeft = 100 - that.data.text.length;
      var newText = that.data.text.substring(0,100);
      that.setData({
        left:textLeft>0?textLeft:0,
        maxLength:100,
        text:newText
      })
    }
    else{
      var textLeft = 200 - that.data.text.length;
      that.setData({
        left:textLeft>0?textLeft:0,
        maxLength:200,
        text:that.data.text
      })
    }

  },

  _add:function () {
    var that = this;
    var num = 9-that.data.imgs.length
    wx.chooseImage({
      count: num,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {


        var imgFiles = that.data.imgs.concat(res.tempFilePaths);
        that.setData({
          imgs: imgFiles,
        })
        if(that.data.imgs.length === 0 )
        {
          var textLeft = 100 - that.data.text.length;
          var newText = that.data.text.substring(0,100);
          that.setData({
            left:textLeft>0?textLeft:0,
            maxLength:100,
            text:newText
          })
        }
        else{
          var textLeft = 200 - that.data.text.length;
          that.setData({
            left:textLeft>0?textLeft:0,
            maxLength:200,
            text:that.data.text
          })
        }
      },
    })
  },
  back:function(){
    wx.navigateBack({
      delta: 0,
    })
  },
  
  upload:function(){
    var that = this;

    var httpClient = template.createHttpClient(that);
    httpClient.setMode("label", true);
    httpClient.addHandler("success", function (post) {
              tip.showTip("上传成功......");
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];  //上一个页面
              if(prevPage.data.posts && prevPage.data.posts.length>0 && prevPage.data.pk.topPostId === prevPage.data.posts[0].postId)
              {//存在顶置 
                prevPage.data.posts.splice(1, 0,post); 
              }
              else
              {//不存在顶置
                prevPage.data.posts.unshift(post);
              }
     
              prevPage.setData({
                leftTime:post.leftTime,
                totalPostTimes:post.postTimes,
                posts:prevPage.data.posts
              })
    
         
              wx.navigateBack({
                delta: 0,
              })

    })
    
    if(that.data.type === 1){
        httpClient.send(request.url.createTextPost, "GET",
        {
          pkId: that.data.pkId,
          title: that.data.text,
        }
    );
    }
    else if(that.data.type === 2){
        httpClient.send(request.url.createCardPost, "GET",
        {
          pkId: that.data.pkId,
          title: that.data.text,
          backId: that.data.currentBack.backId,
        })
    }
    else if(that.data.type === 3){
        template.uploadImages3("userUpload", that.data.imgs, that,
          function (urls) {
            //传输成功
            wx.hideLoading({
              complete: (res) => {},
            })
            console.log("---start---" ,urls);
            console.log("图片集合", urls);

            httpClient.send(request.url.createImgPost, "GET",
              {
                pkId: that.data.pkId,
                title: that.data.text,
                imgUrls: urls,
              }
            );


            // page.editImageDialog.success();
            // createLabelLoading(page).hide();
            // createLabelLoadingSuccess(page).show();
          },
          function () {
            
            //传输失败
            wx.hideLoading({
              complete: (res) => {
                tip.showContentTip("上传失败......");
              },
            })
            

        });

    }
    else if(that.data.type === 4){
      template.uploadImages3("userUpload", [that.data.videoUrl], that,
        function (urls) {
          //传输成功
          wx.hideLoading({
            complete: (res) => {},
          })
          console.log("---start---" ,urls);
          console.log("视频", urls);

          httpClient.send(request.url.createVideoPost, "GET",
            {
              pkId: that.data.pkId,
              title: that.data.text,
              videoUrl: urls[0],
              width: that.data.oldWidth,
              height:that.data.oldHeight,
            }
          );


          // page.editImageDialog.success();
          // createLabelLoading(page).hide();
          // createLabelLoadingSuccess(page).show();
        },
        function () {
          
          //传输失败
          wx.hideLoading({
            complete: (res) => {
              tip.showContentTip("上传失败......");
            },
          })
          

      });


    }
    else{tip.showContentTip("不支持的内容类型");}
    
    // if(!that.data.imgs||that.data.imgs.length===0){
    //     var httpClient = template.createHttpClient(that);
    //     httpClient.setMode("label", true);
    //     httpClient.addHandler("success", function (post) {
    //           tip.showTip("上传成功......");
    //           var pages = getCurrentPages();
    //           var prevPage = pages[pages.length - 2];  //上一个页面
    //           if(prevPage.data.posts && prevPage.data.posts.length>0 && prevPage.data.pk.topPostId === prevPage.data.posts[0].postId)
    //           {//存在顶置 
    //             prevPage.data.posts.splice(1, 0,post); 
    //           }
    //           else
    //           {//不存在顶置
    //             prevPage.data.posts.unshift(post);
    //           }
     
    //           prevPage.setData({
    //             leftTime:post.leftTime,
    //             totalPostTimes:post.postTimes,
    //             posts:prevPage.data.posts
    //           })
    
         
    //           wx.navigateBack({
    //             delta: 0,
    //           })

    //     })
    //     httpClient.send(request.url.createPost, "GET",
    //       {
    //         pkId: that.data.pkId,
    //         title: that.data.text,
    //         imgUrls: new Array(),
    //         backId: that.data.currentBack.backId,
    //       }
    //     );


    // }
    // else{

      
    //   template.uploadImages3("userUpload", that.data.imgs, that,
    //     function (urls) {
    //       //传输成功
    //       wx.hideLoading({
    //         complete: (res) => {},
    //       })
    //       console.log("---start---" ,urls);
    //       console.log("图片集合", urls);
          
    //       // , urls
    //       var httpClient = template.createHttpClient(that);
    //       httpClient.setMode("label", true);
    //       httpClient.addHandler("success", function (post) {
    //         tip.showTip("上传成功......");
    //         var pages = getCurrentPages();
    //         var prevPage = pages[pages.length - 2];  //上一个页面
    //         if(prevPage.data.posts && prevPage.data.posts.length>0 && prevPage.data.pk.topPostId === prevPage.data.posts[0].postId)
    //         {//存在顶置 
    //           prevPage.data.posts.splice(1, 0,post); 
    //         }
    //         else
    //         {//不存在顶置
    //           prevPage.data.posts.unshift(post);
    //         }
    //         prevPage.setData({
    //           leftTime:post.leftTime,
    //           totalPostTimes:post.postTimes,
    //           posts:prevPage.data.posts
    //         })
    //         wx.navigateBack({
    //           delta: 0,
    //         })

    //       })
    //       httpClient.send(request.url.createPost, "GET",
    //         {
    //           pkId: that.data.pkId,
    //           title: that.data.text,
    //           imgUrls: urls,
    //           backId: "-1",
    //         }
    //       );


    //       // page.editImageDialog.success();
    //       // createLabelLoading(page).hide();
    //       // createLabelLoadingSuccess(page).show();
    //   },
    //   function () {
          
    //       //传输失败
    //       wx.hideLoading({
    //         complete: (res) => {
    //           tip.showContentTip("上传失败......");
    //         },
    //       })
          

    //   });

    // }

  }
})


