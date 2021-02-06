


var showTip = (tip) =>{
    wx.showToast({
      title: tip,
      icon:'success',
    })
};

var showContentTip = (tip) => {
  wx.showToast({
    title: tip,
    icon:'none',
    duration:3000
  })
}

var showLoading = (tiptitle) =>{
    wx.showLoading({
      title: tiptitle,
    })
}


module.exports = { showTip, showContentTip, showLoading}











