
//@include sencha-button-ui('pink', #333, 'matte', #AE537A);

Ext.require(['Ext.List','Ext.data.Store', 'Ext.form.FieldSet', 'Ext.field.Select','Ext.Toast','Ext.TabPanel',
            'Ext.grid.Grid','Ext.grid.column.Column','Ext.ux.touch.grid.List',
            'Ext.chart.Chart','Ext.chart.PolarChart','Ext.chart.series.Pie','Ext.chart.interactions.Rotate',
            'Ext.chart.interactions.ItemInfo', 'Ext.chart.CartesianChart', 'Ext.chart.interactions.ItemHighlight',
            'Ext.form.Panel', 'Ext.data.Model','Ext.field.Search','Ext.plugin.PullRefresh','Ext.plugin.ListPaging','Ext.MessageBox']);


Ext.define('userInfoModel', {
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
            name: 'passwd',
            type: 'string'
        },
        {
            name: 'gender',
            type: 'string'
        },
        {
            name: 'age',
            type: 'string'
        },
        {
            name: 'mobile',
            type: 'string'
        },
        {
            name: 'nickName',
            type: 'string'
        },
        {
            name: 'address',
            type: 'string'
        },
        {
            name: 'company',
            type: 'string'
        },
        {
            name: 'rpOrder',
            type: 'string'
        },
        {
            name: 'reqStatus',
            type: 'string'
        },
        {
            name: 'geoStatus',
            type: 'string'
        },
        {
            name: 'latitude',
            type: 'string'
        },
        {
            name: 'longitude',
            type: 'string'
        },
        {
            name: 'accuracy',
            type: 'string'
        },
        ]
    }
});

Ext.define('Auth', {
            extend: 'Ext.data.Model',
            config:{
                fields: [
                    'password',
                ],
                validations: [
                    //{type:'presence',field:'mobile',message : '手机号必须输入'},
                    {type:'length',field:'password',min:6,max:10,message: '请正确输入密码'},
                    //{type:'format',field: 'mobile_query',matcher: /^\+?[1-1][3-8][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/,message:'请正确输入您的手机号'},
                ]
            }
});

