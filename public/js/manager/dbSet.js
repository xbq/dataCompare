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
        console.log(data);
        return false
    });
});