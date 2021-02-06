var request = require('./../utils/request.js')
var http = require('./../utils/http.js')
var tip = require('./../utils/tipUtil.js')
var login = require('./../utils/loginUtil.js')
var route = require('./../utils/route.js')
var redirect = require('./../utils/redirect.js')
var uuid = require('./../utils/uuid.js')
var inviteReq = require('./../utils/invite.js')
var userInvite = require('./../utils/userInvite.js')
var upload = require('./../utils/uploadFile.js')
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()


//上传图片


// 上传图片
function uploadImages3(upType, files,page, successCallBack, failureCallBack){
  wx.showLoading({
    title: '0/' + files.length
  })

  var urls = new Array();
  getOssInfo(upType,page,function(ossData){

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
    method: "PUT",
    name: "file",
    header:{
      'Connection':'close',
      'socketTimeout':'300000',
      'connetionTimeout':'300000',
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
          urls.push(data.aliyunServerURL+"/"+aliyunFileKey);
          
          tip.showLoading(urls.length + "/" + files.length);


          if(urls.length === files.length){
              wx.hideLoading({complete: (res) => {},})
              successCallBack(urls);
          } 
        return;
      }
      wx.hideLoading({complete: (res) => {},})
      failureCallBack();
    },
    fail: function () {
      wx.hideLoading({complete: (res) => {},})
      failureCallBack();
    }
  })





}
function getOssInfo(upType, page,successCallBack, failureCallBack){


  var httpClient = createHttpClient(page);
  httpClient.setMode("", true);
  httpClient.addHandler("success", function (data) {
    successCallBack(data);
  })
  httpClient.send(request.url.getOssUploadUrl, "GET",{type:upType})



}



// 反饋框
function createDialog(page) {
  if (page.dialog) {
    return page.dialog;
  }
  var dialog = new Object();
    dialog.visible = false;
    dialog.title = "",
    dialog.text = "",

    
    dialog.show = function (title, text) {



      page.setData({
        'dialog.title': title,
        'dialog.text': text,
        'dialog.visible': true,
      })







    }
  dialog.hide = function () {
    page.setData({
      'dialog.visible': false,
    })
  }
  page.dialog = dialog;
  page.dialog_confirm = function () {
    dialog.hide();
  }
  return dialog;
}
// info  warning  error
function createTipDialog(page) {
  if (page.tipDialog) {
    return page.tipDialog;
  }
  var tipDialog = new Object();
  tipDialog.visible = false;
  tipDialog.show = function (level, message) {
    page.setData({
      'tipDialog.message': message,
      'tipDialog.level': level,
      'tipDialog.visible': true,
    })
    //一秒钟小时
    setTimeout(function () {
      page.setData({
        'tipDialog.visible': false,
      })
    }, 2000)
  }
  page.tipDialog = tipDialog;
  return tipDialog;



}
//操作框
function createOperateDialog(page) {
  if (page.data.operateDialog) {
    return page.data.operateDialog;
  }
  var operateDialog = new Object();
  operateDialog.visible = false;
  operateDialog.title = "",
  operateDialog.text = "",
  operateDialog.statu = 0;
  operateDialog.confirm = function () { };
  operateDialog.cancel = function () { };

  operateDialog.show = function (title, text, confirm, cancel) {



    operateDialog.confirm = confirm;
    operateDialog.cancel = cancel;
    page.setData({

      'operateDialog.title': title,
      'operateDialog.text': text,
      'operateDialog.visible': true,
    })



  }
  operateDialog.hide = function () {

    page.setData({
      'operateDialog.title': "",
      'operateDialog.text': "",
      'operateDialog.visible': false,
    })
    page.data.operateDialog = undefined;
  }
  page.operateDialog_confirm = function () {
    if (!operateDialog.statu === 0) {
      return;
    }
    operateDialog.statu = 1
    operateDialog.hide();

    operateDialog.confirm();
    operateDialog.statu = 0;
  };
  page.operateDialog_cancel = function () {
    operateDialog.hide();
    operateDialog.cancel();
  };
  page.data.operateDialog = operateDialog;
  return operateDialog;
}


function createPayDialog(page) {
  if (page.data.payDialog) {
    return page.data.payDialog;
  }
  var payDialog = new Object();
  payDialog.visible = false;
  payDialog.single = function () { };
  payDialog.all = function () { };

  payDialog.show = function (pay, single, all) {

    payDialog.pay = pay;
    payDialog.single = single;
    payDialog.all = all;
    page.setData({
      'payDialog.visible': true,
    })

  }
  payDialog.hide = function () {

    page.setData({
      'payDialog.visible': false,
    })
    page.data.payDialog = undefined;
  }

  page.payDialog_single = function () {
    payDialog.hide();
    payDialog.single(payDialog.pay.single);
  };
  page.payDialog_all = function () {
    payDialog.hide();
    payDialog.all(payDialog.pay.all);
  };
  page.payDialog_cancel = function () {
    payDialog.hide();
  };

  page.data.payDialog = payDialog;
  return payDialog;
}


