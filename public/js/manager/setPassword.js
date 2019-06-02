layui.use(['form'], function(){
    var $ = layui.jquery;
    var form = layui.form;

    $("#newPWD").val('');
    $("#pwdConfirm").val('');
    $("#oldPWD").val('');

    //监听提交
    form.on('submit(setPassword)', function(data) {
        var newPWD = $.trim($("#newPWD").val());
        var PwdConfirm = $.trim($("#pwdConfirm").val());
        if(newPWD!=PwdConfirm){
            layer.msg('两次输入的新密码不一致，请重新输入！', {
                icon: 5
            });
        }else{
            $.ajax({
                type: 'POST',
                url:'/user/updatePassword',
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
    if(r != null) return unescape(r[2]);
    return null;
}