var userStore =  Ext.create('Ext.data.Store', {
    id: 'userInfoStore',
    //extend: 'Ext.data.Store',
        model: 'userInfoModel',
        //fields: ['name'],
        storeId: 'userInfoStore',
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
        pageSize: 5,
        proxy: {
            type: 'ajax',
            //服务端地址
            url: '/servlet/sqlSurvey?requestFlag=GetUserInfoAll',
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


var detailHtml;
var surveyStaHtml = "";
var SurveyStatusObj;
var delTableName = "orders";

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
    if (r != null) return unescape(r[2]); return null;
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

function UpdateSettingFormStatus(SurverStatusObj) {
    var item;

    item = Ext.getCmp('panel3').items.items[0].items.items[0];
    //item.setPlaceHolder(SurverStatusObj.totalMoney);   
 
    item = Ext.getCmp('panel3').items.items[0].getComponent('txt_rpNum');
    //item.setPlaceHolder(SurverStatusObj.rpNum); 
    
    item = Ext.getCmp('panel3').items.items[0].getComponent('txt_minMoney');
    item.setPlaceHolder(SurverStatusObj.minMoney); 
    
    item = Ext.getCmp('panel3').items.items[0].getComponent('txt_centerDistance');
    item.setPlaceHolder(SurverStatusObj.centerDistance); 
    
    item = Ext.getCmp('panel3').items.items[0].getComponent('rpCheckLocation');
    if( SurverStatusObj.rpCheckLocation == "true"){
        item.setChecked(true); 
    }else {  item.setChecked(false); }
                              
    item = Ext.getCmp('panel3').items.items[0].getComponent('rpCheckEnable');
    if( SurverStatusObj.rpCheckEnable == "true"){
        item.setChecked(true); 
    }else {  item.setChecked(false); }
      
}

var panel0;
var panelTab0;
var panelLogin;

function GetSurveyStatus() {
    
    Ext.Ajax.request({
        
    url: '/servlet/sqlSurvey',
    method: 'GET',
    params: { requestFlag: 'GetSurveyStatus'},
    //jsonData: jSonString,
    success: function (result, request ) { 
            //alert("Success: "+result.responseText); 
        console.log(result.responseText);
        
        var jsonObj = JSON.parse(result.responseText);
        
        //UpdateSettingFormStatus(jsonObj);
         
        var rpEnable = "未开放";                            
        if( jsonObj.rpCheckEnable == "true"){
            rpEnable = "已开放"; 
        }
        
        var rpLocation = "否";  
        if( jsonObj.rpCheckLocation == "true"){
            rpLocation = "是";
        }
        
        var htmlStr = "\n嘉宾签到: "+jsonObj.userIdCnt + "\n微信用户: "+jsonObj.openIdCnt
                    + "\n手机注册: "+jsonObj.mobileCnt + "\n问卷完成: "+jsonObj.reqStatusCnt
                    + "\n现场嘉宾: "+jsonObj.geoStatusCnt + "\n领取红包: "+jsonObj.rpOrderCnt
                    + "\n位置登记: "+jsonObj.addressIdCnt + "\n"
                    + "\n红包状态: "+rpEnable + "\n红包总数: "+jsonObj.rpNum
                    + "\n红包最小: "+jsonObj.minMoney + " 元\n红包总额: "+jsonObj.totalMoney+ " 元\n"
                    + "\n位置验证: "+rpLocation
                    + "\n巡展范围: "+jsonObj.centerDistance + " 公里\n巡展地点: "+jsonObj.adressCenter+"\n";
                 
                               
        surveyStaHtml = '<p align="center"><font size=5> 巡展现场状态<br/><br/></font> </p> <p'+StrtoHtml(htmlStr)+' </p>';                                     
        var item = Ext.getCmp('panel0').items.items[0];
        //item.setHtml(surveyStaHtml);
        
        var tmpStaStore = Ext.create('Ext.data.Store', {
        fields: ['StaName', 'StaValue'],
        data: [
            { StaName: '嘉宾签到',  StaValue: jsonObj.userIdCnt+" 人"},
            { StaName: '手机注册',  StaValue: jsonObj.mobileCnt+" 人"},
            { StaName: '微信用户',  StaValue: jsonObj.openIdCnt+" 人"},
            { StaName: '位置登记',  StaValue: jsonObj.addressIdCnt+" 人" },
            { StaName: '现场嘉宾',  StaValue: jsonObj.geoStatusCnt+" 人" },
            { StaName: '问卷完成',  StaValue: jsonObj.reqStatusCnt+" 人" },
            { StaName: '领取红包',  StaValue: jsonObj.rpOrderCnt+" 人" },
            { StaName: '',  StaValue: ''},
            { StaName: '红包状态',  StaValue: rpEnable },
            { StaName: '位置验证',  StaValue: rpLocation },
            { StaName: '巡展范围',  StaValue: jsonObj.centerDistance+" 公里" },
            { StaName: '巡展地点',  StaValue: jsonObj.adressCenter },
        ]
        });
        
        panel0.getComponent('list0').getStore().sync();
        panel0.getComponent('list0').setStore(tmpStaStore);
                                                                                
    },
                            
    failure: function ( result, request) { 
    alert("Failed: "+result.responseText);
   } 
                            
   });                           
    
}

function CheckLoginStatus() {

                            var htmlRet = StrtoHtml("请输入管理员密码");
                            htmlRet = '<p align="left"><font size=3>' + htmlRet+'</font> </p>';
                            var item = Ext.getCmp('panelLogin').items.items[0];
                            item.setInstructions(htmlRet);      
                            
                        var model = Ext.create('Auth',panelLogin.getValues());
                        var errors = model.validate();
                        if(errors.isValid()) {
                            console.log('validate ok');
                             var item = Ext.getCmp('panelLogin').items.items[1].getComponent('btnLogin');
                             item.enable();                                  
                             item.setStyle({
                                    background: '#04BD00',
                                    color:'white', 
                             })            
                                                     
                        }
                        else {
                            console.log('validate failed');
                            var item = Ext.getCmp('panelLogin').items.items[1].getComponent('btnLogin');
                             item.disable();                                  
                             item.setStyle({
                                    background: '#A1DF8C',
                                    color:'white', 
                             })     
                             
                            var message = "";
                            Ext.each(errors.items,function(rec){                            
                                message += rec.getMessage()+"\n";
                            });
                        }
}                          


function VerifyUserPasswd(name, password) {
    var ret = "fail";
    userInfo =new Object();
    userInfo.name = name;
    userInfo.password = password;                                
    var jSonUserInfo  = JSON.stringify(userInfo); 
    console.log("jSonUserInfo:"+ jSonUserInfo); 
     
    Ext.Ajax.request({
        url: '/servlet/sqlSurvey',
        method: 'GET',
        async: false,
        params: { requestFlag: 'VerifyUserPasswd', name:name, password: password},

        success: function (result, request ) { 
            console.log("VerifyUserPasswd: "+result.responseText); 
            var jsonObj = JSON.parse(result.responseText);                               
            
            ret = jsonObj.status;                                                                                                             
        },
                            
        failure: function ( result, request) { 
            console.log("console.log Failed:"+result.responseText);
            ret = "error"; 
        }                            
    }); 
               
    return ret;
}


function VerifyAdmin(callbackFunc) 
{ 
            var prompt = Ext.create('Ext.MessageBox',{
        	title:'身份验证',
        	message:'请输入密码',
            style: {
                background: '#D5D5D5',
            },
        	prompt:{
        		xtype:'passwordfield', //xtype:'textareafield' etc
                id:'txt_passwd',
                name : 'passwd',
                placeHolder:'后台管理密码',  
                required:true,
                clearIcon: true,
                listeners: {
                    change: function(field, newVal, oldVal) {                           
                        prompt.setMessage("请输入密码"); 
                    },
                        
                    keyup: function(field, newVal, oldVal) {
                        prompt.setMessage("请输入密码"); 
                    },
                },
        	},
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
        			
        			var password = btn.getParent().getParent().getPrompt().getValue();//get input text
                    console.log("password is:"+password);                   
                     /* 
                    var str = VerifyUserPasswd("admin", password);
    
                    if( str != "success") {
                        //prompt.setMessage("密码不正确!");
                        //return; 
                    }
                    */
                    prompt.hide();
                                       
                    callbackFunc(password);
        		},
        	}],
        	listeners:[{
        		event:'painted',
        		fn:function(){
        			this.getPrompt().focus()
        		}
        	}]
        });
         
        Ext.Viewport.add(prompt);  
}

