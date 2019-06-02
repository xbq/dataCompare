layui.use(['form','laydate'], function(){
    var $ = layui.jquery;
    var form = layui.form;
    var laydate = layui.laydate;
    $(function(){
        var id = getUrlParam('id');
        $.ajax({
            type: 'get',
            url:'/weekly/approve?id='+id,
            success: function(res) {
                if(res.weekly){
                    $("#startTime").val(res.weekly.startTime.split('T')[0]);
                    $("#endTime").val(res.weekly.endTime.split('T')[0]);
                    $("#taskDesc").val(res.weekly.taskDesc);
                    $("#taskTime").val(res.weekly.taskTime);
                    $("#process").val(res.weekly.process);
                    $("#project").val(res.weekly.projectObj.name);
                    $("#approveTaskTime").val(res.weekly.approveTaskTime);
                    $("#executor").val(res.weekly.executorObj.username);
                    $("#isApprove").val(res.weekly.isApprove);
                    $("#approveOpinion").val(res.weekly.approveOpinion);
                    form.render();
                }
            }
        });
    });
});

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r != null) return decodeURI(r[2]);
    return null;
}