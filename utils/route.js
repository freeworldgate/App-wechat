// 页面跳转
var login = require('./loginUtil.js');
var redirect = require('./redirect.js');

var inUserRoom = (userId) => {
  redirect.goTo("/pages/room/user/userRoom?userId="+userId);
};
var inSelfRoom = () => {
  var userId = login.getUserId();
  if (!userId) {
    return;
  }
  redirect.goTo("/pages/room/self/selfRoom");
}



module.exports = { inUserRoom, inSelfRoom }








