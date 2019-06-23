layui.use(['upload', 'table', 'form', 'layer','laydate'], function () {
    var $ = layui.jquery;
    var table = layui.table;
    var form = layui.form;
    var layer = layui.layer;
    var upload = layui.upload;
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

    upload.render({
        elem: '#uploadExcel',
        url: '/upload',
        accept: 'file' //普通文件
            ,
        done: function (res) {
            if (res.Code == 0) {
                layer.msg(res.message, {
                    icon: 1,
                    time: 1000
                }, function () {
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
                {
                    type: 'checkbox'
                },
                {
                    field: 'name',
                    title: '姓名',
                    align: 'center'
                },
                {
                    field: 'sex',
                    title: '性别',
                    align: 'center'
                },
                {
                    field: 'birthday',
                    title: '出身年月',
                    align: 'center'
                },
                {
                    title: '是否健在',
                    align: 'center',
                    templet: function (d) {
                        switch (d.isdead) {
                            case 1:
                                return '<span>未知</span>';
                            case 0:
                                return '<span class="isdead">已故</span>';
                            case 2:
                                return '<span class="islive">健在</span>'
                        }
                    }
                },
                {
                    field: 'age',
                    title: '年龄',
                    align: 'center'
                },
                {
                    field: 'description',
                    width: 150,
                    title: '人员类别明细',
                    align: 'center'
                },
                {
                    field: 'retiretime',
                    title: '精减时间',
                    align: 'center'
                },
                {
                    field: 'subsidy',
                    title: '补贴标准',
                    align: 'center'
                },
                {
                    field: 'address',
                    width: 200,
                    title: '现居住地',
                    align: 'center'
                },
                {
                    field: 'idnum',
                    title: '身份证',
                    align: 'center',
                    width: 150
                },
                
                {
                    field: 'tel',
                    title: '联系方式',
                    align: 'center',
                    width:150
                },
                
                {
                    fixed: 'right',
                    width: 150,
                    align: 'center',
                    toolbar: '#toolBar',
                    title: '操作',
                    align: 'center'
                }
            ]
        ],
        limits: [1, 10, 20, 50, 100],
        limit: 10
    });

    //监听提交
    form.on('submit(searchProject)', function (data) {
        var searchKey = $("#searchKey").val();
        var where = {};
        where[searchKey] = $("#searchValue").val();
        if(searchKey=="isdead"){
            where[searchKey] = $("#search-isdead").val();
        }
        peopleTable.reload({
            url: '/people/find',
            where: where
        });
        return false;
    });

    //监听提交
    form.on('select(changeField)', function (data) {
        var searchKey = $("#searchKey").val();
        if(searchKey=='isdead'){
            $("#searchValueWrap").css('display','none');
            $("#search-isdeadWrap").css('display','inline-block');
        }else{
            $("#searchValueWrap").css('display','inline-block');
            $("#search-isdeadWrap").css('display','none');
        }
        form.render();
    });


    //监听提交
    form.on('submit(addPeople)', function (data) {
        $.ajax({
            type: 'POST',
            url: '/people/add',
            data: data.field,
            success: function (res) {
                if (!res.code) {
                    layer.msg(
                        res.message, {
                            icon: 1,
                            time: 2000 //2秒关闭（如果不配置，默认是3秒）
                        },
                        function () {
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

    $("#btnCompare").click(function(){
        var checkStatus = table.checkStatus(peopleTable.config.id);
        var selectedCount = checkStatus.data.length
        $("#selectedCount").text(selectedCount);
        var rmeoteCount = 0;
        //拿到每条数据的唯一标识，将唯一标识用逗号隔开传给后台，后台返回不相同的数据即可
        checkStatus.data.forEach(function (item) {
            (function (people) {
                $.ajax({
                    url: url,
                    async: false,
                    type: 'https://interface.zjzwfw.gov.cn/gateway/api/001003010/dataSharing/cremationInfo.htm',
                    data: {
                        requestTime: new Date().getTime(),
                        cardId: people.idnum,
                        sign: 'af2c4d32fa4eba353ad02a320f22d909',
                        appKey: 'ada72850-2b2e-11e7-985b-008cfaeb3d74',
                        additional: {
                            "powerMatters": "许可0000-00",
                            "subPowerMatters": "许可0000-0101",
                            "accesscardId": "33071918******784523",
                            "materialName": "社会团体变更登记申请表",
                            "sponsorName": "阿里巴巴（中国）有限公司",
                            "sponsorCode": "91330100799655058B",
                            "projectId": "330000261711151100004"
                        }
                    },
                    success: function (res) {
                        if (res.code == '00' && res.dataCount > 0) {
                            rmeoteCount++;
                            //调用本地接口，修改对应数据的isdead字段
                            $.ajax({
                                type: 'POST',
                                async: false,
                                url: '/people/update',
                                data: {
                                    id: people.id,
                                    isdead: 0
                                }
                            });
                        } else {
                            $.ajax({
                                type: 'POST',
                                async: false,
                                url: '/people/update',
                                data: {
                                    id: people.id,
                                    isdead: 2
                                }
                            });
                        }
                    },
                    error:function(err){
                        console.log(err);
                    }
                });
            })(item)
        })

        $("#selectRemoteCount").val(rmeoteCount);
        //刷新列表
        var searchKey = $("#searchKey").val();
        var where = {};
        where[searchKey] = $("#searchValue").val();
        if(searchKey=="isdead"){
            where[searchKey] = $("#search-isdead").val();
        }
        peopleTable.reload({
            url: '/people/find',
            where: where
        });
        return false
    });


    table.on('tool(handler)', function (obj) {
        var data = obj.data,
            layEvent = obj.event;
        var id = data.id;
        var current = $("#current").val();
        var manager = data.manager;

        if (layEvent === 'del') {
            layer.confirm('确认删除该行记录？', function (index) {
                layer.close(index);
                $.ajax({
                    type: 'GET',
                    url: '/people/delete?id=' + id,
                    success: function (data) {
                        if (data.code == '0') {
                            obj.del();
                        }
                        layer.msg(data.message, {
                            icon: 1,
                            time: 1000
                        }, function () {
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
                area: ['650px', '440px'],
                content: '/people/edit?id=' + id
            });
        }
    });
});