Ext.application({
    name : 'Fiddle',

    launch : function() {
         

var StaStore = Ext.create('Ext.data.Store', {
    fields: ['StaName', 'StaValue'],
    data: [
        { StaName: '系统状态',  StaValue: '0'},
    ]
});


panel0 = Ext.create('Ext.Panel', {
    id: 'panel0',
    title: '状态', 
    iconCls: 'info', 
    //fullscreen: true,
    
    //scrollable:'vertical',
    layout: {
        type: 'vbox',
        //align: 'start',
    },
       
    items: [
    
    {
            
            xtype: 'panel',
            //heigth:'20px',
            docked: 'top',
            margin: '8px',
            html: '<p align="center"><font size=4> 巡展状态 </font> </p>',          
    },
       
    {
        
        xtype: 'list',
        id: 'list0',
        store: StaStore,
        //cls: 'tenders',
        //ui: 'plain',
        selectedCls: 'x-item-selected1',
        flex: 1,
        itemTpl: '<div>{StaName} &nbsp &nbsp <font color=green size=3> {StaValue} </font> </div>',
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
                    panel1.getComponent('list1').getStore().load();
                    alert('pull down');
　　　　　　　　},

                listeners : {                
                    latestfetched : function() {
                        GetSurveyStatus();       
                    },
                }          
            },
        ],
        /* 
        xtype: 'grid',
        requires: [
        'Ext.grid.column.Column'
        ],
        title: '巡展状态统计',
        store: StaStore,
        columns: [
        { xtype: 'column', width: 40,  text: '状态',  dataIndex: 'StaName', },
        { xtype: 'column',  width: 30, text: '人数', dataIndex: 'StaValue',},

        ],
        height: 500,
        width: '500',
        //layout: 'fit',
        //fullscreen: true    
        
       
        xtype:'touchgridpanel',  
                store      : 'StaStore',  
              
         scrollable: {  
                direction: 'vertical',  
                directionLock: true  
            },  
                         
                    columns   : [  
                    {  
                        text    : '状态',  
                        dataIndex : 'StaName',  
                        //style     : 'padding-left: 1em;',  
                        width     : '40px',  
                       
                    },  
                    {  
                        text    : '人数',  
                        dataIndex : 'StaValue',  
                        //style     : 'text-align: center;',  
                        width     : '60px',  
                       
                    },   
                    ],
                height: 500,
        width: '500', 
        
        */                     
    },
     /*
     {            
        xtype:'panel',
        layout: {
            //pack: 'center',
            pack: 'justify',
            type: 'hbox', 
            align: 'center',                
        },
        
        style: {
        background: '#04BD00',
        //background: 'transparent',
        },
        
        margin: '10 15 8 15', 
        docked: 'bottom',
        items: [ 
        {
            xtype: 'button',
            ui: 'plain',                    
            height: '38px',
            width: '30%',                    
            style: {
                background: '#04BD00',
                color:'white',              
            },
                        
            //cls:'normal_btn',
            text: '系统设置',
            handler : function(button) {
                                                                      
                Ext.Viewport.animateActiveItem(panel3, {  
                type : 'pop',  
                //direction : 'left' 
                });                                                                    
            }, 
        },
        
        { xtype: 'spacer', }, 
                          
        {
            xtype: 'button',
            ui: 'plain',
            height: '38px',
            width: '30%',                    
            style: {
                background: '#04BD00',
                color:'white',              
            },              
            //cls:'normal_btn',
            text: '嘉宾信息',
            handler : function(button) {
                                             
                Ext.Viewport.animateActiveItem(panel1, {  
                type : 'pop',  
                //direction : 'left' 
                });                                                                    
            }, 
        }                                              
        ]
     },  // pann firest 
     
      {              
        xtype: 'panel',
        //id: 'panelBtn1',
        //docked: 'bottom',
        margin: '10 15 8 15', 
            
        items: [
        {
            xtype: 'button',
            //id:'btn1',
            ui: 'plain',    
            width: '100%',
            height: '38px',                                       
            style: {
                background: '#04BD00',
                color:'white',              
            },                       

            text: '刷    新',
            handler : function(button) {
                //Ext.toast('状态更新中...', 600);
                //var item = Ext.getCmp('panel0');//.items.items[2].getComponent('btn1');
                //item.setMasked(true);
               // Ext.Viewport.unmask(false);
                
              
               Ext.Viewport.setMasked({ 
    masked: {
       xtype: 'loadmask',
       message: 'A message..',
       transparent: true,
       indicator: false
    }
});
             
                    
               Ext.toast(
               { 
                        message: '状态更新中...', 
                        timeout: '1000',
                        //animation: false,
                        //hideAnimation: true,
                        //ui:'plain',
    
                        style: {
                           border: '0px',
                           background:  '#04BD00',
                           color: 'white',
                        },
               });
                
                //GetSurveyStatus();                                                         
            }, 
        }                                              
        ]
     },   // pann firest 
      */
    ]
});



