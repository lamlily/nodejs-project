// let admin0 = Cookie.getCookie("admin");
// if(admin==""){
//     alert("请先登录！");
    
// }
let admin0 = $.cookie("admin");

$(".admin").html(admin0);

$(".logout").on("click",function(){
    $.removeCookie("admin");
    $(".admin").html("请先登录");
})