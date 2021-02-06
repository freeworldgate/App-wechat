

const Base64 = require('./Base64.js');

require('./hmac.js');
require('./sha1.js');
const Crypto = require('./crypto.js');


var uploadFile = (filePath, fileW, objectId, successCB, errorCB) =>{

    console.log('上传视频…');
    //const aliyunFileKey = fileW+filePath.replace('wxfile://', '')；

  const aliyunFileKey = fileW + '/fuck/' + (new Date().getTime()) + '_' + objectId + '.jpg';
  const aliyunServerURL = "https://oss.211shopper.com";
  const accessid ="LTAIzxViWZTSLgfe";
    const policyBase64 = getPolicyBase64();
    const signature = getSignature(policyBase64);

    console.log('aliyunFileKey=', aliyunFileKey);

    wx.uploadFile({
        url: aliyunServerURL, //仅为示例，非真实的接口地址
        filePath: filePath[0],
        method:"PUT",
        name: 'file',

        formData: {
            'key': aliyunFileKey,
            'OSSAccessKeyId': accessid,
            'policy': policyBase64,
            'Signature': signature,
            'success_action_status': '200',
        },
        success: function (res) {
            if (res.statusCode != 200) {
                errorCB(new Error('上传错误:' + JSON.stringify(res)))
                return;
            }
            console.log('上传视频成功', res)
            successCB(aliyunFileKey);
        },
        fail: function (err) {
            err.wxaddinfo = aliyunServerURL;
            errorCB(err);
        },
    })
}

// 上传单张图片到OSS
function uploadSingleImages(file, data, successCallBack, failureCallBack) {
  var fileNameColums = file.split(".");
  var suffix = fileNameColums[fileNameColums.length - 1];
  var aliyunFileKey = data.directory + '/' + data.prefix + '-' + (new Date().getTime()) + '.' + suffix;
  const policyBase64 = getPolicyBase64();
  const signature = getSignature(policyBase64);
  wx.uploadFile({
    url: data.aliyunServerURL,
    filePath: file,
    method: "PUT",
    name: 'file',
    header: {
      'Connection': 'close',
      'socketTimeout': '300000',
      'connetionTimeout': '300000',
    },
    formData: {
      'key': aliyunFileKey,
      'OSSAccessKeyId': 'LTAIzxViWZTSLgfe',
      'policy': policyBase64,
      'Signature': signature,
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
















const getPolicyBase64 = function () {
    let date = new Date();
    date.setHours(date.getHours() + 87600 );
    let srcT = date.toISOString();
    const policyText = {
        "expiration": srcT, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了 指定了Post请求必须发生在2020年01月01日12点之前("2020-01-01T12:00:00.000Z")。
        "conditions": [
            ["content-length-range", 0, 20 * 1024 * 1024] // 设置上传文件的大小限制,1048576000=1000mb
        ]
    };

    const policyBase64 = Base64.encode(JSON.stringify(policyText));
    return policyBase64;
}

const getSignature = function (policyBase64) {
  const accesskey = "MPyvdgboQZhezjdhPCXPr7lUoaAfpe";

    const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
        asBytes: true
    });
    const signature = Crypto.util.bytesToBase64(bytes);

    return signature;
}

module.exports = { uploadFile, getPolicyBase64, getSignature, uploadSingleImages};