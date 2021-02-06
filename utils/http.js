var request = require('./request.js')

function createSubmit(urlReq,methodReq) {
    var submit = new Object();
    submit.url = urlReq;
    submit.param = {};
    submit.handlers = new Map();


    submit.success = function(data){};
    submit.error = function(){};
    submit.complet = function(){};


    submit.setParam = function(key,value){
      this.param[key] = value;
    };
    submit.setHandler = function(code,handler){this.handlers.set(code,handler);};
    submit.setError = function (erroHandler) { this.error = erroHandler}
    submit.setSuccess = function (successHandler) { this.success = successHandler }
    submit.setComplet = function (completHandler) { this.complet = completHandler}
    submit.submit = function(){
        var that = this;
        wx.request({
          url: that.url,
          method:methodReq,
          data: that.param,
          success:function(res){
            console.log("错误码处理集合:",that.handlers);
            if (res.data.code === request.value.success) {
              that.success(res.data.data);
              return;
            }
            for (var [key, value] of that.handlers) {
              if (res.data.code === key){
                   value(res.data.data);
                   return; 
                }
            }
            that.error();
          },
          fail:function(){
            that.error();
          },
          complete:function(){
            that.complet();
          }
        })
    }
  return submit;
}

module.exports = { createSubmit }









