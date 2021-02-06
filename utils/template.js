var request = require('./request.js')
var http = require('./http.js')
var tip = require('./tipUtil.js')
var login = require('./loginUtil.js')
var route = require('./route.js')
var redirect = require('./redirect.js')
var uuid = require('./uuid.js')
var inviteReq = require('./invite.js')
var userInvite = require('./userInvite.js')
var upload = require('./uploadFile.js')


// 反饋框
function createDialog(page) {
  if(page.dialog)
  {
    return page.dialog;
  }
  var dialog = new Object();
  dialog.visible = false;
  dialog.title = "",
  dialog.text = "",
  dialog.show = function(title,text){
      page.setData({
        'dialog.title' : title,
        'dialog.text' :text,
        'dialog.visible':true,
      })
  }
  dialog.hide = function () {
    page.setData({
      'dialog.visible': false,
    })
  }
  page.dialog = dialog;
  page.dialog_confirm = function(){
    dialog.hide();
  }
  return dialog;
}
// info  warning  error
function createTipDialog(page){
      if (page.tipDialog) {
        return page.tipDialog;
      }
      var tipDialog = new Object();
      tipDialog.visible = false;
      tipDialog.show = function (level,message) {
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
  if (page.operateDialog) {
    return page.operateDialog;
  }
  var operateDialog = new Object();
  operateDialog.visible = false;
  operateDialog.title = "",
  operateDialog.text = "",
  operateDialog.statu = 0;
  operateDialog.confirm = function(){};
  operateDialog.cancel = function(){};

  operateDialog.show = function (title, text,confirm,cancel) {
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
        'operateDialog.visible': false,
     })
     page.operateDialog = undefined;
   }
  page.operateDialog_confirm = function () {
    if(!operateDialog.statu === 0){
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
  page.operateDialog = operateDialog;
  return operateDialog;
}
//2秒钟信息显示框
function showTip(text){
  wx.showToast({
    title: text,
  })
}
//中间位置 图片展示框(可以下载并保存图片)
function createImageShowDialog(page){};
//编辑图片和文字窗口
function createEditMessageDialog(page){};
//图片集合
function createImageListDialog(page){
 };
// 选择框
function createSelectionDialog(page) { 
    if (page.selectionDialog) {
      return page.selectionDialog;
    }
    var selectionDialog = new Object();
    selectionDialog.visible = false;
    selectionDialog.style=0;
    selectionDialog._selectionDialog_layout = 'css selectionDialog_bottom'; 
    selectionDialog.items = new Array();
    selectionDialog.itemSelect = new Map();
    selectionDialog.statu = 0;
    selectionDialog.setLayout = function(location,direction){
        selectionDialog.items.length = 0;
        selectionDialog.itemSelect.clear();
        if(direction === 'x' && location==='top')
        {
          selectionDialog._selectionDialog_layout = 'css selectionDialog_top'; 
          selectionDialog.style = 5;
        }
        else if (direction === 'y' && location === 'top')
        {
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
        else if (direction === 'x' && location === 'bottom'){
          selectionDialog._selectionDialog_layout = 'css selectionDialog_bottom'; 
          selectionDialog.style = 1;
        }
        else { 
          selectionDialog._selectionDialog_layout = 'css selectionDialog_bottom'; 
          selectionDialog.style = 0;
        }

        return selectionDialog;
    
    }

    selectionDialog.addItem = function(tabIcon,tabName,select){
        var item = new Object();
        item.icon = tabIcon;
        item.name = tabName;
        selectionDialog.items.push(item);
        selectionDialog.itemSelect.set(tabName,select);
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
    page._selectionDialog_hide = function(){
        page.setData({
          'selectionDialog.visible': false,
        })
     }
    page._selectDialog_choose = function(res){
      if(page.selectionDialog.statu === 0){
          page.selectionDialog.statu = 1;
          var name = res.currentTarget.dataset.name;
          var select = selectionDialog.itemSelect.get(name);
          select();
          setTimeout(function(){
              page.selectionDialog.statu = 0
          },600)
      }
     }
    return selectionDialog;
};
function createPageLoading(page){
      if (page.pageLoadingDialog) {
          return page.pageLoadingDialog;
      }
     var pageLoadingDialog = new Object();
     pageLoadingDialog.visible = false;
     pageLoadingDialog.text = "",
     pageLoadingDialog.show = function (text) {
          page.setData({
            'pageLoadingDialog.text': text,
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
function createPageLoadingError(page){
    if (page.pageLoadingDialogError) {
      return page.pageLoadingDialogError;
    }
    var pageLoadingDialogError = new Object();
    pageLoadingDialogError.visible = false;
    pageLoadingDialogError.text = "",
      pageLoadingDialogError.show = function (text) {
          page.setData({
            'pageLoadingDialogError.text': text,
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
        setTimeout(function(){
          page.setData({
            'labelLoadingDialogError.visible': false,
          })
        },1000)
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
function createEditImageDialog(page){
        if (page.editImageDialog) {
          return page.editImageDialog;
        }
        var editImageDialog = new Object();

        editImageDialog.width = (wx.getSystemInfoSync().windowWidth - 20 - 10) / 3.0;
        editImageDialog.success = function(){}

        editImageDialog.setDialog = function(_dialog_title,_default_edit_text,_max_images,success){
          editImageDialog.success = success;

          //初始化
          page.setData({
              'editImageDialog.images': new Array(),
              'editImageDialog.statu': 0,
              'editImageDialog.uploadIndex': 0,
              'editImageDialog.dialogHeight':95,
              'editImageDialog.text': '',
              'editImageDialog.width': editImageDialog.width,
              'editImageDialog._dialog_title': _dialog_title,
              'editImageDialog._default_edit_text': _default_edit_text,
              'editImageDialog._max_images': _max_images,
              'editImageDialog.visible': false,
          })

          return editImageDialog;
        }

        editImageDialog.show = function(){
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
                editImageDialog.images = page.data.editImageDialog.images.concat(res.tempFilePaths);
                page.setData({
                  'editImageDialog.images': editImageDialog.images,
                  'editImageDialog.visible': true,
                })
              },
            })
        }
        editImageDialog.hide = function () {
          page.setData({'editImageDialog.dialogHeight': 90,})
          for (var i = 0; i < 1000; i++) {}
          page.setData({ 'editImageDialog.dialogHeight': 70, }) 
          for (var i = 0; i < 1000; i++) { }
          page.setData({ 'editImageDialog.dialogHeight': 50, })
          for (var i = 0; i < 1000; i++) { }
          page.setData({ 'editImageDialog.dialogHeight': 30, })
          for (var i = 0; i < 1000; i++) { }
          page.setData({ 'editImageDialog.dialogHeight': 10, })
          for (var i = 0; i < 1000; i++) { }
          page.setData({ 'editImageDialog.dialogHeight': 0, })
            page.setData({
              'editImageDialog.images': [],
              'editImageDialog.text': "",
              'editImageDialog.visible': false,
            })
            page.editImageDialog = undefined;
        }
        //-----------------------------page---------------------------------------

        page.editImageDialog = editImageDialog;
        
        page._editImageDialog_selectImgs = function() {
          if (page.data.editImageDialog.statu != 0) {
            return;
          }
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
        page._editImageDialog_confirm =  function() {

          if (page.data.editImageDialog.statu != 0) {
              return;
          }
          else {
              //confirm使用状态
              page.setData({
                'editImageDialog.statu': 1,
              })
          }

          // createLabelLoading(page).show();
          login.getUser(function(user){
                upload.uploadImages2(user.userId, "userUpload", page.data.editImageDialog.images, page,
                  function (index, url) {
                    if (page.data.editImageDialog.statu === 0) {
                      //已经被取消发布
                      return;
                    }
                    page.setData({
                      'editImageDialog.uploadIndex': index,
                    });
                  },
                  function (urls) {
                    console.log("图片集合", urls);
                    if (page.data.editImageDialog.statu === 0) {
                      //已经被取消发布
                      return;
                    }
                    //TODO 发送消息给后台，统计上传成功

                    page.editImageDialog.success(page.data.editImageDialog.text, urls);
                    // createLabelLoading(page).hide();
                    // createLabelLoadingSuccess(page).show();
                  },
                  function () {
                    //可以使用Http消息记录上传失败统计失败率

                    //TODO 发送消息给后台，统计上传失败
                    // createLabelLoading(page).hide();
                    // createLabelLoadingError(page).show();
                    showTip("发布失败......");
                    page.setData({
                      'editImageDialog.statu': 0,
                      'editImageDialog.uploadIndex': 0
                    })

                  });
          })
        };
        page._editImageDialog_cancelUpload = function(){
            page.setData({
              'editImageDialog.statu': 0,
              'editImageDialog.uploadIndex': 0
            })
            tip.showContentTip("上传终止")
        }
        page._editImageDialog_remove = function (res) {

          if (page.data.editImageDialog.statu != 0) {
            return;
          }
          var index = parseInt(res.currentTarget.dataset.index);
          page.data.editImageDialog.images.splice(index, 1);

          page.setData({
            'editImageDialog.images': page.data.editImageDialog.images,
          })
        };
        page._editImageDialog_input = function (res) {
          var value = res.detail.value;
          page.data.editImageDialog.text = value;
        };
        page._editImageDialog_closeEdit = function() {

          if (page.data.editImageDialog.statu != 0) {
            return;
          }
          page.editImageDialog.hide();
        };
        return editImageDialog;

 }


























































































//文本编辑的窗口
function createEditTextDialog(page){
    if(page.editTextDialog){
      return page.editTextDialog;
    }
    var editTextDialog = new Object();
    editTextDialog._confirm = function(){}


    editTextDialog.show = function (_title, _placeholder,_max_length,_confirm){
        editTextDialog._confirm = _confirm;
        page.setData({
          "editTextDialog.title": _title,
          "editTextDialog.placeholder": _placeholder,
          "editTextDialog.maxLength": _max_length,
          "editTextDialog.text": '',
          "editTextDialog.visible": true
        })

    }
    editTextDialog.hide = function () {
      page.setData({
        "editTextDialog.visible": false,
         'editTextDialog.title' :  '编辑',
         'editTextDialog.placeholder' : '编辑',
         'editTextDialog.maxLength' : 20,
         'editTextDialog.text' : "",
      })

    }


    page._editTextDialog_close = function(){
      page.editTextDialog.hide();
    }
    page._editTextDialog_input = function(res){
        var value = res.detail.value;
      if (value.length > page.data.editTextDialog.maxLength){
          showTip("内容超出长度");
          // return;
        }
        page.setData({
            'editTextDialog.text':value
        })
    } 
    page._editTextDialog_confirm = function () {
        var tempText = page.data.editTextDialog.text
        if (tempText.length > page.data.editTextDialog.maxLength){
            showTip("内容超出长度");
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
  shortTextDialog.show = function (title, maxLength, confirm) {
    shortTextDialog.confirm = confirm;
    page.setData({
      'shortTextDialog.maxLength': maxLength,
      "shortTextDialog.title": title,
      "shortTextDialog.text": '',
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
  editNumberDialog.confirm = function(){}
  editNumberDialog.show = function (title,maxLength,confirm) {
    editNumberDialog.confirm = confirm;
    page.setData({
      'editNumberDialog.maxLength':maxLength,
      "editNumberDialog.title":title,
      "editNumberDialog.text": '',
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
    if (page.data.editNumberDialog.text.length === 0){
        return;
    }
    var value = page.data.editNumberDialog.text;
    page.editNumberDialog.confirm(value);
    page.editNumberDialog.hide();
  }
  page._editNumberDialog_input = function(res){
    var value = res.detail.value;
    page.setData({
      "editNumberDialog.text": value,
    })
  }
  page.editNumberDialog = editNumberDialog;
  return editNumberDialog;
}

//可下载的图片
function createDownloadImageDialog(page){
  if (page.downloadImageDialog) {
    return page.downloadImageDialog;
    }
    var downloadImageDialog = new Object();

    downloadImageDialog.show = function (title,subTitle,imageUrl) {
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
    page._downloadImageDialog_save = function(res){
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
    page.getInfo = function(){
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

//Http发射器
function createHttpClient(page)
{
    var httpClient = new Object();
    //label,page,
    httpClient.loadingMode = "",
    httpClient.isNeedUser = false;
    httpClient.codeHandlers = new Map();

    httpClient.setMode = function(loadingMode,isNeedUser){
        httpClient.loadingMode = loadingMode,
        httpClient.isNeedUser = isNeedUser;
        return httpClient;
    }
    httpClient.addHandler = function(code,handler){
      httpClient.codeHandlers.set(code,handler)
      return httpClient;  
    }
    httpClient.send = function(url,method,args)
    {
        if (page.httpStatus.get(url))
        {
            return ;
        }
        page.httpStatus.set(url,"on");
        if(httpClient.isNeedUser)
        {
            login.getUser(function(user){
              args.userId = user.userId;
              httpClient.doSend(url, method, args);
            })
        }
        else
        {
            httpClient.doSend(url, method, args);
        }
        return httpClient;
    }
    httpClient.doSend = function (url, method, args){
        if (httpClient.loadingMode === "label") { createLabelLoading(page).show(); }
        else if (httpClient.loadingMode === "page") { createPageLoading(page).show(); }
        else {}

        wx.request({
          url: url,
          method: method,
          header: {
            'content-type': 'application/json' // 默认值
          },
          data: args,
          success: function (res) {
              if(res.statusCode === 200)
              {
                  httpClient.resultProcess(res.data);
              }
              else
              {
                  createTipDialog(page).show("error","服务异常  状态码:" + res.statusCode);
              }
          },
          fail: function () {
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
    httpClient.resultProcess = function(data){
      if(data._action_type === 0)
      {
         createDialog(page).show(data._0_title, data._0_message);
      } 
      else if (data._action_type === 1)
      {
        createTipDialog(page).show(data._1_message_level,data._1_message);
      } 
      else if (data._action_type === 2)
      {
          httpClient.dataSet(data._2_data_sets)
      } 
      else if (data._action_type === 3)
      {
          httpClient.navigateResponseUrl(data._3_url, data._3_isneed_userId)
      } 
      else if (data._action_type === 4) 
      {
        httpClient.handleResponse(data._4_handler_name, data._4_data)
      }
      else
      {
           createTipDialog(page).show("warn","服务端异常");
      }
    }
    httpClient.dataSet = function(datas){
        for(var i = 0; i < datas.length; i++)
        {
            var key = datas[i].key;
            var data = datas[i].data;
            page.setData({
              [key]:data,
            })
        }
    }
    httpClient.navigateResponseUrl = function(page,isNeedUserId){
        if(isNeedUserId)
        {
          var newUrl = page;
              login.getUser(function(user){
                  var userId = user.userId;
                  if(page.indexOf("?") === -1){
                    newUrl = page + "?userId=" + userId;
                  } 
                  else
                  {
                    newUrl = page + "&userId=" + userId;
                  }
                  redirect.goTo(newUrl);
              })
        }
        else
        {
          redirect.goTo(page);
        }
    }
    httpClient.handleResponse = function(handlerName,data){
        var handler = httpClient.codeHandlers.get(handlerName);
        if(handler)
        {
            handler(data);
        }
        else
        {
            createDialog(page).show("请求处理","请求响应未找到对应的处理器: 处理器名称=" + handlerName)
        }
    }
    if(!page.httpStatus){
      page.httpStatus = new Map();
    }

    return httpClient;
}





//页面加固


































module.exports = { createDialog, createHttpClient, createTipDialog,createDownloadImageDialog,createShortTextDialog, createEditNumberDialog, createOperateDialog, createPageLoading, createPageLoadingError, createLabelLoading, createLabelLoadingSuccess, createLabelLoadingError, createSelectionDialog, createEditImageDialog, createEditTextDialog }









