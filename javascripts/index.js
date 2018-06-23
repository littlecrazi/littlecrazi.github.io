$(function(){

    var now;
    var dappAddress = "n1z5oWdvKeUFAP1oU9nyqn3WvbMKXk8JhmG";
    var width = $(document).width();
    var num;
    if(width>=1200){
        num = 8;
    }else if(width>=768){
        num = 6;
    }else if(width<768){
        num = 4;
    }
    //初始化创建盒子
    var mainBox = $(".main-box");
    for(var i=0;i<num;i++){
        var contentBox = $("<div class='col-lg-3 col-md-4 col-sm-6 col-xs-12 content-box'></div>");
        var content = $("<div class='content'></div>");
        var ideaHead = $("<div class='idea-head'></div>");
        var keywordBox = $("<div class='keyword-box'></div>");
        var keyword = $("<span class='keyword'>关键词：</span>");
        var keywordDetail = $("<i class='keyword-detail'></i>");
        var publishTime = $("<i class='publish-time'></i>");
        var authorBox  = $("<span class='author-box'></span>");
        var author = $("<span class='author-txt'>作者：</span>");
        var authorName = $("<i class='author'></i>");
        var ideaContent = $("<div class='idea-content'></div>");
        keywordBox.append(keyword).append(keywordDetail);
        ideaHead.append(keywordBox).append(publishTime).append(authorBox);
        authorBox.append(author).append(authorName);
        content.append(ideaHead).append(ideaContent);
        contentBox.append(content);
        mainBox.append(contentBox);
    }

    //点击弹框外隐藏
    $("#my-box-shadow").click(function(){
        $(this).hide();
    });
    $("#my-box").click(function(e){
        e.stopPropagation();
    });

    $("#add").click(function(){
        $("#my-box-shadow").show();
    });

    //点击弹框外隐藏
    $("#show-detail").click(function(){
        $("#content-box").css({marginTop:"-400px"});
        $(this).hide();
    });
    $("#content-box").click(function(e){
        e.stopPropagation();
    });



    //上传资源

    var btn = $("#write");

    btn.click(function() {
        if(!$.trim($("#keywords").val()) &&!$.trim($("#content").val())){
            alert('输入框不能为空');
            return;
        }
        now = new Date().getTime();
        var to = dappAddress;
        var value = "0";
        var callFunction = "save";
        var keywords = $("#keywords").val();
        var content = $("#content").val();

        var callArgs = JSON.stringify([now,keywords,content]);

        serialNumber = nebPay.call(to, value, callFunction,callArgs,  {    //使用nebpay的call接口去调用合约,
            listener: cbPush,       //设置listener, 处理交易返回信息
            callback: callbackUrl
        });
        clearInterval(intervalQuery);
        intervalQuery = setInterval(function () {
            funcIntervalQuery();
        }, 10000);
    });


    //获取资源
    var nebulas = require("nebulas"),
        Account = nebulas.Account,
        neb = new nebulas.Neb();
    neb.setRequest(new nebulas.HttpRequest("https://Mainnet.nebulas.io"));

    var from = Account.NewAccount().getAddressString();
    var value = "0";
    var nonce = "0";
    var gas_price = "1000000";
    var gas_limit = "2000000";
    var callFunction = "getSome";
    var arg1 = num;
    getData();
    function getData(){
        var callArgs = JSON.stringify([arg1]);  //推荐用 JSON.stringify 来生成参数字符串,这样会避免出错!
        var contract = {
            "function": callFunction,
            "args": callArgs
        };
        neb.api.call(from,dappAddress,value,nonce,gas_price,gas_limit,contract).then(function (resp) {
            cbSearch(resp)
        }).catch(function (err) {
            console.log("error:" + err.message)
        });
    }
    var loadBtn = $("#loadBtn");

    function cbSearch(result){

        result = JSON.parse(result.result);
        result = JSON.parse(result);
        $("#loading").hide();
        var content = mainBox.find('.content-box');
        for(var i=0;i<result.length;i++){
            var temp = result[i];
            var tempBox = content.eq(i);
            var authorTime = temp.authorTime;
            var index = authorTime.lastIndexOf('_');

            var author = authorTime.substring(0,index);
            var time = parseInt(authorTime.substring(index+1));
            time = new Date(time).toLocaleDateString()
            tempBox.find('.keyword-detail').html(temp.keywords);
            tempBox.find('.idea-content').html(temp.content);
            tempBox.find('.publish-time').html(time);
            tempBox.find('.author').html(author);
        }
        loadBtn.removeAttr('disabled');
    }


    var NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
    var nebPay = new NebPay();
    var serialNumber;
    var callbackUrl = NebPay.config.mainnetUrl;


    loadBtn.click(function(){
        $("#loading").show();
        $("html,body").animate({scrollTop:0}, 300);
        $(this).attr('disabled','disabled');
        getData();
    });

    //插入新增数据
    function insertNewContent(title){
        var timer = setInterval(function(){
            var callFunction2 = "get";
            var argTitle = title + '_' + now;
            var callArgs = JSON.stringify([argTitle]);  //推荐用 JSON.stringify 来生成参数字符串,这样会避免出错!
            var contract = {
                "function": callFunction2,
                "args": callArgs
            };

            neb.api.call(from,dappAddress,value,nonce,gas_price,gas_limit,contract).then(function (resp) {
                if(resp.result!='null'){
                    clearInterval(timer);
                    judge(resp.result);
                }
            }).catch(function (err) {
                console.log("error:" + err.message)
            });
        },2000);

        function judge(resp){

            resp = JSON.parse(resp);
            alert('发布成功');
            $("#keywords").val('');
            $("#content").val('');
            $("#my-box-shadow").hide();
            var contentBox = $("<div class='col-lg-3 col-md-4 col-sm-6 col-xs-12 content-box'></div>");
            var content = $("<div class='content'></div>");
            var ideaHead = $("<div class='idea-head'></div>");
            var keywordBox = $("<div class='keyword-box'></div>");
            var keyword = $("<span class='keyword'>关键词：</span>");
            var keywordDetail = $("<i class='keyword-detail'></i>");
            var publishTime = $("<i class='publish-time'></i>");
            var authorBox  = $("<span class='author-box'></span>");
            var author = $("<span class='author-txt'>作者：</span>");
            var authorName = $("<i class='author'></i>");
            var ideaContent = $("<div class='idea-content'></div>");

            var authorTime = resp.authorTime;
            var index = authorTime.lastIndexOf('_');

            var authorName2 = authorTime.substring(0,index);
            var time = parseInt(authorTime.substring(index+1));
            time = new Date(time).toLocaleDateString();
            publishTime.html(time);
            authorName.html(authorName2);
            keywordDetail.html(resp.keywords);
            ideaContent.html(resp.content);


            keywordBox.append(keyword).append(keywordDetail);
            ideaHead.append(keywordBox).append(publishTime).append(authorBox);
            authorBox.append(author).append(authorName);
            content.append(ideaHead).append(ideaContent);
            contentBox.append(content);
            mainBox.prepend(contentBox);
            mainBox.find('.content-box').last().remove();

            content.click(function(){
                var keywords = $(this).find('.keyword-detail').html();
                var time = $(this).find('.publish-time').html();
                var author = $(this).find('.author').html();
                var content = $(this).find('.idea-content').html();
                $("#keyword-detail").html(keywords);
                $("#publish-time").html(time);
                $("#author").html(author);
                $("#idea-content").html(content);
                $("#show-detail").show();
                $("#content-box").animate({marginTop:"-200px"});
            })


        }

    }

    var intervalQuery;

    function funcIntervalQuery() {
        var options = {
            callback: callbackUrl
        }
        nebPay.queryPayInfo(serialNumber,options)   //search transaction result from server (result upload to server by app)
            .then(function (resp) {
                var respObject = JSON.parse(resp)
                if(respObject.code === 0){
                    clearInterval(intervalQuery);
                    var from = respObject.data.from;
                    insertNewContent(from);
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    function cbPush(resp) {
        var respString = JSON.stringify(resp);
        if(respString.search("rejected by user") !== -1){
            clearInterval(intervalQuery);
            alert(respString)
        }else if(respString.search("txhash") !== -1){
            // alert("wait for tx result: " + resp.txhash)
        }
    }

    $(".content").each(function(){
        $(this).click(function(){
            var keywords = $(this).find('.keyword-detail').html();
            var time = $(this).find('.publish-time').html();
            var author = $(this).find('.author').html();
            var content = $(this).find('.idea-content').html();
            $("#keyword-detail").html(keywords);
            $("#publish-time").html(time);
            $("#author").html(author);
            $("#idea-content").html(content);
            $("#show-detail").show();

            $("#content-box").animate({marginTop:"-200px"});
        })
    })


})
