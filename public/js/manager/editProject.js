layui.use(['form','laydate'], function () {
    var $ = layui.jquery;
    var form = layui.form;
    var laydate=layui.laydate;

    laydate.render({
        elem:'#startTime'
    });
    laydate.render({
        elem:'#endTime'
    });
    laydate.render({
        elem:'#preStartTime'
    });
    laydate.render({
        elem:'#preEndTime'
    });

    $(function () {
        var id = getUrlParam('id');
        $("#id").val(id);
        $.ajax({
            type: 'get',
            url:'/project/findOneById?id='+id,
            success: function(res) {
                if(res.project){
                    $("#name").val(res.project.name);
                    $("#number").val(res.project.number);
                    $("#description").val(res.project.description);
                    $("#budget").val(res.project.budget);
                    $("#startTime").val((res.project.startTime||"").split("T")[0]);
                    $("#endTime").val((res.project.startTime||"").split("T")[0]);
                    $("#preStartTime").val((res.project.preStartTime||"").split("T")[0]);
                    $("#preEndTime").val((res.project.preEndTime||"").split("T")[0]);
                    $("#manager").val(res.project.manager);
                    $("#state").val(res.project.state);
                    form.render();
                }
            }
        });
    });

    //监听提交
    form.on('submit(editProject)', function (data) {
        data.field.isPublish = true;
        data.field.publishTime = new Date();
        $.ajax({
            type: 'POST',
            url: '/project/update',
            data: data.field,
            success: function (res) {
                if (!res.code) {
                    layer.open({
                        content: res.message,
                        yes: function (index, layero) {
                            closeParentLayer();
                            if (parent.document.getElementsByClassName('layui-laypage-btn')[0]) {
                                parent.document.getElementsByClassName('layui-laypage-btn')[0].click();
                            } else {
                                parent.table.render({ //其它参数省略
                                    id: 'projectList'
                                });
                            }

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
        return false;
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