function createPkTipDialog(page) {
  if (page.data.pkTipDialog) {
    return page.data.pkTipDialog;
  }
  var pkTipDialog = new Object();
  pkTipDialog.visible = false;
  pkTipDialog.tips = [];
  pkTipDialog.maxTips = 3;
  pkTipDialog.pkTips = [];
  pkTipDialog.confirm = function () { };

  pkTipDialog.show = function (tips, pkTips,maxTips, confirm) {

    pkTipDialog.confirm = confirm;
    page.setData({
      'pkTipDialog.tips':tips,
      'pkTipDialog.maxTips':maxTips,
      'pkTipDialog.pkTips':pkTips,
      'pkTipDialog.visible': true,
    })

  }
  pkTipDialog.hide = function () {
    page.setData({
      'pkTipDialog.visible': false,
    })
    page.data.pkTipDialog = undefined;
  }

  page.pkTipDialog_confirm = function () {
    pkTipDialog.hide();
    pkTipDialog.confirm(pkTipDialog.pkTips);
  };
  page.pkTipDialog_cancel = function () {
    pkTipDialog.hide();
  };
  page._pkTipDialog_addTip = function(res){
    var tip =  res.currentTarget.dataset.tip;
    if(pkTipDialog.pkTips.length >=pkTipDialog.maxTips)
    {
        return;
    }




    for (var i = pkTipDialog.pkTips.length-1;i >= 0 ;i--) {
          if (pkTipDialog.pkTips[i].id === tip.id) 
          {
            return        //执行后aa.length会减一
          }
    }

    pkTipDialog.pkTips.unshift(tip);
    page.setData({
      'pkTipDialog.pkTips': pkTipDialog.pkTips,
    })

  };
  

  page._pkTipDialog_delTip = function(res){
    var tip =  res.currentTarget.dataset.tip;
    var index =  res.currentTarget.dataset.index;
    page.data.pkTipDialog.pkTips.splice(index, 1); 
   
    page.setData({
      'pkTipDialog.pkTips': pkTipDialog.pkTips,
    })

  };
  page.data.pkTipDialog = pkTipDialog;
  return pkTipDialog;
}














