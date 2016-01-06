
//@include sencha-toolbar-ui('yellow', #E9D890, 'bevel');

Ext.require(['Ext.List','Ext.data.Store', 'Ext.form.FieldSet', 'Ext.field.Select','Ext.data.proxy.JsonP',
            'Ext.chart.Chart','Ext.chart.PolarChart','Ext.chart.series.Pie','Ext.chart.interactions.Rotate',
            'Ext.chart.interactions.ItemInfo', 'Ext.chart.CartesianChart', 'Ext.chart.interactions.ItemHighlight',
            'Ext.form.Panel', 'Ext.data.Model','Ext.field.Search','Ext.plugin.PullRefresh','Ext.plugin.ListPaging','Ext.MessageBox']);

Ext.define('TestModel', {
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
            name: 'quesId',
            type: 'string'
        },
        {
            name: 'type',
            type: 'string'
        },
        
        {
            name: 'choicesNum',
            type: 'string'
        },
        {
            name: 'flag',
            type: 'string'
        },
        {
            name: 'question',
            type: 'string'
        },
        {
            name: 's0',
            type: 'string'
        },
        {
            name: 's1',
            type: 'string'
        },
        {
            name: 's2',
            type: 'string'
        },
        {
            name: 's3',
            type: 'string'
        },
         {
            name: 's4',
            type: 'string'
        },
        {
            name: 's5',
            type: 'string'
        },
         {
            name: 's6',
            type: 'string'
        },
        {
            name: 's7',
            type: 'string'
        },
         {
            name: 's8',
            type: 'string'
        },
        {
            name: 's9',
            type: 'string'
        }
              
        ],            
    }
});

Ext.define('questionModel', {
            extend: 'Ext.data.Model',
            config: {
                fields:[
                    {name:'id',type:'string'},                
                    {name:'question',type:'string'}
                    
                ]
            }
        });

Ext.define('answerModel', {
            extend: 'Ext.data.Model',
            config: {
                fields:[
                    {name:'choicesName',type:'string'},                
                    {name:'value',type:'string'}
                    
                ]
            }
        });
//fields: ['choicesName', 'value'],  
    

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

var resultContendHtml = " ";
var chartItemInfoHtml = " ";
var loctionStaHtml = "";
var xFieldStr = "g3";
  
var userId = "";
var openId = "";
var mystore;
var panel3;
var UserObj;
var msgbox;
var requireGeo = true;
var surveyProject;

var ScreenWidth;
var ScreenHeight; 
var TiteWidth; 

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

function GetListFormState(answerBaseObj) {
    
     var arr = new Array();
                        
                        var size = mystore.getCount();
                    for(var j=0; j< size; j++){                          
                        var myrecord = mystore.getAt(j);
                        var typeStr = myrecord.get('type') ;
                        var choicesNum =  myrecord.get('choicesNum');
                        var indexName  = "inputName"+j;
                        
                        answerObj = new Object();
                        answerObj.appId = answerBaseObj.appId;
                        answerObj.projectId = answerBaseObj.projectId;
                        answerObj.userId = answerBaseObj.userId;
                        answerObj.openId = answerBaseObj.openId;
                        answerObj.quesId = myrecord.get('quesId') ;
                        
                        var inputs = document.getElementsByName(indexName);
                        var ret = ""; 
                        if( typeStr == "text"){
                            ret  = ret + inputs[0].value;
                        }
                        else 
                        {
                             //for(var i=0; i<choicesNum; i++ ) {
                               for(var i=0; i<inputs.length; i++ ) {
                                var sn = 's'+i;
                                var snStr = myrecord.get(sn);
                        
                                if (inputs[i].checked) {
                                    //ret  = ret + inputs[i].value; 
                                    ret  = ret + "1";     
                                }
                                else {
                                    ret  = ret + "0";
                                }                                                                                                                                                                                    
                            }                   
                       }
                       //console.log("quesId="+myrecord.get('quesId')+" answer="+ret);
                       answerObj.answer = ret;
                       arr.push(answerObj);
                     } // for all
    
    return arr;
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
                               
                                
                                if(jsonObj.geoStatus == "巡展现场")
                                {
                                      //MsgBox("", "检测到您在巡展现场\n完成问卷后可以领取微信红包");
                                    var item = Ext.getCmp('panel3').items.items[2].getComponent('btnGetRedPack');
                                    item.setStyle({
                                        background: '#04BD00',
                                        color:'white',
                                    })
              
                                    item.setText("领取红包");
                                    item.enable();
                                }
                                else
                                {
                                      //MsgBox("", "抱歉，系统无法检测到您是否巡展现场\n");
                                }
                                
                                
                            },
                            failure: function ( result, request) { 
                                alert("Failed: "+result.responseText);
                            } 
                        });                                                               
                                
                        },
                         
                        fail:  function (res) {
                            MsgBox("", "获取您的位置失败！<br/>请确保打开了手机定位");
                            loctionStaHtml = '<p align="center"><font size=4> <br/><br/>' + '位置状态:未知' + '<br/> </font> </p>';                             
                            var item = Ext.getCmp('panel3').items.items[1];
                            item.setHtml(loctionStaHtml);
                        },
                        cancel:  function (res) { 
                            MsgBox("", "请允许获取您位置，方可领取红包"); 
                            loctionStaHtml = '<p align="center"><font size=4> <br/><br/>' + '位置状态:未知' + '<br/> </font> </p>';                             
                            var item = Ext.getCmp('panel3').items.items[1];
                            item.setHtml(loctionStaHtml);                            
                        },
               
                        });
    
}

