function obj2str(obj) {
    /*
    //url?key=value&key=value
    "userName":"zcy",
    "userPwd":"12345"
    "t":"3712i9471329876498132"
     */
    obj.t=new Date().getTime();
    var res=[];
    for(var key in obj){
        //在URL中是不可以出现中文的，如果出现了中文需要转码
        //可以调用encodeURLComponent()方法
        res.push(encodeURIComponent(key)+"="+encodeURIComponent(obj[key]));       //[userName=zcy, userPwd=12345];
    }
    return res.join("&");
}
function ajax(url,obj,timeout,success,error) {
    //0.将对象转换为字符串
    var str=obj2str(obj);
    //1.创建一个异步对象
    var xmlhttp,timer;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    //2.设置请求方式和请求地址
    /*
    method：请求的类型；GET 或 POST
    url：文件在服务器上的位置
    async：true（异步）或 false（同步）
     */
    xmlhttp.open("GET",url+"?"+str,true);
    //3.发送请求
    xmlhttp.send();
    //4.监听状态的变化
    xmlhttp.onreadystatechange=function (ev2) {
        /*
        0: 请求未初始化
        1: 服务器连接已建立
        2: 请求已接收
        3: 请求处理中
        4: 请求已完成，且响应已就绪
         */
        if(xmlhttp.readyState===4){
            clearInterval(timer);
            //判断是否请求成功
            if(xmlhttp.status>=200 && xmlhttp.status<300 || xmlhttp.status===304){
                //5.处理返回的结果
                //console.log("接受到服务器返回的数据");
                success(xmlhttp);
            }else{
                //console.log("没有接受到服务器返回的数据");
                error(xmlhttp);
            }
        }
    }
    //判断外界是否传入了超时时间
    if(timeout){
        var timer=setInterval(function () {
            console.log("中断请求");
            xmlhttp.abort();
            clearInterval(timer);
        },timeout);
    }
}