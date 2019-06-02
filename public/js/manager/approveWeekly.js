layui.use(['form','laydate'], function(){
    var $ = layui.jquery;
    var form = layui.form;
    var laydate = layui.laydate;
    $(function(){
        var id = getUrlParam('id');
        $("#id").val(id);
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
                    $("[name=isApprove][value="+res.weekly.isApprove+"]").attr('checked',true);
                    $("#approveOpinion").val(res.weekly.approveOpinion);
                    form.render();
                }
            }
        });
    });

    //监听提交
    form.on('submit(editWeekly)', function(data) {
        var isApprove = $("[name=isApprove]").val();
        var approveTaskTime = $.trim($("#approveTaskTime").val());
        if(!approveTaskTime){
            layer.msg('请填写审批工时！', {
                icon: 1,
                time: 1000
            });
        }else if(!isApprove){
            layer.msg('请选择审批状态！', {
                icon: 1,
                time: 1000
            });
        }else{
            $.ajax({
                type: 'POST',
                url:'/weekly/update',
                data: data.field,
                success: function(res) {
                    if(!res.code) {
                        layer.open({
                            content: res.message,
                            yes: function(index, layero) {
                                closeParentLayer();
                                parent.document.getElementsByClassName('layui-laypage-btn')[0].click();
                            }
                        });
                    } else {
                        layer.msg(res.message, {
                            icon: 5,
                            shift: 6
                        });
                    }
                }
            });
        }

        return false;
    });
});

/*关闭弹出框口的父窗口*/
function closeParentLayer(){
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r != null) return decodeURI(r[2]);
    return null;
}