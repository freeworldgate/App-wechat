var request = require('./request.js')
var login = require('./loginUtil.js')
var tip = require('./tipUtil.js')
var aliyun = require('./security/uploadAliyun.js')


var uploadPhoto = (path, successCallBack, failBack) => {

  var imgPath = path
  return wx.uploadFile({
    url:"",
    filePath: imgPath,
    name: 'media',

    success: function (res) {
      var obj = JSON.parse(res.data.trim());

      if (obj.errcode && obj.errcode === 42001) {
        //说明token超时,需再次获取
        return uploadPhoto(imgPath);
      }
      var mediaID = obj.media_id;
      console.log("上传成功:", mediaID);
      if (mediaID) {
        console.log("上传MediaID = ", mediaID);
        successCallBack(imgPath, mediaID);
      } else {
        failBack();
      }

    },
    fail: function () {
      failBack();
    }
  })
}


var uploadMulptiPhotos = (paths, success, fail) => {
  var imgPath = paths;  //数组
  var mediaIDs = new Map();
  var uptasks = [];

  var currentTime = new Date().getTime(); //当前时间
  console.log("要上传的图片：", paths);
  for (var j = 0; j < imgPath.length; j++) {

    var uploadTask = uploadPhoto(imgPath[j], function (path, mediaID) {

      var index = imgPath.indexOf(path);

      console.log("上传图片原始路径", path);
      console.log("上传图片的Media", mediaID);
      console.log("上传图片所处的位置", index);
      mediaIDs.set(index, mediaID);
      if (mediaIDs.size === imgPath.length) {
        var uploadMedias = [];
        for (var i = 0; i < imgPath.length; i++) {
          var media = mediaIDs.get(i);
          uploadMedias.push(media);
        }
        success(uploadMedias);
      }
    }, function () {
      fail();  //只要有一个失败，那么就全部失败
    });
    uptasks.push(uploadTask);
  }
  console.log("全部的上传任务：", uptasks);
  return uptasks;
};

// 上传图片
var uploadImageMethod = (size, successCallback, failureCallBack) => {
  console.log("上传图片");
  wx.chooseImage({
    count: size,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: function (res) {
      var tempFilePaths = res.tempFilePaths

      var tasks = uploadMulptiPhotos(tempFilePaths, successCallback, failureCallBack);
    },
  });
};


var upload2Oss = (filePaths,typeReq,sunccessCallback,failureCallback) =>
{
    var id = login.getUserId();
    if (id.length<1) { return;};
    var param = {
          files:filePaths,
          userId: id,
          type:typeReq,
      };
     request.getRequest(request.url.getOssUploadUrl,param,function(res){
          if (res.data.code == request.value.success)
          {
                  const policyBase64 = aliyun.getPolicyBase64();
                  const signature = aliyun.getSignature(policyBase64);
                  var fileNums =0
                  var fileNames = [];
                  for(var i=0;i<filePaths.length;i++){
                    const aliyunFileKey = res.data.data.directory + '/' + res.data.data.prefix + '-' + (new Date().getTime()) + '.' + res.data.data.suffix;
                      wx.uploadFile({
                        url: res.data.data.aliyunServerURL,
                        filePath: filePaths[i],
                        method: "PUT",
                        name: 'file',
                        formData: {
                          'key': aliyunFileKey,
                          'OSSAccessKeyId': res.data.data.ossaccessKeyId,
                          'policy': res.data.data.policyBase64,
                          'Signature': res.data.data.signature,
                          'success_action_status': '200',
                        },
                        success:function(aliyunResp){
                          if (aliyunResp.statusCode == 200){
                                fileNums++;
                                fileNames.push(aliyunFileKey);
                                if(fileNums == filePaths.length)
                                {
                                  sunccessCallback(fileNames, res.data.data.taskId);
                                }
                                return;
                            }
                            failureCallback();
                        },
                        fail:function(){
                           failureCallback();
                        }
                      })



                  }

                  return;
          }

          tip.showContentTip("请求失败");




     },
     function(){
       tip.showContentTip("请求失败,服务异常");
     });








};    













var uploadFiles = (filePaths, typeReq, sunccessCallback, failureCallback) => {

  var param = {
    type: typeReq,
  };
  request.getRequest(request.url.getOssUploadUrl, param, function (res) {
      if (res.data.code == request.value.success) {
        var fileNums = 0
        var fileNames = [];
        for (var i = 0; i < filePaths.length; i++) {
          uploadSingle2Oss(filePaths[i],res.data.data,
              function(fileKey){
                  fileNums ++;
                  fileNames.push(fileKey);
                  if (fileNums == filePaths.length) {
                    sunccessCallback(fileNames, res.data.data.taskId);
                  }
              },  
              function(){
                failureCallback();
            });
        }
        return;
      }
      failureCallback();
  },
    function () {
      failureCallback();
    });


};    

// 上传单个文件到
var uploadSingle2Oss = (filePath, taskInfo, sunccessCallback, failureCallback) =>{
  var fileNameColums = filePath.split(".");
  var suffix = fileNameColums[fileNameColums.length - 1];
  console.log("文件类型:", suffix);
  var aliyunFileKey = taskInfo.directory + '/' + taskInfo.prefix + '-' + (new Date().getTime()) + '.' + suffix;
      wx.uploadFile({
            url: taskInfo.aliyunServerURL,
            filePath: filePath,
            method: "PUT",
            name: 'file',
            formData: {
              'key': aliyunFileKey,
              'OSSAccessKeyId': taskInfo.ossaccessKeyId,
              'policy': taskInfo.policyBase64,
              'Signature': taskInfo.signature,
              'success_action_status': '200',
            },
            success: function (aliyunResp) {
              if (aliyunResp.statusCode === 200) {
                sunccessCallback(aliyunFileKey);
                return;
              }
              failureCallback();
            },
            fail: function () {
              failureCallback();
            }
      })





}

















module.exports = { uploadImageMethod, upload2Oss, uploadFiles}



/**
 * 上传图片传入的是一个本地文件地址的数组，返回的media也是一个数组，他和本地文件的位置一一对应。 
 * 
 */


/**
 *   取消上传任务    
 * wx.chooseImage({
      success: function(res) {
        var tempFilePaths = res.tempFilePaths

         var tasks = uploadUtil.uploadMulptiPhotos(tempFilePaths,function(mediaIDs){
          console.log("uploadnames", mediaIDs);

        },function(){
          //上传失败
          console.log("上传失败");
        });

        for(var i=0;i<tasks.length;i++){
            tasks[i].abort();
            console.log("停止任务", tasks[i]);

        }

 * 
 */













