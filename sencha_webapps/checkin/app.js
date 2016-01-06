
//@include sencha-toolbar-ui('yellow', #E9D890, 'bevel');

Ext.require(['Ext.List','Ext.data.Store', 'Ext.form.FieldSet', 'Ext.field.Select','Ext.tab.Panel',
            'Ext.chart.Chart','Ext.chart.PolarChart','Ext.chart.series.Pie','Ext.chart.interactions.Rotate',
            'Ext.chart.interactions.ItemInfo', 'Ext.chart.CartesianChart', 'Ext.chart.interactions.ItemHighlight',
            'Ext.form.Panel', 'Ext.data.Model','Ext.field.Search','Ext.plugin.PullRefresh','Ext.plugin.ListPaging','Ext.MessageBox']);

Ext.define('CandModel', {
    extend: 'Ext.data.Model',
    config: {
    fields: [
        {
            name: 'id',
            type: 'string'
        },
        {
            name: 'appId',
            type: 'string'
        },
        {
            name: 'projectId',
            type: 'string'
        },
        {
            name: 'candId',
            type: 'string'
        },
        {
            name: 'poll',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'introduce',
            type: 'string'
        },
        {
            name: 'detail',
            type: 'string'
        },
        {
            name: 'imagePath',
            type: 'string'
        },
        
        {
            name: 'updateTime',
            type: 'string'
        }   
        ]
    }
});

  
function StrtoHtml(str)
{ 
        //var str = this; 
        str=str.replace(/&/g,"&amp;"); 
        str=str.replace(/</g,"&lt;"); 
        str=str.replace(/>/g,"&gt;"); 
        str=str.replace(/\'/g,"&apos;"); 
        str=str.replace(/\"/g,"&quot;"); 
        str=str.replace(/\n/g,"<br>"); 
        str=str.replace(/\ /g,"&nbsp;"); 
        str=str.replace(/\t/g,"&nbsp;&nbsp;&nbsp;&nbsp;"); 
        return str; 
}

function strlenAll(str){
    var len = 0;
    for (var i=0; i<str.length; i++) { 
     var c = str.charCodeAt(i); 
    //单字节加1 
     if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
       len++; 
     } 
     else { 
      len+=2; 
     } 
    } 
    return len;
}

function MsgBox(title, msg) {
    console.log("Titel:"+title+"  msg:"+msg);
    var msgbox = new Ext.MessageBox();
    msgbox.show({
        //width: 280,
        //height: 200,
        //cls: 'x-msgbox-1',
        buttons: [
        {   
            text : "确   定", 
            ui : "plain", 
            style: {
                background: '#04BD00',
            },
        }
        ],
        title: title,
        message: msg,
    });
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); 
    //return null;
    return "";
}

function onBridgeReady(){
    //WeixinJSBridge.call('hideOptionMenu');
}