//2秒钟信息显示框
function showTip(text) {
  wx.showToast({
    title: text,
  })
}
//中间位置 图片展示框(可以下载并保存图片)
function createImageShowDialog(page) { }
//编辑图片和文字窗口
function createEditMessageDialog(page) { }
//图片集合
function createImageListDialog(page) {
};
// 选择框
function createSelectionDialog(page) {
  if (page.selectionDialog) {
    return page.selectionDialog;
  }
  var selectionDialog = new Object();
  selectionDialog.visible = false;
  selectionDialog.style = 0;
  selectionDialog._selectionDialog_layout = 'css selectionDialog_bottom';
  selectionDialog.items = new Array();
  selectionDialog.itemSelect = new Map();
  selectionDialog.statu = 0;
  selectionDialog.setLayout = function (location, direction) {
    selectionDialog.items.length = 0;
    selectionDialog.itemSelect.clear();
    if (direction === 'x' && location === 'top') {
      selectionDialog._selectionDialog_layout = 'css selectionDialog_top';
      selectionDialog.style = 5;
    }
    else if (direction === 'y' && location === 'top') {
      selectionDialog._selectionDialog_layout = 'css selectionDialog_top';
      selectionDialog.style = 4;
    }
    else if (location === 'left') {
      selectionDialog._selectionDialog_layout = 'ccc  selectionDialog_left';
      selectionDialog.style = 3;
    }
    else if (location === 'right') {
      selectionDialog._selectionDialog_layout = 'ccc selectionDialog_right';
      selectionDialog.style = 2;
    }
    else if (direction === 'x' && location === 'bottom') {
      selectionDialog._selectionDialog_layout = 'css selectionDialog_bottom';
      selectionDialog.style = 1;
    }
    else {
      selectionDialog._selectionDialog_layout = 'css selectionDialog_bottom';
      selectionDialog.style = 0;
    }

    return selectionDialog;

  }

  selectionDialog.addItem = function (tabIcon, tabName, select) {
    var item = new Object();
    item.icon = tabIcon;
    item.name = tabName;
    selectionDialog.items.push(item);
    selectionDialog.itemSelect.set(tabName, select);
    return selectionDialog;
  }


  selectionDialog.show = function () {
    page.setData({
      'selectionDialog.items': selectionDialog.items,
      'selectionDialog.style': selectionDialog.style,
      'selectionDialog._selectionDialog_layout': selectionDialog._selectionDialog_layout,
      'selectionDialog.visible': true,

    })
  }

  selectionDialog.hide = function () {
    page.setData({
      'selectionDialog.visible': false,
    })
    // page.selectionDialog = undefined;
  }


  page.selectionDialog = selectionDialog;
  page._selectionDialog_hide = function () {
    page.setData({
      'selectionDialog.visible': false,
    })
  }
  page._selectDialog_choose = function (res) {
    if (page.selectionDialog.statu === 0) {
      page.selectionDialog.statu = 1;
      var name = res.currentTarget.dataset.name;
      var select = selectionDialog.itemSelect.get(name);
      select();
      setTimeout(function () {
        page.selectionDialog.statu = 0
      }, 600)
    }
  }
  return selectionDialog;
};
function createPageLoading(page) {
  if (page.pageLoadingDialog) {
    return page.pageLoadingDialog;
  }
  var pageLoadingDialog = new Object();
  pageLoadingDialog.visible = false;
  pageLoadingDialog.text = "",
    pageLoadingDialog.show = function () {
      page.setData({
        // 'pageLoadingDialog.text': text,
        'pageLoadingDialog.visible': true,
      })
    }
  pageLoadingDialog.hide = function () {
    page.setData({
      'pageLoadingDialog.visible': false,
    })
  }
  page.pageLoadingDialog = pageLoadingDialog;
  return pageLoadingDialog;
}
function createPageLoadingError(page) {
  if (page.pageLoadingDialogError) {
    return page.pageLoadingDialogError;
  }
  var pageLoadingDialogError = new Object();
  pageLoadingDialogError.visible = false;
  pageLoadingDialogError.text = "",
    pageLoadingDialogError.show = function () {
      page.setData({
        // 'pageLoadingDialogError.text': text,
        'pageLoadingDialogError.visible': true,
      })
    }
  pageLoadingDialogError.hide = function () {
    page.setData({
      'pageLoadingDialogError.visible': false,
    })
  }
  page.pageLoadingDialogError = pageLoadingDialogError;
  return pageLoadingDialogError;

}
function createLabelLoading(page) {
  if (page.labelLoadingDialog) {
    return page.labelLoadingDialog;
  }
  var labelLoadingDialog = new Object();
  labelLoadingDialog.visible = false;
  labelLoadingDialog.show = function () {

    page.setData({
      'labelLoadingDialog.visible': true,
    })
  }
  labelLoadingDialog.hide = function () {


    page.setData({
      'labelLoadingDialog.visible': false,
    })
  }
  page.labelLoadingDialog = labelLoadingDialog;
  return labelLoadingDialog;
}
function createLabelLoadingError(page) {
  if (page.labelLoadingDialogError) {
    return page.labelLoadingDialogError;
  }
  var labelLoadingDialogError = new Object();
  labelLoadingDialogError.visible = false;
  labelLoadingDialogError.show = function () {
    page.setData({
      'labelLoadingDialogError.visible': true,
    })
    //一秒钟小时
    setTimeout(function () {
      page.setData({
        'labelLoadingDialogError.visible': false,
      })
    }, 1000)
  }
  page.labelLoadingDialogError = labelLoadingDialogError;
  return labelLoadingDialogError;
}
function createLabelLoadingSuccess(page) {

  if (page.labelLoadingDialogSuccess) {
    return page.labelLoadingDialogSuccess;
  }
  var labelLoadingDialogSuccess = new Object();
  labelLoadingDialogSuccess.visible = false;
  labelLoadingDialogSuccess.show = function () {
    page.setData({
      'labelLoadingDialogSuccess.visible': true,
    })
    //一秒钟小时
    setTimeout(function () {
      page.setData({
        'labelLoadingDialogSuccess.visible': false,
      })
    }, 2000)
  }
  page.labelLoadingDialogSuccess = labelLoadingDialogSuccess;
  return labelLoadingDialogSuccess;

}
//文字图片编辑页面
//要统计失败率和成功率。
function createEditImageDialog(page) {
  if (page.editImageDialog) {
    return page.editImageDialog;
  }
  var editImageDialog = new Object();

  editImageDialog.width = (wx.getSystemInfoSync().windowWidth - 20 - 10) / 3.0;
  editImageDialog.success = function () { }

  editImageDialog.setDialog = function (_dialog_title, _default_edit_text, _max_images, confirm,success,fail) {
    editImageDialog.success = success;
    editImageDialog.confirm = confirm;
    editImageDialog.fail = fail;
    //初始化
    page.setData({
      'editImageDialog.images': new Array(),
      'editImageDialog.left':100,
      'editImageDialog.text': '',
      'editImageDialog.width': editImageDialog.width,
      'editImageDialog._dialog_title': _dialog_title,
      'editImageDialog._default_edit_text': _default_edit_text,
      'editImageDialog._max_images': _max_images,
      'editImageDialog.visible': false,
    })

    return editImageDialog;
  }

  editImageDialog.show = function () {
    wx.chooseImage({
      count: page.data.editImageDialog._max_images > 9 ? 9 : page.data.editImageDialog._max_images,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {
        page.setData({
          'editImageDialog.images': res.tempFilePaths,
          "editImageDialog.text": "",
          'editImageDialog.visible': true,
        })
      },
    })
  }
  editImageDialog.hide = function () {
    page.setData({
      'editImageDialog': {},
      "editImageDialog.text":"",
      'editImageDialog.visible': false,
    })
  }
  //-----------------------------page---------------------------------------

  page.editImageDialog = editImageDialog;


  page._editImageDialog_selectImgs = function () {

    wx.chooseImage({
      count: page.data.editImageDialog._max_images > 9 ? 9 : page.data.editImageDialog._max_images,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {
        var length = page.data.editImageDialog.images.length + res.tempFilePaths.length;
        if (length > page.data.editImageDialog._max_images) {
          wx.showToast({
            title: '图片数量超限...',
          })
          return;
        }
        var imgs = page.data.editImageDialog.images.concat(res.tempFilePaths);
        page.setData({
          'editImageDialog.images': imgs,
        })
      },
    })
  };
  //确认发布
  page._editImageDialog_confirm = function () {
    login.getUser(function (user) {
      page.setData({
        'editImageDialog.visible': false,
      })
      editImageDialog.confirm();
      uploadImages3("userUpload", page.data.editImageDialog.images, page,
        function (urls) {
          console.log("图片集合", urls);

          page.editImageDialog.success(page.data.editImageDialog.text, urls);
          // createLabelLoading(page).hide();
          // createLabelLoadingSuccess(page).show();
        },
        function () {
          showTip("发布失败......");
          page.editImageDialog.fail();
        });
    
    })
  };

  page._editImageDialog_cancelUpload = function () {
    page.setData({
      'editImageDialog.uploadIndex': 0
    })
    tip.showContentTip("上传终止")
  }
  page._editImageDialog_remove = function (res) {

    var index = parseInt(res.currentTarget.dataset.index);
    page.data.editImageDialog.images.splice(index, 1);

    page.setData({
      'editImageDialog.images': page.data.editImageDialog.images,
    })
  };
  page._editImageDialog_change = function (res) {

    var index = parseInt(res.currentTarget.dataset.index);

    wx.chooseImage({
      count:1,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success(res) {

        page.data.editImageDialog.images.splice(index,1,res.tempFilePaths[0]);
        page.setData({
          'editImageDialog.images': page.data.editImageDialog.images,
        })
      },
    })

    // page.setData({
    //   'editImageDialog.images': page.data.editImageDialog.images,
    // })
  };
  page._editImageDialog_input = function (res) {
    var value = res.detail.value;
    var left = 100 - value.length;
    page.setData({
      'editImageDialog.text':value,
      'editImageDialog.left': left
    })
    page.data.editImageDialog.text = value;
  };
  page._editImageDialog_closeEdit = function () {

    page.editImageDialog.hide();
  };
  page.editImageDialog = editImageDialog;
  return editImageDialog;

}