var panel1 = Ext.create('Ext.Panel', {
    id: 'panel1',
    title: '嘉宾', 
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
            placeHolder: '请输入要搜索的编号/手机/姓名等',
            //width: '100%',
            
            //flex: 6,
            listeners: {
                change: function() {
                    var tex2 =  panel1.getComponent('searchpannel0').getComponent('text1').getValue();
                    if( tex2 == ''){
                    
                        panel1.getComponent('list1').getStore().clearFilter();
                        panel1.getComponent('list1').getStore().loadPage(1);
                    }
                    else
                    {
                        panel1.getComponent('list1').getStore().clearFilter();
                        panel1.getComponent('list1').getStore().filter('userName', tex2);
                        panel1.getComponent('list1').getStore().load();
                        
                    }
                }              
            }
        },
        ]

    },
        /*
        {
            heigth: 20,
            xtype: 'panel',
            html: '',
            
        },
        */
        {
            id: 'list1',
            flex: 8,
            xtype: 'list',
            store: userStore,
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
                    panel1.getComponent('list1').getStore().load();
                    alert('pull down');
　　　　　　　　},

                /*
                onLatestFetched: function(store) {
                    panel1.getComponent('list1').getStore().loadPage(1);
                    //alert('pull downonLatestFetched');
                },
                */
                listeners : {                
                    latestfetched : function() {
                        panel1.getComponent('list1').getStore().loadPage(1);
                        //panel1.getComponent('list1').getStore().load();
                         },
                    
                    //getRefreshFn: function() {alert('pull down4'); },
                    //released: function() {alert('pull released');},
                    //change: function() {alert('pull down2change');},               
                    //refreshFn: function() {alert('pull down2');},
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
                          '<p>{[this.outputHtml(values.userId)]}</p>',     
                {               
                    outputHtml:  function(valueIn)
                    {           
                        var index1 = userStore.find('userId', valueIn);
                        console.log("store index:"+index1); //Dave第一次出现是在第5条记录，下标为4，输出4。
                        var myrecord = userStore.getAt(index1);
                  
                        //var typeStr = myrecord.get('userName') ; 
                        var dispStr = ""+myrecord.get('userId')+"  "+myrecord.get('userName')+"  "+myrecord.get('mobile');
                        if( myrecord.get('reqStatus') == 'true') {
                            dispStr += "\n问卷已答";
                        }else {  dispStr += "\n问卷未答"; }

                        if( myrecord.get('rpOrder') == "") {
                            dispStr += "    红包未领";
                        }else {  
                            dispStr += "    红包已领"; 
                        }
                        dispStr += "\n公司: "+myrecord.get('company');
                        dispStr += "\n地址: "+myrecord.get('address');
                        
                        dispStr = StrtoHtml(dispStr);
                        
                        dispStr = '<font size=3>'+dispStr+ '</font>';           
                        return dispStr;    
                    }
                }),
                
                //grouped: true,
                
               /*         
              listeners: {
                itemsingletap: function (list, idx, target, record, evt) {
                    //Ext.Msg.alert('itemsingletap', record.data.name);
                    
                    //detailHtml
                    var Str = '  点击题目下拉框选择题目\n  点击饼状图查看信息';    
                        detailHtml = '<p align="left"><font  color="black">' +StrtoHtml(Str)+ '</font> </p>'
                    
                    var item = Ext.getCmp('panel2').items.items[0];
                                item.setHtml(detailHtml);  
                                
                                
                    Ext.Viewport.animateActiveItem(panel2, {  
                                    type : 'pop',  
                                    //direction : 'left' 
                                });
                }, // itemsingletap
                itemdoubletap: function (list, idx, target, record, evt) {
                    Ext.Msg.alert('itemdoubletap', record.data.name);
                } // itemdoubletap
            } ,// listeners
            */
            
        },
        /*
      {              
        xtype: 'panel',
        docked: 'bottom',
        margin: '10 15 8 15', 
            
        items: [
        {
            xtype: 'button',
            //id:'btn2',
            ui: 'plain',    
            width: '100%',
            height: '38px',                                       
            style: {
                background: '#04BD00',
                color:'white',                
            },                
            text: '返回',
            handler : function(button) {
                                             
                Ext.Viewport.animateActiveItem(panel0, {  
                type : 'pop',  
                //direction : 'left' 
                });                                                                    
            }, 
        }                                              
        ]
     },  // pann firest 
     */            
    ]
});


