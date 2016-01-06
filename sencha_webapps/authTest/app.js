
//@include sencha-toolbar-ui('yellow', #E9D890, 'bevel');

Ext.require(['Ext.List','Ext.data.Store', 'Ext.form.FieldSet', 'Ext.field.Select',
            'Ext.chart.Chart','Ext.chart.PolarChart','Ext.chart.series.Pie','Ext.chart.interactions.Rotate',
            'Ext.chart.interactions.ItemInfo', 'Ext.chart.CartesianChart', 'Ext.chart.interactions.ItemHighlight',
            'Ext.form.Panel', 'Ext.data.Model','Ext.field.Search','Ext.plugin.PullRefresh','Ext.plugin.ListPaging','Ext.MessageBox']);

Ext.define('loginInfo', {
            extend: 'Ext.data.Model',
            config:{
                fields: [
                    'user','password','loginType',
                ],
                validations: [
                    //{type: 'presence',field:'user',message:'姓名必须输入'},
                    {type: 'exclusion',field:'user',
                    list:['H3C','h3c','华三'],
                    message:'不能使用这个姓名'},
                    {type:'length',field:'user',min:2,max:4,message: '请正确输入您的帐号'},
     
                    {type:'length',field:'password',min:6,max:10,message: '请正确输入密码'},
                    //{type:'length',field:'mobile',min:11,max:11,message: '手机号长度必须为11位'},
                   
                    {type:'length',field:'loginType',min:2,max:20,message: '请正确输入登录类型'},
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


function ConfirmBox(callbackFunc, message) 
{ 
            var prompt = Ext.create('Ext.MessageBox',{
        	title:'确定',
        	message:message,
            /*
            style: {
                background: '#D5D5D5',
            },
            
        	prompt:{
        		
        	},
            */
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

var loginUser = "";
var wsurl= "";
//------------------------------------------------
Ext.application({
    name : 'Fiddle',

    launch : function() {

    openId = GetQueryString("OpenId");
    console.log("openId:"+ openId);
    
    wsurl = GetQueryString("wsurl");
    console.log("wsurl:"+ wsurl);

     var panel1 = Ext.create('Ext.Panel', {
        id: 'panel1',
        scrollable:'vertical',
        layout: {
            type: 'vbox',
            //pack: 'center',
            //align: 'center',
        }, 
        standardSubmit: 'false',

        items: [
        
                
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
                    background: 'green',
                    color:'white',              
                },  
                //disabled: true,
                               
                text: '购买',
                handler : function(button) {
                    
                    var isLogin = false;
                    Ext.Ajax.request({
                            url: '/svtbase/AuthServices',
                            method: 'GET',
                            async: false,
                            params: { req: 'checkIsLogin', },
                            //jsonData: jSonString,
                            success: function ( result, request ) { 
                                console.log("Success: "+result.responseText);
                                var jsonObj = JSON.parse(result.responseText);
                                if( jsonObj.status == "success") {
                                    isLogin = true;
                                    
                                    loginUser = jsonObj.user;
                                }
                                else{  
                                    isLogin = false; 
                                    alert("你还没有登录:"+result.responseText);
                                }
                          
                            },
                            failure: function ( result, request) { 
                                alert("Failed: "+result.responseText);
                            } 
                    });       
                    
                    
                    function loginCommit(){                                
                    window.location.href='/login/?backUrl=/authTest/';
                    }
                    
                    if( isLogin){
                        alert("恭喜你已经登录:"+loginUser);
                    }
                    else {
                         
                    }
                    ConfirmBox(loginCommit, "立即去登录 ？");
                                                                      
                    } //handler function
                    }]
               } , // toolbar
               
               
                {              
                xtype: 'panel',               
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
                    background: 'green',
                    color:'white',              
                },  
                //disabled: true,
                               
                text: '退出登录',
                handler : function(button) {
                   
                   Ext.Ajax.request({
                            url: '/svtbase/AuthServices',
                            method: 'GET',
                            //async: false,
                            params: { req: 'logOut', user: loginUser},
                            //jsonData: jSonString,
                            success: function ( result, request ) { 
                                console.log("Success: "+result.responseText);
                                var jsonObj = JSON.parse(result.responseText);
                                if( jsonObj.status == "success") {
                                    isLogin = false;
                                    alert("退出登录成功:"+result.responseText);
                                }
                                else{  
                                    alert("退出登失败:"+result.responseText);
                                }
                          
                            },
                            failure: function ( result, request) { 
                                alert("Failed: "+result.responseText);
                            } 
                    }); 
                    
                           
                }
                }]
                },
                            
            ]
       
     }); //pannelform2
     
     

   
     var panelAll = Ext.create('Ext.Panel', {
        id:'panelAll',
       layout: 'card',
       items: [panel1],
        
    });
    
    Ext.Viewport.add(panelAll);
    panelAll.setActiveItem(panel1); 
     
    
 } //LUANCH  
 
});
