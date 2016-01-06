
//@include sencha-toolbar-ui('yellow', #E9D890, 'bevel');

Ext.require(['Ext.List','Ext.data.Store', 'Ext.form.FieldSet', 'Ext.field.Select','Ext.tab.Panel',
            'Ext.chart.Chart','Ext.chart.PolarChart','Ext.chart.series.Pie','Ext.chart.interactions.Rotate',
            'Ext.chart.interactions.ItemInfo', 'Ext.chart.CartesianChart', 'Ext.chart.interactions.ItemHighlight',
            'Ext.form.Panel', 'Ext.data.Model','Ext.field.Search','Ext.plugin.PullRefresh','Ext.plugin.ListPaging','Ext.MessageBox']);

Ext.define('User', {
            extend: 'Ext.data.Model',
            config:{
                fields: [
                    'payMsg','money','payName',
                ],
                validations: [
                    //{type: 'presence',field:'userName',message:'姓名必须输入'},
                    {type: 'exclusion',field:'payMsg',
                    list:['他妈的','操','傻逼','逼','滚'],
                    message:'不能使用这个字'},
                    //{type:'length',field:'payMsg',min:2,max:4,message: '请正确输入被打赏者'},
     
                    //{type:'presence',field:'money',message : '金额必须输入'},
                    {type:'format',field: 'money',matcher: /^([1-9]|10)$/,message:'请输入正确的金额'},
                    
                    {type:'length',field:'payName',min:0,max:4,message: '请正确输入姓名'},
                    {type:'length',field:'payMsg',min:0,max:32,message: '留言内容过长'},
                ]
            }
});

Ext.define('RewardUserModel', {
    extend: 'Ext.data.Model',
    config: {
        fields: [{
            name: 'status',
            type: 'string'
        },
        {
            name: 'userId',
            type: 'string'
        },
        {
            name: 'openId',
            type: 'string'
        },
        {
            name: 'userName',
            type: 'string'
        },
        {
            name: 'mobile',
            type: 'string'
        },
        {
            name: 'project',
            type: 'string'
        },
        {
            name: 'showTime',
            type: 'string'
        },
        {
            name: 'introduce',
            type: 'string'
        },
        
        {
            name: 'totalFee',
            type: 'string'
        },
        {
            name: 'company',
            type: 'string'
        },       
        ]
    }
});

