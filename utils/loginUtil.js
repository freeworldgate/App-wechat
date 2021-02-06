var request = require('./request.js');
var tip = require('./tipUtil.js');
var redirect = require('./request.js');




var getUserId = () => {
  var userId = wx.getStorageSync("userId");
  var userTel = wx.getStorageSync("userTel");
  if (userTel.length < 1 || userId.length < 1) {
          wx.login({
            success: function (res) {
                if (res.code) {
                    wx.navigateTo({
                      url: '/pages/login/login/login?code=' + res.code,
                    })
                    return;
                }
                tip.showTip("登录失败");
                return;
            },
            fail: function () {
                tip.showTip("登录失败");
                return;
            }
          })
          return ;
  }
  return userId;
}

var getUserIdWithBack = () => {
  var userId = wx.getStorageSync("userId");
  if (!userId) {
    wx.navigateBack({})
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.navigateTo({
            url: '/pages/login/login/login?code=' + res.code,
          })
          return;
        }
        tip.showTip("登录失败");
        return;
      },
      fail: function () {
        tip.showTip("登录失败");
        return;
      }
    })
    return;
  }
  return userId;
}

var getUser = (success) =>{
  var user = wx.getStorageSync("user");

  if(!user){
      // 跳转登录页面
      tip.showContentTip("登陆中...");
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.navigateTo({
              url: '/pages/user/login/login?code=' + res.code,
            })
            return;
          }
          tip.showTip("登录失败");

        },
        fail: function () {
          tip.showTip("登录失败");

        }
      })
  }
  else{
    success(user);
  }

}




module.exports = { getUserId, getUserIdWithBack, getUser}