function createShowPkDialog(page){
  if (page.showPkDialog) {
    return page.showPkDialog;
  }
  var showPkDialog = new Object();

  

  showPkDialog.show = function(topic,watchWord){

    page.setData({
      'showPkDialog.topic':topic,
      'showPkDialog.watchWord':watchWord,
      'showPkDialog.visible': true,
    })
  }
  showPkDialog.hide = function(){
    page.setData({
      'showPkDialog': {},
    })
  } 



  page.showPkDialog = showPkDialog;
  page._showPkDialog_hide = function () {
    page.showPkDialog.hide()
  }
  return showPkDialog;



}


function createUpdatePkDialog(page){
  if (page.updatePkDialog) {
    return page.updatePkDialog;
  }
  var updatePkDialog = new Object();
  updatePkDialog.success = function(topic,watchWord){}
  

  updatePkDialog.show = function(topic,watchWord,success){
    updatePkDialog.success = success;
    page.setData({
      'updatePkDialog.topic':topic,
      'updatePkDialog.watchWord':watchWord,
      'updatePkDialog.visible': true,
    })
  }
  updatePkDialog.hide = function(){
    page.setData({
      'updatePkDialog': {},
    })
  } 
  page._updatePkDialog_input_topic = function(res)
  {
    var value = res.detail.value;
    page.setData({
      'updatePkDialog.topic':value,
    })
  }
  page._updatePkDialog_input_watchword = function(res)
  {
    var value = res.detail.value;
    page.setData({
      'updatePkDialog.watchWord':value,
    })
  }


  page._updatePkDialog_createPk = function()
  {
    page.setData({
      'updatePkDialog.visible': false,
    })
    updatePkDialog.success(page.data.updatePkDialog.topic,page.data.updatePkDialog.watchWord);

  }

  page.updatePkDialog = updatePkDialog;
  page._updatePkDialog_hide = function () {
    page.updatePkDialog.hide()
  }
  return updatePkDialog;



}





