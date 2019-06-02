layui.use(['form'], function(){
    var $ = layui.jquery;
    var form = layui.form;

    //监听提交
    form.on('submit(addUser)', function(data) {
        $.ajax({
            type: 'POST',
            url:'/user/add',
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