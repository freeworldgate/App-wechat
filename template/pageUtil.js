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

// 浏览记录  页面
function  openViewers(id){
  wx.setStorageSync("page_list_url", request.url.viewers)
  wx.setStorageSync("page_list_args", { id: id })
  wx.setStorageSync("page_list_isNeedUser", false)
  redirect.goTo("/pages/common/viewers/viewers");
}
// 分享记录  页面
function openSharers(id) {
  wx.setStorageSync("page_list_url", request.url.sharers)
  wx.setStorageSync("page_list_args", { id: id })
  wx.setStorageSync("page_list_isNeedUser", false)
  redirect.goTo("/pages/common/sharers/sharers");
}

// 点赞记录  页面
function openComplimentors(id) {
  wx.setStorageSync("page_list_url", request.url.greaters)
  wx.setStorageSync("page_list_args", { id: id })
  wx.setStorageSync("page_list_isNeedUser", false)
  redirect.goTo("/pages/common/complimentor/complimentor");
}



module.exports = { openViewers, openSharers, openComplimentors}