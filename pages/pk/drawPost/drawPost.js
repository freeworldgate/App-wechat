// pages/pk/drawImg/drawImg.js
var request = require('./../../../utils/request.js')
var http = require('./../../../utils/http.js')
var tip = require('./../../../utils/tipUtil.js')
var login = require('./../../../utils/loginUtil.js')
var route = require('./../../../utils/route.js')
var redirect = require('./../../../utils/redirect.js')
var uuid = require('./../../../utils/uuid.js')
var inviteReq = require('./../../../utils/invite.js')
var userInvite = require('./../../../utils/userInvite.js')
var upload = require('./../../../utils/uploadFile.js')
var template = require('./../../../template/template.js')






const width = wx.getSystemInfoSync().windowWidth;
const vwPx = width/100;
wx.createSelectorQuery()
var ctx = wx.createCanvasContext('myCanvas');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statu:0,
    imgs:[],
    imgBack:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    inviteReq.getHeight(function (res) {
      that.setData({
          top: res.statusBarHeight + (res.titleBarHeight - 32) / 2
      })
    })

    var pk = wx.getStorageSync('drawPk');
    wx.removeStorageSync('drawPk')
    that.data.pk = pk;

  },
  onShow:function(){
    var that = this;
    that.drawWxCode();
    that.drawUserImg();
    that.drawBackImg();
  },
  queryPost:function(tag,pkId,postId){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode(tag, false);
    httpClient.addHandler("success", function (imp) {
        if(!that.data.imgBack){
          that.setData({
            imgBack:imp.imgBack
          });
        }
        that.setData({"post.pkTopic":imp.topic})
        that.setData({tips:imp.tips})
        console.log("请求返回:",imp.topic,imp.tips);
        if(that.data.imgs[0]&&that.data.imgs[1]&&that.data.imgs[2]&&that.data.imgs[3]&&that.data.imgs[4]&&that.data.imgs[5]&&that.data.imgs[6]&&that.data.imgs[7]&&that.data.imgs[8]&& that.data.wxcode && that.data.userImg){
          that.refresh(); 
      }






    })
    httpClient.send(request.url.importPost, "GET", { pkId: pkId, postId:postId});

  },

  queryTips:function(){
    var that = this;
    var httpClient = template.createHttpClient(that);
    httpClient.setMode("", false);
    httpClient.send(request.url.queryAllTips, "GET", { });
  },

  drawWxCode:function(){
    var that = this;

    wx.getImageInfo({
        src:that.data.pk.codeUrl,
        success:function(res){
          var imgW = res.width;
          var imgH = res.height;
          var x = imgW>imgH?(imgW-imgH)/2:0;
          var y = imgW>imgH?0:(imgH-imgW)/2;
          var size = imgW>imgH?imgH:imgW;
          var imgData = {x:x,y:y,size:size,url:res.path,lx:75,ly:100,lwidth:20,lheight:20};
          that.data.wxcode = imgData;
          console.log("ErCode:",res.path);
          if(that.data.backUrl && that.data.wxcode && that.data.userImg){
            that.refresh(); 
          }

        }
    })


  },
  drawUserImg:function(){
    var that = this;

    wx.getImageInfo({
        src:that.data.pk.user.imgUrl,
        success:function(res){
          var imgW = res.width;
          var imgH = res.height;
          var x = imgW>imgH?(imgW-imgH)/2:0;
          var y = imgW>imgH?0:(imgH-imgW)/2;
          var size = imgW>imgH?imgH:imgW;
          var imgData = {x:x,y:y,size:size,url:res.path,lx:81,ly:106,lwidth:8,lheight:8};
          that.data.userImg = imgData;
          console.log("userImg:",res.path);
          if(that.data.backUrl && that.data.wxcode && that.data.userImg){
            that.refresh(); 
          }
        }
    })

  },
  drawBackImg:function(){
    var that = this;

    wx.getImageInfo({
        src:that.data.pk.backUrl,
        success:function(res){
          var imgW = res.width;
          var imgH = res.height;
          var x = imgW>imgH?(imgW-imgH)/2:0;
          var y = imgW>imgH?0:(imgH-imgW)/2;
          var size = imgW>imgH?imgH:imgW;
          var imgData = {x:x,y:y,size:size,url:res.path,lx:2,ly:2,lwidth:94,lheight:94};
          that.data.backUrl = imgData;
          console.log("backImg:",res.path);
          if(that.data.backUrl && that.data.wxcode && that.data.userImg){
            that.refresh(); 
          }
        }
    })

  },
  

  drawTopic:function(){
    var that = this;
    const context = ctx;
    var text = that.data.pk.sign;//这是要绘制的文本
    var chr = text.split("");//这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    context.setFontSize(3.8 * vwPx)
    context.setFillStyle("#6f6f6f")
    for (var a = 0; a < chr.length; a++) {
     if (context.measureText(temp).width < 60*vwPx) {
      temp += chr[a];
     }
     else {
      a--; //这里添加了a-- 是为了防止字符丢失，效果图中有对比
      row.push(temp);
      temp = "";
     }
    }
    row.push(temp); 
   
    //如果数组长度大于2 则截取前两个
    if (row.length > 2) {
     var rowCut = row.slice(0, 2);
     var rowPart = rowCut[1];
     var test = "";
     var empty = [];
     for (var a = 0; a < rowPart.length; a++) {
      if (context.measureText(test).width < 220) {
       test += rowPart[a];
      }
      else {
       break;
      }
     }
     empty.push(test);
     var group = empty[0] + "..."//这里只显示两行，超出的用...表示
     rowCut.splice(1, 1, group);
     row = rowCut;
    }
    for (var b = 0; b < row.length; b++) {
     context.fillText(row[b], 2*vwPx, (116 + 5*b) * vwPx, 60*vwPx);
    }


  },
  drawPkTopic:function(){
    var that = this;
    const context = ctx;
    var text = that.data.pk.name;//这是要绘制的文本
    var chr =text.split("");//这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    context.setFontSize(4.5 * vwPx);
    // context.font = 'normal bold '+ 4.3 * vwPx +'px sans-serif';
    context.setFillStyle("#000000")
    
    for (var a = 0; a < chr.length; a++) {
     if (context.measureText(temp).width < 60*vwPx) {
      temp += chr[a];
     }
    }
    if(context.measureText(temp).width > 60*vwPx)
    {
      temp += "...";
    }
    

    context.fillText(temp, 2*vwPx, 106 * vwPx, 60*vwPx);
    context.fillText(temp, 2*vwPx-0.4, 106 * vwPx-0.4, 60*vwPx);



  },

  drawWechat:function(){
    var that = this;
    const context = ctx;
    var text = that.data.pk.name;//这是要绘制的文本
    var chr =text.split("");//这个方法是将一个字符串分割成字符串数组
    var temp = "";
    var row = [];
    context.setFontSize(3 * vwPx);
    // context.font = 'normal bold '+ 4.3 * vwPx +'px sans-serif';
    context.setFillStyle("#909090")
    
    for (var a = 0; a < chr.length; a++) {
     if (context.measureText(temp).width < 60*vwPx) {
      temp += chr[a];
     }
    }
    if(context.measureText(temp).width > 60*vwPx)
    {
      temp += "...";
    }
    context.fillText("微信扫一扫", (98-3*6.7)*vwPx, 125 * vwPx, 20*vwPx);
  },
  drawImg:function(){

    var that = this;


    for(var index=0;index<9;index++)
    {
    
      var drawData = that.getDrawPsion(index,that.data.style);
      var img = that.data.post.postImages[index];
      that.imagePro(index,img,drawData);

    }
  
    // ctx.draw()
    // ctx.save();

  





  },


  imagePro:function(index,img,drawData){
    var that = this;



      wx.getImageInfo({
          // src: res.tempFilePath,
          src:img.imgUrl,
          success:function(res){
            var imgW = res.width;
            var imgH = res.height;
            var x = imgW>imgH?(imgW-imgH)/2:0;
            var y = imgW>imgH?0:(imgH-imgW)/2;
            var size = imgW>imgH?imgH:imgW;
            var imgData = {x:x,y:y,size:size,url:res.path,lx:drawData.x,ly:drawData.y,lwidth:drawData.width,lheight:drawData.height};
            that.data.imgs[index] = imgData;
            console.log("Imgs:",index,res.path);
            if(that.data.tips&&that.data.imgs[0]&&that.data.imgs[1]&&that.data.imgs[2]&&that.data.imgs[3]&&that.data.imgs[4]&&that.data.imgs[5]&&that.data.imgs[6]&&that.data.imgs[7]&&that.data.imgs[8]&& that.data.wxcode && that.data.userImg){
              that.refresh(); 
            }
             
    
            // ctx.draw()
            // ctx.save();
          }
      })






  },


  save:function(){
    wx.showLoading({
      title: '生成图片',
    })


    wx.canvasToTempFilePath({ //裁剪对参数
      canvasId: "myCanvas",
      x: 0, //画布x轴起点
      y: 0, //画布y轴起点
      width: vwPx * 98, //画布宽度
      height:vwPx * 159, //画布高度
      // destWidth: image_width, //输出图片宽度
      // destHeight: image_height, //输出图片高度
      success: function (res) {
        console.log('图片处理成功了',res)

        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存到相册',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("当初用户拒绝，再次发起授权")
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          },
          complete(res) {
            console.log(res);
          }
        })
        wx.hideLoading()
      },
      fail: function (e) {
        wx.hideLoading()
        wx.showToast({
          title: '出错啦...',
          icon: 'loading'
        })
      }
    })





  }
  ,



  getDrawPsion:function(index,style){






      if(style === 1 || style ===2)
      {
          if(index === 0){return style===1?{x:0,y:0,width:62.5,height:62.5}:{x:0,y:0,width:31,height:31};}
          if(index === 1){return style===1?{x:63,y:0,width:31,height:31}:{x:31.5,y:0,width:62.5,height:62.5};}
          if(index === 2){return style===1?{x:63,y:31.5,width:31,height:31}:{x:0,y:31.5,width:31,height:31};}

          if(index === 3){return {x:0,y:63,width:31,height:31};}
          if(index === 4){return {x:31.5,y:63,width:31,height:31};}
          if(index === 5){return {x:63,y:63,width:31,height:31};}
          if(index === 6){return {x:0,y:94.5,width:31,height:31};}
          if(index === 7){return {x:31.5,y:94.5,width:31,height:31};}
          if(index === 8){return {x:63,y:94.5,width:31,height:31};}

      }
      else if(style===3||style===4)
      {
        if(index === 0){return {x:0,y:0,width:31,height:31};}
        if(index === 1){return {x:31.5,y:0,width:31,height:31};}
        if(index === 2){return {x:63,y:0,width:31,height:31};}


          if(index === 3){return style===3?{x:0,y:31.5,width:62.5,height:62.5}:{x:0,y:31.5,width:31,height:31};}
          if(index === 4){return style===3?{x:63,y:31.5,width:31,height:31}:{x:31.5,y:31.5,width:62.5,height:62.5};}
          if(index === 5){return style===3?{x:63,y:63,width:31,height:31}:{x:0,y:63,width:31,height:31};}
          


          if(index === 6){return {x:0,y:94.5,width:31,height:31};}
          if(index === 7){return {x:31.5,y:94.5,width:31,height:31};}
          if(index === 8){return {x:63,y:94.5,width:31,height:31};}


      }
      else if(style===5||style===6)
      {
          if(index === 0){return {x:0,y:0,width:31,height:31};}
          if(index === 1){return {x:31.5,y:0,width:31,height:31};}
          if(index === 2){return {x:63,y:0,width:31,height:31};}

          if(index === 3){return {x:0,y:31.5,width:31,height:31};}
          if(index === 4){return {x:31.5,y:31.5,width:31,height:31};}
          if(index === 5){return {x:63,y:31.5,width:31,height:31};}

          if(index === 6){return style===5?{x:0,y:63,width:62.5,height:62.5}:{x:0,y:63,width:31,height:31};}
          if(index === 7){return style===5?{x:63,y:63,width:31,height:31}:{x:31.5,y:63,width:62.5,height:62.5};}
          if(index === 8){return style===5?{x:63,y:94.5,width:31,height:31}:{x:0,y:94.5,width:31,height:31};}

      }
      else
      {
        if(index === 0){return {x:0,y:0,width:31,height:31};}
        if(index === 1){return {x:31.5,y:0,width:31,height:31};}
        if(index === 2){return {x:63,y:0,width:31,height:31};}

        if(index === 3){return {x:0,y:31.5,width:31,height:31};}
        if(index === 4){return {x:31.5,y:31.5,width:31,height:31};}
        if(index === 5){return {x:63,y:31.5,width:31,height:31};}

        if(index === 6){return {x:0,y:63,width:31,height:31};}
        if(index === 7){return {x:31.5,y:63,width:31,height:31};}
        if(index === 8){return {x:63,y:63,width:31,height:31};}





      }










  },



  refresh:function(){
    var that = this;
    
    
    // ctx.save()
    // ctx.setFillStyle('white');//填充白色
    // ctx.fillRect(0,0,vwPx * 97,vwPx * 155);//画出矩形白色背景
    // ctx.restore()
  
    that.roundRect(ctx,0,0,vwPx * 98,vwPx * 129,2*vwPx);

    


    // for(var index=0;index<that.data.imgs.length;index++)
    // {
    //   var imgData = that.data.imgs[index];
    //   ctx.save(); // 先保存状态 已便于画完圆再用
    //   // ctx.beginPath(); //开始绘制
    //   // //先画个圆
    //   // ctx.arc((imgData.lx + 2 + imgData.lwidth/2)*vwPx, (imgData.ly + 2 + imgData.lheight/2)*vwPx  ,imgData.lwidth/2 * 1.3 * vwPx, 0, Math.PI * 2,false);
    //   // ctx.clip();//画了圆 再剪切 原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内
    //   that.roundRect(ctx,(imgData.lx + 2)*vwPx, (imgData.ly + 2)*vwPx  ,imgData.lwidth * vwPx,imgData.lheight * vwPx,1.5*vwPx);
      
    //   ctx.drawImage(imgData.url,imgData.x,imgData.y,imgData.size,imgData.size, (imgData.lx + 2)*vwPx, (imgData.ly+2)*vwPx,(imgData.lwidth)*vwPx , (imgData.lheight)*vwPx);
    //   ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 可以继续绘制
    //   // ctx.draw();
    // }
    ctx.save()
    ctx.beginPath()
    ctx.arc(49*vwPx, 49*vwPx, 65*vwPx, 0, 2 * Math.PI)	//绘制圆圈
 
    // that.roundRect(ctx,2,2,vwPx * 94,vwPx * 94,2*vwPx);
    ctx.clip()	//裁剪
    // ctx.restore(); 
    ctx.drawImage(that.data.backUrl.url,that.data.backUrl.x,that.data.backUrl.y,that.data.backUrl.size,that.data.backUrl.size, (that.data.backUrl.lx)*vwPx, (that.data.backUrl.ly)*vwPx,(that.data.backUrl.lwidth)*vwPx , (that.data.backUrl.lheight)*vwPx);
    ctx.restore(); 
    ctx.drawImage(that.data.wxcode.url,that.data.wxcode.x,that.data.wxcode.y,that.data.wxcode.size,that.data.wxcode.size, (that.data.wxcode.lx)*vwPx, (that.data.wxcode.ly)*vwPx,(that.data.wxcode.lwidth)*vwPx , (that.data.wxcode.lheight)*vwPx);

    ctx.save()
    ctx.beginPath()
    ctx.arc(85*vwPx, 110*vwPx, 4*vwPx, 0, 2 * Math.PI)	//绘制圆圈
    ctx.clip()	//裁剪
    ctx.drawImage(that.data.userImg.url,that.data.userImg.x,that.data.userImg.y,that.data.userImg.size,that.data.userImg.size, (that.data.userImg.lx)*vwPx, (that.data.userImg.ly)*vwPx,(that.data.userImg.lwidth)*vwPx , (that.data.userImg.lheight)*vwPx);
    ctx.restore()



    that.drawWechat();
    that.drawTopic();
    that.drawPkTopic();

    



    ctx.draw()
    ctx.save();



    that.setData({statu:1})



  },
  selectPng:function(res){
    var png = res.currentTarget.dataset.png;
    var that = this;
    wx.getImageInfo({
      src:png,
      success:function(res){
        var imgW = res.width;
        var imgH = res.height;
        that.data.png = {url:res.path,imgW:imgW,imgH:imgH}
        that.refresh();


        // ctx.drawImage(res.path,0,0,imgW,imgH, 2*vwPx, 2*vwPx,90*vwPx ,120*vwPx);
        // ctx.draw()
        // ctx.save();

      }
  })









  },
  back:function(){
    wx.navigateBack({
      complete: (res) => {},
    })
  },

  roundRect:function(ctx, x, y, w, h, r) {
    // 开始绘制
    ctx.beginPath()
    // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
    // 这里是使用 fill 还是 stroke都可以，二选一即可
    ctx.setFillStyle('white')
    // ctx.setStrokeStyle('transparent')
    // 左上角
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
    
    // border-top
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.lineTo(x + w, y + r)
    // 右上角
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
    
    // border-right
    ctx.lineTo(x + w, y + h - r)
    ctx.lineTo(x + w - r, y + h)
    // 右下角
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
    
    // border-bottom
    ctx.lineTo(x + r, y + h)
    ctx.lineTo(x, y + h - r)
    // 左下角
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
    
    // border-left
    ctx.lineTo(x, y + r)
    ctx.lineTo(x + r, y)
    
    // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
    ctx.fill()
    // ctx.stroke()
    ctx.closePath()
    // 剪切
    ctx.clip()
   }






})