function createEditPkDialog(page){
  if (page.editPkDialog) {
    return page.editPkDialog;
  }
  var editPkDialog = new Object();
  editPkDialog.success = function(topic,watchWord,invite){}
  

  editPkDialog.show = function(success){
    editPkDialog.success = success;
    page.setData({
      'editPkDialog.topic':"",
      'editPkDialog.watchWord':"",
      'editPkDialog.visible': true,
      'editPkDialog.invite': true,
    })
  }
  editPkDialog.hide = function(){
    page.setData({
      'editPkDialog': {},
    })
  } 
  page._editPkDialog_input_topic = function(res)
  {
    var value = res.detail.value;
    page.setData({
      'editPkDialog.topic':value,
    })
  }
  page._editPkDialog_input_watchword = function(res)
  {
    var value = res.detail.value;
    page.setData({
      'editPkDialog.watchWord':value,
    })
  }
  page._editPkDialog_selectInvite = function (e) {
    page.setData({
      'editPkDialog.invite': e.detail.value,
    })
  }

  page._editPkDialog_createPk = function()
  {
    page.setData({
      'editPkDialog.visible': false,
    })
    editPkDialog.success(page.data.editPkDialog.topic,page.data.editPkDialog.watchWord,page.data.editPkDialog.invite);

  }

  page.editPkDialog = editPkDialog;
  page._editPkDialog_hide = function () {
    page.editPkDialog.hide()
  }
  return editPkDialog;



}






















//文本编辑的窗口
function createEditTextDialog(page) {
  if (page.editTextDialog) {
    return page.editTextDialog;
  }
  var editTextDialog = new Object();
  editTextDialog._confirm = function () { }


  editTextDialog.show = function (_title, _placeholder,_text, _max_length, _confirm) {
    editTextDialog._confirm = _confirm;
    page.setData({
      "editTextDialog.title": _title,
      "editTextDialog.placeholder": _placeholder,
      "editTextDialog.maxLength": _max_length,
      "editTextDialog.text": _text,
      "editTextDialog.visible": true
    })

  }
  editTextDialog.hide = function () {
    page.setData({
      "editTextDialog": {},
      // 'editTextDialog.title': '编辑',
      // 'editTextDialog.placeholder': '编辑',
      // 'editTextDialog.maxLength': 20,
      // 'editTextDialog.text': "",
    })

  }


  page._editTextDialog_close = function () {
    page.editTextDialog.hide();
  }
  page._editTextDialog_input = function (res) {
    var value = res.detail.value;
    if (value.length > page.data.editTextDialog.maxLength) {
      showTip("内容超出长度");
      // return;
    }
    page.setData({
      'editTextDialog.text': value
    })
  }
  page._editTextDialog_confirm = function () {
    var tempText = page.data.editTextDialog.text
    if (tempText.length > page.data.editTextDialog.maxLength) {
      tip.showContentTip("内容超出长度");
      return;
    }
    if (tempText.length === 0) {
      tip.showContentTip("没有内容");
      return;
    }
    page.editTextDialog.hide();
    page.editTextDialog._confirm(tempText);
  }


  page.editTextDialog = editTextDialog;
  return editTextDialog;








}
//短文本编辑窗口  例如 修改用户名等...
function createShortTextDialog(page) {
  if (page.shortTextDialog) {
    return page.shortTextDialog;
  }
  var shortTextDialog = new Object();
  shortTextDialog.confirm = function () { }
  shortTextDialog.show = function (title, maxLength,text, confirm) {
    shortTextDialog.confirm = confirm;
    page.setData({
      'shortTextDialog.maxLength': maxLength,
      "shortTextDialog.title": title,
      "shortTextDialog.text": text,
      'shortTextDialog.visible': true,
    })
  }
  shortTextDialog.hide = function () {
    page.setData({
      'shortTextDialog.visible': false,
      'shortTextDialog.maxLength': 0,
      "shortTextDialog.title": '标题',

    })
  }



  page._shortTextDialog_close = function () {
    page.shortTextDialog.hide();
  }
  page._shortTextDialog_confirm = function () {
    if (page.data.shortTextDialog.text.length === 0) {
      return;
    }
    var value = page.data.shortTextDialog.text;
    page.shortTextDialog.confirm(value);
    page.shortTextDialog.hide();
  }
  page._shortTextDialog_input = function (res) {
    var value = res.detail.value;
    page.setData({
      "shortTextDialog.text": value,
    })
  }
  page.shortTextDialog = shortTextDialog;
  return shortTextDialog;
}

