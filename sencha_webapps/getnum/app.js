
//@include sencha-toolbar-ui('yellow', #E9D890, 'bevel');

Ext.require(['Ext.List','Ext.data.Store', 'Ext.form.FieldSet', 'Ext.field.Select',
            'Ext.chart.Chart','Ext.chart.PolarChart','Ext.chart.series.Pie','Ext.chart.interactions.Rotate',
            'Ext.chart.interactions.ItemInfo', 'Ext.chart.CartesianChart', 'Ext.chart.interactions.ItemHighlight',
            'Ext.form.Panel', 'Ext.data.Model','Ext.field.Search','Ext.plugin.PullRefresh','Ext.plugin.ListPaging','Ext.MessageBox']);

Ext.define('User', {
            extend: 'Ext.data.Model',
            config:{
                fields: [
                    'userName','mobile','company',
                ],
                validations: [
                    //{type: 'presence',field:'userName',message:'姓名必须输入'},
                    {type: 'exclusion',field:'userName',
                    list:['H3C','h3c','华三'],
                    message:'不能使用这个姓名'},
                    {type:'length',field:'userName',min:2,max:4,message: '请正确输入您的姓名'},
     
                    //{type:'presence',field:'mobile',message : '手机号必须输入'},
                    //{type:'length',field:'mobile',min:11,max:11,message: '手机号长度必须为11位'},
                    {type:'format',field: 'mobile',matcher: /^\+?[1-1][3-8][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/,message:'请正确输入您的手机号'},
                    
                    {type:'length',field:'company',min:2,max:16,message: '请正确输入您的学号'},
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

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); 
    //return null;
    return "";
}

function onBridgeReady(){
    WeixinJSBridge.call('hideOptionMenu');
}

var resultContendHtml = "";
var loctionStaHtml = "";
var userId = "";
var openId = "";

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
    var urlStr = "/servlet/wechatMpSend?req=getJsapiSignature&url="+ curUrl;
    
    Ext.Ajax.request({
        url: urlStr,
        //url: '/servlet/sqlSurvey',
        method: 'GET',
        //params: { requestFlag: 'SaveUserInfo', userInfo: jSonUserInfo},
        success: function ( result, request ) { 
        console.log(result.responseText);
        var jsonObj = JSON.parse(result.responseText);
                                
        wx.config({
            debug: false, // 开启调试
            appId: jsonObj.appid, // 必填，公众号的唯一标识
            timestamp: jsonObj.timestamp, // 必填，生成签名的时间戳
            nonceStr: jsonObj.nonceStr, // 必填，生成签名的随机串
            signature: jsonObj.signature,// 必填，签名，见附录1
            jsApiList: ['closeWindow', 'scanQRCode', 'openLocation', 'getLocation', 'getNetworkType'], // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        },
        
        failure: function ( result, request) { 
            alert("Failed: "+result.responseText);
        } 
    });           
} 


function UpdateWxLocation() {
    
        wx.getLocation({
            success: function (res) {
                                
                                userInfo =new Object();
                                userInfo.openId = openId;
                                
                                userInfo.latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                                userInfo.longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                                userInfo.accuracy = res.accuracy; // 位置精度
                                var speed = res.speed; // 速度，以米/每秒计
                                
                                var jSonUserInfo  = JSON.stringify(userInfo); 
                                console.log("jSonUserInfo:"+ jSonUserInfo);
                        
                                Ext.Ajax.request({
                            //url : 'http://112.74.76.96/xl/uip2.php',
                            url: '/servlet/sqlSurvey',
                            method: 'POST',
                            params: { requestFlag: 'SaveUserLocation', userInfo: jSonUserInfo},
                            //jsonData: jSonString,
                            success: function ( result, request ) { 
                                //alert("Success: "+result.responseText); 
                                console.log("Submit and Get return info:"+result.responseText);
                                var jsonObj = JSON.parse(result.responseText);
                                                 
                                loctionStaHtml = '<p align="center"><font size=4>' + '位置状态: ' +jsonObj.geoStatus+ '<br/> </font> </p>' 
                                                +'<p align="center"><font color=green size=3>' +jsonObj.address + '</font> </p>' ;  
                                var item = Ext.getCmp('panel3').items.items[1];
                                item.setHtml(loctionStaHtml);
                              
                            },
                            failure: function ( result, request) { 
                                alert("Failed: "+result.responseText);
                            } 
                        });                                                               
                                
                        },
                         
                        fail:  function (res) {
                            MsgBox("", "获取地理位置失败！\n请确保您打开了手机定位功能");
                            loctionStaHtml = '<p align="center"><font size=4> <br/><br/>' + '位置状态:未知' + '<br/> </font> </p>';                             
                            var item = Ext.getCmp('panel3').items.items[1];
                            item.setHtml(loctionStaHtml);
                        },
                        cancel:  function (res) { 
                            MsgBox("", "请您允许获取地理位置，作为本活动现场抽奖凭证\n您可以稍后点击更新位置来允许"); 
                            loctionStaHtml = '<p align="center"><font size=4> <br/><br/>' + '位置状态:未知' + '<br/> </font> </p>';                             
                            var item = Ext.getCmp('panel3').items.items[1];
                            item.setHtml(loctionStaHtml);
                        },
               
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
        message: msg,
    });
}

wx.ready(function(){
    //UpdateWxLocation();
});
/*
wx.ready(function(){
    
    var latitude = "";
    var longitude = "";
    var networkType = "";
    
    wx.getNetworkType({
    success: function (res) {
        networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi  
         alert("  networkType:"+networkType);      
    }
    });
});

*/
function  ValidateUserInfo(panelObj)
{
                        //console.log('field change');
                            
                        var model = Ext.create('User',panelObj.getValues());
                        var errors = model.validate();
                        if(errors.isValid()) {
                             var item = Ext.getCmp('panelform2').items.items[1].getComponent('btnGetnum');
                             item.enable();                                  
                             item.setStyle({
                                    background: '#04BD00',
                                    color:'white', 
                             })            
                            
                            var item = Ext.getCmp('panelform2').items.items[0];
                            item.setInstructions('<p align="left"><font size=3>' + '为保证本活动顺利抽奖, 请您确保:<br/>1. 开启手机GPS定位功能<br/>2. 允许获取您的地理位置' + '</font> </p>');  
                        }
                        else {
                            var item = Ext.getCmp('panelform2').items.items[1].getComponent('btnGetnum');
                             item.disable();                                  
                             item.setStyle({
                                    background: '#A1DF8C',
                                    color:'white', 
                             })     
                             
                            var message = "";
                            Ext.each(errors.items,function(rec){                            
                                message += rec.getMessage()+"\n";
                            });

                            var retStr = ""+message;
                            var htmlRet = StrtoHtml(retStr);
                            htmlRet = '<p align="left"><font color=red size=3>' + htmlRet+'</font> </p>';
                            var item = Ext.getCmp('panelform2').items.items[0];
                            item.setInstructions(htmlRet);                     
                       
                        }
                }
                
//------------------------------------------------
Ext.application({
    name : 'Fiddle',

    launch : function() {

    openId = GetQueryString("OpenId");
    console.log("openId:"+ openId);

    enableWxConfig();

    //UpdateWxLocation();
    
     var panel2 = Ext.create('Ext.form.Panel', {
        id: 'panelform2',
        scrollable:'vertical',
        layout: {
            type: 'vbox',
            //pack: 'center',
            //align: 'center',
        }, 
        standardSubmit: 'false',

        items: [
        {
                xtype:'fieldset',
                title:'嘉宾登记',
                //instructions:'请填写您的基本信息，并打开手机定位\n请允许获取地理位置，作为本活动现场抽奖凭证',
                //instructions:'为保证本活动顺利抽奖，请您确保:\n1. 开启手机GPS定位功能\n2. 允许获取您的地理位置',
                instructions: { 
                    title: '<p align="left"><font size=3>' + '为保证本活动顺利抽奖, 请您确保:<br/>1. 开启手机GPS定位功能<br/>2. 允许获取您的地理位置' + '</font> </p>', 
                    //docked: 'bottom' 
                    //align: 
                }, 
                defaultType: 'textfield',
                margin: '15px',
                defaults:{
                    //labelwidth:'20%'
                    labelWidth: '90px',
                    
                    listeners: {
                        change: function(field, newVal, oldVal) {                           
                            ValidateUserInfo(panel2);
                        },
                        
                        keyup: function(field, newVal, oldVal) {
                            //console.log('field change');
                            ValidateUserInfo(panel2);
                        },
                        
                        activate: function() {   console.log('field activate'); },
                        updatedata: function() {  console.log('field updatedata');  },
                    },
                    
                },
                border: 0,
                cls: 'customField',
                items: [
                {
                    xtype: 'textfield',
                    id:'txt_userName',
                    name : 'userName',
                    label: '      姓    名',
                    cls: 'customField',
                    placeHolder:'您的姓名',
                    required:true,
                    clearIcon: true
                },
                {
                    xtype: 'textfield',
                    id:'txt_mobile',
                    name : 'mobile',
                    label: '      手    机',
                    cls: 'customField',
                    placeHolder:'您的手机号码',  
                    required:true,
                    //clearIcon: true,
                },
                {
                    xtype: 'textfield',
                    id:'txt_company',
                    name : 'company',
                    label: '      学    号',
                    placeHolder:'您的学号',
                    required:true,
                    clearIcon: true,
                    //disabled:true,
                    //disabledCls:'disabled'
                }]
                },
                
               {              
                xtype: 'panel',               
                //docked: 'bottom',
                margin: '10 15 8 15', 
            
                items: [
                {
                xtype: 'button',
                id: 'btnGetnum',
                //id:'btn1',
                ui: 'plain',    
                width: '100%',
                height: '38px',                                       
                style: {
                    background: '#A1DF8C',
                    color:'white',              
                },  
                disabled: true,
                               
                text: '获取号码',
                handler : function(button) {
                                                    
                        var formObj = panel2.getValues();
                        
                        userInfo =new Object();
                        userInfo.openId = openId;
                        userInfo.mobile = formObj.mobile;
                        userInfo.userName = formObj.userName;
                        userInfo.company = formObj.company;
                        
                        //var jSonUserInfo  = JSON.stringify(panel2.getValues()); 
                        var jSonUserInfo  = JSON.stringify(userInfo); 

                        console.log("jSonUserInfo:"+ jSonUserInfo);
                                      
                        Ext.Ajax.request({
                            //url : 'http://112.74.76.96/xl/uip2.php',
                            url: '/servlet/sqlSurvey',
                            method: 'POST',
                            params: { requestFlag: 'SaveUserInfo', userInfo: jSonUserInfo},
                            //jsonData: jSonString,
                            success: function ( result, request ) { 
                                //alert("Success: "+result.responseText); 
                                
                            resultContendHtml = '<p align="center"><font size=5>尊敬的&nbsp'+userInfo.userName+'</font><font size=3>&nbsp 先生/女士 </font> </p>'
                                   + '<p align="center"><font size=4><br/>您的抽奖码为 <br/><br/> </font> </p>'   
                                   + '<p align="center"><font color=green size=25>' + result.responseText + '</font> </p>' ;
                                                    
                                var item = Ext.getCmp('panel3').items.items[0];
                                item.setHtml(resultContendHtml);
                                
                                loctionStaHtml = '<p align="center"><font size=4>' + '位置状态: 未知' + '<br/> </font> </p>' 
                                                +'<p align="center"><font color=green size=3>' +'' + '</font> </p>' ;                                                    
                                var item = Ext.getCmp('panel3').items.items[1];
                                item.setHtml(loctionStaHtml);
                                                                    
                                Ext.Viewport.animateActiveItem(panel3, {  
                                    type : 'pop',  
                                    //direction : 'left' 
                                });
                            },
                            failure: function ( result, request) { 
                                alert("Failed: "+result.responseText);
                            } 
                        });         
                        
                        UpdateWxLocation();
                                                                                 
                        } //handler function
                    }]
               }  // toolbar
                            
            ]
       
     }); //pannelform2
     
     

       var panel3 = Ext.create('Ext.Panel', {
       id: 'panel3',
       scrollable:'vertical',
       
       items: [    
            {
                //padding: 20,
                //border: 10,
                margin: '50 15 5 15', 
                html: resultContendHtml, 
                
            },          

            {
                    //docked: 'bottom',
                    margin: '50 15 10 15',
                    html: loctionStaHtml,                
            },
             
             {              
                    xtype: 'panel',               
                    //docked: 'bottom',
                    margin: '20 15 10 15', 
            
                    items: [
                    {
                        xtype: 'button',
                        //id: 'btnGetnum',
                        ui: 'plain',    
                        width: '100%',
                        height: '38px',                                       
                        style: {
                            background: '#04BD00',
                            color:'white',              
                        },  
                        //disabled: true,
                        text: '更新位置',
                        handler : function(button) {
                            
                            //alert("正在重新获取位置\n请您稍后查看");
                            loctionStaHtml = '<p align="center"><font size=4>' + '位置状态: 正在更新...' + '</font> </p>' ;
                                              //  +'<p align="center"><font color=green size=3>' +jsonObj.address + '<br/> </font> </p>' ;                                                    
                            var item = Ext.getCmp('panel3').items.items[1];
                            item.setHtml(loctionStaHtml);
                            
                            UpdateWxLocation();                          
                        }
                        
                    }, 
                                                      
                    ]
            },  // pann firest
                {              
                    xtype: 'panel',               
                    //docked: 'bottom',
                    margin: '20 15 20 15', 
            
                    items: [
                    {
                        xtype: 'button',
                        //id: 'btnGetnum',
                        ui: 'plain',    
                        width: '100%',
                        height: '38px',                                       
                        style: {
                            background: '#04BD00',
                            color:'white',              
                        },  
                        text: '修改信息',
                        handler : function(button) {
                            
                           Ext.Viewport.animateActiveItem(panel2, {  
                                type : 'slide',  
                                direction : 'left'  
                           }); 
                                                                        
                        }
                        
                    }, 
                    ]
                },   
       ]      
    });// panel3
   
   
     var panelAll = Ext.create('Ext.Panel', {
        id:'panelAll',
       layout: 'card',
       items: [panel2, panel3],
        
    });
    
    
    
                        Ext.Ajax.request({
                            url: '/servlet/sqlSurvey',
                            method: 'GET',
                            params: { requestFlag: 'GetUserInfo', userInfo: openId},
                            //jsonData: jSonString,
                            success: function (result, request ) { 
                                //alert("Success: "+result.responseText); 
                                console.log(result.responseText);
                                var jsonObj = JSON.parse(result.responseText);
                                if( jsonObj.userId != "" && jsonObj.mobile != "" && jsonObj.status == "ok" ) {
                                    Ext.Viewport.add(panelAll);
                                    
                                     resultContendHtml = '<p align="center"><font size=5>尊敬的&nbsp'+jsonObj.userName+'</font><font size=3>&nbsp 先生/女士 </font> </p>'
                                   + '<p align="center"><font size=4><br/>您的抽奖码为 <br/><br/> </font> </p>'   
                                   + '<p align="center"><font color=green size=25>' + jsonObj.userId  + '</font> </p>' ;
                                
                                    var item = Ext.getCmp('panel3').items.items[0];
                                    item.setHtml(resultContendHtml);
                                
                                    var geoStatus = "未知";
                                    if(jsonObj.geoStatus != "")
                                    {
                                        geoStatus =jsonObj.geoStatus;
                                    }
                                    loctionStaHtml = '<p align="center"><font size=4>' + '位置状态: ' +geoStatus+ '<br/> </font> </p>' 
                                                +'<p align="center"><font color=green size=3>' +jsonObj.address + '</font> </p>' ;                                                    
                                    var item = Ext.getCmp('panel3').items.items[1];
                                    item.setHtml(loctionStaHtml);
                                
                                    panelAll.setActiveItem(panel3); 
                                }
                                else {
                                    Ext.Viewport.add(panelAll);
                                    panelAll.setActiveItem(panel2);
                                }                                                  
                            },
                            
                            failure: function ( result, request) { 
                                alert("Failed: "+result.responseText);
                            } 
                            
                        });                                   
                        
                        
   
    
 } //LUANCH  
 
});
