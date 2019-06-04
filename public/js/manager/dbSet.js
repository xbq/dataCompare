layui.use(['form', 'layer'], function() {
    var $ = layui.jquery;
    var form = layui.form;
    var layer = layui.layer;
    //监听提交
    form.on('submit(submit)', function(data) {
        console.log(data);
        return false
    });

    //监听提交
    form.on('submit(connectTest)', function(data) {
        $.ajax({
            url: '/testConnect',
            type: 'post',
            data: data.field,
            success: function(res) {
                if (res && res[0] && res[0].date) {
                    layer.msg('连接成功');
                } else {
                    layer.msg('连接失败');
                }
            }
        });
        return false
    });
});