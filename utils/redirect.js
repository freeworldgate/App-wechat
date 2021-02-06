// 页面跳转
var login = require('./loginUtil.js')



var goTo = (path) =>{
    wx.navigateTo({
      url:path
    })
};

var goBackPage = (page) => {
  wx.navigateBack({
    delta:page,
  })
};

var goBack = () => {
  wx.navigateBack({
  })
};



module.exports = { goTo, goBackPage, goBack }








