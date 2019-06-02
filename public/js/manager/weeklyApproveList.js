layui.use(['table', 'form', 'layer'], function () {
    var $ = layui.jquery;
    var table = layui.table;
    var form = layui.form;
    var layer = layui.layer;

    //第一个实例
    var weeklyTable = table.render({
        elem: '#weeklyTable'
        , height: 600
        , url: '/weekly/approveList' //数据接口
        , page: true //开启分页
        , layout: ['count', 'prev', 'page', 'next', 'limit', 'skip']
        , cols: [[ //表头
            {field: 'executor', width: 100, title: '任务执行人', templet: '<div>{{d.executorObj.username}}</div>'}
            , {field: 'startTime', width: 120, title: '开始时间', templet: '<div>{{d.startTime.split("T")[0]}}</div>'}
            , {field: 'endTime', width: 120, title: '结束时间', templet: '<div>{{d.endTime.split("T")[0]}}</div>'}
            , {field: 'taskDesc', width: 400, title: '任务描述'}
            , {field: 'project', width: 200, title: '所属项目', templet: '<div>{{d.projectObj.name}}</div>'}
            , {field: 'process', width: 100, title: '完成状态'}
            , {field: 'taskTime', width: 100, title: '参考工时'}
            , {field: 'approveTaskTime', width: 100, title: '审批工时'}
            , {field: 'isApprove', width: 100, title: '是否审批'}
            , {fixed: 'right', width: 200, align: 'center', toolbar: '#toolBar', title: '操作'}
        ]],
        limits: [1, 10, 20, 50, 100],
        limit: 20
    });

    //监听提交
    form.on('submit(searchWeekly)', function (data) {
        weeklyTable.reload({
            url: '/weekly/approveFind',
            where: data.field
        });
        return false;
    });

    table.on('tool(handler)', function (obj) {
        var data = obj.data,
            layEvent = obj.event;
        var _id = data.id;
        var isApprove = data.isApprove;
        var executor = data.executor;
        if (layEvent === 'approve') {
            debugger
            if (data.projectObj.manager == $("#current").val()) {
                layer.open({
                    type: 2,
                    area: ['800px', '600px'],
                    fix: false,
                    resize: false,
                    shade: 0.4,
                    title: '周报信息审批',
                    content: '/manager/approveWeekly?id=' + _id
                });
            } else {
                layer.alert('只有该项目的项目经理可以审批改周报！', {icon: 1});
            }

        } else if (layEvent === 'detail') {
            layer.open({
                type: 2,
                area: ['800px', '600px'],
                fix: false,
                resize: false,
                shade: 0.4,
                title: '周报详情查看',
                content: '/manager/detailWeekly?id=' + _id
            });
        }
    });

});
