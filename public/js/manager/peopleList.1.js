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
        url: '/people/all' //数据接口
            ,
        page: true //开启分页
            ,
        layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
        cols: [
            [ //表头
                { type: 'checkbox' },
                { field: 'name',  title: '姓名', align: 'center' },
                { field: 'sex',  title: '性别', align: 'center' },
                { field: 'birthday',  title: '出身年月', align: 'center' },
                { field: 'age', title: '年龄', align: 'center' },
                { field: 'description', width: 150, title: '人员类别明细', align: 'center' },
                { field: 'retiretime', title: '精减时间', align: 'center' },
                { field: 'subsidy', title: '补贴标准', align: 'center' },
                { field: 'address',width: 200, title: '现居住地', align: 'center' },
                { field: 'idnum',  title: '身份证', align: 'center' },
                { field: 'tel',  title: '联系方式', align: 'center' },
                { fixed: 'right', width: 150, align: 'center', toolbar: '#toolBar', title: '操作', align: 'center' }
            ]
        ],
        limits: [1, 10, 20, 50, 100],
        limit: 10
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
    //监听提交
    form.on('submit(addPeople)', function(data) {
        $.ajax({
            type: 'POST',
            url: '/people/add',
            data: data.field,
            success: function(res) {
                if (!res.code) {
                    layer.msg(
                        res.message, {
                            icon: 1,
                            time: 2000 //2秒关闭（如果不配置，默认是3秒）
                        },
                        function() {
                            peopleTable.reload();
                            $("#btnReset").click()
                        }
                    );


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

    //监听提交
    form.on('submit(compareData)', function() {
        var checkStatus = table.checkStatus(peopleTable.config.id);
        var selectedCount = checkStatus.data.length
        $("#selectedCount").text(selectedCount);
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
                var changeCount = res.changeList.length;
                $("#changeCount").text(changeCount);
                var selectRemoteCount = res.remoteList.length;
                $("#selectRemoteCount").text(selectRemoteCount);
                var noChangeCount = selectedCount - changeCount;
                $("#noChangeCount").text(noChangeCount);
                table.render({
                    elem: '#peopleSelectList',
                    data: checkStatus.data,
                    cols: [
                        [ //表头
                            { field: 'idcard', title: '身份证', align: 'center' },
                            { field: 'name', title: '姓名', align: 'center' },
                            { title: '情况', templet: function(data) { return data.status == "0" ? '卒' : '生' }, align: 'center' }
                        ]
                    ]
                });

                table.render({
                    elem: '#peopleRemoteList',
                    data: res.remoteChangeList,
                    cols: [
                        [ //表头
                            { field: 'idcard', title: '身份证', align: 'center' },
                            { field: 'name', title: '姓名', align: 'center' },
                            { title: '健康情况', templet: function(data) { return data.status == "0" ? '卒' : '生' }, align: 'center' }
                        ]
                    ],
                });

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