function CheckListFormState() {
    
                       var FinishedList = new Array();
                                           
                        var size = mystore.getCount();
                    for(var j=0; j< size; j++){                          
                        var myrecord = mystore.getAt(j);
                        var typeStr = myrecord.get('type') ;
                        var choicesNum =  myrecord.get('choicesNum');
                        var flag =  myrecord.get('flag');
                        var indexName  = "inputName"+j;
                       
                        var ret = "";
                        var isFinished = false; 
                         
                        var inputs = document.getElementsByName(indexName);
                        if( typeStr == "text"){
                            if( inputs[0].value != "" || flag == "-NR" ){
                                isFinished = true;  
                            }
                        }
                        else 
                        {
                             //for(var i=0; i<choicesNum; i++ ) {
                               for(var i=0; i<inputs.length; i++ ) {
                                var sn = 's'+i;
                                var snStr = myrecord.get(sn);
                        
                                if (inputs[i].checked || flag == "-NR" ) {
                                    //ret  = ret + inputs[i].value; 
                                    isFinished = true;
                                    break;     
                                }                                                                                                                                                                                                          
                            }                   
                       }
                       FinishedList.push(isFinished);
                     } // for all
    
    return FinishedList;
}

function SubmitAnswerInfo(jSonAnswers) {
    
     Ext.Ajax.request({
                            //url : 'http://112.74.76.96/xl/uip2.php',
                            url: '/base/survey/answers',
                            method: 'POST',
                            params: { listData: jSonAnswers },
                            //jsonData: jSonString,
                            success: function ( result, request ) { 
                                console.log("SubmitAnswerInfo return: "+result.responseText);                        
                                
                                                                                                  
                                var resultContendHtml = '<br/><br/><p align="center"><font size=4>问卷提交成功'+'</font></p>'
                                   + '<p align="center"><font size=4><br/><br/><br/>感谢您的参与！ <br/><br/></font> </p>'   
                                   
                                   //+ '<p align="center"><font size=3><br/><br/>请凭手机号或签到号到后台领取奖品<br/>微信用户还可以参与红包抽奖喔 </font> </p>'              
                                
                                var item = Ext.getCmp('panel3').items.items[0];
                                item.setHtml(resultContendHtml);
                                //item.doLayout();
                                //Ext.getCmp('parent').doComponentLayout();
                       
                                Ext.Viewport.animateActiveItem(panel3, {  
                                    type : 'pop',  
                                    //direction : 'left' 
                                });
                            },
                            failure: function ( result, request) { 
                                alert("Failed: "+result.responseText);
                            } 
                        });         
    
}


wx.ready(function(){

    wx.hideOptionMenu();

});