//数字编辑框
function createEditNumberDialog(page) {
  if (page.editNumberDialog) {
    return page.editNumberDialog;
  }
  var editNumberDialog = new Object();
  editNumberDialog.confirm = function () { }
  editNumberDialog.show = function (title, maxLength,text, confirm) {
    editNumberDialog.confirm = confirm;
    page.setData({
      'editNumberDialog.maxLength': maxLength,
      "editNumberDialog.title": title,
      "editNumberDialog.text": "",
      'editNumberDialog.visible': true,
    })
  }
  editNumberDialog.hide = function () {
    page.setData({
      'editNumberDialog.visible': false,
      'editNumberDialog.maxLength': 0,
      "editNumberDialog.title": '标题',

    })
  }



  page._editNumberDialog_close = function () {
    page.editNumberDialog.hide();
  }
  page._editNumberDialog_confirm = function () {
    if (page.data.editNumberDialog.text.length === 0) {
      return;
    }
    var value = page.data.editNumberDialog.text;
    page.editNumberDialog.confirm(value);
    page.editNumberDialog.hide();
  }
  page._editNumberDialog_input = function (res) {
    var value = res.detail.value;
    page.setData({
      "editNumberDialog.text": value,
    })
  }
  page.editNumberDialog = editNumberDialog;
  return editNumberDialog;
}

//可下载的图片
function createDownloadImageDialog(page) {
  if (page.downloadImageDialog) {
    return page.downloadImageDialog;
  }
  var downloadImageDialog = new Object();

  downloadImageDialog.show = function (title, subTitle, imageUrl) {
    page.setData({
      'downloadImageDialog.title': title,
      'downloadImageDialog.subTitle': subTitle,
      'downloadImageDialog._image': imageUrl,
      'downloadImageDialog.visible': true
    })
  }
  downloadImageDialog.hide = function () {
    page.setData({
      'downloadImageDialog.title': '标题',
      'downloadImageDialog.subTitle': "副标题",
      'downloadImageDialog._image': "",
      'downloadImageDialog.visible': false
    })
  }
  page._downloadImageDialog_close = function () {
    page.downloadImageDialog.hide();
  }
  page._downloadImageDialog_save = function (res) {
    var imgSrc = res.currentTarget.dataset.url;
    wx.downloadFile({
      url: imgSrc,
      success: function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
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
      }
    })
  }
  page.getInfo = function () {
    // wx.scanCode({
    //   success(res) {
    //     console.log(res)
    //     wx.navigateTo({
    //       url: res.result,
    //     })
    //   }
    // })
    wx.previewImage({
      urls: [page.data.downloadImageDialog._image],
    })


  }
  page.downloadImageDialog = downloadImageDialog;
  return downloadImageDialog;


}

//可上传图片
function createUploadImageDialog(page) {
  if (page.uploadImageDialog) {
    return page.uploadImageDialog;
  }
  var uploadImageDialog = new Object();
  uploadImageDialog.success = function(url){}
  uploadImageDialog.show = function (title, subTitle, imageUrl, successCallBack) {
    uploadImageDialog.success = successCallBack;
    page.setData({
      'uploadImageDialog.title': title,
      'uploadImageDialog.subTitle': subTitle,
      'uploadImageDialog._image': imageUrl,
      'uploadImageDialog.visible': true
    })
  }
  uploadImageDialog.hide = function () {
    page.setData({
      'uploadImageDialog.title': '标题',
      'uploadImageDialog.subTitle': "副标题",
      'uploadImageDialog._image': "",
      'uploadImageDialog.visible': false
    })
  }
  page._uploadImageDialog_close = function () {
    page.uploadImageDialog.hide();
  }
  //上传图片
  page._uploadImageDialog_save = function (res) {
    login.getUser(function(user){
      upload.uploadImages1(user.userId, 1, "Upload", function(files){
        wx.hideLoading();
        page.setData({
          'uploadImageDialog._image':files[0]
        })

      },function(){
        createLabelLoadingError(page).show();

      });
    })
     




  }
  page._uploadImageDialog_confirm = function(res){
    var url = res.currentTarget.dataset.url;
    uploadImageDialog.hide();
    uploadImageDialog.success(url);
  }
  page.getInfo = function () {
    wx.previewImage({
      urls: [page.data.uploadImageDialog._image],
    })
  }
  page.uploadImageDialog = uploadImageDialog;
  return uploadImageDialog;


}

















