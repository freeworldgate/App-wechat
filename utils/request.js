 var host = 'https://www.211shopper.com'; 
// var host = 'http://192.168.2.245:8080'; 
// var host = 'http://192.168.43.67:8080'; 

// 上传图片接口 
var uploadUrl = 'https://oss.211shopper.com'; 
 
var tipBack = ''; 
var tipImg = '/images/pk.png'; 

var appinfo = { 
    appName:'APP1号', 
}; 
     
var value = { 
        success: '0x03000000', 
        nouser:'0x03001001', 
        wrongVCode:'0x03001002', 
    }; 
 
var url = { 
 
        shareMenu: `${host}/pk/shareMenu`, 
        click: `${host}/pk/click`, 
        zoneRefresh: `${host}/pk/zoneRefresh`, 
        addPost: `${host}/pk/addPost`, 
        createPost: `${host}/pk/createPost`, 
        queryPk: `${host}/pk/queryPk`, 
        queryUserPost: `${host}/pk/queryUserPost`, 
        nextPage: `${host}/pk/nextPage`, 
        queryPost: `${host}/pk/queryPost`, 
        uploadFront: `${host}/pk/uploadFront`, 
        deleteImg: `${host}/pk/deleteImg`, 
        likeOrDisLike: `${host}/pk/likeOrDisLike`, 
        deletePostImg: `${host}/pk/deletePostImg`, 
        uploadPostImgs: `${host}/pk/uploadPostImgs`, 
        showShareMenu: `${host}/pk/showShareMenu`, 
        uploadFeeCode: `${host}/pk/uploadFeeCode`, 
   
        setFeeCode: `${host}/pk/setFeeCode`, 

        setPhone: `${host}/pk/setPhone`, 
        setOrderCut: `${host}/pk/setOrderCut`, 
        orderConfirm: `${host}/pk/orderConfirm`, 
        feeOrder: `${host}/pk/feeOrder`, 
        cashierOrderConfirm: `${host}/pk/cashierOrderConfirm`, 
 
        approveOrderConfirm1: `${host}/pk/approveOrderConfirm1`, 
        approveOrderConfirm2: `${host}/pk/approveOrderConfirm2`, 
        payOrder: `${host}/pk/payOrder`, 
        queryCreateOrder: `${host}/pk/queryCreateOrder`, 
        approveUserCode: `${host}/pk/approveUserCode`, 
        postApprove: `${host}/pk/postApprove`, 
        postConfirm: `${host}/pk/postConfirm`, 
        queryPostById: `${host}/pk/queryPostById`, 
        queryTasks: `${host}/pk/queryTasks`, 
        userIntegral: `${host}/pk/userIntegral`, 
        queryPkStatu: `${host}/pk/queryPkStatu`, 
         
        rewardOrder: `${host}/pk/rewardOrder`, 
        verifyOrder: `${host}/pk/verifyOrder`, 
        orderConfirmOutOfTime: `${host}/pk/orderConfirmOutOfTime`, 
        queryTaskOrder: `${host}/pk/queryTaskOrder`, 
        complainOrder: `${host}/pk/complainOrder`, 
        helpInfo: `${host}/pk/helpInfo`, 
        nextComplain: `${host}/pk/nextComplain`, 
         
        approvedComplain: `${host}/pk/approvedComplain`, 

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
        queryPkApprove: `${host}/pk/queryPkApprove`, 
        canEditApproveMessage: `${host}/pk/canEditApproveMessage`,
        selectCashier: `${host}/pk/selectCashier`,
        viewActiveGroupCode: `${host}/pk/viewActiveGroupCode`,
        confirmSelectCashier: `${host}/pk/confirmSelectCashier`,
        queryActiveGroupCode: `${host}/pk/queryActiveGroupCode`,
        
     


        setApproveInfo: `${host}/pk/setApproveInfo`, 
   
        doApprove: `${host}/pk/doApprove`, 
        rejectApprove: `${host}/pk/rejectApprove`, 
        rejectApprovingPost: `${host}/pk/rejectApprovingPost`, 
        
        queryAllTips: `${host}/pk/queryAllTips`, 
   
        queryMoreApprovingPost: `${host}/pk/queryMoreApprovingPost`, 
        queryMoreApprovedPost: `${host}/pk/queryMoreApprovedPost`, 
        publishApproveMessage: `${host}/pk/publishApproveMessage`, 
        queryApproveMessage: `${host}/pk/queryApproveMessage`, 
        replaceImg: `${host}/pk/replaceImg`,      
        replaceText: `${host}/pk/replaceText`,      
        complain: `${host}/pk/complain`,     
        createPk: `${host}/pk/createPk`,  
        updatePk: `${host}/pk/updatePk`, 
        
        importPost: `${host}/pk/importPost`, 
        
        userPublishPosts: `${host}/pk/userPublishPosts`, 
        nextUserPublishPosts: `${host}/pk/nextUserPublishPosts`, 
        
        setLocation: `${host}/pk/setLocation`,

        setPkCode: `${host}/pk/setPkCode`, 
        publishPk: `${host}/pk/publishPk`,  
        viewPk: `${host}/pk/viewPk`,  
        
        postStatu: `${host}/pk/postStatu`,      

        goApproving: `${host}/pk/goApproving`,    
        
    
        queryGroupCode: `${host}/pk/queryGroupCode`, 
        uploadGroupCode: `${host}/pk/uploadGroupCode`, 
        setApproveUser: `${host}/pk/setApproveUser`, 
 
        removeApproveUser: `${host}/pk/removeApproveUser`, 
        approve: `${host}/pk/approve`, 
  
        querySort: `${host}/pk/querySort`, 
        checkUserPost: `${host}/pk/checkUserPost`, 
        
        queryMoreSort: `${host}/pk/queryMoreSort`, 
         
        updateTime: `${host}/pk/updateTime`, 
        setCommentVoice:`${host}/pk/setCommentVoice`, 
        setApproverVoice:`${host}/pk/setApproverVoice`, 
        approverDetail:`${host}/pk/approverDetail`, 
 
        allCashiers:`${host}/pk/allCashiers`, 
        nextPageCashiers:`${host}/pk/nextPageCashiers`, 
        queryPkCreators:`${host}/pk/queryPkCreators`, 
        morePkCreators:`${host}/pk/morePkCreators`, 
        
        switchBit:`${host}/pk/switchBit`, 

        
        activeThisPk:`${host}/pk/activeThisPk`, 
        createCashier:`${host}/pk/createCashier`, 
        
        changeCahierStatu:`${host}/pk/changeCahierStatu`, 
         
        uploadCashierGroup:`${host}/pk/uploadCashierGroup`, 
        
        changeGroupStatu:`${host}/pk/changeGroupStatu`, 
        
        deleteGroup:`${host}/pk/deleteGroup`, 
        
        uploadInnerPublicUserImg:`${host}/pk/uploadInnerPublicUserImg`, 

        allFeeCodes:`${host}/pk/allFeeCodes`, 
        deleteFeeCode:`${host}/pk/deleteFeeCode`, 
        changeFeeCodeStatu:`${host}/pk/changeFeeCodeStatu`, 
        uploadFeeCode:`${host}/pk/uploadFeeCode`, 
        
        uploadInnerPublicGroupCode:`${host}/pk/uploadInnerPublicGroupCode`, 
        replaceCashierGroup:`${host}/pk/replaceCashierGroup`, 
        
        replaceFeeCode:`${host}/pk/replaceFeeCode`, 
        systemSetting:`${host}/pk/systemSetting`, 
        
        querySystemSetting:`${host}/pk/querySystemSetting`, 

        //管理
        gennerateCodes:`${host}/pk/gennerateCodes`, 
        queryActiveCode:`${host}/pk/queryActiveCode`, 


        checkPk:`${host}/pk/checkPk`, 
        activePk:`${host}/pk/activePk`, 
        hiddenPk:`${host}/pk/hiddenPk`, 
        activePks:`${host}/pk/activePks`, 
        manageApprovingPosts:`${host}/pk/manageApprovingPosts`, 
        hiddenPost:`${host}/pk/hiddenPost`, 
        approvePost:`${host}/pk/approvePost`, 
        querySort:`${host}/pk/querySort`, 
        nextSortPage:`${host}/pk/nextSortPage`, 
        
        morePrePks:`${host}/pk/morePrePks`, 
        queryPrePks:`${host}/pk/queryPrePks`, 
        preCreatePk:`${host}/pk/preCreatePk`, 
        queryPreHomePage:`${host}/pk/queryPreHomePage`, 
        morePreHomePage:`${host}/pk/morePreHomePage`, 
        
        removePk:`${host}/pk/removePk`, 
        addToGeneticHome:`${host}/pk/addToGeneticHome`, 
        addToNonGeneticHome:`${host}/pk/addToNonGeneticHome`, 
        removePkFromHomPage:`${host}/pk/removePkFromHomPage`, 
        setAlbumType:`${host}/pk/setAlbumType`, 
        
        moreBackImgs:`${host}/pk/moreBackImgs`, 
        queryBackImgs:`${host}/pk/queryBackImgs`, 
        removeImg:`${host}/pk/removeImg`, 
        uploadBackImg:`${host}/pk/uploadBackImg`, 
        
        updatePkPage:`${host}/pk/updatePkPage`, 
        
        addGap:`${host}/pk/addGap`, 
        queryPostByPostId:`${host}/pk/queryPostByPostId`, 
        addPreUser:`${host}/pk/addPreUser`, 
        morePreUsers:`${host}/pk/morePreUsers`, 
        queryPreUsers:`${host}/pk/queryPreUsers`, 
        editUserName:`${host}/pk/editUserName`, 
        editUserImg:`${host}/pk/editUserImg`, 
        updateTipBack:`${host}/pk/updateTipBack`, 
        uploadCashierLink:`${host}/pk/uploadCashierLink`, 
        
        deleteCashier:`${host}/pk/deleteCashier`, 
        deletePk:`${host}/pk/deletePk`, 

   
        activeSinglePK:`${host}/pk/activeSinglePK`, 
        topPost:`${host}/pk/topPost`, 
        queryUserPublishPks:`${host}/pk/queryUserPublishPks`, 
        nextUserPublishPks:`${host}/pk/nextUserPublishPks`, 
        addComment:`${host}/pk/addComment`, 
        queryComments:`${host}/pk/queryComments`, 
        nextCommentPage:`${host}/pk/nextCommentPage`, 
        complainList:`${host}/pk/complainList`, 
        morecomplainList:`${host}/pk/morecomplainList`, 

        queryGreateUsers:`${host}/pk/queryGreateUsers`, 
        queryMoreGreateUsers:`${host}/pk/queryMoreGreateUsers`, 
        likePk:`${host}/pk/likePk`, 
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
        payForTime:`${host}/pk/payForTime`,
        payForPk:`${host}/pk/payForPk`,
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
