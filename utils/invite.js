var request = require('./request.js');
var tip = require('./tipUtil.js');
var redirect = require('./request.js');
var http = require('./http.js');

// 查询联谊地点
var getHeight = (func) =>{
  var globalData = {}
  wx.getSystemInfo({
    success: (res) => {
      let totalTopHeight = 68
      if (res.model.indexOf('iPhone X') !== -1) {
        totalTopHeight = 88
      } else if (res.model.indexOf('iPhone') !== -1) {
        totalTopHeight = 64
      }
      globalData.statusBarHeight = res.statusBarHeight
      globalData.titleBarHeight = totalTopHeight - res.statusBarHeight
      func(globalData);
    },

    fail: () => {
      globalData.statusBarHeight = 20
      globalData.titleBarHeight = 44
      func(globalData);
    }

  })




}









module.exports = { getHeight}