//Http发射器
function createHttpClient(page) {
  var httpClient = new Object();
  //label,page,
  httpClient.loadingMode = "",
  httpClient.isNeedUser = false;
  httpClient.codeHandlers = new Map();

  httpClient.setMode = function (loadingMode, isNeedUser) {
    httpClient.loadingMode = loadingMode,
      httpClient.isNeedUser = isNeedUser;
    return httpClient;
  }
  httpClient.addHandler = function (code, handler) {
    httpClient.codeHandlers.set(code, handler)
    return httpClient;
  }
  httpClient.send = function (url, method, args) {

    if (httpClient.isNeedUser) {
      login.getUser(function (user) {
        page.setData({
          user:user
        })

        args.userId = user.userId;
        httpClient.doSend(url, method, args);
      })
    }
    else {

      httpClient.doSend(url, method, args);
    }
    return httpClient;
  }
  httpClient.doSend = function (url, method, args) {
    if (page.httpStatus.get(url)) {
      return;
    }
    page.httpStatus.set(url, "on");

    if (httpClient.loadingMode === "label") { createLabelLoading(page).show(); }
    else if (httpClient.loadingMode === "page") { createPageLoading(page).show(); }
    else { }

    wx.request({
      url: url,
      method: method,
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: args,
      success: function (res) {
        wx.stopPullDownRefresh({
          complete: (res) => {},
        })
        if (res.statusCode === 200) {
          httpClient.resultProcess(res.data);
        }
        else {
          createTipDialog(page).show("error", "服务异常  状态码:" + res.statusCode);
        }
      },
      fail: function () {
        wx.stopPullDownRefresh({
          complete: (res) => {},
        })

        if (httpClient.loadingMode === "label") { createLabelLoadingError(page).show(); }
        else if (httpClient.loadingMode === "page") { createPageLoadingError(page).show(); }
        else { }
      },
      complete: function () {
        page.httpStatus.delete(url);
        if (httpClient.loadingMode === "label") { createLabelLoading(page).hide(); }
        else if (httpClient.loadingMode === "page") { createPageLoading(page).hide(); }
        else { }
      }
    })
  }
  httpClient.resultProcess = function (data) {
    if (data._action_type === 0) {
      createDialog(page).show(data._0_title, data._0_message);
    }
    else if (data._action_type === 1) {
      createTipDialog(page).show(data._1_message_level, data._1_message);
    }
    else if (data._action_type === 2) {
      httpClient.dataSet(data._2_data_sets)
    }
    else if (data._action_type === 3) {
      httpClient.navigateResponseUrl(data._3_url, data._3_isneed_userId)
    }
    else if (data._action_type === 4) {
      httpClient.handleResponse(data._4_handler_name, data._4_data)
    }
    else {
        if (httpClient.loadingMode === "label") { createLabelLoadingError(page).show(); }
        else if (httpClient.loadingMode === "page") { createPageLoadingError(page).show(); }
        else { }
        // createTipDialog(page).show("warn", "服务端异常");
    }
  }
  httpClient.dataSet = function (datas) {
    for (var i = 0; i < datas.length; i++) {
      var key = datas[i].key;
      var data = datas[i].data;
      page.setData({
        [key]: data,
      })
    }
  }
  httpClient.navigateResponseUrl = function (pageUrl, isNeedUserId) {
    if (isNeedUserId) {
      var newUrl = pageUrl;
      login.getUser(function (user) {
        var userId = user.userId;
        if (pageUrl.indexOf("?") === -1) {
          newUrl = pageUrl + "?userId=" + userId;
        }
        else {
          newUrl = pageUrl + "&userId=" + userId;
        }
        redirect.goTo(newUrl);
      })
    }
    else {
      redirect.goTo(pageUrl);
    }
  }
  httpClient.handleResponse = function (handlerName, data) {
    var handler = httpClient.codeHandlers.get(handlerName);
    if (handler) {
      handler(data);
    }
    else {
      createDialog(page).show("请求处理", "请求响应未找到对应的处理器: 处理器名称=" + handlerName)
    }
  }
  if (!page.httpStatus) {
    page.httpStatus = new Map();
  }

  return httpClient;
}
function pageInitLoading(page){
    // 请求
    var data_url = wx.getStorageSync("page_data_url")
    wx.removeStorageSync("page_data_url");
    var data_args = wx.getStorageSync("page_data_args")
    wx.removeStorageSync("page_data_args");
    var data_isNeedUser = wx.getStorageSync("page_data_isNeedUser")
    wx.removeStorageSync("page_data_isNeedUser");



    var list_url = wx.getStorageSync("page_list_url")
    wx.removeStorageSync("page_list_url");
    var list_args = wx.getStorageSync("page_list_args")
    wx.removeStorageSync("page_list_args");
    var list_isNeedUser = wx.getStorageSync("page_list_isNeedUser")
    wx.removeStorageSync("page_list_isNeedUser");

    page.data.data_url = data_url;
    page.data.data_args = data_args;
    page.data.data_isNeedUser = data_isNeedUser; 
    page.data.data={},

    page.data.list_url = list_url;
    page.data.list_args = list_args;
    page.data.list_isNeedUser = list_isNeedUser;
    page.data.items = new Array();
    page.data.noMore = false;
    page.data.list_num = 0;

    page.onReachBottom = function(){
        page.queryListData();
    };

    page.queryListData = function(){
        var httpClient = createHttpClient(page);
        
        if (page.data.list_num === 0) 
        {
          httpClient.setMode("page", page.data.list_isNeedUser);
        } else {
          httpClient.setMode("label", page.data.list_isNeedUser);
        }

        httpClient.addHandler("success", function (data) {
          var newItems = page.data.items.concat(data);
          page.setData({
            items: newItems,
            list_num: page.data.list_num + 1
          })
          if (data.length < 30) {
            page.setData({
              noMore: true
            })
          }
        })
        page.data.list_args.page = page.data.list_num;
        httpClient.send(page.data.list_url, "GET",  page.data.list_args);
    };
    if(list_url)
    {
        page.queryListData();    
        if(data_url){
          var httpClient2 = createHttpClient(page);
          httpClient2.setMode("", data_isNeedUser);
          httpClient2.send(data_url, "GET", data_args);
        }


        
    }
    else
    {
        if (data_url) {
          var httpClient2 = createHttpClient(page);
          httpClient2.setMode("page", data_isNeedUser);
          httpClient2.send(data_url, "GET", data_args);
        }

    }

}


