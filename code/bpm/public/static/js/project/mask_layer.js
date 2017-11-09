//弹出加载层
function loadMaskLayer(flag) {
    if($('#myMaskLayer').length==0){
        if(flag=='1'){
            $("<div class=\"datagrid-mask\" id='myMaskLayer'></div>").css({ display: "block", width: "100%", height: $(document).height() }).appendTo("body");
            $("<div class=\"datagrid-mask-msg\"></div>").html('正在处理...').appendTo("body").css({ display: "block",position: "fixed",
                left: ($(document.body).outerWidth(true) - 190) / 2, top: ($(window).height() - 45) / 2, height:"40px" });
        }else{
            $("<div class=\"datagrid-mask\" id='myMaskLayer'></div>").css({ display: "block", width: "100%", height: $(window).height() }).appendTo("body");
            $("<div class=\"datagrid-mask-msg\"></div>").html('正在加载...').appendTo("body").css({ display: "block",
                left: ($(document.body).outerWidth(true) - 190) / 2, top: ($(window).height() - 45) / 2, height:"40px" });
        }
    }
}
//取消加载层  
function disLoadMaskLayer() {
    $(".datagrid-mask").remove();
    $(".datagrid-mask-msg").remove();

}