Ext.define('rewardOrdersModel', {
    extend: 'Ext.data.Model',
    config: {
        fields: [{
            name: 'id',
            type: 'string'
        },
        {
            name: 'ordersNum',
            type: 'string'
        },
        {
            name: 'transactionId',
            type: 'string'
        },
        {
            name: 'prePayId',
            type: 'string'
        },
        {
            name: 'body',
            type: 'string'
        },
        {
            name: 'totalFee',
            type: 'string'
        },
        {
            name: 'isPay',
            type: 'string'
        },
        {
            name: 'payToUserId',
            type: 'string'
        },
        {
            name: 'payToOpenId',
            type: 'string'
        },
        {
            name: 'payToUserName',
            type: 'string'
        },
        {
            name: 'payFromOpenId',
            type: 'string'
        },
        {
            name: 'payFromUser',
            type: 'string'
        },
        {
            name: 'payFromMobile',
            type: 'string'
        },
        {
            name: 'payMsg',
            type: 'string'
        },
        {
            name: 'payTime',
            type: 'string'
        },
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

var resultContendHtml = "";
var loctionStaHtml = "";
var userId = "";
var openId = "";
var appId = "";
var gPayOrders;

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
    //var urlStr = "/servlet/WxMpWyySend?req=getJsapiSignature&url="+ curUrl;
    var urlStr = "/svtbase/MpService?req=getJsapiSignature&appId="+appId+"&url="+curUrlEncode;
    var curUrl = window.location.href;
    console.log("urlStr:"+urlStr);  
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

function  ValidateUserInfo(panelObj)
{
                        //console.log('field change');
                            
                        var model = Ext.create('User',panelObj.getValues());
                        var errors = model.validate();
                        if(errors.isValid()) {
                             var item = Ext.getCmp('panelform2').items.items[1].getComponent('btnPay');
                             item.enable();                                  
                             item.setStyle({
                                    background: '#04BD00',
                                    color:'white', 
                             })            
                            
                            var item = Ext.getCmp('panelform2').items.items[0];
                            item.setInstructions('<p align="left"><font size=3>' + '请填写打赏单'+ '</font> </p>');  
                        }
                        else {
                            var item = Ext.getCmp('panelform2').items.items[1].getComponent('btnPay');
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


function CheckUnPayOrders(payFromOpenId, payToUserId) {
    var ret = "";
    OrdersInfo =new Object();
    OrdersInfo.payFromOpenId = payFromOpenId;
    OrdersInfo.payToUserId = payToUserId;                                
    var jSonOrdersInfo  = JSON.stringify(OrdersInfo); 
    console.log("jSonUserInfo:"+ jSonOrdersInfo); 
    
    retObj =new Object();
    retObj.status= "fail";
    ret = JSON.stringify(retObj);  
                        
    Ext.Ajax.request({
        url: '/servlet/sqlSurvey',
        method: 'GET',
        async: false,
        params: { requestFlag: 'checkUnPayOrders', payFromOpenId:payFromOpenId, payToUserId: payToUserId},

        success: function (result, request ) { 
            //console.log("CheckUnPayOrders: "+result.responseText);
            ret =  result.responseText;
            //var jsonObj = JSON.parse(result.responseText);                                         
            //ret = jsonObj.status;                                                                                                             
        },
                            
        failure: function ( result, request) { 
            console.log("console.log Failed:"+result.responseText);
            retObj.status= "error"; 
            ret = JSON.stringify(retObj);  
        }                            
    }); 
                
    return ret;
}

function invokePay(payObj) {
    
          
                        WeixinJSBridge.invoke('getBrandWCPayRequest',
                        {  
                        "appId" : payObj.appId,                  //公众号名称，由商户传入  
                        "timeStamp": payObj.timeStamp,          //时间戳，自 1970 年以来的秒数  
                        "nonceStr" : payObj.nonceStr,         //随机串  
                        "package" :  payObj.packageValue,      //商品包信息</span>  
                        "signType" : payObj.signType,        //微信签名方式:  
                        "paySign" : payObj.paySign,           //微信签名  
                        },
                        function(res){      
                            //alert(res.err_msg);  
                            if(res.err_msg == "get_brand_wcpay_request:ok" ) {  
                               //window.location.href=obj.sendUrl; 
        
                                MsgBox("","打赏支付成功");
                                 var item = Ext.getCmp('panelform2').items.items[0];
                                item.setInstructions('<p align="left"><font color=#04BD00 size=3>' + '打赏成功,感谢您的捧场'+ '</font> </p>');         
                                 
                            }else{  
                                MsgBox("","打赏支付失败");
                                var item = Ext.getCmp('panelform2').items.items[0];
                                item.setInstructions('<p align="left"><font color=red size=3>' + '打赏失败, 请重试...'+ '</font> </p>');    
                            }
                            
                            var itemButton = Ext.getCmp('panelform2').items.items[1].getComponent('btnPay');
                            itemButton.enable();                                  
                            itemButton.setStyle({
                                background: '#04BD00',
                                color:'white', 
                            })  
                          
                        });   
                        
}


var RewardName="";
var RewardUserId;

var RewardUserSto;
var rewardOrdersStore;
var RewardUserStoByFee;  

var payFromUser = "留下您的大名";
var payMsg = "讲的不错,为你喝彩!";
var totalFee = 0;       
//------------------------------------------------
Ext.application({
    name : 'Fiddle',

    launch : function() {

    openId = GetQueryString("OpenId");
    console.log("openId:"+ openId);

    appId = GetQueryString("appId");
    console.log("appId:"+ appId);
    
    enableWxConfig();
    
    RewardUserSto =  Ext.create('Ext.data.Store', {
        id: 'RewardUserStore',
        //extend: 'Ext.data.Store',
        model: 'RewardUserModel',
        //fields: ['name'],
        storeId: 'RewardUserStore',
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

            url: '/servlet/sqlSurvey?requestFlag=GetRewardUserList',
            limitParam: 'limit',
            pageParam: 'page',
            reader: {
                type: "json",
                rootProperty: 'userInfo',
                totalProperty: 'count'
            }
        }
});

    RewardUserStoByFee =  Ext.create('Ext.data.Store', {
        id: 'RewardUserStoByFee',
        //extend: 'Ext.data.Store',
        model: 'RewardUserModel',
        //fields: ['name'],
        storeId: 'RewardUserStoByFee',
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
        //pageSize: 5,
        proxy: {
            type: 'ajax',

            url: '/servlet/sqlSurvey?requestFlag=GetRewardUserListByFee&pageSize=10',
            limitParam: 'limit',
            pageParam: 'page',
            reader: {
                type: "json",
                rootProperty: 'userInfo',
                totalProperty: 'count'
            }
        }
});

    rewardOrdersStore =  Ext.create('Ext.data.Store', {
    id: 'rewardOrdersStore',
    //extend: 'Ext.data.Store',
        model: 'rewardOrdersModel',
        //fields: ['name'],
        storeId: 'rewardOrdersStore',
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
        //每页显示数据条数，此参数传递到服务端
        pageSize: 10,
        proxy: {
            type: 'ajax',
            //服务端地址
            url: '/servlet/sqlSurvey?requestFlag=GetRewardOrders4ST',
            //分页每页显示条数名称，默认为limit，此参数传递到服务端
            limitParam: 'limit',
            //分页页码名称，默认为page，此参数传递到服务端
            pageParam: 'page',
            reader: {
                type: "json",
                //服务端返回数据集数据源名称，用于指定数据源，可以不指定默认值为‘’
                rootProperty: 'userInfo',
                //服务端返回数据集数据总数名称，用于分页，默认值为total
                totalProperty: 'count'
            }
        }
    
});

    var panel1 = Ext.create('Ext.Panel', {
    id: 'panel1',
    //title: '嘉宾', 
    //iconCls: 'user',
    //fullscreen: true,
    
    //scrollable:'vertical',
    
    //docked: 'top',
    //width: 200,
    //heigth: 60,
    layout: {
        type: 'vbox',
        //align: 'start',
    },
    
    items: [
    /*
    {
        
        xtype: 'panel',
        id: 'topPannel1',
        docked: 'top',
        height: '35px',
        margin: '5 10 0 10',
        layout: {
            type: 'vbox',
            //align: 'start',
        },
        html: '<p align="center"><font color=#04BD00 size=5>' + '会 议 议 程'+ '</font> </p>',
       
       
    },
 
    
function UpdateRewardFormStatus() {
    var item;    
    item = Ext.getCmp('panel1').items.items[0].getComponent('txt_money');
    item.setPlaceHolder(totalFee);    
    item = Ext.getCmp('panel1').items.items[0].getComponent('txt_payName');
    item.setPlaceHolder(payFromUser);  
    item = Ext.getCmp('panel1').items.items[0].getComponent('txt_payMsg');
    item.setPlaceHolder(payMsg);         
}
    */
        {
            id: 'list1',
            flex: 8,
            xtype: 'list',
            store: RewardUserSto,
            selectedCls: 'x-item-selected1',
            onItemDisclosure: function (record, btn, index) {
                    console.log('Tap index'+index+" name:"+record.data.userName);             
                    RewardUserId = record.data.userId;                 
                    RewardName = record.data.userName;
                    
                    if( RewardName == "孙总" ){
                        Ext.Viewport.animateActiveItem(panel3, {  
                            type : 'slide',  
                            direction : 'left' 
                        });
                        return;                    
                    }
                    
                    var item = Ext.getCmp('panelform2').items.items[0];
                    item.setTitle("打赏给 "+RewardName);
                       
    
    if( totalFee != 0){
        item = Ext.getCmp('panelform2').items.items[0].getComponent('txt_money');
        //item.setPlaceHolder(totalFee);
        item.setValue(totalFee);
        var item2 = Ext.getCmp('panelform2').items.items[1].getComponent('btnPay');
                             item2.enable();                                  
                             item2.setStyle({
                                    background: '#04BD00',
                                    color:'white', 
                             }) 
                             
        item = Ext.getCmp('panelform2').items.items[0].getComponent('txt_payName');
        //item.setPlaceHolder(payFromUser);
        item.setValue(payFromUser);  
        item = Ext.getCmp('panelform2').items.items[0].getComponent('txt_payMsg');
        //item.setPlaceHolder(payMsg);
        item.setValue(payMsg);                         
    }

        
  
                         
                    Ext.Viewport.animateActiveItem(panel2, {  
                        type : 'slide',  
                        direction : 'left' 
                    });
            },
            
            itemTpl: new Ext.XTemplate(
                '<p>{[this.outputHtml(values.userId)]}</p>',     
                {               
                    outputHtml:  function(valueIn)
                    {           
                        var index1 = RewardUserSto.find('userId', valueIn);
                        //console.log("store index:"+index1); //第5条记录，下标为4，输出4。
                        var myrecord = RewardUserSto.getAt(index1);
                  
                        //var typeStr = myrecord.get('userName') ; 
                        var dispStr = '<p style = "margin:3px 5px 8px 5px" >时间: &nbsp'+myrecord.get('showTime');
                        dispStr += '</p> <p style = "margin:8px 5px 8px 5px" >主题: &nbsp'+myrecord.get('project');
                        dispStr += '</p> <p style = "margin:8px 5px 2px 5px" >讲师: &nbsp <font color=#04BD00 >'+myrecord.get('userName');
                        
                        //dispStr = StrtoHtml(dispStr);
                        dispStr = '</font></p><font size=4>'+dispStr+ '</font>';           
                        return dispStr;    
                    }
                }),
                
        },
    ]
});
    
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
                title:'打赏给',
                //instructions:'请填写您的基本信息，并打开手机定位\n请允许获取地理位置，作为本活动现场抽奖凭证',
                //instructions:'为保证本活动顺利抽奖，请您确保:\n1. 开启手机GPS定位功能\n2. 允许获取您的地理位置',
                instructions: { 
                    title: '<p align="left"><font size=3>' + "请填写打赏单"+ '</font> </p>', 
                    //docked: 'bottom' 
                    //align: 
                }, 
                defaultType: 'textfield',
                margin: '15px',
                defaults:{
                    labelwidth:'20%',
                    //labelWidth: '110px',
                    
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
                    id:'txt_money',
                    name : 'money',
                    label: ' 金额',
                    cls: 'customField',
                    placeHolder:'打赏金额1~10元',  
                    required:true,
                    //clearIcon: true,
                },
                {
                    xtype: 'textfield',
                    id:'txt_payName',
                    name : 'payName',
                    label: ' 姓名',
                    placeHolder:'留下您的大名',
                    //required:true,
                    clearIcon: true,
                    //disabled:true,
                    //disabledCls:'disabled'
                },
                
                {
                    xtype: 'textareafield',
                    id:'txt_payMsg',
                    name : 'payMsg',
                    //height: '85px',
                    label: '留言',
                    cls: 'customField',
                    placeHolder:'您想说的话',
                    //required:true,
                    clearIcon: true
                },
                
                
                ]
                },
                
               {              
                xtype: 'panel',               
                //docked: 'bottom',
                margin: '10 15 8 15', 
            
                items: [
                {
                xtype: 'button',
                id: 'btnPay',
                //id:'btn1',
                ui: 'plain',    
                width: '100%',
                height: '38px',                                       
                style: {
                    background: '#A1DF8C',
                    color:'white',              
                },  
                disabled: true,
                               
                text: '去打赏',
                handler : function(button) {
                    
                    //var jSonFormInfo  = JSON.stringify(panel2.getValues()); 
                    //console.log("jSonFormInfo:"+ jSonFormInfo);
                    //return;
                    // -----------------
                    var itemButton = Ext.getCmp('panelform2').items.items[1].getComponent('btnPay');
                    itemButton.disable();                                  
                    itemButton.setStyle({
                        background: '#A1DF8C',
                        color:'white', 
                    })     
                    
                     var item = Ext.getCmp('panelform2').items.items[0];
                       
                    var checkRet = CheckUnPayOrders(openId, RewardUserId); 
                    console.log("CheckUnPayOrders ret:"+ checkRet);    
                    var jSonPayObj  = JSON.parse(checkRet); 
                    if( jSonPayObj.status == "success" ) {
                        console.log("CheckUnPayOrders start to invoke...");
                        item.setInstructions('<p align="left"><font color=#04BD00 size=3>' + '请支付未完成打赏单...'+ '</font> </p>'); 
                        invokePay(jSonPayObj);
                              
                        return;
                    }
                               
                        var formObj = panel2.getValues();
                        OrdersInfo =new Object();
                        OrdersInfo.payFromOpenId = openId;
                        OrdersInfo.totalFee = formObj.money;
                        OrdersInfo.body = "打赏给"+RewardName;
                        OrdersInfo.payToUserId = RewardUserId;
                        OrdersInfo.payToUserName = RewardName;
                        OrdersInfo.payFromUser = formObj.payName;
                        OrdersInfo.payMsg = formObj.payMsg;

                        //update defaut form value
                        payFromUser = OrdersInfo.payFromUser;
                        payMsg = OrdersInfo.payMsg;
                        totalFee = OrdersInfo.totalFee;
                                              
                        var jSonOrdersInfo  = JSON.stringify(OrdersInfo); 
                        console.log("jSonPayInfo:"+ jSonOrdersInfo);
                        
                        item.setInstructions('<p align="left"><font color=#04BD00 size=3>' + '请稍后,正在生成打赏单...'+ '</font> </p>');              
                        Ext.Ajax.request({

                            url: '/servlet/sqlSurvey',
                            method: 'POST',
                            params: { requestFlag: 'createOrdersInfo', OrdersInfo: jSonOrdersInfo},
                            success: function ( result, request ) { 
                                console.log("Success: "+result.responseText); 
                                
                                var jsonObj = JSON.parse(result.responseText);
                                if( jsonObj.status != "success" ) {
                                    MsgBox("","抱歉:订单生成失败,请返回稍后再试");
                                    
                                    var itemButton = Ext.getCmp('panelform2').items.items[1].getComponent('btnPay');
                                    itemButton.enable();                                  
                                    itemButton.setStyle({
                                        background: '#04BD00',
                                        color:'white', 
                                    })  
                            
                                    return;
                                }
                                
                                invokePay(jsonObj); 
                                
                            },
                            failure: function ( result, request) { 
                                MsgBox("","未知错误: "+result.responseText);
                            } 
                        });         
                        
                                                                                 
                        } //handler function
                    }]
               },  // toolbar
                
            {              
                xtype: 'panel',               
                //docked: 'bottom',
                margin: '10 15 8 15', 
            
                items: [
                {
                xtype: 'button',
                //id: 'btnGetnum',
                //id:'btn1',
                ui: 'plain',    
                width: '100%',
                height: '38px',                                       
                style: {
                   background: '#04BD00',
                    color:'white',              
                },  
                //disabled: true,
                               
                text: '返回',
                handler : function(button) {
                    /*
                     Ext.Viewport.animateActiveItem(panel1, {  
                                type : 'slide',  
                                direction : 'left'  
                             }); 
                     */
                     //panelTabAll.setActiveItem(panelTab2);
                     // var tabs = panelTabAll.find( 'title', "议程");
                     console.log("Return:::: ret:"); 
                     
                    Ext.Viewport.add(panelTabAll);
                    //panelTabAll.setActiveItem(panelTab1);
                    Ext.Viewport.animateActiveItem(panelTabAll, {  
                                type : 'slide',  
                                direction : 'right'  
                             }); 
       
                }
                },
                ],
             },
                
            ]
       
     }); //pannelform2
     
     
     var panel3 = Ext.create('Ext.Panel', {
        id: 'panel3',
        //scrollable:'vertical',
        layout: {
            type: 'vbox',
            //pack: 'center',
            //align: 'center',
        }, 

        items: [
        {
                //padding: 20,
                //border: 10,
                margin: '50 15 30 15', 
                html: "不用， 谢谢了！", 
                
        },    
        
        {              
                xtype: 'panel',               
                //docked: 'bottom',
                margin: '10 15 8 15', 
            
                items: [
                {
                xtype: 'button',
                //id: 'btnGetnum',
                //id:'btn1',
                ui: 'plain',    
                width: '100%',
                height: '38px',                                       
                style: {
                   background: '#04BD00',
                    color:'white',              
                },  
                //disabled: true,
                               
                text: '返回',
                handler : function(button) {
                    
                    Ext.Viewport.add(panelTabAll);
                    //panelTabAll.setActiveItem(panelTab1);
                    Ext.Viewport.animateActiveItem(panelTabAll, {  
                                type : 'slide',  
                                direction : 'right'  
                             });    
                }
                },
                ],
        },
        ],
        
    });
    
    
   var panelTab1 = Ext.create('Ext.Panel', {
        id:'panelTab1',
        title: '议程',
        iconCls: 'star', 
       layout: 'card',
       items: [panel1, panel2, panel3],
        
    });
    
    //Ext.Viewport.add(panelTab1);
    //panelTab1.setActiveItem(panel1);
    
var panelTab2 = Ext.create('Ext.Panel', {
    id: 'panelTab2',
    title: '排名', 
    iconCls: 'user',
    //fullscreen: true,
    
    //scrollable:'vertical',
    
    //docked: 'top',
    //width: 200,
    //heigth: 60,
    layout: {
        type: 'vbox',
        //align: 'start',
    },
    
    items: [ 
  
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
        html: '<p align="center"><font color=#04BD00 size=5>' + 'TOP 10'+ '</font> </p>',
       
       
    },
        {
            id: 'list2',
            flex: 8,
            xtype: 'list',
            store: RewardUserStoByFee,
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
                
                refreshFn: function () { 　　　　　　 　　　　　　　　　　　
                    //panel1.getComponent('list1').getStore().loadPage(1);
                    panelTab2.getComponent('list2').getStore().load();
                    alert('pull down');
　　　　　　　　},

                listeners : {                
                    latestfetched : function() {
                        //GetSurveyStatus();     
                         panelTab2.getComponent('list2').getStore().load();  
                    },
                }          
            },
            ],
            
            itemTpl: new Ext.XTemplate(
                '<p>{[this.outputHtml(values.userName)]}</p>',     
                {               
                    outputHtml:  function(valueIn)
                    {   
                        //console.log("valueIn userName:"+valueIn)
                        var index1 = RewardUserStoByFee.find('userName', valueIn);
                        //console.log("store index:"+index1); //第5条记录，下标为4，输出4。
                        var myrecord = RewardUserStoByFee.getAt(index1);
                        
                        console.log("index:"+index1+" Name:"+myrecord.get('userName')+"  totalFee:"+myrecord.get('totalFee'));
                        
                        var number=index1+1;
                        //var typeStr = myrecord.get('userName') ; 
                        var dispStr = "\t"+number;
                        
                        dispStr += "\t\t"+myrecord.get('userName');
                        
                        var nameLen = strlenAll(myrecord.get('userName'));
                        //console.log("Name:"+myrecord.get('userName')+"  len:"+nameLen);
                        
                        for (var i=0; i<(14-nameLen)/2; i++)
                        {   
                            dispStr += "\t";
                            //dispStr += "肖磊";
                        }
                        //console.log("i="+i); &nbsp
                        
                        //dispStr += myrecord.get('totalFee')+" 元";
                        
                        dispStr = StrtoHtml(dispStr);
                        
                        dispStr = '<font size=4>'+dispStr+ '<font color=#04BD00 >'+myrecord.get('totalFee')+ '元 </font> </font>';           
                        return dispStr;    
                    }
                }),
                
        },
    ]
});

