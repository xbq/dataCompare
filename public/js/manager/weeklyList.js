layui.use(['table', 'form', 'layer'], function () {
    var $ = layui.jquery;
    var table = layui.table;
    var form = layui.form;
    var layer = layui.layer;

    var isAdmin = $("#isAdmin").val();
    var cols = [];
    if (isAdmin=='true') {

        cols = [[ //表头
            {field: 'executorObj', width: 120, title: '周报录入人员', templet: '<div>{{d.executorObj.username}}</div>'}
            , {
                field: 'startTime',
                width: 120,
                title: '开始时间',
                templet: '<div>{{d.startTime?d.startTime.split("T")[0]:""}}</div>'
            }
            , {
                field: 'endTime',
                width: 120,
                title: '结束时间',
                templet: '<div>{{d.endTime?d.endTime.split("T")[0]:""}}</div>'
            }
            , {field: 'taskDesc', width: 400, title: '任务描述'}
            , {field: 'project', width: 200, title: '所属项目', templet: '<div>{{d.projectObj.name}}</div>'}
            , {field: 'process', width: 100, title: '完成状态'}
            , {field: 'taskType', width: 100, title: '任务类型'}
            , {field: 'taskTime', width: 80, title: '工时'}
            , {field: 'approveTaskTime', width: 100, title: '审批工时'}
            , {field: 'isApprove', width: 100, title: '是否审批'}
            , {
                field: 'approver',
                width: 100,
                title: '审批人',
                templet: '<div>{{d.approverObj?d.approverObj.username:""}}</div>'
            }
            , {fixed: 'right', width: 200, align: 'center', toolbar: '#toolBar', title: '操作'}
        ]];

    } else {
        //非管理员显示的都是自己的周报没有必要进行录入人员的筛选
        $($('[name=executor]').parent()).css('display','none');
        cols = [[ //表头
            {
                field: 'startTime',
                width: 120,
                title: '开始时间',
                templet: '<div>{{d.startTime?d.startTime.split("T")[0]:""}}</div>'
            }
            , {
                field: 'endTime',
                width: 120,
                title: '结束时间',
                templet: '<div>{{d.endTime?d.endTime.split("T")[0]:""}}</div>'
            }
            , {field: 'taskDesc', width: 400, title: '任务描述'}
            , {field: 'project', width: 200, title: '所属项目', templet: '<div>{{d.projectObj.name}}</div>'}
            , {field: 'process', width: 100, title: '完成状态'}
            , {field: 'taskType', width: 100, title: '任务类型'}
            , {field: 'taskTime', width: 80, title: '工时'}
            , {field: 'approveTaskTime', width: 100, title: '审批工时'}
            , {field: 'isApprove', width: 100, title: '是否审批'}
            , {
                field: 'approver',
                width: 100,
                title: '审批人',
                templet: '<div>{{d.approverObj?d.approverObj.username:""}}</div>'
            }
            , {fixed: 'right', width: 200, align: 'center', toolbar: '#toolBar', title: '操作'}
        ]];

    }
    //第一个实例
    var weeklyTable = table.render({
        elem: '#weeklyTable'
        , height: 600
        , url: '/weekly/list' //数据接口
        , page: true //开启分页
        , layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
        , cols: cols,
        limits: [5, 10, 20, 50, 100],
        limit: 10
    });

    //监听提交
    form.on('submit(searchWeekly)', function (data) {
        weeklyTable.reload({
            url: '/weekly/find',
            where: data.field
        });
        return false;
    });


    //监听提交
    form.on('submit(addWeekly)', function () {
        layer.open({
            type: 2,
            title: '添加周报',
            fix: false,
            resize: false,
            shade: 0.4,
            area: ['800px', '510px'],
            content: '/weekly/add'
        });
        return false
    });


    table.on('tool(handler)', function (obj) {
        var data = obj.data,
            layEvent = obj.event;
        var id = data.id;
        var isApprove = data.isApprove;
        var executor = data.executorObj;
        if (layEvent === 'del') {
            if (executor.id == $("#current").val()) {
                if (isApprove != '是') {
                    layer.confirm('确认删除该行记录？', function (index) {

                        layer.close(index);
                        $.ajax({
                            type: 'GET',
                            url: '/weekly/delete?id=' + id,
                            success: function (data) {
                                if (!data.code) {
                                    obj.del();
                                }
                                layer.msg(data.message, {
                                    icon: 1,
                                    time: 1000
                                });
                            }
                        });
                    });
                } else {
                    layer.alert('该周报已经审批通过，不能删除！', {icon: 1});
                }
            } else {
                layer.alert('只有周报的录入人员才能删除周报！', {icon: 1});
            }

        } else if (layEvent === 'edit') {
            if (executor.id == $("#current").val()) {
                if (isApprove != '是') {
                    layer.open({
                        type: 2,
                        area: ['800px', '510px'],
                        fix: false,
                        resize: false,
                        shade: 0.4,
                        title: '周报信息编辑',
                        content: '/weekly/edit?id=' + id
                    });
                } else {
                    layer.alert('该周报已经审批通过，不能编辑！', {icon: 1});
                }
            } else {
                layer.alert('只有周报的录入人员才能修改周报！', {icon: 1});
            }
        } else if (layEvent === 'detail') {
            layer.open({
                type: 2,
                area: ['800px', '600px'],
                fix: false,
                resize: false,
                shade: 0.4,
                title: '周报详情查看',
                content: '/manager/detailWeekly?id=' + id
            });
        }
    });

});