var panel2 = Ext.create('Ext.Panel', {
    id: 'panel2',
    //scrollable:'vertical',
    //fullscreen: true,
    //docked: 'top',
    //width: 200,
    //heigth: 60,
    layout: {
        type: 'vbox',
        //align: 'start',
        //pack: 'justify',
    },
      
    
    items: [
    
    {
            heigth: 20,
            xtype: 'panel',
            html: '',
            
    },
    {
        xtype: 'panel',
        //docked: 'top',
        margin: '5 15 5 15', 
            
        items: [
        {
            xtype: 'button',
            id:'btn1',
            ui: 'plain',    
            width: '100%',
            height: '38px',                                       
            style: {
                background: '#04BD00',
                color:'white',              
            },                       

            text: '测   试8',
            handler : function(button) {
                                             
                Ext.Viewport.animateActiveItem(panel0, {  
                type : 'pop',  
                //direction : 'left' 
                });                                                                                             
            },
        }
        ] 
    },
    
    {
            xtype: 'button',
            ui: 'plain',
             
            width: '100%',
            height: '30px', 
                                    
            style: {
                background: 'white',
                //color:'white',
                //margin: '15px 20px  30px 40px', 
            },
            margin: '15px',
            //margin: '15px 20px  30px 40px',  
            //marginRight: '15px',                        
            cls: 'btnmargin2',
            
            text: '测  试 二2',
            handler : function(button) {

              var item = Ext.getCmp('panel2').items.items[1].getComponent('btn1');
              item.setStyle({
                     background: 'white',
                    color:'black',
              })
              
              item.setText("已测试完毕");
              item.disable();         
            }, 
    },                        
        
     {            
                    xtype:'panel',
                    layout: {
                        pack: 'center',
                        type: 'hbox',
                        //start: 'center',
                        //align: 'center',
                    },
                    style: {
                            background: '#04BD00',
                            //background: 'transparent',
                        },
                    margin: '12px',
                    docked: 'bottom',
                    items: [                    
                    {
                        xtype: 'button',
                        ui: 'plain',                    
                        style: {
                            background: 'transparent',
                        },
                        
                        cls:'normal_btn',
                        text: '返回',
                        handler : function(button) {
                            
                 
                           Ext.Viewport.animateActiveItem(panel1, {  
                                    type : 'pop',  
                                    //direction : 'left' 
                                });
                                                   
                        }
                        
                    }, 
                                                      
                    ]
            },  // pann firest 
       
    ]
});


