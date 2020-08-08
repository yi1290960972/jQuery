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

    $(".send").click(function () {
        //拿到用户输入的内容
       var $text=$(".comment").val();
        //根据内容创建节点
        var $weibo=createE($text);
        //插入微博
        $(".messageList").prepend($weibo);
    });
    //监听顶点击
    $("body").on("click",".infoTop",function () {
        $(this).text(parseInt($(this).text()+1));
    });
    $("body").on("click",".infoDown",function () {
        $(this).text(parseInt($(this).text()+1));
    });
    $("body").on("click",".infoDel",function () {
        $(this).parents(".info").remove();
    });

    function createE(text) {
        var $weibo=$("<div class=\"info\">\n" +
            "            <p class=\"infoText\">"+text+"</p>\n" +
            "            <p class=\"infoOperation\">\n" +
            "                <span class=\"infoTime\">"+formartDate()+"</span>\n" +
            "                <span class=\"infoHandle\">\n" +
            "                    <a href=\"javascript:;\" class='infoTop' class='infoTop'>0</a>\n" +
            "                    <a href=\"javascript:;\" class='infoDown' class='infoDown'>0</a>\n" +
            "                    <a href=\"javascript:;\" class='infoDel' class='infoDel'>删除</a>\n" +
            "                </span>\n" +
            "            </p>\n" +
            "        </div>")
        return $weibo;
    }
    
    function formartDate() {
        var date = new Date();
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