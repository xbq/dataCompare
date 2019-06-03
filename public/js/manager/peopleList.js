layui.use(['upload', 'table', 'form', 'layer'], function() {
    var $ = layui.jquery;
    var table = layui.table;
    var form = layui.form;
    var layer = layui.layer;
    var upload = layui.upload;

    upload.render({
        elem: '#uploadExcel',
        url: '/upload',
        accept: 'file' //普通文件
            ,
        done: function(res) {
            if (res.Code == 0) {
                layer.msg(res.message, {
                    icon: 1,
                    time: 1000
                }, function() {
                    peopleTable.reload();
                });
            }
        }
    });
    //第一个实例
    var peopleTable = table.render({
        elem: '#peopleList',
        height: 600,
        url: '/people/all' //数据接口
            ,
        page: true //开启分页
            ,
        layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
        cols: [
            [ //表头
                { type: 'checkbox' },
                { field: 'idcard', width: 200, title: '身份证', align: 'center' },
                { field: 'name', width: 100, title: '姓名', align: 'center' },
                { width: 100, title: '情况', templet: function(data) { return data.status == "0" ? '卒' : '生' }, align: 'center' },
                { fixed: 'right', width: 200, align: 'center', toolbar: '#toolBar', title: '操作', align: 'center' }
            ]
        ],
        limits: [1, 10, 20, 50, 100],
        limit: 20
    });

    //监听提交
    form.on('submit(searchProject)', function(data) {
        peopleTable.reload({
            url: '/people/find',
            where: data.field
        });
        return false;
    });
    //监听提交
    form.on('submit(addPeople)', function() {
        layer.open({
            type: 2,
            title: '添加个人信息',
            shadeClose: true,
            resize: false,
            shade: false,
            area: ['400px', '300px'],
            content: '/people/add'
        });
        return false
    });

    //监听提交
    form.on('submit(compareData)', function() {
        var checkStatus = table.checkStatus(peopleTable.config.id);
        var idcards = '';
        //拿到每条数据的唯一标识，将唯一标识用逗号隔开传给后台，后台返回不相同的数据即可
        checkStatus.data.forEach(function(item) {
            idcards += item.idcard + ',';
        })
        $.ajax({
            url: "people/compare",
            type: 'post',
            data: {
                idcardArr: idcards.substr(0, idcards.length - 1)
            },
            success: function(res) {
                if (res.changeList.length > 0) {
                    layer.alert("信息有出入的人员的身份证号码为：<br/>" + res.changeList.join('<br/>'));
                } else {
                    layer.alert("所选数据和远程数据库的信息完全相同！");
                }


            }
        });
        //然后从
        return false
    });




    table.on('tool(handler)', function(obj) {
        var data = obj.data,
            layEvent = obj.event;
        var id = data.id;
        var current = $("#current").val();
        var manager = data.manager;

        if (layEvent === 'del') {
            layer.confirm('确认删除该行记录？', function(index) {
                layer.close(index);
                $.ajax({
                    type: 'GET',
                    url: '/people/delete?id=' + id,
                    success: function(data) {
                        if (data.code == '0') {
                            obj.del();
                        }
                        layer.msg(data.message, {
                            icon: 1,
                            time: 1000
                        }, function() {
                            peopleTable.reload();
                        });
                    }
                });
            });

        } else if (layEvent === 'edit') {
            layer.open({
                type: 2,
                title: '修改个人信息',
                shadeClose: true,
                resize: false,
                shade: false,
                area: ['400px', '300px'],
                content: '/people/edit?id=' + id
            });
        }
    });
});