

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        //console.log(chrome.extension.getURL('../options/search.html')+'?#'+GetQueryString(details.url,'wd'))
        //console.log(details);
        if(1 && details.type == "main_frame" && typeof details.initiator == 'undefined'){
            if(/^http[s]?:\/\/([^.]+\.)?google\..+/.test(details.url))
            return {redirectUrl: chrome.extension.getURL('../options/search.html')+'?#'+GetQueryString(details.url,'q').replace(/\+/g,' ')};
            else if(GetQueryString(details.url,'wd') != '')
            return {redirectUrl: chrome.extension.getURL('../options/search.html')+'?#'+GetQueryString(details.url,'wd')}; 
        }
        
        if(details.type == "main_frame" && details.url.indexOf('://chrome.jsearch.site')>-1)
            return {redirectUrl: chrome.extension.getURL('../options/search.html')+'?#'+GetQueryString(details.url,'q')}; 
        //console.log('aaa');
    },  //
    {urls: ["*://www.baidu.com/*","*://*/search?q=*","*://chrome.jsearch.site/*"]}, //
    ["blocking"]);




function GetQueryString(url,name)
{
     let reg = new RegExp(`(\\?|&)${name}=([^&]*)(&|$)`);
     let r = url.match(reg);//search,查询？后面的参数，并匹配正则
     if(r!=null)return  r[2]; return '';
}


chrome.runtime.onInstalled.addListener(details => {
    var defaultSettings = {searchModels:[
        {
            type:'baidu',
            symbol:'',
            scope:'www.baidu.com',
            show:true,
            canEdit:false,
            canDelete:false
        },
        {
            type:'google',
            symbol:'',
            scope:'www.google.com',
            show:false,
            canEdit:false,
            canDelete:false
        },
        {
            type:'baidu',
            symbol:'site:',
            scope:'www.zhihu.com',
            show:true,
            canEdit:true,
            canDelete:true
        },
        {
            type:'baidu',
            symbol:'site:',
            scope:'www.jianshu.com',
            show:true,
            canEdit:true,
            canDelete:true
        },
        {
            type:'weixin',
            symbol:'1', //公众号
            scope:'weixin.sogou.com',
            show:true,
            canEdit:false,
            canDelete:false
        },
        {
            type:'weixin',
            symbol:'2', //公众号文章
            scope:'weixin.sogou.com',
            show:true,
            canEdit:false,
            canDelete:false
        },
        {
            type:'bookmarks',
            symbol:'',
            scope:'bookmarks & history',
            show:true,
            canEdit:false,
            canDelete:false
        },
        {
            type:'baidu',
            symbol:'inurl:',
            scope:'www.zhihu.com/people',
            show:true,
            canEdit:true,
            canDelete:true
        }
    ]};
    if (details.reason === 'install') {
        // install
        //设置初始配置
        chrome.storage.sync.set(defaultSettings); 
    }
    if (details.reason === 'update') {
        // 更新事件
        //alert('update');
        chrome.storage.sync.get('searchModels', function (items) {
            if(typeof items.searchModels != 'undefined'){
                //合并配置
                for(let i in defaultSettings.searchModels){
                    let hasThis = 0;
                    for(let j in items.searchModels){
                        if(defaultSettings.searchModels[i].type == items.searchModels[j].type && defaultSettings.searchModels[i].symbol == items.searchModels[j].symbol && defaultSettings.searchModels[i].scope == items.searchModels[j].scope){
                            hasThis = 1;
                            break;
                        }
                    }
                    if(!hasThis){
                        items.searchModels.push(defaultSettings.searchModels[i]);
                    }
                }
                chrome.storage.sync.set(items);

            }else{
                //设置初始配置
                chrome.storage.sync.set(defaultSettings);
            }
        });

    }

});