function showInfo(msg){
    
    var item = Ext.getCmp('panel1').items.items[0];
    var html = '<img src="'+surveyProject.imagePath+'"  width="'+window.innerWidth+'"  />'
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
   

    
    
    //$(':radio').click(function(){if(this.checked)$(this).next().css('color','red')});
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
    console.log("ScreenWidth:"+ ScreenWidth+ " ScreenHeight"+ScreenHeight+" TiteWidth"+TiteWidth);
    
    Ext.Ajax.request({
        url: '/base/survey/projects',
        method: 'GET',
        async: false,
        params: { appId:appId},
        success: function ( result, request) { 
            console.log("projects return:"+result.responseText);
            var arrayObj = new Array();            
            arrayObj = JSON.parse(result.responseText);
            surveyProject = arrayObj[0];
            var jsonProjectInfo  = JSON.stringify(surveyProject); 
            console.log("jsonProjectInfo:"+ jsonProjectInfo)
                    
                        
        },
        failure: function ( result, request) { 
            alert("网络出错，请稍后再试"); 
        } 
    }); 
    
    document.title = surveyProject.title;
    
    mystore =  Ext.create('Ext.data.Store', {
        id: 'MessageListStore',
        //extend: 'Ext.data.Store',
        model: 'TestModel',
        //fields: ['name'],
        storeId: 'messageList',
        //是否在app启动时自动加载数据，手动加载方法为store.load();或者store.loadPage(1);请自行查看api
        //grouper: function(record){ return record.get('firstName'); },
        autoLoad: true,
        //remoteSort: true,
        //remoteFilter: true,
 
        //每页显示数据条数，此参数传递到服务端
        pageSize: 20,
        proxy: {
            type: 'ajax',
            
            //type: 'jsonp',
            url: '/base/survey/question?appId='+appId,    
            //分页每页显示条数名称，默认为limit，此参数传递到服务端
            limitParam: 'limit',
            //分页页码名称，默认为page，此参数传递到服务端
            pageParam: 'page',
            reader: {
                type: "json",
                //服务端返回数据集数据源名称，用于指定数据源，可以不指定默认值为‘’
                rootProperty: 'listData',
                //服务端返回数据集数据总数名称，用于分页，默认值为total
                totalProperty: 'listSize'
            }
        }
});    
    //mystore = Ext.create('app.store.MessageList');

var myform=  Ext.create('Ext.Panel', {
    
    id:'formpanelmy', 
    //scrollable: true,
    //scrollable:'vertical',
    flex: 8,
    layout: {
            type: 'vbox',
            //align: 'start',
    }, 
       
    standardSubmit: 'false',
    //url:'http://112.74.76.96/xl/uip2.php',
    
    items:[
    
        {            
            xtype:'panel',
            layout: {
                pack: 'justify',
                type: 'hbox', 
                align: 'center',                
            },
        
            style: {
                background: '#04BD00',
                //background: 'transparent',
            },
        
            margin: '10 15 7 15', 
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
                        
                        text   : '上一页',  
                        handler : function() {
                              
                              Ext.Viewport.animateActiveItem(panel1, {  
                              type : 'slide',  
                              direction : 'right' 
                              });
                        }
             },
             
             {xtype: 'spacer'}, 
             
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
                text: '完 成',
                handler : function(button) {
                    
                    var FinishedList = CheckListFormState();
                     
                     var ret = " 请您完成题目:"
                     var  isAllFinished = true;
                     
                     for(i=0; i< FinishedList.length; i++){
                        if( FinishedList[i] == false){
                            isAllFinished = false;
                            var j=i+1;
                            ret = ret+ j+",";
                        }                                              
                     }                 
                     ret=ret.substring(0,ret.length-1);
                     
                     var htmlRet = StrtoHtml(ret);
                     
                     //isAllFinished = true;
                     if(isAllFinished){
                        answerObj = new Object();
                        answerObj.appId = "wx082397805d8b7f90";
                        answerObj.projectId = 1;
                        answerObj.userId = 1;
                        answerObj.openId = openId;
                        
                        var arr = GetListFormState(answerObj);     
                        var jSonAnswers = JSON.stringify(arr);
                        console.log("Answer list:"+jSonAnswers); 
                        SubmitAnswerInfo(jSonAnswers);
                                        
                     }
                     else {                        
                        MsgBox("未 填 完", htmlRet)    
                    }
                                                                                             
                }//function
            }
            ]   
        },
            
        {
           
            xtype: 'list', 
            id: 'list1',
            flex: 10,
            disableSelection : true,
            store: mystore,
            itemTpl:  new Ext.XTemplate(
                   
                   '{[this.outputHtml(values.quesId)]}',     
        {
            getIndex: function(index_temp) {
                var index1 = ++index_temp;
                return index1;               
            },
            
			outputHtml:  function(valueIn)
            {
                  //var index1 = index_temp;             
                  var index1 = mystore.find('quesId', valueIn);
                  var quesNum = index1+1;
                  //console.log("store index:"+index1); //Dave第一次出现是在第5条记录，下标为4，输出4。

                  //---------------------------------
			      var myrecord = mystore.getAt(index1);
                  var indexName  = "inputName"+index1;
                  
                  var typeStr = myrecord.get('type') ;
                  var choicesNum =  myrecord.get('choicesNum');
                  var questionStr =  myrecord.get('question');      
                   
                  var dispStr = '';
                  //dispStr = '<div style="background:white" >';
                  //dispStr += '<p> <font color=white> &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp </font> </p>'
                  //dispStr += '<div style="background:white" > &nbsp </div>';
                  //-------------Question--------------------
                  dispStr = dispStr+ '<p> '+quesNum+". "+questionStr;
                  if( typeStr == "checkbox") {
                    dispStr = dispStr+" (多选)"
                  }
                  dispStr = dispStr+'</p>';
                   
                  //-------------Choices--------------------
                  if( typeStr == "radio"){
                     for(var i=0; i<choicesNum; i++ ) {
                        var sn = 's'+i;
                        var snStr = myrecord.get(sn);
                        var idStr = "id"+snStr;
                        
                        dispStr = dispStr + '<p style = "margin:10px"> <input type="radio" style="width:50;height=50" name="'+indexName;
                        dispStr = dispStr + '" value="'+sn+ '" id="' + idStr + '" /> <label for="' + idStr;
                        dispStr = dispStr + '">  ' + snStr + '    </label> </p>';
   
                     }
                    
                  }
                  else if( typeStr == "checkbox") {
                    for(var i=0; i<choicesNum; i++ ) {
                        var sn = 's'+i;
                        var snStr = myrecord.get(sn);
                        var idStr = "id"+snStr;
                        
                        dispStr = dispStr + '<p style = "margin:10px"> <input type="checkbox" style="width:50;height=50" name="'+indexName;
                        dispStr = dispStr + '" value="'+sn+ '" id="' + idStr + '" /> <label for="' + idStr;
                        dispStr = dispStr + '">  ' + snStr + '     </label> </p>';
   
                     }
                    
                  }
                  else {
                       var placeholderStr = myrecord.get('s0');
                       dispStr = dispStr + '<p style = "margin:10px"> <textarea rows=5 cols=27 name="'+indexName;
                       dispStr = dispStr + '" value="" id="' + indexName + '" placeholder="'+ placeholderStr + '" ></textarea></p>';
                       //cols=24
                  }
                  
                  dispStr = dispStr;//+'</div>';
                  return  dispStr;
            }         
            
         }              
),
},
          ]
    
    });//FORM<strong></strong>
                     
    var panel1 = Ext.create('Ext.Panel', {
       id: 'panel1',
       scrollable:'vertical',
       
       items: [
            {
                xtype: 'panel',
                margin: '0px 0px 5px 0px',
                html: '<img src="'+surveyProject.imagePath+'"  width="'+ScreenWidth+'"  />'
            },
                 
        {
                xtype: 'panel',
                margin: '15 15 15 15', 
                html: surveyProject.detail,
                
        },
            
     {                 
       
        xtype: 'panel',
        docked: 'bottom',
        margin: '15 15 7 15', 
            
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
            text: '开  始',
 
            handler : function(button) {
                      
                var timestampClient = Math.round(new Date().getTime());
                var startTimeInt = parseInt(surveyProject.startTime);
                var endTimeInt = parseInt(surveyProject.endTime);
                    
                if(timestampClient < startTimeInt){
                    MsgBox("", "抱歉，问卷活动还未开始");
                    return;
                }
                    
                if(timestampClient > endTimeInt){
                    MsgBox("", "抱歉，问卷活动已经结束");
                    return;
                }
                          
                            //Ext.Msg.alert("Custom alert box!"); 
                             Ext.Viewport.animateActiveItem(myform, {  
                                type : 'slide',  
                                direction : 'left'  
                             }); 
                             
                             if( requireGeo == true) {
                                //UpdateWxLocation();
                             }
                        }
                    }
         ]
       }  // toolbar
       ]      
    });// panel1
    
    var panel0 = Ext.create('Ext.Panel', {
       id: 'panel0',
       scrollable:'vertical',     
       items: [    
            {              
                margin: '60 15 5 15', 
                html: '<p align="center"><font size=5><br/><br/><br/>请您先进行嘉宾签到 </font> </p>',
                
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
                            background: 'transparent',
                        },
                    //margin: '8px',
                    docked: 'bottom',
                    items: [
                        {
                        
                        //margin: 25,
                        height: '60px',
                        html: ' ',            
                        },                 
                    ]
            },
            
            {                 
                xtype: 'panel',
                docked: 'bottom',
                margin: '5 15 5 15', 
            
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
                              
                text: ' 退     出',
                handler : function(button) {
                           
                           wx.closeWindow();
                             
                        }
                }
            ]
            }  // toolbar
       ]      
    });// panel1
    
    
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
                    
                    {type:'length',field:'company',min:2,max:20,message: '请正确输入公司名称'},
                ]
            }
        });

  panel3 = Ext.create('Ext.Panel', {
       id: 'panel3',
       scrollable:'vertical',
       
       items: [    
            {
                margin: '40 15 5 15', 
                html: resultContendHtml, 
                
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
                        text: '关闭问卷',
                        handler : function(button) {
                            wx.closeWindow();
                                             
                        }
                        
                    }, 
                                                      
                    ]
            },  // pann firest
            
           
       ]      
    });// panel3
    
    
        
     var panelAll = Ext.create('Ext.Panel', {
        id:'panelAll',
       layout: 'card',
       items: [myform, panel0, panel1, panel3],
        
    });
    
    Ext.Viewport.add(panelAll);
    panelAll.setActiveItem(panel1);
                        
    
    
 } //LUANCH  
 
});