// 初始化頁面
function pageInit(page) {
  // 请求
  var data_url = wx.getStorageSync("page_data_url")
  wx.removeStorageSync("page_data_url");
  var data_args = wx.getStorageSync("page_data_args")
  wx.removeStorageSync("page_data_args");
  var data_isNeedUser = wx.getStorageSync("page_data_isNeedUser")
  wx.removeStorageSync("page_data_isNeedUser");



  var list_url = wx.getStorageSync("page_list_url")
  wx.removeStorageSync("page_list_url");
  var list_args = wx.getStorageSync("page_list_args")
  wx.removeStorageSync("page_list_args");
  var list_isNeedUser = wx.getStorageSync("page_list_isNeedUser")
  wx.removeStorageSync("page_list_isNeedUser");

  page.data.data_url = data_url;
  page.data.data_args = data_args;
  page.data.data_isNeedUser = data_isNeedUser;
  page.data.data = {},

    page.data.list_url = list_url;
  page.data.list_args = list_args;
  page.data.list_isNeedUser = list_isNeedUser;
  page.data.items = new Array();
  page.data.noMore = false;
  page.data.list_num = 0;

  page.onReachBottom = function () {
    page.queryListData();
  };

  page.queryListData = function () {
    var httpClient = createHttpClient(page);

    if (page.data.list_num === 0) {
      httpClient.setMode("page", page.data.list_isNeedUser);
    } else {
      httpClient.setMode("label", page.data.list_isNeedUser);
    }

    httpClient.addHandler("success", function (data) {
      var newItems = page.data.items.concat(data);
      page.setData({
        items: newItems,
        list_num: page.data.list_num + 1
      })
      if (data.length < 30) {
        page.setData({
          noMore: true
        })
      }
    })
    page.data.list_args.page = page.data.list_num;
    httpClient.send(page.data.list_url, "GET", page.data.list_args);
  };
  if (list_url) {
    page.queryListData();
    if (data_url) {
      var httpClient2 = createHttpClient(page);
      httpClient2.setMode("", data_isNeedUser);
      httpClient2.send(data_url, "GET", data_args);
    }



  }
  else {
    if (data_url) {
      var httpClient2 = createHttpClient(page);
      httpClient2.setMode("page", data_isNeedUser);
      httpClient2.send(data_url, "GET", data_args);
    }

  }

}














module.exports = { createDialog,createEditPkDialog,createPkTipDialog,uploadImages3,createPayDialog,createShowPkDialog, createUpdatePkDialog,pageInit, pageInitLoading, createHttpClient, createTipDialog, createDownloadImageDialog, createUploadImageDialog, createShortTextDialog, createEditNumberDialog, createOperateDialog, createPageLoading, createPageLoadingError, createLabelLoading, createLabelLoadingSuccess, createLabelLoadingError, createSelectionDialog, createEditImageDialog, createEditTextDialog }









