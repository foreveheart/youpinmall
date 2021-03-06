console.log("加载shopcart.js");
require(["../../js/conf/config"], function () {
    require(["jquery","template" ,"common","pageinit"], function ($,template) {
        $(function () {
            var list = [];
            var liststr = getCookie("list");
            if (liststr) {
                var list = JSON.parse(liststr); //将cookie转换成数组
            }
            let userlist = [];
            let userstr = getCookie("userlist");
            if (userstr) {
                userlist = JSON.parse(userstr);
            }

            var totalcount = 0;
            $.each(list, function (index, value) {
                totalcount += value.count;
            })
            //加载购物车商品列表
            $(".goods-list").load("/pages/templates/shoplist.html", function () {
                var shopliststr = template("shoplist", {
                    shoplist: list
                })
                $(".goods-list").html(shopliststr);
                console.log("加载成功");
                //增加商品count
                $(".add-num").on("click", function () {
                    var name = $(this).parent().parent().siblings(".product").text();
                    var price = Number($(this).parent().parent().siblings(".price").find("span").text());
                    var count = Number($(this).parent().find(".text").text()) + 1;
                    $(this).parent().parent().siblings(".total").find("span").text(count * price);
                    $(this).parent().find(".text").text(count);
                    $(".m-cart-news").text(++totalcount);
                    //修改cookie的count值
                    $.each(list, function (index, value) {
                        if (value.name == name) {
                            value.count = count;
                        }
                    })
                    var str = JSON.stringify(list);
                    var d = new Date();
                    d.setDate(d.getDate() + 3);
                    document.cookie = "list=" + str + "; expires=" + d + ";path=" + "/";
                })
                //减少商品count
                $(".reduce-num").on("click", function () {
                    var name = $(this).parent().parent().siblings(".product").text();
                    var count = Number($(this).parent().find(".text").text()) - 1;
                    if (count == 0) return;
                    $(".m-cart-news").text(--totalcount);
                    var price = Number($(this).parent().parent().siblings(".price").find("span").text());
                    $(this).parent().parent().siblings(".total").find("span").text(count * price);
                    $(this).parent().find(".text").text(count);
                    //修改cookie的count值
                    $.each(list, function (index, value) {
                        if (value.name == name) {
                            value.count = count;
                        }
                    })
                    var str = JSON.stringify(list);
                    var d = new Date();
                    d.setDate(d.getDate() + 3);
                    document.cookie = "list=" + str + "; expires=" + d + ";path=" + "/";
                })
                //删除当前商品 有bug
                $(".edit").on("click", function () {
                    console.log("delete");
                    $(this).parent().parent().siblings(".delete-box").show();
                    $(".close-box").click(function () {
                        $(this).parent().parent(".delete-box").hide();
                    })
                    $(".cancel").click(function () {
                        $(this).parent().parent(".delete-box").hide();
                    })
                    let that = this;
                    $(".affirm").click(function () {
                        //确认删除
                        let name = $(that).siblings(".product").text();
                        let targetindex;
                        $.each(list, function (index, value) {
                            if (value.name == name) {
                                targetindex = index; //存储目标元素下标
                                totalcount -= value.count;
                                if (totalcount == 0) {
                                    console.log("0");
                                    $(".m-cart-news").text("");
                                } else {

                                    $(".m-cart-news").text(totalcount);
                                }
                            }
                        })
                        //删除数组里面的目标元素 //在循环外边删除数组 
                        list.splice(targetindex, 1);

                        var str = JSON.stringify(list);
                        var d = new Date();
                        d.setDate(d.getDate() + 3);
                        document.cookie = "list=" + str + "; expires=" + d + ";path=" + "/";
                        //移除元素
                        $(that).parent().parent().parent().remove();

                    })
                })

                //勾选商品
                //单选
                $("a.select-single").on("click", function () {
                    if (!$(this).hasClass("select-active")) {
                        $(this).addClass("select-active")
                    } else {
                        $(this).removeClass("select-active")
                    }
                    //如果找到没有选中的复选框 ，则返回true
                    var isAllSelect = $("a.select-single").is(function (index) {
                        return !$(this).hasClass("select-active");
                    })
                    if (!isAllSelect) {
                        $(".selectall").addClass("select-active");
                    } else {
                        $(".selectall").removeClass("select-active");
                    }
                });
                //全选
                $(".selectall").on("click", function () {
                    if (!$(".selectall").hasClass("select-active")) {
                        $(".selectall").addClass("select-active");
                        $("a.select-single").addClass("select-active");
                    } else {
                        $(".selectall").removeClass("select-active");
                        $("a.select-single").removeClass("select-active");
                    }

                });


                //下滑固定头部
                $(window).scroll(function () {
                    if ($(this).scrollTop() >= 500) {
                        $(".m-header-fix").addClass("m-header-fixed");
                        $(".nav-part").show();
                        $(".m-kind").find(".nav-part").on("mouseover", function () {
                            $(".nav-container").addClass("nav-container-fix").show(200);
                        });
                        $(".m-kind").find(".nav-part").on("mouseout", function () {
                            $(".nav-container").removeClass("nav-container-fix");
                        });
                    } else {
                        $(".m-header-fix").removeClass("m-header-fixed");
                        $(".nav-part").hide();
                    }
                    var index = Math.round(($(this).scrollTop() - 1000) / 600);
                    $("#LoutiNav ul li:not(last)").eq(index).addClass("hover").siblings().removeClass("hover")
                })
            })
        })
    })
})