
//@include sencha-toolbar-ui('yellow', #E9D890, 'bevel');

Ext.require(['Ext.List','Ext.data.Store', 'Ext.form.FieldSet', 'Ext.field.Select',
            'Ext.chart.Chart','Ext.chart.PolarChart','Ext.chart.series.Pie','Ext.chart.interactions.Rotate',
            'Ext.chart.interactions.ItemInfo', 'Ext.chart.CartesianChart', 'Ext.chart.interactions.ItemHighlight',
            'Ext.form.Panel', 'Ext.data.Model','Ext.field.Search','Ext.plugin.PullRefresh','Ext.plugin.ListPaging','Ext.MessageBox']);

        
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



function showNotification(content){    
     var notification = new Notification( "WebSocket", { //data.name: 桌面通知标题
                        tag: "link", //标签
                        icon: '/media/h3cVote/linkcover.jpg', //图片
                        body: content //内容
                    });
                    
                    notification.onclick = function() {
                        //alert("hello");
                    }
                    notification.onshow = function () {
                        //setTimeout(function () {notification.close();}, 10000);
                    }
                    
}

var htmlWebInfo = "";

function addHtmlMsg(msg){
    
    var item = Ext.getCmp('panel1').items.items[1];
        htmlWebInfo = msg +'<br/><br/>' + htmlWebInfo;
        item.setHtml(htmlWebInfo);     
}

//var wsurl = "webapps.byodwork.cn:8080/svtbase/wsService";
var wsurl = "ws://hz2.byodwork.cn:8080/base/wsendpoint";
  
var ws = null;    
function startWebSocket() {    
    if ('WebSocket' in window)   
    {     
        console.log("support Websocket")  
        ws = new WebSocket("ws://hz2.byodwork.cn:8080/base/wsendpoint");    
    }   
    else if ('MozWebSocket' in window)    
    {  
        console.log("support MozWebsocket")  
        ws = new MozWebSocket(wsurl);
    }  
    else    
        alert("not support");    
        
    // 收到消息  
    ws.onmessage = function(evt) {    
        //alert(evt.data); 
        showNotification(evt.data);
        addHtmlMsg(evt.data);
    };    
        
    // 断开连接  
    ws.onclose = function(evt) {    
        //alert("close"); 
        showNotification("WebSocket 断开连接");
        addHtmlMsg("WebSocket 断开连接");   
    };    
        
    // 打开连接  
    ws.onopen = function(evt) {    
        //alert("open"); 
        showNotification("WebSocket 连接成功");
        addHtmlMsg("WebSocket 连接成功");  
        sendMsg("/topic/cp/msg/touser", "msgtousr"); 
        sendMsg("/topic/cp/msg/fromuser", "msgfromusr"); 
        sendMsg("/follow/cp/msg", "follow_cp"); 
        
        sendMsg("/topic/vote/msg", "vote"); 
        sendMsg("/follow/vote/msg", "vote");  
    };    
}    
    
  // 向服务端发送消息  
function sendMsg1() {    
    ws.send(document.getElementById('writeMsg').value);    
}    

function sendMsg(dst, content){
     msgObj = new Object();
     msgObj.destination = dst;
     msgObj.content = content;

     var msgJsonStr  = JSON.stringify(msgObj); 
     console.log("ready to sendmsg: "+msgJsonStr);
     ws.send(msgJsonStr); 
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


        items: [           
                
            {              
                xtype: 'panel',               
                docked: 'top',
                margin: '10 15 5 15', 
                 layout: {
                type: 'hbox',
                    //pack: 'center',
                    //align: 'center',
                }, 
                items: [
                {
                xtype: 'button',
                //id:'btn1',
                ui: 'plain',    
                width: '50%',
                height: '38px',                                       
                style: {
                    background: 'green',
                    color:'white',              
                },  
                //disabled: true,
                               
                text: '连接',
                handler : function(button) {
                    
                     console.log("websocket start: ");                    
                     startWebSocket();                                                            
                } //handler function
                },
                {
                xtype: 'button',
                //id:'btn1',
                ui: 'plain',    
                width: '50%',
                height: '38px',                                       
                style: {
                    background: 'green',
                    color:'white',              
                },  
                //disabled: true,
                               
                text: '关闭',
                handler : function(button) {
                    //htmlWebInfo = "";
                    ws.close();    
                }
                }
                    
                ]
            } , // toolbar
               
            {
              xtype: 'panel', 
              html: htmlWebInfo,
                
            },
               
             {              
                xtype: 'panel',
                id: 'pannelText',               
                docked: 'bottom',
                margin: '10 15 5 15', 
                 layout: {
                type: 'hbox',
                    //pack: 'center',
                    //align: 'center',
                }, 
                items: [
                {
                    
                xtype: 'textfield', 
                id: 'text1',              
             
                },
                
                {
                xtype: 'button',
                //id:'btn1',
                ui: 'plain',    
                width: '20%',
                height: '38px',                                       
                style: {
                    background: 'green',
                    color:'white',              
                },  
                //disabled: true,
                               
                text: '发送',
                handler : function(button) {
                    
                    var tex2 =  panel1.getComponent('pannelText').getComponent('text1').getValue();
                    sendMsg("/post/cp/test", tex2);
                }
                }
                    
                ]
            } , // toolbar
                            
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
