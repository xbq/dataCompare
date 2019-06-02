layui.use(['form'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    $(function () {
        var id = getUrlParam('id');
        $.ajax({
            type: 'get',
            url:'/project/findOneById?id='+id,
            success: function(res) {
                if(res.project){
                    $("#name").val(res.project.name);
                    $("#number").val(res.project.number);
                    $("#description").val(res.project.description);
                    $("#budget").val(res.project.budget);
                    $("#startTime").val((res.project.startTime||""));
                    $("#endTime").val((res.project.startTime||""));
                    $("#preStartTime").val((res.project.preStartTime||""));
                    $("#preEndTime").val((res.project.preEndTime||""));
                    $("#manager").val(res.project.manager);
                    $("#state").val(res.project.state);
                    form.render();
                }
            }
        });
    });
});

/*关闭弹出框口的父窗口*/
function closeParentLayer() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r != null) return decodeURI(r[2]);
    return null;
}