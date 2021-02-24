//  var host = 'https://www.211shopper.com'; 
// var host = 'http://192.168.2.245:8080'; 
var host = 'http://192.168.43.67:8080'; 

// 上传图片接口 
var uploadUrl = 'https://oss.211shopper.com'; 

var appinfo = { 
    appName:'APP1号', 
}; 
     
var value = { 
        success: '0x03000000', 
        nouser:'0x03001001', 
        wrongVCode:'0x03001002', 
    }; 
 
var url = { 
 



        createPost: `${host}/pk/createPost`, 
        queryPk: `${host}/pk/queryPk`, 
        queryUserPost: `${host}/pk/queryUserPost`, 
        nextPage: `${host}/pk/nextPage`, 
        queryPost: `${host}/pk/queryPost`, 
        queryHomePage: `${host}/pk/queryHomePage`, 
        nextHomePage: `${host}/pk/nextHomePage`, 
        queryInvites: `${host}/pk/queryInvites`, 
        queryInvite: `${host}/pk/queryInvite`, 
        unlock: `${host}/pk/unlock`, 
        nextInvitePage: `${host}/pk/nextInvitePage`, 
        addUserInvite: `${host}/pk/addUserInvite`, 
        userPks: `${host}/pk/userPks`, 
        nextUserPks: `${host}/pk/nextUserPks`, 
        viewGroupCode: `${host}/pk/viewGroupCode`, 

        userPublishPosts: `${host}/pk/userPublishPosts`, 
        nextUserPublishPosts: `${host}/pk/nextUserPublishPosts`, 
        hiddenPost:`${host}/pk/hiddenPost`,

        topPost:`${host}/pk/topPost`, 
        setTopPostTime:`${host}/pk/setTopPostTime`, 
  
        collectPk:`${host}/pk/collectPk`, 
        
        
        // 打卡应用
        
        removePost:`${host}/pk/removePost`, 
        hiddenPost:`${host}/pk/hiddenPost`, 
        queryPkImages:`${host}/pk/queryPkImages`, 
        uploadPkImages:`${host}/pk/uploadPkImages`, 
        nextPkImagePage:`${host}/pk/nextPkImagePage`, 
        queryApprovingPkImages:`${host}/pk/queryApprovingPkImages`, 
        nextPkApprovingImagePage:`${host}/pk/nextPkApprovingImagePage`, 
        queryFollowUsers:`${host}/pk/queryFollowUsers`,
        nextFollowUsers:`${host}/pk/nextFollowUsers`,
        followUser:`${host}/pk/followUser`,
        cancelFollow:`${host}/pk/cancelFollow`,
        nextFansUsers:`${host}/pk/nextFansUsers`,
        queryFansUsers:`${host}/pk/queryFansUsers`,
        queryHiddenPost:`${host}/pk/queryHiddenPost`,
        nextHiddenPage:`${host}/pk/nextHiddenPage`,
        queryUserFind:`${host}/pk/queryUserFind`,
        saveUserPkFind:`${host}/pk/saveUserPkFind`,
        startUserPkFind:`${host}/pk/startUserPkFind`,
        pay:`${host}/pk/pay`,

        giveUpUserPkFind:`${host}/pk/giveUpUserPkFind`,
        queryApprovingFinds:`${host}/pk/queryApprovingFinds`,
        nextApprovingFinds:`${host}/pk/nextApprovingFinds`,
        passFindUser:`${host}/pk/passFindUser`,
        queryPkFinds:`${host}/pk/queryPkFinds`,
        clearUserFind:`${host}/pk/clearUserFind`,
        queryUserCard:`${host}/pk/queryUserCard`,
        setUserCard:`${host}/pk/setUserCard`,
        userCardApply:`${host}/pk/userCardApply`,
        queryUserCardApplys:`${host}/pk/queryUserCardApplys`,
        nextUserCardApplys:`${host}/pk/nextUserCardApplys`,

        queryActiveTips:`${host}/pk/queryActiveTips`,
        deletePkImages:`${host}/pk/deletePkImages`,
        setPkBack:`${host}/pk/setPkBack`,
        agreePkImage:`${host}/pk/agreePkImage`,
        removeFromHiddenPosts:`${host}/pk/removeFromHiddenPosts`,
        deleteApply:`${host}/pk/deleteApply`,
        changeLock:`${host}/pk/changeLock`,
        changeSign:`${host}/pk/changeSign`,
        querySingleFind:`${host}/pk/querySingleFind`,
        queryPkSorts:`${host}/pk/queryPkSorts`,
        nextPkSorts:`${host}/pk/nextPkSorts`,
        queryPkGroups:`${host}/pk/queryPkGroups`,
        queryUserGroup:`${host}/pk/queryUserGroup`,
        createGroup:`${host}/pk/createGroup`,
        queryGroupLength:`${host}/pk/queryGroupLength`,
        updateGroup:`${host}/pk/updateGroup`,
        cancelGroup:`${host}/pk/cancelGroup`,
        searchPk:`${host}/pk/searchPk`, 
        buildPk:`${host}/pk/buildPk`, 
        
        queryLengthTime:`${host}/pk/queryLengthTime`, 
        queryMyFinds:`${host}/pk/queryMyFinds`,
        nextMyFinds:`${host}/pk/nextMyFinds`,
        queryMyGroups:`${host}/pk/queryMyGroups`,
        nextMyGroups:`${host}/pk/nextMyGroups`,
        queryMyUnlockGroups:`${host}/pk/queryMyUnlockGroups`,
        queryMyUnlockPkGroups:`${host}/pk/queryMyUnlockPkGroups`,
        nextMyUnlockGroups:`${host}/pk/nextMyUnlockGroups`,
        nextMyUnlockPkGroups:`${host}/pk/nextMyUnlockPkGroups`,
        unLockGroup:`${host}/pk/unLockGroup`,
        queryUserPkPosts:`${host}/pk/queryUserPkPosts`,
        nextUserPkPost:`${host}/pk/nextUserPkPost`,
        setPkTips:`${host}/pk/setPkTips`,
        queryTextBacks:`${host}/pk/queryTextBacks`,
        updateUserBack:`${host}/pk/updateUserBack`,
        queryPkCode:`${host}/pk/queryPkCode`,
        showInfo:`${host}/pk/showInfo`, 
        activeAgine:`${host}/pk/activeAgine`, 
        addTip:`${host}/pk/addTip`, 
        removeTip:`${host}/pk/removeTip`, 
        queryTips:`${host}/pk/queryTips`, 
        setUserImg:`${host}/pk/setUserImg`, 
        setUserName:`${host}/pk/setUserName`, 
        queryGroupMembers:`${host}/pk/queryGroupMembers`, 
        nextGroupMembers:`${host}/pk/nextGroupMembers`, 
        
        payType:`${host}/pk/payType`, 
        
        paySuccess:`${host}/pk/paySuccess`, 
        setUserPkRange:`${host}/pk/setUserPkRange`, 
        


        oneTimeTask:`${host}/pk/oneTimeTask`, 
        // 登录地址，用于建立会话 
        loginUrl: `${host}/user/login`, 
        changeUser: `${host}/user/changeUser`, 
        getVCode: `${host}/user/vcode`, 
        getOssUploadUrl: `${host}/oss/getUrl`, 
        postUploadImgs: `${host}/oss/postUploadImgs`, 
 
        //获取Token Url 
        accessTokenUrl: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx3a496d6928523d69&secret=af61063e84fc1834bb55351f34fa1390', 
 
        uploadToWx: 'https://api.weixin.qq.com/cgi-bin/media/upload?&type=image&access_token=', 
 
    }; 
 
var  getRequest = (urlReq,dataParam,success,failure) =>{ 
    wx.request({ 
      url: urlReq, 
      method:'GET', 
      data:dataParam, 
      success:function(res) 
      { 
          success(res); 
      }, 
      failure:function(){ 
          failure(); 
      } 
    }) 
 
 
} 
 
 
 
 
 
module.exports = { uploadUrl,value, url, appinfo, getRequest};