var panelTab3 = Ext.create('Ext.Panel', {
    id: 'panelTab3',
    title: '动态', 
    iconCls: 'info',
    //fullscreen: true,
    
    //scrollable:'vertical', rewardOrdersStore
    
    //docked: 'top',
    //width: 200,
    //heigth: 60,
    layout: {
        type: 'vbox',
        //align: 'start',
    },
      
    
    items: [
    {
        
        xtype: 'panel',
        id: 'searchpannel0',
        docked: 'top',
        //margin: '0 12 5 0',
        layout: {
            type: 'vbox',
            //align: 'start',
        },
        
        items: [
        {
            id: 'text1', 
            xtype: 'searchfield',
            //docked: 'top',
            lable: '搜索',
            placeHolder: '请输入姓名查询',
            //width: '100%',
            
            //flex: 6,
            listeners: {
                change: function() {
                    var tex2 =  panelTab3.getComponent('searchpannel0').getComponent('text1').getValue();
                    if( tex2 == ''){
                    
                        panelTab3.getComponent('list3').getStore().clearFilter();
                        panelTab3.getComponent('list3').getStore().loadPage(1);
                    }
                    else
                    {
                        panelTab3.getComponent('list3').getStore().clearFilter();
                        panelTab3.getComponent('list3').getStore().filter('userName', tex2);
                        panelTab3.getComponent('list3').getStore().load();
                        
                    }
                }              
            }
        },
        ]

    },
    
    {
            id: 'list3',
            flex: 8,
            xtype: 'list',
            store: rewardOrdersStore,
            selectedCls: 'x-item-selected1',
            
            requires: ['Ext.plugin.ListPaging', 'Ext.plugin.PullRefresh'],
            plugins:[
            {
　　　　　　　　xclass: 'Ext.plugin.PullRefresh',
　　　　　　　　pullText: '下拉可以更新',
                //pullRefreshText: '下拉更新frankie',
　　　　　　　　releaseText: '松开开始更新',
　　　　　　　　loadingText: '正在刷新……',
                loadedText: '已经刷新完成',
                
                refreshFn: function () { 　　　　　　 　　　　　　　　　　　
                    //panel1.getComponent('list1').getStore().loadPage(1);
                    panelTab3.getComponent('list3').getStore().load();
                    alert('pull down');
　　　　　　　　},

                listeners : {                
                    latestfetched : function() {
                        panelTab3.getComponent('list3').getStore().loadPage(1);
                        //panel1.getComponent('list1').getStore().load();
                         },
                }          
            },
            
            {
                xclass:'Ext.plugin.ListPaging',
                autoPaging: true,
                // These override the text; use CSS for styling
                loadMoreText: '加载更多...',
                noMoreRecordsText: '加载完成'
            } 
            ],
        
              itemTpl: new Ext.XTemplate(
                        //'<p>编号:{userId}  {userName} <br/>手机: {mobile} <p>',
                        //'<p>答卷:{reqStatus}  红包订单: {rpOrder} <p>',
                        //'<p>地址:{address} <p>',
                          '<p>{[this.outputHtml(values.id)]}</p>',     
                {               
                    outputHtml:  function(valueIn)
                    {           
                        var index1 = rewardOrdersStore.find('id', valueIn);
                        //console.log("store index:"+index1); //Dave第一次出现是在第5条记录，下标为4，输出4。
                        var myrecord = rewardOrdersStore.getAt(index1);
                  
                        var NameStr = myrecord.get('payFromUser');
                        if( NameStr == "") {
                            NameStr = "匿名";
                        } 
                        var dispStr = "<font color=#04BD00 >"+NameStr+" &nbsp </font> 给 &nbsp <font color=#04BD00 >" +myrecord.get('payToUserName')
                                        +" &nbsp </font> 打赏了 &nbsp <font color=#04BD00 >"+myrecord.get('totalFee')+" </font>元";
                        
                        dispStr += '<p style = "margin:8px 0px 0px 0px" >留言:&nbsp'+myrecord.get('payMsg');
                
                        //dispStr = StrtoHtml(dispStr);
                        dispStr = '</p> <font size=4>'+dispStr+ '</font>'; 
                                  
                        return dispStr;    
                             
                    }
                }),
        }, //list3
    ]
});


 panelTabAll = Ext.create('Ext.TabPanel', {
    id: 'panelTabAll',
    fullscreen: true,
    tabBarPosition: 'bottom', 
     
    tabBar : {
        ui: 'plain',
        //height: '35px',
        layout: { pack: 'justify' },

        style: {
        
        },   
     
    },
    
    layout: {
        type: 'card',
        animation: {
            type: 'fade'
        }
    },
  
     items: [
     
        panelTab1,
        panelTab2,
        panelTab3,        
    ],
     
    //items: [panel0, panel1, panel2, panel3],
});

 //Ext.Viewport.add(panelTab0);
 /*
 var panelAll = Ext.create('Ext.Panel', {
        id:'panelAll',
       layout: 'card',
       items: [panelLogin, panelTab0],        
});
*/

Ext.Viewport.add(panelTabAll);
panelTabAll.setActiveItem(panelTab1);
//panelAll.setActiveItem(panelLogin);  //panelTabAll.setActiveItem(panelTab1);

Ext.Ajax.request({
//http://hz2.byodwork.cn/servlet/sqlSurvey?requestFlag=queryRewardOrdersLast&payFromOpenId=oj51IuFxcyJmjHe92f_fZvixMDFs
                            url: '/servlet/sqlSurvey',
                            method: 'GET',
                            params: { requestFlag: 'queryRewardOrdersLast', payFromOpenId: openId},
                            success: function ( result, request ) { 
                                console.log("Success: "+result.responseText); 
                                
                                var jsonObj = JSON.parse(result.responseText);
                                if( jsonObj.status != "fail" ) {
                                    payFromUser = jsonObj.payFromUser;
                                    payMsg = jsonObj.payMsg;
                                    totalFee = jsonObj.totalFee; 
                                    return;
                                }                                                             
                                
                            },
                            failure: function ( result, request) { 
                                MsgBox("","未知错误: "+result.responseText);
                            } 
                        });         
                        
 
 


 } //LUANCH  
 
});
