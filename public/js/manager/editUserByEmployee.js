layui.use(['form'], function(){
    var $ = layui.jquery;
    var form = layui.form;

    $(function(){
        var id = getUrlParam('id');
        $("[name=id]").val(id);
        $.ajax({
            type: 'get',
            url:'/user/findById?id='+id,
            success: function(res) {
                if(res.user){
                    $("#username").val(res.user.username);
                    $("#tel").val(res.user.tel);
                    $("#department").val(res.user.department);
                    $("#role").val(res.user.role);
                    a("[name=isAdmin][value="+e.user.isAdmin+"]").attr("checked",true);
                    form.render();
                }
            }
        });
    });

    //监听提交
    form.on('submit(editUser)', function(data) {
        $.ajax({
            type: 'POST',
            url:'/user/update',
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
    if(r != null) return unescape(r[2]);
    return null;
}