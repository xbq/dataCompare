layui.use(['form', 'laydate'], function() {
    var $ = layui.jquery;
    var form = layui.form;
    var laydate = layui.laydate;

    laydate.render({
        elem:"#retiretime",
        type:"month",
        format:"yyyyMM",
        trigger:"click"
    })

    laydate.render({
        elem:"#birthday",
        type:"month",
        format:"yyyyMM",
        trigger:"click"
    })

    $(function() {
        var id = getUrlParam('id');
        $.ajax({
            url: "/people/getById?id=" + id,
            success: function(res) {
                if (res.data) {
                    $("#idnum").val(res.data.idnum);
                    $("#name").val(res.data.name);
                    $("#birthday").val(res.data.birthday);
                    $("[name='sex'][value='"+res.data.sex+"']").attr('checked',true);
                    $("#age").val(res.data.age);
                    $("#description").val(res.data.description);
                    $("#retiretime").val(res.data.retiretime);
                    $("#subsidy").val(res.data.subsidy);
                    $("#address").val(res.data.address);
                    $("#tel").val(res.data.tel);
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