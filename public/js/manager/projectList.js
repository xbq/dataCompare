layui.use(['table', 'form', 'layer'], function() {
    var $ = layui.jquery;
    var table = layui.table;
    var form = layui.form;
    var layer = layui.layer;
    var isAdmin = $("#isAdmin").val();
    if (isAdmin !== 'true') {
        $("#btnAdd").css('display', 'none');
    } else {
        $("#btnAdd").css('display', 'block');
    }
    //第一个实例
    var projectTable = table.render({
        elem: '#projectList',
        height: 600,
        url: '/project/all' //数据接口
            ,
        page: true //开启分页
            ,
        layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],
        cols: [
            [ //表头
                { type: 'checkbox' }, { field: 'number', width: 200, title: '项目编号' }, { field: 'name', width: 200, title: '项目名称' }, { field: 'budget', width: 100, title: '项目预算' }, { width: 100, title: '项目经理', templet: '<div>{{d.managerObj.username}}</div>' }, { field: 'preStartTime', width: 120, title: '预计开始时间', templet: '<div>{{d.preStartTime?d.preStartTime.split("T")[0]:""}}</div>' }, { field: 'preEndTime', width: 120, title: '预计结束时间', templet: '<div>{{d.preEndTime?d.preEndTime.split("T")[0]:""}}</div>' }, { field: 'startTime', width: 120, title: '开始时间', templet: '<div>{{d.startTime?d.startTime.split("T")[0]:""}}</div>' }, { field: 'endTime', width: 120, title: '结束时间', templet: '<div>{{d.endTime?d.endTime.split("T")[0]:""}}</div>' }, { field: 'state', width: 100, title: '项目状态' }, { fixed: 'right', width: 200, align: 'center', toolbar: '#toolBar', title: '操作' }
            ]
        ],
        limits: [1, 10, 20, 50, 100],
        limit: 20
    });

    //监听提交
    form.on('submit(searchProject)', function(data) {
        projectTable.reload({
            url: '/project/find',
            where: data.field
        });
        return false;
    });
    //监听提交
    form.on('submit(addProject)', function() {
        layer.open({
            type: 2,
            title: '添加项目',
            shadeClose: true,
            resize: false,
            shade: false,
            area: ['800px', '650px'],
            content: '/project/add'
        });
        return false
    });

    //监听提交
    form.on('submit(compareData)', function() {
        var checkStatus = table.checkStatus(projectTable.config.id);
        console.log(checkStatus);
        // layer.open({
        //     type: 2,
        //     title: '添加项目',
        //     shadeClose: true,
        //     resize: false,
        //     shade: false,
        //     area: ['800px', '650px'],
        //     content: '/project/add'
        // });

        //拿到每条数据的唯一标识，将唯一标识用逗号隔开传给后台，后台返回不相同的数据即可
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
            if (current != manager && isAdmin !== 'true') {
                layer.alert('对不起，只有项目经理和管理员才有删除的权限！', { icon: 1 });
            } else {
                layer.confirm('确认删除该行记录？', function(index) {
                    layer.close(index);
                    $.ajax({
                        type: 'GET',
                        url: '/project/delete?id=' + id,
                        success: function(data) {
                            if (data.code == '0') {
                                obj.del();
                            }
                            layer.msg(data.message, {
                                icon: 1,
                                time: 1000
                            });
                        }
                    });
                });
            }

        } else if (layEvent === 'edit') {
            if (current != manager && isAdmin !== 'true') {
                layer.alert('对不起，只有项目经理和管理员才有编辑的权限！', { icon: 1 });
            } else {
                layer.open({
                    type: 2,
                    area: ['800px', '650px'],
                    fix: false,
                    resize: false,
                    shade: 0.4,
                    title: '项目信息编辑',
                    content: '/project/edit?id=' + id
                });
            }
        } else if (layEvent === 'detail') {
            layer.open({
                type: 2,
                area: ['800px', '650px'],
                fix: false,
                resize: false,
                shade: 0.4,
                title: '项目信息编辑',
                content: '/project/detail?id=' + id
            });
        }
    });
});