var panel3 = Ext.create('Ext.form.Panel', {
    id: 'panel3',
    title: '设置', 
    iconCls: 'settings',
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
                xtype:'fieldset',
                id: 'filedset1',
                title:'系统设置',
                /*
                instructions: { 
                    title: '<p align="left"><font size=3>' + '配置本次巡展活动' + '</font> </p>', 
                    //docked: 'bottom' 
                }, 
                */
                defaultType: 'textfield',
                margin: '15px',
                defaults:{
                    //labelwidth:'30%'
                    labelWidth: '120px',
                    cls: 'customField',
                },
                border: 0,
                //disabledCls:'true',
                //hiddenCls : 'true',
                //collapsible: true,
                
                items: [
                {
                    xtype: 'textfield',
                    id:'txt_totalMoney',
                    name : 'totalMoney',
                    label: '红包总额',
                    cls: 'customField',
                    placeHolder:'总金额(例:888.00)',
                    //required:true,
                    clearIcon: true
                },
                {
                    xtype: 'textfield',
                    id:'txt_rpNum',
                    name : 'rpNum',
                    label: '红包总数',
                    cls: 'customField',
                    placeHolder:'红包总个数',
                    
                    //required:true,
                    clearIcon: true,
                },
                {
                    xtype: 'textfield',
                    id:'txt_minMoney',
                    name : 'minMoney',
                    label: '最小红包',
                    placeHolder:'最小额(需大于1.00)',
                    //required:true,
                    clearIcon: true,
                    //disabled:true,
                    //disabledCls:'disabled'
                },
                {
                    xtype: 'textfield',
                    id:'txt_centerDistance',
                    name : 'centerDistance',
                    label: '巡展范围',
                    placeHolder:'单位千米(例:0.5)',
                    //required:true,
                    clearIcon: true,
                    //disabled:true,
                    //disabledCls:'disabled'
                },
                {
                    xtype:'checkboxfield',
                    id: 'rpCheckLocation',
                    name : 'rpCheckLocation',
                    label: '位置验证',
                    value: 'true',
                    checked: true,
                },
    
                {
                    xtype:'checkboxfield',
                    id: 'rpCheckEnable',
                    name : 'rpCheckEnable',
                    label: '红包开放',
                    value: 'true',
                    checked: false,
                },
                
                {
                    xtype:'checkboxfield',
                    id: 'createRandTab',
                    name : 'createRandTab',
                    label: '生成红包',
                    value: 'true',
                    checked: false,
                },
                ]
    },
    
    
    /*
   {              
        xtype: 'panel',
        docked: 'bottom',
        margin: '5 15 10 15', 
            
        items: [
        {
            xtype: 'button',
            id:'btn3',
            ui: 'plain',    
            width: '100%',
            height: '38px',                                       
            style: {
                background: '#04BD00',
                color:'white',              
            },              
            text: '返回',
            handler : function(button) {
                                             
                Ext.Viewport.animateActiveItem(panel0, {  
                type : 'pop',  
                //direction : 'left' 
                });                                                                    
            }, 
        }                                              
        ]
     },  // pann firest 
    */
    {              
        xtype: 'panel',
        //docked: 'bottom',
        margin: '10 15 8 15', 
            
        items: [
        {
            xtype: 'button',
            //id:'btn2',
            ui: 'plain',    
            width: '100%',
            height: '38px',                                       
            style: {
                background: '#04BD00',
                color:'white',              
            },              
            text: '更新设置',
            handler : function(button) {                 
                
                //var url = "/download/students.xls";
                //window.open(url);
                //window.location = url;

                function updateConfig(password) 
                {   
                    var jSonConfigInfo  = JSON.stringify(panel3.getValues()); 
                    console.log("jSonConfigInfo:"+ jSonConfigInfo); 
                    
                    Ext.Ajax.request({
                            //url : 'http://112.74.76.96/xl/uip2.php',
                            url: '/servlet/sqlSurvey',
                            method: 'POST',
                            params: { requestFlag: 'updateConfig', ConfigInfo: jSonConfigInfo},
                            success: function ( result, request) {  /*
                                if( result.responseText == "ok") {
                                    alert("配置更新成功"); 
                                }else {  alert("配置更新失败");  }
                                */ 
                                 alert("配置更新成功");                         
                            },
                            failure: function ( result, request) { 
                                alert("配置更新失败，请稍后再试"); 
                            } 
                        });               
                                
                } ;
            
                VerifyAdmin(updateConfig);
                                                             
            }, 
        }                                              
        ]
     },  // pann firest 
    
    {              
        xtype: 'panel',
        //docked: 'bottom',
        margin: '30 15 8 15', 
            
        items: [
        {
            xtype: 'button',
            //id:'btn2',
            ui: 'plain',    
            width: '100%',
            height: '38px',                                       
            style: {
                background: '#04BD00',
                color:'white',              
            },              
            text: '设为会展点',
            handler : function(button) {
                
            function updatePosition(password) 
            { 
                enableWxConfig();
                
                wx.getLocation({
                    success: function (res) {
                                
                        var GeoInfo = new Object();
                                
                        GeoInfo.centerLat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                        GeoInfo.centerLng = res.longitude; // 经度，浮点数，范围为180 ~ -180。
                        //GeoInfo.accuracy = res.accuracy; // 位置精度
                        //var speed = res.speed; // 速度，以米/每秒计
                                
                        var jSonConfigInfo  = JSON.stringify(GeoInfo); 
                        console.log("jSonConfigInfo:"+ jSonConfigInfo); 
                    
                        Ext.Ajax.request({
                            //url : 'http://112.74.76.96/xl/uip2.php',
                            url: '/servlet/sqlSurvey',
                            method: 'POST',
                            params: { requestFlag: 'updateConfig', ConfigInfo: jSonConfigInfo},
                            success: function ( result, request ) { 
                                /*
                                if( result.responseText == "ok") {
                                    alert("配置更新成功"); 
                                }else {  alert("配置更新失败");  }
                                */ 
                                 alert("会展位置更新成功");                         
                            },
                            failure: function ( result, request) { 
                                alert("会展位置更新失败，请稍后再试"+result.responseText); 
                            } 
                        });                                                        
                                
                        }, //success
                         
                    fail:  function (res) {
                            alert("获取地理位置失败，请确保您打开了手机定位功能");
                    },
                    cancel:  function (res) { 
                            alert("请您允许获取地理位置，作为本活动现场抽奖凭证\n您可以稍后点击更新位置来允许"); 
                    },
               
               });
             }  //define function
               
              VerifyAdmin(updatePosition); 
            } //handler
        }
        ]
    },
    
          
         
    {              
        xtype: 'panel',
        //docked: 'bottom',
        margin: '20 15 10 15', 
            
        items: [
          {         
                    xtype: 'selectfield',
                    //cls: 'selectfield',
                    usePicker : false,
                   //disabledCls: 'true',
                    name:'genre',                                                  
                    labelWidth: '75px',       
                    label:'删除',
                    docked: 'top',
                    style: {
                            background: '#04BD00',
                        },
                    margin: '10 0 10 0', 
                    
                    //valueField:'id',
                    //displayField:'question',
                    //store:questionStore,                    
                    options:[ 
                        {
                          text: '用户红包订单',
                          value: 'orders', 
                        },               
                        {
                          text: '问卷统计结果',
                          value: 'answer', 
                        },  
                        {
                          text: '嘉宾登记信息',
                          value: 'user', 
                        },                     
                    ],
                    
                    listeners:{
                        change:function(select,newValue,oldValue){
                            //switch(newValue.data.value)
                            delTableName = this.getValue();
                            console.log("You selected delete Info:"+delTableName);                   
                        }
                    }
        },
        
        {
            xtype: 'button',
            //id:'btn2',
            ui: 'plain',    
            width: '100%',
            height: '38px',                                       
            style: {
                background: '#04BD00',
                color:'white',              
            },              
            text: '确认删除',
            handler : function(button) {                 
                
                function clearDataBaseTable(password) 
                {   
                    var objClearInfo = new Object();
                    objClearInfo.name = "admin";
                    objClearInfo.password = password
                    objClearInfo.tabName = delTableName;
                    var jSonClearInfo  = JSON.stringify(objClearInfo); 
                    console.log("jSonClearInfo:"+ jSonClearInfo); 
                    if( delTableName == ""){
                        return;
                    }
                    
                    Ext.Ajax.request({
                            url: '/servlet/sqlSurvey',
                            method: 'POST',
                            params: { requestFlag: 'clearDataBaseTable', clearInfo: jSonClearInfo},
                            success: function ( result, request) {
                                console.log("clearDataBaseTable success:"+result.responseText);
                                var jsonObj = JSON.parse(result.responseText);

                                if( jsonObj.status != "success" ){
                                    alert("删除 "+jsonObj.msg+" 数据失败"); 
                                }
                                else {
                                    alert("删除 "+jsonObj.msg+" 数据成功"); 
                                }
                                                                                                                       
                            },
                            failure: function ( result, request) { 
                                alert("删除数据失败，请稍后再试"); 
                            } 
                        });               
                                
                } ;
            
                VerifyAdmin(clearDataBaseTable);
                                                             
            }, 
        }                                              
        ]
     },  // pann firest 
     
    ]
});
        
   GetSurveyStatus();
  
  panelLogin = Ext.create('Ext.form.Panel', {
    id: 'panelLogin',
    //scrollable:'vertical',
    //fullscreen: true,
    //docked: 'top',
    layout: {
        type: 'vbox',
        //align: 'start',
        //pack: 'justify',
    },
      
    items: [
     {
                xtype:'fieldset',
                title:'管理员登录',
                instructions: { 
                    title: '<p align="left"><font size=3>' + '请输入管理员密码' + '</font> </p>', 
                    //docked: 'bottom' 
                    //align: 
                }, 
                defaultType: 'textfield',
                margin: '30 15 5 15',
                defaults:{
                    //labelwidth:'20%'
                    labelWidth: '90px',
                    listeners: {
                        keyup: function(field, newVal, oldVal) {
                            CheckLoginStatus() ;
                        },
                        change: function(field, newVal, oldVal) {
                            CheckLoginStatus() ;
                        },
                    },
                },
                border: 0,
                
                items: [
                {
                    xtype: 'passwordfield',
                    id:'txt_password',
                    name : 'password',
                    label: '密  码',
                    placeHolder:'请输入6-10位密码',
            
                    required:true,
                    clearIcon: true,
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
                id: 'btnLogin',
                ui: 'plain',    
                width: '100%',
                height: '38px',                                       
                style: {
                    background: '#A1DF8C',
                    color:'white',              
                },  
                disabled: true,
                               
                text: '登  录',
                handler : function(button) {
                    var formObj = panelLogin.getValues();                     
                    
                    /*
                    var str = VerifyUserPasswd("user", formObj.password);
    
                    if( str != "success") {
                        
                        var htmlRet = StrtoHtml("密码不正确！");
                        htmlRet = '<p align="left"><font color=red size=3>' + htmlRet+'</font> </p>';
                        var item = Ext.getCmp('panelLogin').items.items[0];
                        item.setInstructions(htmlRet); 
                        
                        return; 
                    }
                    */
                    Ext.Viewport.animateActiveItem(panelTab0, {  
                                type : 'pop',  
                                //direction : 'left'  
                    });    
                                                       
                }
            }
            ]
          },

    ]
});    
  
  //Ext.Viewport.add(panelLogin);

 
 panelTab0 = Ext.create('Ext.TabPanel', {
    id: 'panelTab0',
    fullscreen: true,
    tabBarPosition: 'bottom', 
    /*
    style: {
        margin:0,
        padding:0,       
    },   */       
    tabBar : {
        ui: 'plain',
        //height: '35px',
        layout: { pack: 'justify' },

        style: {
            // background: '#04BD00',
            //color:'white',    
            //padding: '0 35 0 35', No work
            //margin: '0 25 0 25',  No work  
        },   
     
    },
     /*        
    defaults: {
        styleHtmlContent: true,    
    },  */
    layout: {
        type: 'card',
        animation: {
            type: 'fade'
        }
    },
  
     items: [
        /*    
        {  
            title: '嘉宾', 
            iconCls: 'user',
            //html: "test",       
        },
        */
        panel0,
        panel1,
        panel3,        
    ],
     
    //items: [panel0, panel1, panel2, panel3],
});

 //Ext.Viewport.add(panelTab0);
 
 var panelAll = Ext.create('Ext.Panel', {
        id:'panelAll',
       layout: 'card',
       items: [panelLogin, panelTab0],        
});

Ext.Viewport.add(panelAll);
panelAll.setActiveItem(panelLogin);

 
       
    }
});

