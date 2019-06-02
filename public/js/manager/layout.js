/**
 * layout是后台管理页面的大框架，包含了相同的导航条和侧边栏
 * 一些公共的函数也可以定义在这个文件里面
 */
layui.use('element', 'form', function() {
    var $ = layui.jquery;
    var element = layui.element;
    //退出
    function logout() {
        layer.confirm('确定退出？', function(index) {
            layer.close(index);
            $.ajax({
                url: '/logout',
                success: function(res) {
                    if (!res.code) {
                        window.location = '/';
                    }
                }
            });
        });
    }
    $(function() {
        $("#infomation").on('click', function() {
            layer.open({
                type: 2,
                area: ['500px', '350px'],
                fix: false,
                resize: false,
                shade: 0.4,
                title: '个人信息修改',
                content: '/user/editByEmployee?id=' + $("#userId").val()
            });
        });

        $("#passwordSet").on('click', function() {
            layer.open({
                type: 2,
                area: ['400px', '300px'],
                fix: false,
                resize: false,
                shade: 0.4,
                title: '个人信息修改',
                content: '/user/setPassword'
            });
        });

        $("#toggleSlide").on('click', function() {
            if ($(this).hasClass('x-slide_left')) {
                $(this).removeClass('x-slide_left').addClass('x-slide_right')
                $(".layui-side").css('left', '-200px');
                $(".layui-body").css('left', '0');
            } else {
                $(this).removeClass('x-slide_right').addClass('x-slide_left')
                $(".layui-body").css('left', '200px');
                $(".layui-side").css('left', '0');
            }

        });

    });
});

/*关闭弹出框口的父窗口*/
function closeParentLayer() {
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}