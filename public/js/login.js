layui.use(['form'], function() {
    var form = layui.form;
    var $ = layui.jquery;

    form.on('submit(login)', function(data) {
        var username = $('[name=username]').val();
        var password = $('[name=password]').val();
        if ($.trim(username) != "" && $.trim(password) != "") {
            $.ajax({
                type: 'POST',
                url: '/login',
                data: data.field,
                success: function(res) {
                    if (!res.code) {
                        window.location = '/peopleList';
                    } else {
                        $(".errorMessage")[0].innerHTML = res.message;
                    }
                }
            });
        } else {
            $(".errorMessage")[0].innerHTML = "用户名和密码不能为空！";

        }
        return false;
    });
});