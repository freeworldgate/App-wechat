

var http = require('./http.js')

var request = require('./request.js')
var tip = require("./tipUtil.js");
const MPServerless = require('./mpserverless.js');


//上传图片
function uploadImages1(userId,imgNum, type, successCallBack,failureCallBack) {
  wx.chooseImage({
    count: imgNum,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success(res) {
      wx.showLoading({
        title: '图片上传中',
      })
      var uploadTask = createUpload(userId,res.tempFilePaths, type);
      uploadTask.setError(function () {
        console.log("上传文件错误");
      });
      uploadTask.setSuccess(function (fileMap, taskId) {

        console.log("上传文件", fileMap);
        console.log("上传任务", taskId);

        var httpClient = http.createSubmit(request.url.postUploadImgs, "GET");  
        var images = [];
        for (var image of fileMap) { // 遍历Map
          console.log("---" + image[0]);
          console.log("---" + image[1]);
          images.push(image[1]);
        }
        console.log("所有文件:" + images);
        httpClient.setParam("taskId", taskId);
        httpClient.setParam("files", images);   

        httpClient.setSuccess(successCallBack);
        httpClient.setError(failureCallBack);

        httpClient.submit();
      });
      uploadTask.setError(function(){
        failureCallBack();
      });
      
      uploadTask.upload(userId);
    },
    fail(){
      wx.hideLoading();
    }
  })
}

//上传图片
function uploadImages2(upType, files,page, successCallBack, failureCallBack){
      var urls = [];
      getOssInfo(upType,page,function(ossData){
        uploadMulptiImages(files, 0, ossData, urls, page, successCallBack, failureCallBack);
      },function(){
        failureCallBack();
      });

}
function uploadImages3(upType, files,page,startCallBack, successCallBack, failureCallBack){
  tip.showContentTip("开始上传...");
  var urls = new Map();
  getOssInfo(upType,page,function(ossData){
    startCallBack();
    uploadMulptiImages3(files, ossData, urls, page, successCallBack, failureCallBack);
  },function(){
    failureCallBack();
  });

}
//上传图片
function uploadMulptiImages3(files, data, urls, page, successCallBack, failureCallBack){
      for(var num=0;num<files.length;num++){
          uploadSingleImages3(files,num,data,urls,page,successCallBack, failureCallBack);
      }
}
function uploadSingleImages3(files,num,data,urls,page,successCallBack, failureCallBack) {
  var file = files[num];
  var fileNameColums = file.split(".");
  var suffix = fileNameColums[fileNameColums.length - 1];
  console.log("文件类型:", suffix);
  var aliyunFileKey = data.directory + '/' + data.prefix + '-' + (new Date().getTime()) + '.' + suffix;
  wx.uploadFile({
    url: data.aliyunServerURL,
    filePath: file,
    method: "POST",
    name: "file",
    header:{
      'Connection':'close',
      // 'socketTimeout':'300000',
      // 'connetionTimeout':'300000',
    },
    formData: {
      'name': file,
      'key': aliyunFileKey,
      'OSSAccessKeyId': data.ossaccessKeyId,
      'policy': data.policyBase64,
      'Signature': data.signature,
      'success_action_status': '200',
    },
    success: function (aliyunResp) {
      
      if (aliyunResp.statusCode === 200) {
          urls.set(file, data.aliyunServerURL+"/"+aliyunFileKey);
          
          tip.showLoading(urls.size + "/" + files.length);


          if(urls.size === files.length){
              successCallBack(urls);
          } 
        return;
      }
      failureCallBack();
    },
    fail: function () {
      failureCallBack();
    }
  })





}
function getOssInfo(upType, page,successCallBack, failureCallBack){


  var httpClient = template.createHttpClient(page);
  httpClient.setMode("", true);
  httpClient.addHandler("success", function (data) {
    successCallBack(data);
  })
  httpClient.send(request.url.getOssUploadUrl, "GET",{type:upType})



}