if (typeof WeixinJSBridge == "undefined"){
        if( document.addEventListener ){
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
        }else if (document.attachEvent){
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
    }else{
        onBridgeReady();
    }


function enableWxConfig(){
    
    var curUrl = window.location.href;
    console.log("curUrl:"+curUrl);
    var curUrlEncode = encodeURIComponent(curUrl); 
    var urlStr = "/base/mp/jsapi?appId="+appId+"&url="+curUrlEncode;

    Ext.Ajax.request({
                            url: urlStr,
                            //url: '/servlet/sqlSurvey',
                            method: 'GET',
                            //params: { requestFlag: 'SaveUserInfo', userInfo: jSonUserInfo},
                            //jsonData: jSonString,
                            success: function ( result, request ) { 
                                //alert("Success: "+result.responseText); 
                                console.log(result.responseText);
                                var jsonObj = JSON.parse(result.responseText);

                                wx.config({
    debug: false, // 开启调试
    appId: jsonObj.appid, // 必填，公众号的唯一标识
    timestamp: jsonObj.timestamp, // 必填，生成签名的时间戳
    nonceStr: jsonObj.nonceStr, // 必填，生成签名的随机串
    signature: jsonObj.signature,// 必填，签名，见附录1
    jsApiList: ['hideOptionMenu', 'closeWindow', 'openLocation', 'getLocation', 'getNetworkType'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
});
  
                           //alert("enableWxConfig end");
                            },
                            failure: function ( result, request) { 
                                alert("Failed: "+result.responseText);
                            } 
                        });           
}



function MsgBox(title, msg) {
    console.log("Titel:"+title+"  msg:"+msg);
    var msgbox = new Ext.MessageBox();
    msgbox.show({
        //width: 280,
        //height: 200,
        //cls: 'x-msgbox-1',
        buttons: [
        {   
            text : "确   定", 
            ui : "plain", 
            style: {
                background: '#04BD00',
            },
        }
        ],
        title: title,
        message: '<p align=center >'+msg+'</p>',
    });
}

function MsgBoxExit(title, msg) {
    console.log("Titel:"+title+"  msg:"+msg);
    var msgbox = new Ext.MessageBox();
    msgbox.show({
        //width: 280,
        //height: 200,
        //cls: 'x-msgbox-1',
        buttons: [
        {   
            text : "确   定", 
            ui : "plain", 
            style: {
                background: '#04BD00',
            },
            handler:function(btn,e,eOpts){
               console.log("wx.closeWindow():");
	           wx.closeWindow();
	       },
        }
        ],
        title: title,
        message: '<p align=center >'+msg+'</p>',
    });
}


function VoteConfirmBox(callbackFunc, message) 
{ 
            var prompt = Ext.create('Ext.MessageBox',{
        	title:'确定投票给',
        	message:message,
            
        	buttons:[{
        		text:'取消',
                ui : "plain", 
                style: {
                    background: '#04BD00',
                },
        		handler:function(btn,e,eOpts){
        			prompt.hide();
        			//do something
        		},
        	},{
        		text:'确定',
                ui : "plain", 
                style: {
                    background: '#04BD00',
                },
        		handler:function(btn,e,eOpts){
	
                    prompt.hide();
                                       
                    callbackFunc();
        		},
        	}],
            /*
        	listeners:[{
        		event:'painted',
        		fn:function(){
        			this.getPrompt().focus()
        		}
        	}]
            */
        });
         
        Ext.Viewport.add(prompt);  
}

function checkIsVoted(jsonVoteInfo){
    var checkRet = "error";
                    
                        Ext.Ajax.request({
                            url: '/base/vote/check',
                            method: 'POST',
                            async: false,
                            params: {voteInfo:jsonVoteInfo},
                            success: function ( result, request) { 
                                
                                console.log("checkIsVoted return"+result.responseText);
                                checkRet = JSON.parse(result.responseText);

                                /*
                                if( jsonObj.status == "success" && jsonObj.isVote == "true" ) {
                                    console.log("checkIsVoted：Voted");
                                    isVoteTmp = "true";
                                    checkVoteToName = jsonObj.name;
                                    checkVoteToCandId = jsonObj.candId;
                                    
                                }else {  
                                    console.log("checkIsVoted：No Voted");
                                    isVoteTmp = "false";
                                    checkVoteToName = " "; 
                                    checkVoteToCandId = 0;
                                }
                                */
                                           
                            },
                            failure: function ( result, request) { 
                                alert("网络出错，请稍后再试"); 
                                checkRet = "error";
                            } 
                        }); 
     return checkRet;                          
}
                    
wx.ready(function(){
    //UpdateWxLocation();
});

var RewardName="";
var RewardUserId;

var CandStore;   

var ScreenWidth;
var ScreenHeight; 
var TiteWidth; 

var bindex;

var resultContendHtml = "";
var loctionStaHtml = "";
var userId = "";

var openId = "";
var appId = "";
var timestamp;
var access_token = "";
var args = "";

var isVote = "false";
var checkVoteToName = " ";
var checkVoteToCandId = 0;

var interval;
var isInitFinished = false;
var voteProject;
function showInfo(msg){
    
    var item = Ext.getCmp('panel2').items.items[0];
    var html = '<img src="'+voteProject.imagePath+'"  width="'+window.innerWidth+'"  />'
    item.setHtml(html);
    /*
    var strInfo = ""+msg+"screen.height:"+screen.width+"  window.screen.availWidth:"+window.screen.availWidth
                +"  document.body.clientWidth:"+document.body.clientWidth+" window.innerWidth:"+window.innerWidth
                +"screen.height:"+screen.height+"  window.screen.availHeight:"+window.screen.availHeight
                +"  document.body.clientHeight:"+document.body.clientHeight+" window.innerHeight:"+window.innerHeight;
    alert(strInfo); 
    */ 
}

window.addEventListener('orientationchange', function(event){
    if(!isInitFinished){
        return;
    }
    if ( window.orientation == 180 || window.orientation==0 ) {
        //alert("竖屏");
       setTimeout(function(){showInfo("竖屏");}, 500);   
    }
    if( window.orientation == 90 || window.orientation == -90 ) {
        //alert("横屏");
        setTimeout(function(){showInfo("横屏");}, 500);
    }
});

  
//------------------------------------------------
Ext.application({
    name : 'Fiddle',

    launch : function() {

    openId = GetQueryString("openId");
    console.log("openId:"+ openId);
    appId = GetQueryString("appId");
    console.log("appId:"+ appId);
    timestamp = GetQueryString("timestamp");
    console.log("timestamp:"+ timestamp);
    
    if( timestamp == "" ){
        console.log("timestamp is null");   
        //MsgBoxExit("", '请关注"华三深圳办"公众号后进行投票');
        //return;     
    }
    
    var timestampClient = Math.round(new Date().getTime());
    console.log("timestampClient:"+ timestampClient);
    
    var timestampSerInt = parseInt(timestamp);
    if( (timestampClient -timestampSerInt ) > 45*1000 ){
        console.log("timestampClient expire 30");   
        //window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx082397805d8b7f90&redirect_uri=http%3A%2F%2Fhz2.byodwork.cn%2Fbase%2FMpService&response_type=code&scope=snsapi_base&state=wx082397805d8b7f90EndVote#wechat_redirect';
        //MsgBoxExit("", '请关注"华三深圳办"公众号后进行投票');
        //return;     
    }
    else{
        console.log("timestampClient in 30");
    }   
    
    enableWxConfig();
    
    ScreenWidth =  (window.innerWidth > 0) ? window.innerWidth : screen.width;
    ScreenHeight = (window.innerHeight> 0) ? window.innerHeight : screen.height;
    TiteWidth = ScreenWidth/3;  
    //ScreenWidth = ScreenWidth-30;
    //ScreenHeight = Ext.viewport.getWindowHeight(),  
    console.log("ScreenWidth:"+ ScreenWidth+ " ScreenHeight"+ScreenHeight+" TiteWidth"+TiteWidth);
  
    
     Ext.Ajax.request({
        url: '/base/vote/projects',
        method: 'GET',
        async: false,
        params: { appId:appId},
        success: function ( result, request) { 
            console.log("projects return:"+result.responseText);
            var arrayObj = new Array();            
            arrayObj = JSON.parse(result.responseText);
            voteProject = arrayObj[0];
            var jsonProjectInfo  = JSON.stringify(voteProject); 
            console.log("jsonProjectInfo:"+ jsonProjectInfo)
                    
                        
        },
        failure: function ( result, request) { 
            alert("网络出错，请稍后再试"); 
        } 
    }); 
    
    document.title = voteProject.title;
    
       
    CandStore =  Ext.create('Ext.data.Store', {
        id: 'CandStore',
        //extend: 'Ext.data.Store',
        model: 'CandModel',
        //fields: ['name'],
        storeId: 'CandStore',
        //是否在app启动时自动加载数据，手动加载方法为store.load();或者store.loadPage(1);请自行查看api
        //grouper: function(record){ return record.get('firstName'); },
        autoLoad: true,
        //remoteSort: true,
        remoteFilter: true,
        /*
        filter: {
            property: 'id',
            value: 'nothing'            
        },
        */
        pageSize: 20,
        proxy: {
            type: 'ajax',

            url: '/base/vote/cand/?appId='+appId,
            limitParam: 'limit',
            pageParam: 'page',
            reader: {
                type: "json",
                rootProperty: 'listData',
                totalProperty: 'listSize'
            }
        }
});

      CandStoreByPoll =  Ext.create('Ext.data.Store', {
        id: 'CandStoreByPoll',
        //extend: 'Ext.data.Store',
        model: 'CandModel',
        //fields: ['name'],
        storeId: 'CandStoreByPoll',
        autoLoad: true,
        remoteFilter: true,
        pageSize: 20,
        proxy: {
            type: 'ajax',
            url: '/base/vote/cand/byPoll?appId='+appId,
            limitParam: 'limit',
            pageParam: 'page',
            reader: {
                type: "json",
                rootProperty: 'listData',
                totalProperty: 'listSize'
            }
        }
    });

  
    var panel1 = Ext.create('Ext.Panel', {
    id: 'panel1',
    //title: '嘉宾', 
    //iconCls: 'user',
    //fullscreen: true,
    
    //scrollable:'vertical',
    layout: {
        //type: 'vbox',
        //align: 'start',
        type: 'vbox',
    },
    
    items: [
        /*
        {
                xtype: 'panel',
                margin: '15px 15px 10px 15px',
                html: '<img src="/media/'+bindex+'.jpg"  width="'+ScreenWidth+'"  />'
        },
        */    
        {  
            xtype: 'list',
            //scrollable:false,
            
            id: 'list1',
            flex: 8,
            store: CandStore,
            selectedCls: 'x-item-selected1',
            //ui: 'plain',  
            onItemDisclosure: {
            
                handler: function (record, btn, index) {
                    console.log('Tap index'+index+" name:"+record.data.project);             
                    
                    var timestampClient = Math.round(new Date().getTime());
                    var startTimeInt = parseInt(voteProject.startTime);
                    var endTimeInt = parseInt(voteProject.endTime);
                    
                    if(timestampClient < startTimeInt){
                        MsgBox("", "抱歉，投票活动还未开始");
                        return;
                    }
                    
                    if(timestampClient > endTimeInt){
                       MsgBox("", "抱歉，投票活动已经结束");
                       return;
                    }
                    
                    
                    var ObjVote = new Object();
                    ObjVote.voteToProjectId = record.data.projectId;
                    ObjVote.voteToCandId = record.data.candId;
                    ObjVote.voteFromOpenId = openId;
                    ObjVote.appId = appId;
                                                                      
                    var jsonVoteInfo  = JSON.stringify(ObjVote); 
                    console.log("jsonVoteInfo:"+ jsonVoteInfo);                                     
                    
                   
                    var checkRetObj = new Object();  
                    checkRetObj = checkIsVoted(jsonVoteInfo);
                    
                    if(checkRetObj.status != "success") {
                        
                        if(checkRetObj.replyCode == "vote.voted") {
                            MsgBox("", "您已为该项目投过票,感谢参与!");
                        }
                        else if(checkRetObj.replyCode == "vote.beyond.limit") {
                            MsgBox("", "您的投票已超出规定次数");
                        }
                        else if(checkRetObj.replyCode == "openId.invalid") {
                            MsgBox("", "您的投票身份不符合规定");
                        }
                        else{
                            MsgBox("", "您已投过票");
                        }
                        
                        var item = Ext.getCmp('panel1').items.items[1].getComponent('BtnCheckVote');
                                    item.enable();
                                    item.setStyle({
		                              background: '#04BD00',
                                        color:'white', 
                                    })
                                    
                        return;
                    }
                    
                    function voteCommit(){
   
                        Ext.Ajax.request({
                            url: '/base/vote/voteto',
                            method: 'POST',
                            params: {voteInfo: jsonVoteInfo},
                            success: function ( result, request) {
                                var jsonObj = JSON.parse(result.responseText);
                                if( jsonObj.status == "success") {
                                    console.log("Voted success");
                                    MsgBox("", "投票成功,感谢您的参与"); 
                                
                                    isVote = "true";
                                    
                                    var item = Ext.getCmp('panel1').items.items[1].getComponent('BtnCheckVote');
                                    item.enable();
                                    item.setStyle({
		                              background: '#04BD00',
                                        color:'white', 
                                    }) 
                                    
                                    CandStore.load(); 
                                    CandStoreByPoll.load();
                                    
                                }else {  
                                    console.log("Voted Failed");
                                    MsgBox("", "投票失败:"+jsonObj.replyMsg);     
                                }                    
                            },
                            failure: function ( result, request) { 
                                alert("网络异常，请稍后再试"); 
                            } 
                        });                           
                    }
                                       
                    VoteConfirmBox(voteCommit, record.data.name);
                  
                },
            },
            
            itemTpl: new Ext.XTemplate(
                '<p>{[this.outputHtml(values.candId)]}</p>',     
                {               
                    outputHtml:  function(valueIn)
                    {           
                        var index1 = CandStore.find('candId', valueIn);
                        //console.log("cand store index:"+index1+"  candidateId:"+valueIn); //第5条记录，下标为4，输出4。
                        var myrecord = CandStore.getAt(index1);
                        var sortIndex = index1+1;
                        //var typeStr = myrecord.get('userName') ;
                        /* 
                         var dispStr = '<table border="0"><tr valign="top"><td>'
                        +'<div class="img"><img src="/media/vote/'+sortIndex+'.jpg"  width="'+TiteWidth+'"  /></div></td>'
                        +'<td><div class="contend" style="margin:1px 5px 5px 10px;"><font size=4><p style = "margin:3px 5px 8px 5px">'
                        + '项目编号 &nbsp;<font size=4 color=#04BD00 >'+myrecord.get('candidateId') + '</font></p><p style = "margin:4px 5px 4px 5px">'
                        + myrecord.get('project') + '</p><p style = "margin:8px 5px 8px 5px">'
                       
                        + '当前票数 &nbsp;<font size=4 color=#04BD00 >'+myrecord.get('poll') + '</font></p><p style = "margin:4px 5px 4px 5px">'
                        +'</p></font></div></td></tr></table>'
                        +'<p style = "margin:15px 5px 8px 5px" ><font size=3> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+ myrecord.get('detail') + '</font></p>';
                        
  
                        */
                        
                        var dispStr = '<table border="0"><tr valign="top"><td>'
                        +'<div class="img"><img src="'+myrecord.get('imagePath') + '" width="'+TiteWidth+'"  /></div></td>'
                        +'<td><div class="contend" style="margin:1px 5px 5px 10px;"><font size=4><p style = "margin:3px 5px 8px 5px">'
                        + '编号 &nbsp;<font size=4 color=#04BD00 >'+myrecord.get('candId') + '</font></p><p style = "margin:4px 5px 4px 5px">'
                        //+ myrecord.get('project') + '</p><p style = "margin:8px 5px 8px 5px">'
                       
                        + '票数 &nbsp;<font size=4 color=#04BD00 >'+myrecord.get('poll') + '</font></p><p style = "margin:4px 5px 4px 5px">'
                        +'</p></font></div></td></tr></table>'
                        +'<p style = "margin:10px 5px 4px 5px" align=center > <font size=4>'+ myrecord.get('name')+ '</font></p>'
                        + myrecord.get('detail');
                        
                                  
                        return dispStr;    
                    }
                }),                
        },
        
        {              
                xtype: 'panel',               
                //docked: 'bottom',
                margin: '10 15 8 15', 
            
                items: [
                {
                xtype: 'button',
                id: 'BtnCheckVote',
                ui: 'plain',    
                width: '100%',
                height: '38px',                                       
                style: {
                   background: '#04BD00',
                    color:'white',              
                },  
                //disabled: true,
                               
                text: '查看排名',
                handler : function(button) {
                
                   Ext.Viewport.add(panelTab1);
                    //panelTabAll.setActiveItem(panelTab1);
                    
                    Ext.Viewport.animateActiveItem(panel3, {  
                                type : 'slide',  
                                direction : 'left'  
                             }); 
       
                }
                },
                ],
       },
    ]
});
    
     var panel2 = Ext.create('Ext.Panel', {
        id: 'panel2',
        scrollable:'vertical',
        layout: {
            type: 'vbox',
            //pack: 'center',
            //align: 'center',
        }, 

        items: [
             {
                xtype: 'panel',
                margin: '0px 0px 5px 0px',
                html: '<img src="'+voteProject.imagePath+'"  width="'+ScreenWidth+'"  />'
             },
             
             {
                xtype: 'panel',
                margin: '15 15 15 15', 
                //margin: '15px 15px 10px 15px',
                html: voteProject.detail,
                /*
                html: '<p style = "margin:15px 5px 8px 5px; text-align:justify;" ><font size=3> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;'
                        + '过去的2014年，H3C深圳办在您的关注与支持下，通过新IT赋能百行百业变革，取得了不斐的成绩。'
                        +'本次巡展我们将选出最佳实践项目给予丰厚奖励，经过初赛有8个项目进入决赛，请为本次大赛投出您珍贵的一票！'
                        +'<br/> <br/> &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; 投票时间：14:00～17:00' 
                        //+'<br/> &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;决赛投票时间: &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;2015年6月16日 14:00~16:00' 
                        + '</font></p>',
                */
             },
             
             {              
                xtype: 'panel',               
                //docked: 'bottom',
                margin: '25 15 40 15', 
            
                items: [
                {
                xtype: 'button',
                id: 'BtnToVote',
                ui: 'plain',    
                width: '100%',
                height: '38px',                                       
                style: {
                   background: '#04BD00',
                    color:'white',              
                },  
                //disabled: true,
                               
                text: '去投票',
                handler : function(button) {
         
                   
                    
                    Ext.Viewport.add(panelTab1);
                    //panelTabAll.setActiveItem(panelTab1);
                    Ext.Viewport.animateActiveItem(panel1, {  
                                type : 'slide',  
                                direction : 'left'  
                             }); 
       
                }
                },
                ],
             },                             
            ]
       
     }); //pannelform2
    
    var panel3 = Ext.create('Ext.Panel', {
    id: 'panel3',
    title: '排名', 
    iconCls: 'user',
    layout: {
        type: 'vbox',
        //align: 'start',
    },
    
    items: [ 
    /*
    {
        
        xtype: 'panel',
        id: 'topPannel2',
        docked: 'top',
        height: '35px',
        margin: '5 10 2 10',
        layout: {
            type: 'vbox',
            //align: 'start',
        },
        html: '<p align="center"><font color=#04BD00 size=4>' + '投票排名'+ '</font> </p>',
       
       
    },
    */
        {
            id: 'list3',
            flex: 8,
            xtype: 'list',
            store: CandStoreByPoll,
            selectedCls: 'x-item-selected1',
            onItemDisclosure: false,
            requires: ['Ext.plugin.PullRefresh'],
            plugins:[
            {
　　　　　　　　xclass: 'Ext.plugin.PullRefresh',
　　　　　　　　pullText: '下拉可以更新',
                //pullRefreshText: '下拉更新frankie',
　　　　　　　　releaseText: '松开开始更新',
　　　　　　　　loadingText: '正在刷新……',
                loadedText: '已经刷新完成',
                
                listeners : {                
                    latestfetched : function() {  
                         panel3.getComponent('list3').getStore().load();  
                    },
                }          
            },
            ],
            
            itemTpl: new Ext.XTemplate(
                '<p>{[this.outputHtml(values.candId)]}</p>',     
                {               
                    outputHtml:  function(valueIn)
                    {   
                        var index1 = CandStoreByPoll.findExact('candId', valueIn);
                        //console.log("CandStoreByPoll index:"+index1+"  candidateId:"+valueIn); //第5条记录，下标为4，输出4。
                        var myrecord = CandStoreByPoll.getAt(index1);
                        var sortIndex = index1+1;
                       /*      
                        var dispStr = '<table border="0"><tr valign="top"><td>'
                        +'<div class="img"><img src="/media/vote/'+sortIndex+'.jpg"  width="'+TiteWidth+'"  /></div></td>'
                        +'<td><div class="contend" style="margin:1px 5px 5px 20px;"><font size=4><p style = "margin:0px 5px 0px 5px">'
                        + '<font size=5 color=#04BD00 >'+sortIndex + '</font></p><p style = "margin:8px 5px 0px 5px">'
                        + '当前票数 <font size=4 color=#04BD00 >'+myrecord.get('poll') + '</font></p><p style = "margin:8px 5px 0px 5px">'
                        + '项目编号 <font size=4  >'+myrecord.get('candidateId') + '</font></p><p style = "margin:5px 5px 4px 5px">'
                        + myrecord.get('project') 
                        +'</p></font></div></td></tr></table>';
                       */
                        var dispStr = '<table border="0"><tr valign="top"><td>'
                        +'<div class="img"><img src="'+myrecord.get('imagePath') + '" width="'+TiteWidth+'"   /></div></td>'
                        +'<td><div class="contend" style="margin:1px 5px 5px 20px;"><font size=4><p style = "margin:0px 5px 0px 5px">'
                        + '<font size=5 color=#04BD00 >'+sortIndex + '</font></p><p style = "margin:8px 5px 0px 5px">'
                        + '票数 <font size=4 color=#04BD00 >'+myrecord.get('poll') + '</font></p><p style = "margin:8px 5px 0px 5px">'
                        + '编号 <font size=4  >'+myrecord.get('candId') + '</font></p><p style = "margin:5px 5px 4px 5px">'
                        +'</p></font></div></td></tr></table>'
                         +'<p style = "margin:10px 5px 4px 5px" align=center > <font size=4>'+ myrecord.get('name')+ '</font></p>';
                                          
                        return dispStr;      
                    }
                }),
                
        },
        
         {              
                xtype: 'panel',               
                docked: 'bottom',
                margin: '10 15 10 15', 
            
                items: [
                {
                xtype: 'button',             
                ui: 'plain',    
                width: '100%',
                height: '38px',                                       
                style: {
                   background: '#04BD00',
                    color:'white',              
                },  
                               
                text: '返回',
                handler : function(button) {
         
                    Ext.Viewport.add(panelTab1);
                    //panelTabAll.setActiveItem(panelTab1);
                    Ext.Viewport.animateActiveItem(panel2, {  
                                type : 'slide',  
                                direction : 'right'  
                             }); 
       
                }
                },
                ],
       },         
             
    ]
});

     
    var panelTest = Ext.create('Ext.Panel', {
        id: 'panelTest',
        scrollable: true,
        layout: {
            type: 'vbox',
            //pack: 'center',
            //align: 'center',
        }, 

        items: [
            
			{
				xtype: 'list',         
				store: CandStore,
				itemTpl: '{project}',
                //flex: 1,
                height: '90px',
				scrollable: true,				
			},
            {
				xtype: 'button',
               
                height: '30px',
				text: 'click me 2',
				//margin: '20',
			},
		],
  });
             
             
   var panelTab1 = Ext.create('Ext.Panel', {
        id:'panelTab1',
        //title: '议程',
        //iconCls: 'star', 
       layout: 'card',
       items: [panel1, panel2,panel3],
        
    });
    
    
    /*
     if( isVote == "true"){
         var item = Ext.getCmp('panel2').items.items[2].getComponent('BtnToVote');
         //item.disable();
         item.setText("去查看(已投票)"); 
     }
    */
     if( voteProject.viewResult != "true"){
                        var item = Ext.getCmp('panel1').items.items[1].getComponent('BtnCheckVote');
                        item.disable();
                        //item.setText("去查看(已投票)"); 
                        item.setStyle({
                                    background: '#A1DF8C',
                                    color:'white', 
                        }) 
     }
                    
    isInitFinished = true;
                   
    Ext.Viewport.add(panelTab1);
    panelTab1.setActiveItem(panel2);
    
     //Ext.Viewport.add(panelTest);
   


 } //LUANCH  
 
});
