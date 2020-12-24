$(function () {
    //0.监听内容实时输入
    $("body").on("propertychange input",".comment",function () {
        //判断是否输入了内容
        if($(this).val().length>0){
            //让按钮可用
            $(".send").prop("disabled",false);
        }else{
            $(".send").prop("disabled",true);
        }
    })

    //var number=$.getCookie("pageNumber") || 1;
    var number=window.location.hash.substring(1) || 1;
    getMsgPage();
    function getMsgPage(){
        $(".page").html("");
        //weibo.php?act=get&page=1
        $.ajax({
            type:"GET",
            url:"weibo.php",
            data:"act=get_page_count",
            success:function (msg) {
                //console.log(msg);
                var obj=eval("("+msg+")");
                for(var i=0;i<obj.count;i++){
                    var $a=$("<a href=\"javascript:;\">"+(i+1)+"</a>");
                    if(i=== number-1)
                      $a.addClass("cur");
                    $(".page").append($a);
                }
            },
            error:function (xhr) {
                console.log(xhr.status);
            }
        });
    }


    //console.log(number);
    getMsgList(number);
    function getMsgList(number){
        $(".messageList").html("");
        $.ajax({
            type: "GET",
            url: "weibo.php",
            data:"act=get&page="+number,
            success:function (msg) {
                var obj=eval("("+msg+")");
                //遍历数组
                $.each(obj,function (index,value) {
                    //console.log(value);
                    var $weibo=createE(value);
                    $weibo.get(0).obj=value;
                    $(".messageList").append($weibo);
                });
            },
            error:function (xhr) {
                console.log(xhr.status);
            }
        });
    }

    $(".send").click(function () {
        //拿到用户输入的内容
       var $text=$(".comment").val();
       $.ajax({
           type:"GET",
           url:"weibo.php",
           data:"act=add&content="+$text,
           success:function (msg) {
               /*
               {error:0, id: 新添加内容的ID, time: 添加时间}
               非标准的JSON字符串：  {error: 0, id: 1, time: 1594273796, acc: 0, ref: 0}
               标准的JSON字符串：{"error": "0", "id": "1", "time": "1594273796", "acc": "0", "ref": "0"}
               VM13:1 Uncaught SyntaxError: Unexpected token e in JSON at position 1   非标准的采用eval方法
                */
               var obj=eval("("+msg+")");
               //console.log(obj);
               obj.content=$text;
               //根据内容创建节点
               var $weibo=createE(obj);
               $weibo.get(0).obj=obj;
               //插入微博
               $(".messageList").prepend($weibo);
               //清空输入框的内容
               $(".comment").val("");
               //重新获取页码
               getMsgPage();
               //删除最前面一条微博
               if($(".info").length>6){
                   $(".info:last-child").remove();
               }
           },
           error:function (xhr) {
               console.log(xhr.status);
           }
       });
    });
    //监听顶点击
    $("body").on("click",".infoTop",function () {
        $(this).text(parseInt($(this).text()+1));
        var obj=$(this).parents(".info").get(0).obj;
        //weibo.php?act=acc&id=12
        $.ajax({
            type:"GET",
            url:"weibo.php",
            data:"act=acc&id="+obj.id,
            success:function (msg) {
                console.log(msg);
            },
            error:function (xhr) {
                console.log(xhr.status);
            }
        });
    });
    //监听踩点击
    $("body").on("click",".infoDown",function () {
        $(this).text(parseInt($(this).text()+1));
        var obj=$(this).parents(".info").get(0).obj;
        //weibo.php?act=ref&id=12
        $.ajax({
            type:"GET",
            url:"weibo.php",
            data:"act=ref&id="+obj.id,
            success:function (msg) {
                console.log(msg);
            },
            error:function (xhr) {
                console.log(xhr.status);
            }
        });
    });
    //监听删除点击
    $("body").on("click",".infoDel",function () {
        $(this).parents(".info").remove();
        var obj=$(this).parents(".info").get(0).obj;
        //weibo.php?act=del&id=12
        $.ajax({
            type:"GET",
            url:"weibo.php",
            data:"act=del&id="+obj.id,
            success:function (msg) {
                console.log(msg);
            },
            error:function (xhr) {
                console.log(xhr.status);
            }
        });
        // 重新获取当前这一页数据
        getMsgList($(".cur").html());
    });
    //监听页码点击
    $("body").on("click",".page>a",function (){
        $(this).addClass("cur");
        $(this).siblings().removeClass("cur");
        getMsgList($(this).html());
        //保存当前点击的页码
        //$.addCookie("pageNumber",$(this).html());
        window.location.hash=$(this).html();
    });

    function createE(obj) {
        var $weibo=$("<div class=\"info\">\n" +
            "            <p class=\"infoText\">"+obj.content+"</p>\n" +
            "            <p class=\"infoOperation\">\n" +
            "                <span class=\"infoTime\">"+formartDate(obj.time)+"</span>\n" +
            "                <span class=\"infoHandle\">\n" +
            "                    <a href=\"javascript:;\" class='infoTop' class='infoTop'>"+obj.acc+"</a>\n" +
            "                    <a href=\"javascript:;\" class='infoDown' class='infoDown'>"+obj.ref+"</a>\n" +
            "                    <a href=\"javascript:;\" class='infoDel' class='infoDel'>删除</a>\n" +
            "                </span>\n" +
            "            </p>\n" +
            "        </div>")
        return $weibo;
    }
    
    function formartDate(time) {
        var date = new Date(time*1000);
        // 2018-4-3 21:30:23
        var arr = [date.getFullYear() + "-",
            date.getMonth() + 1 + "-",
            date.getDate() + " ",
            date.getHours() + ":",
            date.getMinutes() + ":",
            date.getSeconds()];
        return arr.join("");

    }
});