function createUpload(userId, files, type) {

  var upload = new Object();
  upload.fileMap = new Map();
  upload.upfiles = files;
  upload.upType = type;
  upload.userId = userId;
  upload.error = function () { };
  upload.success = function (fileNames, taskId) { };



  upload.setError = function (errorHandler) {
    this.error = errorHandler
  }
  upload.setSuccess = function (successHandler) {
    this.success = successHandler
  }

  // upload.upload = function(userId){
  //     var httpClient = http.createSubmit(request.url.getOssUploadUrl, "GET");
  //     httpClient.setParam("type", this.upType);
  //     if (userId) { httpClient.setParam("userId", this.userId);}
  //     httpClient.setSuccess(function (data) {
  //         var filePaths = upload.upfiles;

  //         for(var i=0;i<filePaths.length;i++)
  //         {
  //             upload.uploadSingle2Oss(filePaths[i],data);
  //         }
  //     });
  //     httpClient.setError(upload.error);
  //     httpClient.submit();
  // }
  upload.upload = function (userId) {
    var httpClient = http.createSubmit(request.url.getOssUploadUrl, "GET");
    httpClient.setParam("type", this.upType);
    if (userId) { httpClient.setParam("userId", this.userId); }
    httpClient.setSuccess(function (data) {
      var filePaths = upload.upfiles;

      // for (var i = 0; i < filePaths.length; i++) {
      var num = 0;
      upload.uploadSingle2Oss(filePaths, data, num);
      // }
    });
    httpClient.setError(upload.error);
    httpClient.submit();
  }
  upload.uploadSingle2Oss = function (filePaths, data, num) {
    var that = this;
    var fileNameColums = filePaths[num].split(".");
    var suffix = fileNameColums[fileNameColums.length - 1];
    console.log("文件类型:", suffix);
    var aliyunFileKey = data.directory + '/' + data.prefix + '-' + (new Date().getTime()) + '.' + suffix;
    wx.uploadFile({
      url: data.aliyunServerURL,
      filePath: filePaths[num],
      // method: "POST",
      name: 'file',
      header: {
        "Connection": "close"
      },
      formData: {
        'key': aliyunFileKey,
        'OSSAccessKeyId': data.ossaccessKeyId,
        'policy': data.policyBase64,
        'Signature': data.signature,
        'success_action_status': '200',
      },
      success: function (aliyunResp) {
        if (aliyunResp.statusCode === 200) {
          var newNum = num + 1;
          if (newNum < filePaths.length) {
            that.uploadSingle2Oss(filePaths, data, newNum);
          }

          upload.fileMap.set(filePaths[num], data.aliyunServerURL + '/'+ aliyunFileKey);
          if (upload.fileMap.size === upload.upfiles.length) {
            upload.success(upload.fileMap, data.taskId);
          }
          return;
        }
        upload.error();
      },
      fail: function () {
        upload.error();
      }
    })
  }
  // upload.uploadSingle2Oss = function (filePath,data) {
  //     var fileNameColums = filePath.split(".");
  //     var suffix = fileNameColums[fileNameColums.length - 1];
  //     console.log("文件类型:", suffix);
  //     var aliyunFileKey = data.directory + '/' + data.prefix + '-' + (new Date().getTime()) + '.' + suffix;
  //     wx.uploadFile({
  //       url: data.aliyunServerURL,
  //       filePath: filePath,
  //       method: "PUT",
  //       name: 'file',
  //       header: {
  //         "Content-Type":"multipart/form-data"
  //       },
  //       formData: {
  //         'key': aliyunFileKey,
  //         'OSSAccessKeyId': data.ossaccessKeyId,
  //         'policy': data.policyBase64,
  //         'Signature': data.signature,
  //         'success_action_status': '200',
  //       },
  //       success: function (aliyunResp) {
  //         if (aliyunResp.statusCode === 200) {


  //           upload.fileMap.set(filePath,aliyunFileKey);
  //           if (upload.fileMap.size === upload.upfiles.length){
  //             upload.success(upload.fileMap,data.taskId);
  //           }
  //           return;
  //         }
  //         upload.error();
  //       },
  //       fail: function () {
  //         upload.error();
  //       }
  //     })
  // }
  return upload;
}
//上传图片
function uploadMulptiImages(files, index, data, urls, page, successCallBack, failureCallBack){

    uploadSingleImages(files[index],data,function(url){
    if (page.data.statu === 0) {
        return;
      }
      urls.push(data.aliyunServerURL + '/'+ url);
      if(index === files.length-1)
      {  
        successCallBack(urls);
      }
      else
      {
        uploadMulptiImages(files, index + 1, data, urls, page,successCallBack,failureCallBack)
      }
  },function(){
    failureCallBack();

  });






}
// 上传单张图片到OSS
function uploadSingleImages(file,data, successCallBack, failureCallBack) {
    var fileNameColums = file.split(".");
    var suffix = fileNameColums[fileNameColums.length - 1];
    console.log("文件类型:", suffix);
    var aliyunFileKey = data.directory + '/' + data.prefix + '-' + (new Date().getTime()) + '.' + suffix;
    wx.uploadFile({
      url: data.aliyunServerURL,
      filePath: file,
      method: "PUT",
      name: 'file',
      header:{
        'Connection':'close',
        // 'socketTimeout':'300000',
        // 'connetionTimeout':'300000',
      },
      formData: {
        'key': aliyunFileKey,
        'OSSAccessKeyId': data.ossaccessKeyId,
        'policy': data.policyBase64,
        'Signature': data.signature,
        'success_action_status': '200',
      },
      success: function (aliyunResp) {
        
        if (aliyunResp.statusCode === 200) {
          successCallBack(aliyunFileKey);
          return;
        }
        failureCallBack();
      },
      fail: function () {
        failureCallBack();
      }
    })





}
// 获取OSS信息
function getOssInfo(upType, page,successCallBack, failureCallBack){


      var httpClient = template.createHttpClient(page);
      httpClient.setMode("", true);
      httpClient.addHandler("success", function (data) {
        successCallBack(data);
      })
      httpClient.send(request.url.getOssUploadUrl, "GET",{type:upType})



}









module.exports = { uploadImages1, createUpload, uploadMulptiImages, uploadImages2,uploadImages3}


















