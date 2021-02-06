var request = require('./request.js');
var tip = require('./tipUtil.js');
var redirect = require('./request.js');
var http = require('./http.js');



var queryUserInviteOrder = (inviteId, userId, success, fail) => {
  wx.showLoading({
    title: '请求中...',
  })
  var httpClient = http.createSubmit(request.url.queryUserInviteOrder, "GET");
  httpClient.setParam("inviteId", inviteId);
  httpClient.setParam("userId", userId);

  httpClient.setSuccess(function (data) {
    tip.showContentTip("查询成功...");
    success(data)
  });
  httpClient.setError(function () {
    tip.showContentTip("请求失败...");
  });
  httpClient.setComplet(function () {
    wx.hideLoading();

  });
  httpClient.submit()
}

var queryUserInviteAlbum = (inviteId, userId, success, fail) => {
  var httpClient = http.createSubmit(request.url.queryUserInviteAlbum, "GET");
  httpClient.setParam("inviteId", inviteId);
  httpClient.setParam("userId", userId);
  httpClient.setSuccess(function (data) {
    success(data);
  });
  httpClient.setError(function () {
    fail();
  });
  httpClient.submit();
}



var uploadUserInviteAlbum = (userId, inviteId, text, urls, successCallBack, failCallBack) =>{
  var httpClient = http.createSubmit(request.url.uploadUserInviteAlbum, "POST");
    httpClient.setParam("inviteId", inviteId);
    httpClient.setParam("userId", userId);
    httpClient.setParam("text", text);
    httpClient.setParam("urls", urls);
    httpClient.setSuccess(function () {
      successCallBack();
    });
    httpClient.setError(function () {
      failCallBack();
    });
    httpClient.submit();








}









module.exports = { queryUserInviteOrder, queryUserInviteAlbum, uploadUserInviteAlbum}