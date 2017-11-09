/**
 * Created by HePengFei 2017.3 .
 */
// 关闭窗口
function closeWindow(){
    $('#newWindow').window('close');
}


function detail(v,r,i){
    var btn = "<a href=\"javascript:openWindow('详情');\">"+v+"</a>"
    JSON.str
    return btn;
}
$(document).ready(function(){
    //初始化加载详情窗口
    intDetail();
    /*$('#simpledatatable').datagrid({
        onLoadSuccess:function(data){
            if (data.rows.length >0) {
                $('#simpledatatable').datagrid("selectRow", 0);
            }
        }
    });*/
});


//提示信息
function msgSuccess(msg) {
    Notify(msg, 'bottom-right', '5000', 'success', 'fa-check', true);
    function showUserMsg(r){
        var btn =  "<a style=\"color:red\" href=\"javascript:void(0);\" onclick=\"openWindow('访问次数详情'"
        btn += ",'{{projcfg.appurl}}/api/notice/notice_routes/accessNotUser?not_id="+ r.not_id+"')\">"+ r.nums+"</a>"
        return btn;
    }
}


