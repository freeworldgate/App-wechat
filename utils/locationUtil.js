var request = require('./request.js');
var tip = require('./tipUtil.js');
var redirect = require('./request.js');


var locationChange = (success) =>{
  wx.getSetting({
    success: (res) => {
      console.log(JSON.stringify(res))
      // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
      // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
      // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
      if (res.authSetting['scope.userLocationBackground'] != undefined && res.authSetting['scope.userLocationBackground'] != true) {
        wx.showModal({
          title: '请求授权当前位置',
          content: '需要获取您的地理位置，请确认授权',
          success: function (res) {
            if (res.cancel) {
              wx.showToast({
                title: '拒绝授权',
                icon: 'none',
                duration: 1000
              })
            } else if (res.confirm) {
              wx.openSetting({
                success: function (dataAu) {
                  if (dataAu.authSetting["scope.userLocationBackground"] == true) {
                    wx.showToast({
                      title: '授权成功',
                      icon: 'success',
                      duration: 1000
                    })
                    //再次授权，调用wx.getLocation的API
                    startlocationChange(success);
                  } else {
                    wx.showToast({
                      title: '授权失败',
                      icon: 'none',
                      duration: 1000
                    })
                  }
                }
              })
            }
          }
        })
      } else if (res.authSetting['scope.userLocationBackground'] == undefined) {
        //调用wx.getLocation的API
        startlocationChange(success);
      }
      else {
        //调用wx.getLocation的API
        startlocationChange(success);
      }
    }
  })




}
var getLocationWithCity = (success) => {

  wx.getSetting({
    success: (res) => {
      console.log(JSON.stringify(res))
      // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
      // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
      // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
      if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
        wx.showModal({
          title: '请求授权当前位置',
          content: '需要获取您的地理位置，请确认授权',
          success: function (res) {
            if (res.cancel) {
              wx.showToast({
                title: '拒绝授权',
                icon: 'none',
                duration: 1000
              })
            } else if (res.confirm) {
              wx.openSetting({
                success: function (dataAu) {
                  if (dataAu.authSetting["scope.userLocation"] == true) {
                    wx.showToast({
                      title: '授权成功',
                      icon: 'success',
                      duration: 1000
                    })
                    //再次授权，调用wx.getLocation的API
                    getWxLocationWithCity(success);
                  } else {
                    wx.showToast({
                      title: '授权失败',
                      icon: 'none',
                      duration: 1000
                    })
                  }
                }
              })
            }
          }
        })
      } else if (res.authSetting['scope.userLocation'] == undefined) {
        //调用wx.getLocation的API
        getWxLocationWithCity(success);
      }
      else {
        //调用wx.getLocation的API
        getWxLocationWithCity(success);
      }
    }
  })


}
var getWxLocationWithCity = (success) => {


  wx.getLocation({
    type: 'gcj02',
    success: function (res) {
      let latitude = res.latitude
      let longitude = res.longitude
      console.log("定位:",res);
      success(latitude,longitude);
    },
    fail: function (res) {
      console.log('fail' + JSON.stringify(res))
    }
  })




}
var getLocation = (success) => {

  wx.getSetting({
    success: (res) => {
      console.log(JSON.stringify(res))
      // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
      // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
      // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
      if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
        wx.showModal({
          title: '请求授权当前位置',
          content: '需要获取您的地理位置，请确认授权',
          success: function (res) {
            if (res.cancel) {
              wx.showToast({
                title: '拒绝授权',
                icon: 'none',
                duration: 1000
              })
            } else if (res.confirm) {
              wx.openSetting({
                success: function (dataAu) {
                  if (dataAu.authSetting["scope.userLocation"] == true) {
                    wx.showToast({
                      title: '授权成功',
                      icon: 'success',
                      duration: 1000
                    })
                    //再次授权，调用wx.getLocation的API
                    getWxLocation(success);
                  } else {
                    wx.showToast({
                      title: '授权失败',
                      icon: 'none',
                      duration: 1000
                    })
                  }
                }
              })
            }
          }
        })
      } else if (res.authSetting['scope.userLocation'] == undefined) {
        //调用wx.getLocation的API
        getWxLocation(success);
      }
      else {
        //调用wx.getLocation的API
        getWxLocation(success);
      }
    }
  })


}

var startlocationChange = (success) => {

  wx.startLocationUpdate({
    success() {
      wx.onLocationChange(function(res) {
        success(res);
        // console.log('location change', res)
      })
    },
    fail(res) {
      console.log('开启后台定位失败', res)
    }
  })




}


var getWxLocation = (success) => {


    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        let latitude = res.latitude
        let longitude = res.longitude
        success(latitude,longitude);
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })




}

var getDistance = (lat1,lng1,lat2,lng2) => {
  var radLat1 = lat1*Math.PI / 180.0;
  var radLat2 = lat2*Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1*Math.PI / 180.0 - lng2*Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
  Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
  s = s *6378.137 ;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  console.log("计算距离:",s);

  if(s>1){
    return s.toFixed(1);
  }
  else if(s >0.001)
  {
    return s.toFixed(3);
  }
  else{
    return 0.001;
  }


}


module.exports = { getLocation,getLocationWithCity,locationChange,getDistance}