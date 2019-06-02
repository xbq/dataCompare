layui.use(['form','laydate'], function(){
    var $ = layui.jquery;
    var form = layui.form;
    var laydate = layui.laydate;

    var role = "";
    //应用layui时间组件
    laydate.render({
        elem: '#startTime'
    });
    laydate.render({
        elem: '#endTime'
    });


    $(function(){
        form.render();
        //这儿待处理，#role的值是base64编码之后的，需要解码
        var Base = new Base64();
        role = Base.decode($("#role").val());
    });

    //监听提交
    form.on('submit(addWeekly)', function(data) {
        data.field.isPublish=true;
        data.field.publishTime = new Date();
        $.ajax({
            type: 'POST',
            url:'/weekly/add',
            data: data.field,
            success: function(res) {
                if(!res.code) {
                    layer.open({
                        content: res.message,
                        yes: function() {
                            closeParentLayer();
                            if(parent.document.getElementsByClassName('layui-laypage-btn')[0]){
                                parent.document.getElementsByClassName('layui-laypage-btn')[0].click();
                            }else{
                                parent.table.render({ //其它参数省略
                                    id: 'weeklyList'
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
function closeParentLayer(){
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}