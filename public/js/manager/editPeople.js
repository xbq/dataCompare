layui.use(['form', 'laydate'], function() {
    var $ = layui.jquery;
    var form = layui.form;

    $(function() {
        var id = getUrlParam('id');
        $.ajax({
            url: "/people/getById?id=" + id,
            success: function(res) {
                if (res.data) {
                    $("#idcard").val(res.data.idcard);
                    $("#name").val(res.data.name);
                    $("#status").val(res.data.status);
                    $("#id").val(res.data.id);
                    form.render();
                }
            }
        });

        form.render();
    });

    //监听提交
    form.on('submit(updatePeople)', function(data) {
        data.field.isPublish = true;
        data.field.publishTime = new Date();
        $.ajax({
            type: 'POST',
            url: '/people/update',
            data: data.field,
            success: function(res) {
                debugger
                if (!res.code) {
                    layer.open({
                        content: res.message,
                        yes: function(index, layero) {
                            closeParentLayer();
                            if (parent.document.getElementsByClassName('layui-laypage-btn')[0]) {
                                parent.document.getElementsByClassName('layui-laypage-btn')[0].click();
                            } else {
                                parent.table.render({ //其它参数省略
                                    id: 'peopleList'
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
    if (r != null) return decodeURI(r[2]);
    return null;
}